import {
    FiSun,
    FiMessageCircle,
    FiCheckSquare,
    FiTarget,
    FiBookmark,
    FiSettings,
    FiCalendar,
    FiBell,
    FiRepeat,
    FiTrendingUp,
    FiBarChart2,
} from 'react-icons/fi';

export const navIconElement = (name, size = 18, strokeWidth = 2) => {
    switch (name) {
        case 'chat':
            return <FiMessageCircle size={size} strokeWidth={strokeWidth} />;
        case 'tasks':
            return <FiCheckSquare size={size} strokeWidth={strokeWidth} />;
        case 'goals':
            return <FiTarget size={size} strokeWidth={strokeWidth} />;
        case 'memory':
            return <FiBookmark size={size} strokeWidth={strokeWidth} />;
        case 'settings':
            return <FiSettings size={size} strokeWidth={strokeWidth} />;
        case 'calendar':
            return <FiCalendar size={size} strokeWidth={strokeWidth} />;
        case 'reminders':
        case 'notifications':
            return <FiBell size={size} strokeWidth={strokeWidth} />;
        case 'habits':
            return <FiRepeat size={size} strokeWidth={strokeWidth} />;
        case 'insights':
            return <FiTrendingUp size={size} strokeWidth={strokeWidth} />;
        case 'progress':
            return <FiBarChart2 size={size} strokeWidth={strokeWidth} />;
        case 'sun':
        default:
            return <FiSun size={size} strokeWidth={strokeWidth} />;
    }
};
