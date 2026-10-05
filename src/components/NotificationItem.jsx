import { Box, Typography } from '@mui/material';
import { FiAlertCircle, FiClock, FiZap, FiTrendingUp } from 'react-icons/fi';
import { NOTIFICATION_KINDS } from '../utils/constants';
import { formatRelative } from '../utils/date';

const kindIcon = {
    reminder: FiClock,
    alert: FiAlertCircle,
    suggestion: FiZap,
    insight: FiTrendingUp,
};

const NotificationItem = ({ notification }) => {
    const kind = NOTIFICATION_KINDS[notification.kind] || NOTIFICATION_KINDS.insight;
    const Icon = kindIcon[notification.kind] || FiTrendingUp;

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1.2,
                px: 1.5,
                py: 1.1,
                borderRadius: '8px',
                mb: 0.4,
                bgcolor: notification.read ? 'transparent' : 'var(--accent-soft)',
                transition: 'background 0.12s ease',
                '&:hover': { bgcolor: 'var(--surface-soft)' },
            }}
        >
            <Box
                sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    bgcolor: kind.soft,
                    color: kind.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.2,
                }}
            >
                <Icon size={14} />
            </Box>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>
                    {notification.title}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, mt: 0.2 }}>
                    {notification.body}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: 'var(--text-muted)', mt: 0.3 }}>
                    {formatRelative(notification.createdAt)}
                </Typography>
            </Box>
        </Box>
    );
};

export default NotificationItem;
