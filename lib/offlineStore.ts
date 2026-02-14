import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { Task } from '@/types';
import { apiClient } from '@/lib/api';

const OFFLINE_TASKS_KEY = 'flowmind_offline_tasks';
const PENDING_ACTIONS_KEY = 'flowmind_pending_actions';

interface PendingAction {
    id: string;
    type: 'create' | 'update' | 'delete' | 'complete';
    payload: any;
    createdAt: number;
}

// ---- Cache Functions ----

export async function cacheTasks(tasks: Task[]): Promise<void> {
    try {
        await AsyncStorage.setItem(OFFLINE_TASKS_KEY, JSON.stringify(tasks));
    } catch {
        // silently fail
    }
}

export async function getCachedTasks(): Promise<Task[]> {
    try {
        const raw = await AsyncStorage.getItem(OFFLINE_TASKS_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

// ---- Pending Actions Queue ----

export async function addPendingAction(action: Omit<PendingAction, 'id' | 'createdAt'>): Promise<void> {
    try {
        const existing = await getPendingActions();
        const newAction: PendingAction = {
            ...action,
            id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
            createdAt: Date.now(),
        };
        existing.push(newAction);
        await AsyncStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(existing));
    } catch {
        // silently fail
    }
}

export async function getPendingActions(): Promise<PendingAction[]> {
    try {
        const raw = await AsyncStorage.getItem(PENDING_ACTIONS_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export async function clearPendingActions(): Promise<void> {
    await AsyncStorage.removeItem(PENDING_ACTIONS_KEY).catch(() => { });
}

// ---- Sync Engine ----

export async function syncPendingActions(): Promise<{ synced: number; failed: number }> {
    const actions = await getPendingActions();
    if (actions.length === 0) return { synced: 0, failed: 0 };

    let synced = 0;
    let failed = 0;
    const remaining: PendingAction[] = [];

    for (const action of actions) {
        try {
            switch (action.type) {
                case 'create':
                    await apiClient.createTask(action.payload);
                    break;
                case 'update':
                    await apiClient.updateTask(action.payload.id, action.payload.updates);
                    break;
                case 'complete':
                    await apiClient.updateTask(action.payload.id, { isCompleted: true });
                    break;
                case 'delete':
                    await apiClient.deleteTask(action.payload.id);
                    break;
            }
            synced++;
        } catch {
            failed++;
            // Keep failed actions for retry
            remaining.push(action);
        }
    }

    if (remaining.length > 0) {
        await AsyncStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(remaining));
    } else {
        await clearPendingActions();
    }

    return { synced, failed };
}

// ---- Network Status Hook ----

import NetInfo from '@react-native-community/netinfo';

export function onNetworkRestore(callback: () => void): () => void {
    let wasOffline = false;

    const unsubscribe = NetInfo.addEventListener(state => {
        if (!state.isConnected) {
            wasOffline = true;
        } else if (wasOffline && state.isConnected) {
            wasOffline = false;
            callback();
        }
    });

    return unsubscribe;
}
