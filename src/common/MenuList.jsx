export const menulist = [
    {
        label: 'Today',
        path: '/app',
        match: ['/app', '/app/'],
        icon: 'sun',
    },
    {
        label: 'Calendar',
        path: '/app/calendar',
        match: ['/app/calendar'],
        icon: 'calendar',
    },
    {
        label: 'Reminders',
        path: '/app/reminders',
        match: ['/app/reminders'],
        icon: 'reminders',
    },
    {
        label: 'Chat',
        path: '/app/chat',
        match: ['/app/chat'],
        icon: 'chat',
    },
    {
        label: 'Memory',
        path: '/app/memory',
        match: ['/app/memory'],
        icon: 'memory',
    },
    {
        label: 'Insights',
        path: '/app/insights',
        match: ['/app/insights'],
        icon: 'insights',
    },
    {
        label: 'Tasks',
        path: '/app/tasks',
        match: ['/app/tasks'],
        icon: 'tasks',
    },
    {
        label: 'Goals',
        path: '/app/goals',
        match: ['/app/goals'],
        icon: 'goals',
    },
    {
        label: 'Habits',
        path: '/app/habits',
        match: ['/app/habits'],
        icon: 'habits',
    },
    {
        label: 'Progress',
        path: '/app/progress',
        match: ['/app/progress'],
        icon: 'progress',
    },
    {
        label: 'Notifications',
        path: '/app/notifications',
        match: ['/app/notifications'],
        icon: 'notifications',
    },
    {
        label: 'Settings',
        path: '/app/settings',
        match: ['/app/settings'],
        icon: 'settings',
    },
];

/** Bottom navigation on mobile — the four most-used destinations. */
export const bottomNavItems = menulist.filter((item) =>
    ['sun', 'chat', 'tasks', 'goals', 'habits'].includes(item.icon)
);
