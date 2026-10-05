// All data hooks for Milo, following SmartOps-Pay's convention of one
// Api.jsx exporting useQuery/useMutation hooks. In demo mode the hooks read
// and write the local demo store; once the Milo API is live, set
// VITE_DEMO_MODE=false and the same hooks call the real endpoints below.
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './ApiClient';
import { demoStore, delay } from '../utils/demoStore';
import { planReply } from '../utils/demoAi';

export const DEMO_MODE = (import.meta.env.VITE_DEMO_MODE ?? 'true') === 'true';

const sessionTokens = () => ({
    access_token: `demo_${Date.now()}`,
    refresh_token: `demo_refresh_${Date.now()}`,
});

const applySession = () => {
    const tokens = sessionTokens();
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('refreshToken', tokens.refresh_token);
    localStorage.setItem('role', 'owner');
    localStorage.setItem('two_fa_verified', 'true');
};

const clearSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('two_fa_verified');
};

const runDemo = async (fn) => {
    await delay(180);
    return fn();
};

const invalidate = (queryClient, keys) => {
    keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
};

const withCallbacks = (queryClient, keys, onSuccess, onError) => ({
    onSuccess: (data) => {
        invalidate(queryClient, keys);
        onSuccess?.(data);
    },
    onError,
});

// =====================================================================
// AUTH
// =====================================================================
export const useLogin = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (credentials) => {
            if (DEMO_MODE) {
                await runDemo(() => {
                    demoStore.updateUser({ email: credentials.identifier || credentials.email });
                });
                applySession();
                return { data: { user: demoStore.getUser(), role: 'owner' } };
            }
            const response = await apiClient.post('/auth/login', credentials);
            const result = response.data?.data || response.data;
            if (result?.tokens?.access_token) localStorage.setItem('accessToken', result.tokens.access_token);
            if (result?.tokens?.refresh_token) localStorage.setItem('refreshToken', result.tokens.refresh_token);
            localStorage.setItem('role', 'owner');
            localStorage.setItem('two_fa_verified', 'true');
            return response.data;
        },
        ...withCallbacks(queryClient, [['userProfile'], ['agent'], ['settings']], onSuccess, onError),
    });
};

export const useRegister = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            if (DEMO_MODE) {
                await runDemo(() => {
                    demoStore.updateUser({
                        name: payload.name,
                        mobile: payload.mobile,
                        email: payload.email,
                        timezone: payload.timezone || demoStore.getUser().timezone,
                    });
                    demoStore.updateAgent({
                        name: 'Novi',
                        avatar: 'orb',
                        color: '#C26A44',
                    });
                });
                applySession();
                return { data: { user: demoStore.getUser(), agent: demoStore.getAgent() } };
            }
            const response = await apiClient.post('/auth/register', payload);
            const result = response.data?.data || response.data;
            if (result?.tokens?.access_token) localStorage.setItem('accessToken', result.tokens.access_token);
            if (result?.tokens?.refresh_token) localStorage.setItem('refreshToken', result.tokens.refresh_token);
            localStorage.setItem('role', 'owner');
            localStorage.setItem('two_fa_verified', 'true');
            return response.data;
        },
        ...withCallbacks(queryClient, [['userProfile'], ['agent'], ['settings']], onSuccess, onError),
    });
};

export const useLogout = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async () => {
            if (DEMO_MODE) {
                await runDemo(() => {});
                clearSession();
                return { success: true };
            }
            await apiClient.post('/auth/logout', {});
            clearSession();
            return { success: true };
        },
        onSuccess,
        onError,
    });
};

// =====================================================================
// PROFILE · AGENT · SETTINGS
// =====================================================================
export const useUserProfile = (options = {}) => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            if (DEMO_MODE) return demoStore.getUser();
            const response = await apiClient.get('/users/profile');
            return response.data?.data || response.data;
        },
        ...options,
    });
};

export const useUpdateUserProfile = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            if (DEMO_MODE) return runDemo(() => demoStore.updateUser(payload));
            const response = await apiClient.put('/users/profile', payload);
            return response.data;
        },
        ...withCallbacks(queryClient, [['userProfile']], onSuccess, onError),
    });
};

export const useAgent = (options = {}) => {
    return useQuery({
        queryKey: ['agent'],
        queryFn: async () => {
            if (DEMO_MODE) return demoStore.getAgent();
            const response = await apiClient.get('/agent');
            return response.data?.data || response.data;
        },
        ...options,
    });
};

export const useUpdateAgent = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            if (DEMO_MODE) return runDemo(() => demoStore.updateAgent(payload));
            const response = await apiClient.put('/agent', payload);
            return response.data;
        },
        ...withCallbacks(queryClient, [['agent']], onSuccess, onError),
    });
};

export const useSettings = (options = {}) => {
    return useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            if (DEMO_MODE) return demoStore.getSettings();
            const response = await apiClient.get('/settings');
            return response.data?.data || response.data;
        },
        ...options,
    });
};

export const useUpdateSettings = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            if (DEMO_MODE) return runDemo(() => demoStore.updateSettings(payload));
            const response = await apiClient.put('/settings', payload);
            return response.data;
        },
        ...withCallbacks(queryClient, [['settings']], onSuccess, onError),
    });
};

// =====================================================================
// SECURITY · STATS
// =====================================================================
export const useChangePassword = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (payload) => {
            if (DEMO_MODE) {
                await runDemo(() => {});
                return { success: true };
            }
            const response = await apiClient.post('/auth/change-password', payload);
            return response.data;
        },
        onSuccess,
        onError,
    });
};

export const useDeleteAccount = (onSuccess, onError) => {
    return useMutation({
        mutationFn: async (password) => {
            if (DEMO_MODE) {
                await runDemo(() => {});
                clearSession();
                return { success: true };
            }
            const response = await apiClient.delete('/users/me', {
                data: { password },
                headers: { 'x-password': password },
            });
            clearSession();
            return response.data;
        },
        onSuccess,
        onError,
    });
};

export const useStatsOverview = (options = {}) => {
    return useQuery({
        queryKey: ['statsOverview'],
        queryFn: async () => {
            if (DEMO_MODE) {
                return {
                    week: [],
                    completedToday: 0,
                    completedThisWeek: 0,
                    completionRate: 0,
                    streak: 0,
                    open: 0,
                    overdue: 0,
                    highPriorityOpen: 0,
                    goals: { total: 0, inProgress: 0, completed: 0 },
                    memories: 0,
                    conversations: 0,
                    unreadNotifications: 0,
                };
            }
            const response = await apiClient.get('/stats/overview');
            return response.data?.data || response.data;
        },
        ...options,
    });
};

// =====================================================================
// CONVERSATIONS
// =====================================================================
export const useConversations = (options = {}) => {
    return useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            if (DEMO_MODE) return demoStore.listConversations();
            const response = await apiClient.get('/chat/conversations');
            return response.data?.data || response.data;
        },
        placeholderData: keepPreviousData,
        ...options,
    });
};

export const useCreateConversation = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (title) => {
            if (DEMO_MODE) return runDemo(() => demoStore.createConversation(title));
            const response = await apiClient.post('/chat/conversations', { title });
            return response.data;
        },
        ...withCallbacks(queryClient, [['conversations']], onSuccess, onError),
    });
};

export const useRenameConversation = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, title }) => {
            if (DEMO_MODE) return runDemo(() => demoStore.renameConversation(id, title));
            const response = await apiClient.put(`/chat/conversations/${id}`, { title });
            return response.data;
        },
        ...withCallbacks(queryClient, [['conversations']], onSuccess, onError),
    });
};

export const useDeleteConversation = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            if (DEMO_MODE) return runDemo(() => demoStore.deleteConversation(id));
            const response = await apiClient.delete(`/chat/conversations/${id}`);
            return response.data;
        },
        ...withCallbacks(queryClient, [['conversations'], ['messages']], onSuccess, onError),
    });
};

// =====================================================================
// MESSAGES · CHAT
// =====================================================================
export const useMessages = (conversationId, options = {}) => {
    return useQuery({
        queryKey: ['messages', conversationId],
        queryFn: async () => {
            if (DEMO_MODE) return demoStore.listMessages(conversationId);
            const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
            return response.data?.data || response.data;
        },
        enabled: !!conversationId,
        ...options,
    });
};

// Appends the user message and returns the planned AI reply (text + side effects).
// Streaming of the returned text happens in the UI; useFinishMessage persists it.
export const useSendMessage = (conversationId, onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (content) => {
            if (DEMO_MODE) {
                demoStore.addMessage(conversationId, 'user', content);
                const reply = planReply(content);
                return { reply };
            }
            const response = await apiClient.post(`/chat/conversations/${conversationId}/messages`, { content });
            // Backend envelope: { success, message, data: { reply: { text, actions } } }
            const reply = response.data?.data?.reply || response.data?.reply || {};
            return { reply: { text: typeof reply.text === 'string' ? reply.text : '', actions: reply.actions || [] } };
        },
        ...withCallbacks(
            queryClient,
            [
                ['messages', conversationId],
                ['conversations'],
                ['tasks'],
                ['goals'],
                ['memories'],
                ['notifications'],
            ],
            onSuccess,
            onError
        ),
    });
};

// Persists the final (fully streamed) AI message.
export const useFinishMessage = (conversationId, onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (content) => {
            if (DEMO_MODE) return runDemo(() => demoStore.addMessage(conversationId, 'agent', content));
            const response = await apiClient.post(`/chat/conversations/${conversationId}/messages`, {
                role: 'agent',
                content,
            });
            return response.data;
        },
        ...withCallbacks(queryClient, [['messages', conversationId], ['conversations']], onSuccess, onError),
    });
};

// Removes the last AI reply and re-plans it from the last user message.
export const useRegenerate = (conversationId, onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            if (DEMO_MODE) {
                const last = demoStore.lastAgentMessage(conversationId);
                if (last) demoStore.deleteMessage(last.id);
                const lastUser = demoStore.lastUserMessage(conversationId);
                return { reply: planReply(lastUser?.content || '') };
            }
            const response = await apiClient.post(`/chat/conversations/${conversationId}/regenerate`);
            const reply = response.data?.data?.reply || response.data?.reply || {};
            return { reply: { text: typeof reply.text === 'string' ? reply.text : '', actions: reply.actions || [] } };
        },
        ...withCallbacks(
            queryClient,
            [['messages', conversationId], ['tasks'], ['memories'], ['notifications']],
            onSuccess,
            onError
        ),
    });
};

export const useEditMessage = (conversationId, onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, content }) => {
            if (DEMO_MODE) return runDemo(() => demoStore.updateMessage(id, { content }));
            const response = await apiClient.put(`/chat/messages/${id}`, { content });
            return response.data;
        },
        ...withCallbacks(queryClient, [['messages', conversationId], ['conversations']], onSuccess, onError),
    });
};

export const useDeleteMessage = (conversationId, onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            if (DEMO_MODE) return runDemo(() => demoStore.deleteMessage(id));
            const response = await apiClient.delete(`/chat/messages/${id}`);
            return response.data;
        },
        ...withCallbacks(queryClient, [['messages', conversationId], ['conversations']], onSuccess, onError),
    });
};

// =====================================================================
// TASKS
// =====================================================================
export const useTasks = (options = {}) => {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            if (DEMO_MODE) return demoStore.listTasks();
            const response = await apiClient.get('/tasks');
            return response.data?.data || response.data;
        },
        placeholderData: keepPreviousData,
        ...options,
    });
};

export const useCreateTask = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            if (DEMO_MODE) return runDemo(() => demoStore.createTask(payload));
            const response = await apiClient.post('/tasks', payload);
            return response.data;
        },
        ...withCallbacks(queryClient, [['tasks'], ['notifications']], onSuccess, onError),
    });
};

export const useUpdateTask = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...payload }) => {
            if (DEMO_MODE) return runDemo(() => demoStore.updateTask(id, payload));
            const response = await apiClient.put(`/tasks/${id}`, payload);
            return response.data;
        },
        ...withCallbacks(queryClient, [['tasks'], ['notifications']], onSuccess, onError),
    });
};

export const useToggleTask = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            if (DEMO_MODE) return runDemo(() => demoStore.toggleTask(id));
            const response = await apiClient.post(`/tasks/${id}/toggle`);
            return response.data;
        },
        ...withCallbacks(queryClient, [['tasks'], ['notifications']], onSuccess, onError),
    });
};

export const useDeleteTask = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            if (DEMO_MODE) return runDemo(() => demoStore.deleteTask(id));
            const response = await apiClient.delete(`/tasks/${id}`);
            return response.data;
        },
        ...withCallbacks(queryClient, [['tasks']], onSuccess, onError),
    });
};

// =====================================================================
// GOALS
// =====================================================================
export const useGoals = (options = {}) => {
    return useQuery({
        queryKey: ['goals'],
        queryFn: async () => {
            if (DEMO_MODE) return demoStore.listGoals();
            const response = await apiClient.get('/goals');
            return response.data?.data || response.data;
        },
        placeholderData: keepPreviousData,
        ...options,
    });
};

export const useCreateGoal = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            if (DEMO_MODE) return runDemo(() => demoStore.createGoal(payload));
            const response = await apiClient.post('/goals', payload);
            return response.data;
        },
        ...withCallbacks(queryClient, [['goals']], onSuccess, onError),
    });
};

export const useUpdateGoal = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...payload }) => {
            if (DEMO_MODE) return runDemo(() => demoStore.updateGoal(id, payload));
            const response = await apiClient.put(`/goals/${id}`, payload);
            return response.data;
        },
        ...withCallbacks(queryClient, [['goals']], onSuccess, onError),
    });
};

export const useToggleGoalStep = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ goalId, stepId }) => {
            if (DEMO_MODE) return runDemo(() => demoStore.toggleGoalStep(goalId, stepId));
            const response = await apiClient.post(`/goals/${goalId}/steps/${stepId}/toggle`);
            return response.data;
        },
        ...withCallbacks(queryClient, [['goals']], onSuccess, onError),
    });
};

export const useDeleteGoal = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            if (DEMO_MODE) return runDemo(() => demoStore.deleteGoal(id));
            const response = await apiClient.delete(`/goals/${id}`);
            return response.data;
        },
        ...withCallbacks(queryClient, [['goals']], onSuccess, onError),
    });
};

// =====================================================================
// MEMORY
// =====================================================================
export const useMemories = (options = {}) => {
    return useQuery({
        queryKey: ['memories'],
        queryFn: async () => {
            if (DEMO_MODE) return demoStore.listMemories();
            const response = await apiClient.get('/memory');
            return response.data?.data || response.data;
        },
        placeholderData: keepPreviousData,
        ...options,
    });
};

export const useCreateMemory = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            if (DEMO_MODE) return runDemo(() => demoStore.createMemory(payload));
            const response = await apiClient.post('/memory', payload);
            return response.data;
        },
        ...withCallbacks(queryClient, [['memories']], onSuccess, onError),
    });
};

export const useUpdateMemory = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...payload }) => {
            if (DEMO_MODE) return runDemo(() => demoStore.updateMemory(id, payload));
            const response = await apiClient.put(`/memory/${id}`, payload);
            return response.data;
        },
        ...withCallbacks(queryClient, [['memories']], onSuccess, onError),
    });
};

export const useDeleteMemory = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            if (DEMO_MODE) return runDemo(() => demoStore.deleteMemory(id));
            const response = await apiClient.delete(`/memory/${id}`);
            return response.data;
        },
        ...withCallbacks(queryClient, [['memories']], onSuccess, onError),
    });
};

// =====================================================================
// NOTIFICATIONS
// =====================================================================
export const useNotifications = (options = {}) => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            if (DEMO_MODE) return demoStore.listNotifications();
            const response = await apiClient.get('/notifications');
            return response.data?.data || response.data;
        },
        ...options,
    });
};

export const useMarkNotificationsRead = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            if (DEMO_MODE) return runDemo(() => demoStore.markAllRead());
            const response = await apiClient.post('/notifications/read-all');
            return response.data;
        },
        ...withCallbacks(queryClient, [['notifications']], onSuccess, onError),
    });
};

// =====================================================================
// HABITS
// =====================================================================
export const useHabits = (options = {}) => {
    return useQuery({
        queryKey: ['habits'],
        queryFn: async () => {
            if (DEMO_MODE) return [];
            const response = await apiClient.get('/habits');
            return response.data?.data || response.data;
        },
        ...options,
    });
};

export const useCreateHabit = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            if (DEMO_MODE) return runDemo(() => payload);
            const response = await apiClient.post('/habits', payload);
            return response.data;
        },
        ...withCallbacks(queryClient, [['habits'], ['progress']], onSuccess, onError),
    });
};

export const useUpdateHabit = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...payload }) => {
            if (DEMO_MODE) return runDemo(() => payload);
            const response = await apiClient.put(`/habits/${id}`, payload);
            return response.data;
        },
        ...withCallbacks(queryClient, [['habits']], onSuccess, onError),
    });
};

export const useDeleteHabit = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            if (DEMO_MODE) return runDemo(() => id);
            const response = await apiClient.delete(`/habits/${id}`);
            return response.data;
        },
        ...withCallbacks(queryClient, [['habits'], ['progress']], onSuccess, onError),
    });
};

export const useToggleHabitLog = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, date }) => {
            if (DEMO_MODE) return runDemo(() => ({ id }));
            const response = await apiClient.post(`/habits/${id}/toggle`, { date });
            return response.data;
        },
        ...withCallbacks(queryClient, [['habits'], ['progress'], ['insights']], onSuccess, onError),
    });
};

// =====================================================================
// CALENDAR
// =====================================================================
export const useCalendarEvents = (month, options = {}) => {
    return useQuery({
        queryKey: ['calendar', month],
        queryFn: async () => {
            if (DEMO_MODE) return [];
            const response = await apiClient.get('/calendar/events', { params: { month } });
            return response.data?.data || response.data;
        },
        placeholderData: keepPreviousData,
        ...options,
    });
};

// =====================================================================
// REMINDERS
// =====================================================================
export const useUpcomingReminders = (days = 7, options = {}) => {
    return useQuery({
        queryKey: ['reminders', days],
        queryFn: async () => {
            if (DEMO_MODE) return [];
            const response = await apiClient.get('/reminders/upcoming', { params: { days } });
            return response.data?.data || response.data;
        },
        ...options,
    });
};

// =====================================================================
// INSIGHTS
// =====================================================================
export const useInsights = (options = {}) => {
    return useQuery({
        queryKey: ['insights'],
        queryFn: async () => {
            if (DEMO_MODE) return [];
            const response = await apiClient.get('/insights');
            return response.data?.data || response.data;
        },
        ...options,
    });
};

// =====================================================================
// PROGRESS
// =====================================================================
export const useProgress = (options = {}) => {
    return useQuery({
        queryKey: ['progress'],
        queryFn: async () => {
            if (DEMO_MODE) return { goals: { total: 0, completed: 0, inProgress: 0, avgProgress: 0, list: [] }, tasks: {}, habits: {} };
            const response = await apiClient.get('/progress');
            return response.data?.data || response.data;
        },
        ...options,
    });
};

// =====================================================================
// DAILY BRIEFING
// =====================================================================
export const useDailyBriefing = (options = {}) => {
    return useQuery({
        queryKey: ['dailyBriefing'],
        queryFn: async () => {
            if (DEMO_MODE) return null;
            const response = await apiClient.get('/daily-briefing');
            return response.data?.data || response.data;
        },
        ...options,
    });
};

// =====================================================================
// ACTIVITY LOGS
// =====================================================================
export const useActivityLogs = (params = { page: 1, limit: 20 }, options = {}) => {
    return useQuery({
        queryKey: ['activityLogs', params],
        queryFn: async () => {
            if (DEMO_MODE) return { logs: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } };
            const response = await apiClient.get('/activity-logs', { params });
            return response.data?.data || response.data;
        },
        ...options,
    });
};

