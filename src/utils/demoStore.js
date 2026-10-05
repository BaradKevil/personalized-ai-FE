// Demo store — localStorage-backed data layer so the frontend runs standalone
// before the Milo API exists. Every function mirrors the future backend
// contract; Api.jsx swaps these for real HTTP calls when VITE_DEMO_MODE=false.
import { addDays, setHours, setMinutes, startOfDay } from 'date-fns';
import { toISO } from './date';

const DB_KEY = 'milo:db';
const SEED_VERSION = '1';

export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

const at = (dayOffset, hour, minute = 0) => {
    const base = addDays(startOfDay(new Date()), dayOffset);
    return toISO(setMinutes(setHours(base, hour), minute));
};

const seedDB = () => ({
    version: SEED_VERSION,
    user: {
        name: 'Alex',
        email: 'alex@milo.app',
        mobile: '+91 98765 43210',
        avatarColor: '#C26A44',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    },
    agent: {
        name: 'Novi',
        avatar: 'orb',
        color: '#C26A44',
    },
    settings: {
        memoryEnabled: true,
        conciseAnswers: true,
        dailyBriefing: true,
        proactiveSuggestions: true,
        inAppNotifications: true,
        browserNotifications: false,
    },
    conversations: [
        {
            id: 'conv-welcome',
            title: 'Getting started',
            createdAt: toISO(new Date()),
            updatedAt: toISO(new Date()),
        },
    ],
    messages: [
        {
            id: 'msg-welcome',
            conversationId: 'conv-welcome',
            role: 'agent',
            content:
                "Hi Alex — I'm **Novi**, your personal AI.\n\nI can help you plan your day, keep track of tasks, and remember what matters to you.\n\nTry asking me something like:\n\n- *Remind me to call Rahul next Tuesday*\n- *Remember that I prefer morning meetings*\n- *What's on my list today?*",
            createdAt: toISO(new Date()),
        },
    ],
    tasks: [
        {
            id: 'task-1',
            title: 'Finish client proposal',
            notes: 'Focus on pricing and timeline sections.',
            priority: 'high',
            dueDate: at(0, 18, 0),
            completed: false,
            recurrence: 'none',
            tags: ['work'],
            createdAt: toISO(new Date()),
        },
        {
            id: 'task-2',
            title: 'Call Rahul',
            notes: '',
            priority: 'medium',
            dueDate: at(1, 11, 0),
            completed: false,
            recurrence: 'none',
            tags: [],
            createdAt: toISO(new Date()),
        },
        {
            id: 'task-3',
            title: 'Study chapter 4',
            notes: '',
            priority: 'low',
            dueDate: at(3, 10, 0),
            completed: false,
            recurrence: 'none',
            tags: ['study'],
            createdAt: toISO(new Date()),
        },
        {
            id: 'task-4',
            title: 'Review weekly metrics',
            notes: '',
            priority: 'medium',
            dueDate: at(-1, 9, 0),
            completed: false,
            recurrence: 'weekly',
            tags: ['work'],
            createdAt: toISO(new Date()),
        },
        {
            id: 'task-5',
            title: 'Book dentist appointment',
            notes: '',
            priority: 'low',
            dueDate: null,
            completed: true,
            recurrence: 'none',
            tags: [],
            createdAt: toISO(addDays(new Date(), -3)),
        },
    ],
    goals: [
        {
            id: 'goal-1',
            title: 'Launch my startup',
            description: 'Take the product from prototype to a paying first cohort.',
            steps: [
                { id: 'g1s1', text: 'Finish the MVP', done: true },
                { id: 'g1s2', text: 'Interview 5 users', done: false },
                { id: 'g1s3', text: 'Prepare the landing page', done: false },
            ],
            createdAt: toISO(addDays(new Date(), -20)),
        },
        {
            id: 'goal-2',
            title: 'Run a 10K',
            description: 'Build up to race day with a gentle training plan.',
            steps: [
                { id: 'g2s1', text: 'Run 3 times this week', done: false },
                { id: 'g2s2', text: 'Reach 5K comfortably', done: true },
            ],
            createdAt: toISO(addDays(new Date(), -6)),
        },
    ],
    memories: [
        { id: 'mem-1', category: 'Personal', content: 'Your preferred name is Alex.', source: 'You told me', createdAt: toISO(addDays(new Date(), -12)), updatedAt: toISO(addDays(new Date(), -12)) },
        { id: 'mem-2', category: 'Preferences', content: 'You prefer concise answers.', source: 'Settings', createdAt: toISO(addDays(new Date(), -12)), updatedAt: toISO(addDays(new Date(), -8)) },
        { id: 'mem-3', category: 'Goals', content: 'Launch your startup by December.', source: 'Conversation', createdAt: toISO(addDays(new Date(), -10)), updatedAt: toISO(addDays(new Date(), -10)) },
        { id: 'mem-4', category: 'Important', content: 'Exam on September 12.', source: 'You told me', createdAt: toISO(addDays(new Date(), -4)), updatedAt: toISO(addDays(new Date(), -4)) },
        { id: 'mem-5', category: 'Work', content: 'Building an AI startup.', source: 'You told me', createdAt: toISO(addDays(new Date(), -11)), updatedAt: toISO(addDays(new Date(), -11)) },
        { id: 'mem-6', category: 'Preferences', content: 'Prefers morning meetings.', source: 'Conversation', createdAt: toISO(addDays(new Date(), -5)), updatedAt: toISO(addDays(new Date(), -5)) },
    ],
    notifications: [
        {
            id: 'notif-1',
            kind: 'alert',
            title: 'Task is overdue',
            body: 'Review weekly metrics was due yesterday.',
            read: false,
            createdAt: toISO(new Date()),
        },
        {
            id: 'notif-2',
            kind: 'insight',
            title: 'Busy afternoon ahead',
            body: "You have 3 tasks due today. I'd suggest finishing the proposal first.",
            read: false,
            createdAt: toISO(new Date()),
        },
    ],
});

const readDB = () => {
    try {
        const raw = localStorage.getItem(DB_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed.version !== SEED_VERSION) return null;
        return parsed;
    } catch {
        return null;
    }
};

const writeDB = (db) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const getDB = () => {
    let db = readDB();
    if (!db) {
        db = seedDB();
        writeDB(db);
    }
    return db;
};

const save = (mutator) => {
    const db = getDB();
    const next = mutator(db) || db;
    writeDB(next);
    return next;
};

export const demoStore = {
    // ---- user / agent / settings ----
    getUser: () => getDB().user,
    updateUser: (patch) => save((db) => { db.user = { ...db.user, ...patch }; }),
    getAgent: () => getDB().agent,
    updateAgent: (patch) => save((db) => { db.agent = { ...db.agent, ...patch }; }),
    getSettings: () => getDB().settings,
    updateSettings: (patch) => save((db) => { db.settings = { ...db.settings, ...patch }; }),

    // ---- conversations ----
    listConversations: () =>
        [...getDB().conversations].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    createConversation: (title = 'New conversation') => {
        const now = toISO(new Date());
        const conv = { id: uid(), title, createdAt: now, updatedAt: now };
        save((db) => { db.conversations.unshift(conv); });
        return conv;
    },
    renameConversation: (id, title) =>
        save((db) => {
            const conv = db.conversations.find((c) => c.id === id);
            if (conv) { conv.title = title; conv.updatedAt = toISO(new Date()); }
        }),
    deleteConversation: (id) =>
        save((db) => {
            db.conversations = db.conversations.filter((c) => c.id !== id);
            db.messages = db.messages.filter((m) => m.conversationId !== id);
        }),
    touchConversation: (id) =>
        save((db) => {
            const conv = db.conversations.find((c) => c.id === id);
            if (conv) conv.updatedAt = toISO(new Date());
        }),

    // ---- messages ----
    listMessages: (conversationId) =>
        getDB().messages
            .filter((m) => m.conversationId === conversationId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    addMessage: (conversationId, role, content) => {
        const msg = { id: uid(), conversationId, role, content, createdAt: toISO(new Date()) };
        save((db) => { db.messages.push(msg); });
        demoStore.touchConversation(conversationId);
        return msg;
    },
    updateMessage: (id, patch) =>
        save((db) => {
            const msg = db.messages.find((m) => m.id === id);
            if (msg) Object.assign(msg, patch);
        }),
    deleteMessage: (id) => save((db) => { db.messages = db.messages.filter((m) => m.id !== id); }),
    lastAgentMessage: (conversationId) => {
        const msgs = demoStore.listMessages(conversationId);
        for (let i = msgs.length - 1; i >= 0; i -= 1) {
            if (msgs[i].role === 'agent') return msgs[i];
        }
        return null;
    },
    lastUserMessage: (conversationId) => {
        const msgs = demoStore.listMessages(conversationId);
        for (let i = msgs.length - 1; i >= 0; i -= 1) {
            if (msgs[i].role === 'user') return msgs[i];
        }
        return null;
    },

    // ---- tasks ----
    listTasks: () => [...getDB().tasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const prio = { high: 0, medium: 1, low: 2 };
        if (prio[a.priority] !== prio[b.priority]) return prio[a.priority] - prio[b.priority];
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    }),
    createTask: (payload) => {
        const task = { id: uid(), completed: false, recurrence: 'none', tags: [], createdAt: toISO(new Date()), ...payload };
        save((db) => { db.tasks.push(task); });
        return task;
    },
    updateTask: (id, patch) =>
        save((db) => {
            const task = db.tasks.find((t) => t.id === id);
            if (task) Object.assign(task, patch);
        }),
    toggleTask: (id) => {
        let updated = null;
        save((db) => {
            const task = db.tasks.find((t) => t.id === id);
            if (task) {
                task.completed = !task.completed;
                task.completedAt = task.completed ? toISO(new Date()) : null;
                updated = task;
            }
        });
        return updated;
    },
    deleteTask: (id) => save((db) => { db.tasks = db.tasks.filter((t) => t.id !== id); }),

    // ---- goals ----
    listGoals: () => [...getDB().goals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    createGoal: (payload) => {
        const goal = { id: uid(), steps: [], createdAt: toISO(new Date()), ...payload };
        save((db) => { db.goals.push(goal); });
        return goal;
    },
    updateGoal: (id, patch) =>
        save((db) => {
            const goal = db.goals.find((g) => g.id === id);
            if (goal) Object.assign(goal, patch);
        }),
    toggleGoalStep: (goalId, stepId) =>
        save((db) => {
            const goal = db.goals.find((g) => g.id === goalId);
            if (!goal) return;
            const step = goal.steps.find((s) => s.id === stepId);
            if (step) step.done = !step.done;
        }),
    deleteGoal: (id) => save((db) => { db.goals = db.goals.filter((g) => g.id !== id); }),

    // ---- memories ----
    listMemories: () => [...getDB().memories].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    createMemory: (payload) => {
        const now = toISO(new Date());
        const mem = { id: uid(), source: 'You told me', createdAt: now, updatedAt: now, ...payload };
        save((db) => { db.memories.unshift(mem); });
        return mem;
    },
    updateMemory: (id, patch) =>
        save((db) => {
            const mem = db.memories.find((m) => m.id === id);
            if (mem) { Object.assign(mem, patch); mem.updatedAt = toISO(new Date()); }
        }),
    deleteMemory: (id) => save((db) => { db.memories = db.memories.filter((m) => m.id !== id); }),
    deleteMemoryByContent: (fragment) => {
        let removed = false;
        save((db) => {
            const before = db.memories.length;
            db.memories = db.memories.filter((m) => !m.content.toLowerCase().includes(fragment.toLowerCase()));
            removed = db.memories.length < before;
        });
        return removed;
    },

    // ---- notifications ----
    listNotifications: () => [...getDB().notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    unreadCount: () => getDB().notifications.filter((n) => !n.read).length,
    markAllRead: () => save((db) => { db.notifications.forEach((n) => { n.read = true; }); }),

    // ---- reset ----
    reset: () => {
        localStorage.removeItem(DB_KEY);
        return seedDB();
    },
};
