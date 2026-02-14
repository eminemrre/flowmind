import { create } from 'zustand';
import { Achievement } from '@/types';
import { apiClient } from '@/lib/api';

// Başarım detayları (frontend tarafında da tanımlı)
export const ACHIEVEMENT_INFO: Record<string, { title: string; description: string; emoji: string }> = {
    first_task: { title: 'İlk Adım', description: 'İlk görevini tamamla', emoji: '🎯' },
    streak_7: { title: 'Haftalık Savaşçı', description: '7 gün üst üste görev tamamla', emoji: '🔥' },
    streak_30: { title: 'Aylık Efsane', description: '30 gün üst üste görev tamamla', emoji: '🏆' },
    focus_master: { title: 'Odak Ustası', description: '10 odaklanma oturumu tamamla', emoji: '🧘' },
    early_bird: { title: 'Erken Kuş', description: "Sabah 7'den önce görev tamamla", emoji: '🌅' },
    night_owl: { title: 'Gece Kuşu', description: "Gece 23'ten sonra görev tamamla", emoji: '🦉' },
    level_5: { title: 'Çırak', description: "Level 5'e ulaş", emoji: '⭐' },
    level_10: { title: 'Usta', description: "Level 10'a ulaş", emoji: '💎' },
};

interface AchievementWithStatus {
    achievement_type: string;
    title: string;
    description: string;
    emoji: string;
    earned: boolean;
    earned_at: string | null;
}

interface GamificationState {
    achievements: AchievementWithStatus[];
    newAchievements: AchievementWithStatus[];
    isLoading: boolean;

    fetchAchievements: () => Promise<void>;
    checkAchievements: () => Promise<AchievementWithStatus[]>;
    clearNewAchievements: () => void;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
    achievements: [],
    newAchievements: [],
    isLoading: false,

    fetchAchievements: async () => {
        set({ isLoading: true });
        try {
            const { data } = await apiClient.getAchievements();
            if (data) {
                set({ achievements: data as any, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch {
            set({ isLoading: false });
        }
    },

    checkAchievements: async () => {
        try {
            const { data } = await (apiClient as any).checkAchievements();
            if (data && (data as any).new_achievements?.length > 0) {
                const newOnes = (data as any).new_achievements;
                set({ newAchievements: newOnes });
                // Başarımları yeniden yükle
                await get().fetchAchievements();
                return newOnes;
            }
        } catch { /* sessiz */ }
        return [];
    },

    clearNewAchievements: () => set({ newAchievements: [] }),
}));
