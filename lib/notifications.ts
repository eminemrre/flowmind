import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const scheduleNotification = async (title: string, body: string, seconds: number) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds,
        },
    });
};

export const registerForPushNotificationsAsync = async () => {
    let token;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push Token:', token);

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
};

export const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
};

// Günlük motivasyon bildirimi — her gün sabah 9:00'da
export const scheduleDailyMotivation = async () => {
    // Önce eskileri temizle
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
        if ((notif.content.data as any)?.type === 'daily_motivation') {
            await Notifications.cancelScheduledNotificationAsync(notif.identifier);
        }
    }

    const motivations = [
        'Bugün harika şeyler başaracaksın! 🚀',
        'Küçük adımlar büyük sonuçlar doğurur. Başla! 💪',
        'Enerjini doğru kullan, verimli bir gün seni bekliyor! ⚡',
        'Dünden daha iyi ol. Sadece bir görev tamamla! 🎯',
        'Odaklan, başar, kutla! FlowMind seninle. 🧠',
    ];

    const randomMsg = motivations[Math.floor(Math.random() * motivations.length)];

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🌅 Günaydın!',
            body: randomMsg,
            sound: true,
            data: { type: 'daily_motivation' },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 9,
            minute: 0,
        },
    });
};

// Görev hatırlatma bildirimi
export const scheduleTaskReminder = async (taskTitle: string, dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();

    if (diff <= 0) return; // Geçmiş tarih

    // Due date'ten 1 saat önce hatırlat
    const reminderTime = Math.max(60, Math.floor((diff - 3600000) / 1000));

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '⏰ Görev Hatırlatma',
            body: `"${taskTitle}" görevi yaklaşıyor!`,
            sound: true,
            data: { type: 'task_reminder' },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: reminderTime,
        },
    });
};
