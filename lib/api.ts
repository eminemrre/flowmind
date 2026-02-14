import { config } from '@/constants/config';
import { User, Task, UserPreferences, FocusSession, Achievement } from '@/types';

// VDS Backend API Client
class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor() {
        this.baseUrl = config.api.baseUrl;
    }

    setToken(token: string | null) {
        this.token = token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<{ data: T | null; error: string | null }> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
                ...(options.headers as Record<string, string>),
            };

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { data: null, error: errorData.message || `HTTP ${response.status}` };
            }

            const data = await response.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: (error as Error).message };
        }
    }

    // ============ AUTH ============
    async login(email: string, password: string) {
        return this.request<{ user: User; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(email: string, password: string, name: string) {
        return this.request<{ user: User; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
    }

    async logout() {
        return this.request('/auth/logout', { method: 'POST' });
    }

    async getMe() {
        return this.request<User>('/auth/me');
    }

    async updateProfile(data: { name?: string; avatar_url?: string }) {
        return this.request<User>('/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // ============ TASKS ============
    async getTasks() {
        return this.request<Task[]>('/tasks');
    }

    async createTask(task: Partial<Task>) {
        return this.request<Task>('/tasks', {
            method: 'POST',
            body: JSON.stringify(task),
        });
    }

    async updateTask(id: string, updates: Partial<Task>) {
        return this.request<Task>(`/tasks/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    }

    async deleteTask(id: string) {
        return this.request(`/tasks/${id}`, { method: 'DELETE' });
    }

    async completeTask(id: string) {
        return this.request<Task>(`/tasks/${id}/complete`, { method: 'POST' });
    }

    // ============ PREFERENCES ============
    async getPreferences() {
        return this.request<UserPreferences>('/preferences');
    }

    async updatePreferences(preferences: Partial<UserPreferences>) {
        return this.request<UserPreferences>('/preferences', {
            method: 'PATCH',
            body: JSON.stringify(preferences),
        });
    }

    // ============ FOCUS SESSIONS ============
    async startFocusSession(taskId?: string) {
        return this.request<FocusSession>('/focus-sessions', {
            method: 'POST',
            body: JSON.stringify({ taskId }),
        });
    }

    async endFocusSession(id: string, completed: boolean) {
        return this.request<FocusSession>(`/focus-sessions/${id}/end`, {
            method: 'POST',
            body: JSON.stringify({ completed }),
        });
    }

    async getFocusSessions(startDate?: string, endDate?: string) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return this.request<FocusSession[]>(`/focus-sessions?${params}`);
    }

    // ============ STATS ============
    async getStats(period: 'day' | 'week' | 'month' = 'week') {
        return this.request<{
            tasksCompleted: number;
            focusMinutes: number;
            streak: number;
            xpEarned: number;
        }>(`/stats?period=${period}`);
    }

    // ============ ACHIEVEMENTS ============
    async getAchievements() {
        return this.request<Achievement[]>('/achievements');
    }

    async checkAchievements() {
        return this.request<{ new_achievements: any[]; count: number }>('/achievements/check', {
            method: 'POST',
        });
    }

    // ============ ENERGY ============
    async logEnergy(level: number) {
        return this.request('/energy', {
            method: 'POST',
            body: JSON.stringify({ level }),
        });
    }

    async getEnergyHistory(days: number = 7) {
        return this.request<{ date: string; avgLevel: number }[]>(`/energy/history?days=${days}`);
    }
}

export const apiClient = new ApiClient();
