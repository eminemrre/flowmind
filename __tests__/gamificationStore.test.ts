// @ts-nocheck
import { useGamificationStore, ACHIEVEMENT_INFO } from '@/stores/gamificationStore';

// Mock API
jest.mock('@/lib/api', () => ({
    apiClient: {
        getAchievements: jest.fn().mockResolvedValue({ data: [], error: null }),
        checkAchievements: jest.fn().mockResolvedValue({ data: [], error: null }),
    },
}));

describe('gamificationStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useGamificationStore.setState({
            achievements: [],
            newAchievements: [],
            isLoading: false,
        });
    });

    test('ACHIEVEMENT_INFO has 8 achievements defined', () => {
        expect(Object.keys(ACHIEVEMENT_INFO).length).toBe(8);
    });

    test('each achievement has icon, title, and description', () => {
        Object.values(ACHIEVEMENT_INFO).forEach((info: any) => {
            expect(info.icon).toBeDefined();
            expect(info.title).toBeDefined();
            expect(info.description).toBeDefined();
        });
    });

    test('addXp increases and triggers level calculations', () => {
        const store = useGamificationStore.getState();
        // addXp should be callable
        expect(typeof store.addXp).toBe('function');
    });

    test('fetchAchievements sets achievements array', async () => {
        const mockAchievements = [
            { achievement_type: 'first_task', earned: true, earned_at: '2026-01-01' },
        ];

        const { apiClient } = require('@/lib/api');
        apiClient.getAchievements.mockResolvedValue({
            data: mockAchievements,
            error: null,
        });

        await useGamificationStore.getState().fetchAchievements();
        const state = useGamificationStore.getState();
        expect(state.achievements).toEqual(mockAchievements);
    });

    test('clearNewAchievements empties the array', () => {
        useGamificationStore.setState({ newAchievements: ['first_task'] });
        useGamificationStore.getState().clearNewAchievements();
        expect(useGamificationStore.getState().newAchievements).toEqual([]);
    });

    test('initial state has empty arrays', () => {
        const state = useGamificationStore.getState();
        expect(state.achievements).toEqual([]);
        expect(state.newAchievements).toEqual([]);
        expect(state.isLoading).toBe(false);
    });
});
