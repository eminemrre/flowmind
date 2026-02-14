import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_TIMER_TASK = 'FLOWMIND_BACKGROUND_TIMER';
const TIMER_STORAGE_KEY = 'flowmind_timer_state';

export interface TimerPersistState {
    endTime: number; // timestamp when timer should end
    isBreak: boolean;
    sessionMinutes: number;
}

// Save timer state when app goes to background
export async function saveTimerState(state: TimerPersistState): Promise<void> {
    try {
        await AsyncStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
    } catch {
        // silently fail
    }
}

// Load timer state when app returns to foreground
export async function loadTimerState(): Promise<TimerPersistState | null> {
    try {
        const raw = await AsyncStorage.getItem(TIMER_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// Clear timer state
export async function clearTimerState(): Promise<void> {
    await AsyncStorage.removeItem(TIMER_STORAGE_KEY).catch(() => { });
}

// Calculate remaining seconds from saved state
export function getRemainingSeconds(state: TimerPersistState): number {
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((state.endTime - now) / 1000));
    return remaining;
}

// Schedule a notification for timer completion
export async function scheduleTimerEndNotification(seconds: number, isBreak: boolean): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: isBreak ? '☕ Mola Bitti!' : '🎉 Oturum Tamamlandı!',
            body: isBreak
                ? 'Yeni bir odaklanma oturumuna hazır mısın?'
                : 'Harika iş! Biraz mola ver.',
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: Math.max(1, seconds),
        },
    });
    return id;
}

// Cancel timer notification
export async function cancelTimerNotification(notificationId: string): Promise<void> {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch {
        // silently fail
    }
}

// Define background task (runs periodically to check timer)
TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
    const state = await loadTimerState();
    if (!state) return BackgroundFetch.BackgroundFetchResult.NoData;

    const remaining = getRemainingSeconds(state);

    if (remaining <= 0) {
        // Timer completed in background
        await clearTimerState();
        return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
});

// Register background task
export async function registerBackgroundTimer(): Promise<void> {
    try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TIMER_TASK);
        if (!isRegistered) {
            await BackgroundFetch.registerTaskAsync(BACKGROUND_TIMER_TASK, {
                minimumInterval: 60, // Check every minute
                stopOnTerminate: false,
                startOnBoot: true,
            });
        }
    } catch (e) {
        console.log('Background timer registration failed:', e);
    }
}
