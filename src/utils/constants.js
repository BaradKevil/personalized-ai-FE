export const PRIORITIES = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
];

export const RECURRENCE_OPTIONS = [
    { value: 'none', label: 'Does not repeat' },
    { value: 'daily', label: 'Every day' },
    { value: 'weekly', label: 'Every week' },
];

export const MEMORY_CATEGORIES = [
    { value: 'Personal', label: 'Personal' },
    { value: 'Preferences', label: 'Preferences' },
    { value: 'Goals', label: 'Goals' },
    { value: 'Important', label: 'Important' },
    { value: 'Work', label: 'Work' },
];

export const AVATAR_OPTIONS = [
    { id: 'orb', label: 'Orb', color: '#7C3AED' },
    { id: 'leaf', label: 'Leaf', color: '#10B981' },
    { id: 'wave', label: 'Wave', color: '#3B82F6' },
    { id: 'spark', label: 'Spark', color: '#F59E0B' },
];

export const USER_AVATAR_COLORS = ['#7C3AED', '#10B981', '#3B82F6', '#F59E0B', '#F43F5E', '#6366F1'];

export const TIMEZONES = (() => {
    try {
        const zones = Intl.supportedValuesOf?.('timeZone') || [];
        if (zones.length) return zones.map((z) => ({ value: z, label: z.replace(/_/g, ' ') }));
    } catch {
        /* fall through to defaults */
    }
    return [
        { value: 'UTC', label: 'UTC' },
        { value: 'Asia/Kolkata', label: 'India (Asia/Kolkata)' },
        { value: 'America/New_York', label: 'New York (America/New_York)' },
        { value: 'America/Los_Angeles', label: 'Los Angeles (America/Los_Angeles)' },
        { value: 'Europe/London', label: 'London (Europe/London)' },
        { value: 'Europe/Berlin', label: 'Berlin (Europe/Berlin)' },
    ];
})();

export const NOTIFICATION_KINDS = {
    reminder: { label: 'Reminder', color: '#2563EB', soft: '#EFF6FF' },
    alert: { label: 'Alert', color: '#DC2626', soft: '#FEF2F2' },
    suggestion: { label: 'Suggestion', color: '#16A34A', soft: '#F0FDF4' },
    insight: { label: 'Insight', color: '#D97706', soft: '#FFFBEB' },
};
