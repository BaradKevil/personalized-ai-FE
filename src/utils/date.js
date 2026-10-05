import { format, isToday, isTomorrow, isYesterday, parseISO, formatDistanceToNowStrict, startOfDay, addDays } from 'date-fns';

export const toISO = (date) => (date ? new Date(date).toISOString() : null);

export const parseDay = (iso) => (iso ? parseISO(iso) : null);

export const isDueOverdue = (iso) => {
    if (!iso) return false;
    return parseISO(iso) < startOfDay(new Date());
};

export const isDueToday = (iso) => (iso ? isToday(parseISO(iso)) : false);

export const isDueTomorrow = (iso) => (iso ? isTomorrow(parseISO(iso)) : false);

export const isDueInDays = (iso, days) => {
    if (!iso) return false;
    const target = addDays(startOfDay(new Date()), days);
    return startOfDay(parseISO(iso)).getTime() === target.getTime();
};

export const formatDay = (iso) => {
    if (!iso) return 'No due date';
    const date = parseISO(iso);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEE, MMM d');
};

export const formatFullDate = (iso) => {
    if (!iso) return '—';
    return format(parseISO(iso), 'EEE, MMM d, yyyy');
};

export const formatTime = (iso) => {
    if (!iso) return '';
    return format(parseISO(iso), 'h:mm a');
};

export const formatRelative = (iso) => {
    if (!iso) return '';
    return formatDistanceToNowStrict(parseISO(iso), { addSuffix: true });
};

export const dueLabel = (iso) => {
    if (!iso) return '';
    const day = formatDay(iso);
    const time = formatTime(iso);
    return time ? `${day} · ${time}` : day;
};

export const greetingFor = () => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Good evening';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};
