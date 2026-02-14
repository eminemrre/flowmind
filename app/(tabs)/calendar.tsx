import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskStore } from '@/stores/taskStore';
import { useTheme } from '@/components/ThemeProvider';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Theme } from '@/constants/theme';
import { Task } from '@/types';

const DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

function getMonthDays(year: number, month: number): Date[] {
    const days: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Haftanın ilk günü öncesini ekle (boşluk)
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
        const d = new Date(year, month, -i);
        days.push(d);
    }

    // Ayın günleri
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }

    // Haftanın kalan günleri
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
        for (let i = 1; i <= remaining; i++) {
            days.push(new Date(year, month + 1, i));
        }
    }

    return days;
}

export default function CalendarScreen() {
    const { tasks, fetchTasks } = useTaskStore();
    const { theme } = useTheme();
    const styles = useThemedStyles(createStyles);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => { fetchTasks(); }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTasks();
        setRefreshing(false);
    };

    const monthDays = useMemo(() =>
        getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth()),
        [currentMonth]
    );

    const tasksForDate = useMemo(() => {
        const dateStr = selectedDate.toDateString();
        return tasks.filter(t => {
            if (t.dueDate) {
                return new Date(t.dueDate).toDateString() === dateStr;
            }
            if (t.scheduledTime) {
                return new Date(t.scheduledTime).toDateString() === dateStr;
            }
            return false;
        });
    }, [tasks, selectedDate]);

    // Görev olan günleri bul
    const datesWithTasks = useMemo(() => {
        const set = new Set<string>();
        tasks.forEach(t => {
            const d = t.dueDate || t.scheduledTime;
            if (d) set.add(new Date(d).toDateString());
        });
        return set;
    }, [tasks]);

    const goToPrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const isToday = (date: Date) => date.toDateString() === new Date().toDateString();
    const isSelected = (date: Date) => date.toDateString() === selectedDate.toDateString();
    const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth.getMonth();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
            >
                {/* Ay Navigasyonu */}
                <View style={styles.monthNav}>
                    <TouchableOpacity onPress={goToPrevMonth} style={styles.navButton}>
                        <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.monthTitle}>
                        {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </Text>
                    <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
                        <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Gün İsimleri */}
                <View style={styles.weekRow}>
                    {DAYS.map((day) => (
                        <Text key={day} style={styles.weekDay}>{day}</Text>
                    ))}
                </View>

                {/* Takvim Grid */}
                <View style={styles.calendarGrid}>
                    {monthDays.map((date, idx) => {
                        const hasTasks = datesWithTasks.has(date.toDateString());
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.dayCell,
                                    isSelected(date) && styles.selectedDay,
                                    isToday(date) && !isSelected(date) && styles.todayDay,
                                ]}
                                onPress={() => setSelectedDate(date)}
                            >
                                <Text style={[
                                    styles.dayText,
                                    !isCurrentMonth(date) && styles.otherMonthText,
                                    isSelected(date) && styles.selectedDayText,
                                ]}>
                                    {date.getDate()}
                                </Text>
                                {hasTasks && (
                                    <View style={[styles.dot, isSelected(date) && styles.dotSelected]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Seçili Günün Görevleri */}
                <View style={styles.taskSection}>
                    <Text style={styles.taskSectionTitle}>
                        📋 {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]} — {tasksForDate.length} görev
                    </Text>

                    {tasksForDate.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>📭</Text>
                            <Text style={styles.emptyText}>Bu gün için görev yok</Text>
                        </View>
                    ) : (
                        tasksForDate.map((task) => (
                            <View key={task.id} style={styles.taskItem}>
                                <View style={[styles.taskDot, {
                                    backgroundColor: task.isCompleted ? '#10B981' :
                                        task.priority === 'urgent' ? '#EF4444' :
                                            task.priority === 'high' ? '#F59E0B' :
                                                theme.colors.primary
                                }]} />
                                <View style={styles.taskInfo}>
                                    <Text style={[
                                        styles.taskTitle,
                                        task.isCompleted && styles.taskCompleted,
                                    ]}>
                                        {task.title}
                                    </Text>
                                    <Text style={styles.taskMeta}>
                                        {task.estimatedMinutes}dk • {task.priority} • {task.category}
                                    </Text>
                                </View>
                                {task.isCompleted && (
                                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                )}
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: 16 },
    monthNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    navButton: { padding: 8 },
    monthTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    weekDay: {
        flex: 1,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    selectedDay: {
        backgroundColor: theme.colors.primary,
    },
    todayDay: {
        backgroundColor: `${theme.colors.primary}20`,
    },
    dayText: {
        fontSize: 15,
        color: theme.colors.text,
        fontWeight: '500',
    },
    otherMonthText: { color: theme.colors.gray400 },
    selectedDayText: { color: '#FFF', fontWeight: '700' },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
        marginTop: 2,
    },
    dotSelected: { backgroundColor: '#FFF' },
    taskSection: {
        marginTop: 24,
    },
    taskSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 12,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyEmoji: { fontSize: 40, marginBottom: 8 },
    emptyText: { color: theme.colors.textSecondary, fontSize: 15 },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
    },
    taskDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 12,
    },
    taskInfo: { flex: 1 },
    taskTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text,
    },
    taskCompleted: {
        textDecorationLine: 'line-through',
        opacity: 0.5,
    },
    taskMeta: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
});
