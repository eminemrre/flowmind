// @ts-nocheck
import { renderHook, act } from '@testing-library/react-hooks';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

// Mock api client
jest.mock('@/lib/api', () => ({
    apiClient: {
        login: jest.fn(),
        register: jest.fn(),
        getProfile: jest.fn(),
        setToken: jest.fn(),
    },
}));

import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/lib/api';
import * as SecureStore from 'expo-secure-store';

describe('authStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset store state
        useAuthStore.setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
    });

    test('initial state is unauthenticated', () => {
        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
    });

    test('login sets user and token on success', async () => {
        const mockUser = { id: '1', email: 'test@test.com', name: 'Test' };
        const mockToken = 'jwt-token-123';

        (apiClient.login as jest.Mock).mockResolvedValue({
            data: { user: mockUser, token: mockToken },
            error: null,
        });

        await useAuthStore.getState().login('test@test.com', 'password123');

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(mockUser);
        expect(state.token).toBe(mockToken);
    });

    test('login sets error on failure', async () => {
        (apiClient.login as jest.Mock).mockResolvedValue({
            data: null,
            error: 'Geçersiz e-posta veya şifre',
        });

        await useAuthStore.getState().login('bad@test.com', 'wrong');

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.error).toBe('Geçersiz e-posta veya şifre');
    });

    test('logout clears state and token', async () => {
        // Set initial authenticated state
        useAuthStore.setState({
            user: { id: '1', email: 'test@test.com' },
            token: 'jwt-token',
            isAuthenticated: true,
        });

        await useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
    });

    test('register works like login on success', async () => {
        const mockUser = { id: '2', email: 'new@test.com', name: 'New User' };
        const mockToken = 'jwt-new-token';

        (apiClient.register as jest.Mock).mockResolvedValue({
            data: { user: mockUser, token: mockToken },
            error: null,
        });

        await useAuthStore.getState().register('new@test.com', 'password123', 'New User');

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(mockUser);
    });

    test('clearError resets error state', () => {
        useAuthStore.setState({ error: 'Some error' });
        useAuthStore.getState().clearError();
        expect(useAuthStore.getState().error).toBeNull();
    });
});
