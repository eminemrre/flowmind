import { create } from 'zustand';
import { Task, DailyPlan } from '@/types';
import { apiClient } from '@/lib/api';
import { cacheTasks, getCachedTasks, syncPendingActions, addPendingAction } from '@/lib/offlineStore';

interface TaskState {
    // State
    tasks: Task[];
    todaysTasks: Task[];
    dailyPlan: DailyPlan | null;
    isLoading: boolean;
    error: string | null;
    selectedTaskId: string | null;

    // API Actions
    fetchTasks: () => Promise<void>;
    createTask: (task: Partial<Task>) => Promise<boolean>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>;
    deleteTask: (id: string) => Promise<boolean>;
    completeTask: (id: string) => Promise<boolean>;

    // Local Actions
    setDailyPlan: (plan: DailyPlan) => void;
    setSelectedTask: (id: string | null) => void;
    clearError: () => void;

    // Getters
    getTodaysTasks: () => Task[];
    getCompletedToday: () => Task[];
    getPendingToday: () => Task[];
}

// Backend returns snake_case, frontend uses camelCase
const mapBackendTask = (raw: any): Task => ({
    id: raw.id?.toString(),
    userId: raw.user_id?.toString(),
    title: raw.title,
    description: raw.description || null,
    category: raw.category || 'general',
    priority: raw.priority || 'medium',
    energyLevel: raw.energy_level || 'medium',
    estimatedMinutes: raw.estimated_minutes || 30,
    dueDate: raw.due_date || null,
    scheduledTime: raw.scheduled_time || null,
    isCompleted: raw.is_completed || false,
    completedAt: raw.completed_at || null,
    createdAt: raw.created_at || new Date().toISOString(),
    updatedAt: raw.updated_at || new Date().toISOString(),
});

// Frontend camelCase → backend snake_case for updates
const mapToBackend = (updates: Partial<Task>): Record<string, any> => {
    const map: Record<string, string> = {
        title: 'title',
        description: 'description',
        category: 'category',
        priority: 'priority',
        energyLevel: 'energy_level',
        estimatedMinutes: 'estimated_minutes',
        dueDate: 'due_date',
        scheduledTime: 'scheduled_time',
        isCompleted: 'is_completed',
    };
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
        if (map[key]) {
            result[map[key]] = value;
        }
    }
    return result;
};

const isToday = (dateStr: string | null): boolean => {
    if (!dateStr) return false;
    const today = new Date().toDateString();
    const taskDate = new Date(dateStr).toDateString();
    return today === taskDate;
};

const computeTodaysTasks = (tasks: Task[]): Task[] => {
    return tasks.filter(t => isToday(t.dueDate) || isToday(t.scheduledTime?.split('T')[0] || null));
};

export const useTaskStore = create<TaskState>((set, get) => ({
    // Initial state
    tasks: [],
    todaysTasks: [],
    dailyPlan: null,
    isLoading: false,
    error: null,
    selectedTaskId: null,

    // Fetch all tasks from backend
    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            // Try to sync pending offline actions first
            await syncPendingActions().catch(() => { });

            const { data, error } = await apiClient.getTasks();
            if (error || !data) {
                // Offline fallback — load from cache
                const cached = await getCachedTasks();
                if (cached.length > 0) {
                    set({ tasks: cached, todaysTasks: computeTodaysTasks(cached), isLoading: false });
                    return;
                }
                set({ isLoading: false, error: error || 'Görevler yüklenemedi' });
                return;
            }
            const tasks = (data as any[]).map(mapBackendTask);
            // Cache tasks for offline use
            await cacheTasks(tasks);
            set({ tasks, todaysTasks: computeTodaysTasks(tasks), isLoading: false });
        } catch {
            // Network error — load from cache
            const cached = await getCachedTasks();
            if (cached.length > 0) {
                set({ tasks: cached, todaysTasks: computeTodaysTasks(cached), isLoading: false });
                return;
            }
            set({ isLoading: false, error: 'Bağlantı hatası' });
        }
    },

    // Create task via API
    createTask: async (taskData) => {
        set({ error: null });
        try {
            const backendData = mapToBackend(taskData);
            backendData.title = taskData.title; // ensure title is always sent
            const { data, error } = await apiClient.createTask(backendData as any);
            if (error || !data) {
                set({ error: error || 'Görev oluşturulamadı' });
                return false;
            }
            const newTask = mapBackendTask(data);
            const { tasks } = get();
            const newTasks = [newTask, ...tasks];
            set({ tasks: newTasks, todaysTasks: computeTodaysTasks(newTasks) });
            return true;
        } catch {
            set({ error: 'Bağlantı hatası' });
            return false;
        }
    },

    // Update task via API
    updateTask: async (id, updates) => {
        set({ error: null });
        try {
            const backendData = mapToBackend(updates);
            const { data, error } = await apiClient.updateTask(id, backendData as any);
            if (error || !data) {
                set({ error: error || 'Görev güncellenemedi' });
                return false;
            }
            const updatedTask = mapBackendTask(data);
            const { tasks } = get();
            const newTasks = tasks.map(t => t.id === id ? updatedTask : t);
            set({ tasks: newTasks, todaysTasks: computeTodaysTasks(newTasks) });
            return true;
        } catch {
            set({ error: 'Bağlantı hatası' });
            return false;
        }
    },

    // Delete task via API
    deleteTask: async (id) => {
        set({ error: null });
        // Optimistic: remove immediately
        const { tasks } = get();
        const newTasks = tasks.filter(t => t.id !== id);
        set({ tasks: newTasks, todaysTasks: computeTodaysTasks(newTasks) });

        try {
            const { error } = await apiClient.deleteTask(id);
            if (error) {
                // Rollback on failure
                set({ tasks, todaysTasks: computeTodaysTasks(tasks), error: error || 'Görev silinemedi' });
                return false;
            }
            return true;
        } catch {
            set({ tasks, todaysTasks: computeTodaysTasks(tasks), error: 'Bağlantı hatası' });
            return false;
        }
    },

    // Complete task via API
    completeTask: async (id) => {
        set({ error: null });
        // Optimistic update
        const { tasks } = get();
        const optimisticTasks = tasks.map(t =>
            t.id === id ? { ...t, isCompleted: true, completedAt: new Date().toISOString() } : t
        );
        set({ tasks: optimisticTasks, todaysTasks: computeTodaysTasks(optimisticTasks) });

        try {
            const { data, error } = await apiClient.completeTask(id);
            if (error || !data) {
                // Rollback
                set({ tasks, todaysTasks: computeTodaysTasks(tasks), error: error || 'İşlem başarısız' });
                return false;
            }
            const completedTask = mapBackendTask(data);
            const finalTasks = tasks.map(t => t.id === id ? completedTask : t);
            set({ tasks: finalTasks, todaysTasks: computeTodaysTasks(finalTasks) });

            // Görev tamamlandığında başarım kontrolü (arka planda)
            apiClient.checkAchievements().catch(() => { });

            return true;
        } catch {
            set({ tasks, todaysTasks: computeTodaysTasks(tasks), error: 'Bağlantı hatası' });
            return false;
        }
    },

    setDailyPlan: (dailyPlan) => set({ dailyPlan }),
    setSelectedTask: (selectedTaskId) => set({ selectedTaskId }),
    clearError: () => set({ error: null }),

    getTodaysTasks: () => get().todaysTasks,
    getCompletedToday: () => get().todaysTasks.filter(t => t.isCompleted),
    getPendingToday: () => get().todaysTasks.filter(t => !t.isCompleted),
}));
