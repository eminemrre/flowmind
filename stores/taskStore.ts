import { create } from 'zustand';
import { Task, CreateTaskInput, DailyPlan } from '@/types';

interface TaskState {
    // State
    tasks: Task[];
    todaysTasks: Task[];
    dailyPlan: DailyPlan | null;
    isLoading: boolean;
    selectedTaskId: string | null;

    // Actions
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    completeTask: (id: string) => void;
    setDailyPlan: (plan: DailyPlan) => void;
    setSelectedTask: (id: string | null) => void;
    setLoading: (loading: boolean) => void;
    getTodaysTasks: () => Task[];
    getCompletedToday: () => Task[];
    getPendingToday: () => Task[];
}

const isToday = (dateStr: string | null): boolean => {
    if (!dateStr) return false;
    const today = new Date().toDateString();
    const taskDate = new Date(dateStr).toDateString();
    return today === taskDate;
};

export const useTaskStore = create<TaskState>((set, get) => ({
    // Initial state
    tasks: [],
    todaysTasks: [],
    dailyPlan: null,
    isLoading: false,
    selectedTaskId: null,

    // Actions
    setTasks: (tasks) => {
        const todaysTasks = tasks.filter(t => isToday(t.dueDate) || isToday(t.scheduledTime?.split('T')[0] || null));
        set({ tasks, todaysTasks });
    },

    addTask: (task) => {
        const { tasks } = get();
        const newTasks = [...tasks, task];
        const todaysTasks = newTasks.filter(t => isToday(t.dueDate) || isToday(t.scheduledTime?.split('T')[0] || null));
        set({ tasks: newTasks, todaysTasks });
    },

    updateTask: (id, updates) => {
        const { tasks } = get();
        const newTasks = tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t);
        const todaysTasks = newTasks.filter(t => isToday(t.dueDate) || isToday(t.scheduledTime?.split('T')[0] || null));
        set({ tasks: newTasks, todaysTasks });
    },

    deleteTask: (id) => {
        const { tasks } = get();
        const newTasks = tasks.filter(t => t.id !== id);
        const todaysTasks = newTasks.filter(t => isToday(t.dueDate) || isToday(t.scheduledTime?.split('T')[0] || null));
        set({ tasks: newTasks, todaysTasks });
    },

    completeTask: (id) => {
        const { tasks } = get();
        const newTasks = tasks.map(t =>
            t.id === id
                ? { ...t, isCompleted: true, completedAt: new Date().toISOString() }
                : t
        );
        const todaysTasks = newTasks.filter(t => isToday(t.dueDate) || isToday(t.scheduledTime?.split('T')[0] || null));
        set({ tasks: newTasks, todaysTasks });
    },

    setDailyPlan: (dailyPlan) => set({ dailyPlan }),

    setSelectedTask: (selectedTaskId) => set({ selectedTaskId }),

    setLoading: (isLoading) => set({ isLoading }),

    getTodaysTasks: () => get().todaysTasks,

    getCompletedToday: () => get().todaysTasks.filter(t => t.isCompleted),

    getPendingToday: () => get().todaysTasks.filter(t => !t.isCompleted),
}));
