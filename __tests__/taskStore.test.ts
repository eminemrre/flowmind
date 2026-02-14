import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useTaskStore } from '@/stores/taskStore';
import { apiClient } from '@/lib/api';

// Mock apiClient
jest.mock('@/lib/api', () => ({
    apiClient: {
        getTasks: jest.fn(),
        createTask: jest.fn(),
        updateTask: jest.fn(),
        deleteTask: jest.fn(),
        completeTask: jest.fn(),
        checkAchievements: jest.fn().mockResolvedValue({}),
    },
}));

describe('useTaskStore', () => {
    beforeEach(() => {
        // Clear store before each test
        useTaskStore.setState({
            tasks: [],
            todaysTasks: [],
            isLoading: false,
            error: null,
        });
        jest.clearAllMocks();
    });

    it('should fetch tasks successfully', async () => {
        const mockTasks = [
            { id: 1, title: 'Task 1', is_completed: false },
            { id: 2, title: 'Task 2', is_completed: true },
        ];

        (apiClient.getTasks as jest.Mock).mockResolvedValue({ data: mockTasks, error: null });

        const { result } = renderHook(() => useTaskStore());

        await act(async () => {
            await result.current.fetchTasks();
        });

        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks[0].title).toBe('Task 1');
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle fetch error', async () => {
        (apiClient.getTasks as jest.Mock).mockResolvedValue({ data: null, error: 'Failed' });

        const { result } = renderHook(() => useTaskStore());

        await act(async () => {
            await result.current.fetchTasks();
        });

        expect(result.current.error).toBe('Failed');
        expect(result.current.tasks).toHaveLength(0);
    });

    it('should create a task', async () => {
        const newTask = { id: 3, title: 'New Task', is_completed: false };
        (apiClient.createTask as jest.Mock).mockResolvedValue({ data: newTask, error: null });

        const { result } = renderHook(() => useTaskStore());

        await act(async () => {
            await result.current.createTask({ title: 'New Task' });
        });

        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.tasks[0].title).toBe('New Task');
    });

    it('should complete a task', async () => {
        // Setup initial state
        useTaskStore.setState({
            tasks: [{ id: '1', title: 'Task 1', isCompleted: false } as any],
        });

        (apiClient.completeTask as jest.Mock).mockResolvedValue({
            data: { id: 1, title: 'Task 1', is_completed: true },
            error: null
        });

        const { result } = renderHook(() => useTaskStore());

        await act(async () => {
            await result.current.completeTask('1');
        });

        expect(result.current.tasks[0].isCompleted).toBe(true);
        expect(apiClient.checkAchievements).toHaveBeenCalled();
    });
});
