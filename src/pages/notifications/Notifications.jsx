import { Box, Button, Skeleton, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { FiAlertTriangle, FiBell, FiCheck, FiCheckCircle, FiFlag, FiTarget, FiZap } from 'react-icons/fi';
import { formatDistanceToNowStrict } from 'date-fns';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import { useMarkNotificationsRead, useNotifications } from '../../Api/Api';

const KIND_META = {
    deadline: { icon: <FiFlag size={15} />, color: 'var(--error)', soft: 'var(--error-soft)' },
    reminder: { icon: <FiBell size={15} />, color: 'var(--info)', soft: 'var(--info-soft)' },
    ai_suggestion: { icon: <FiZap size={15} />, color: 'var(--accent-deep)', soft: 'var(--accent-soft)' },
    goal: { icon: <FiTarget size={15} />, color: 'var(--success)', soft: 'var(--success-soft)' },
    system: { icon: <FiCheckCircle size={15} />, color: 'var(--text-secondary)', soft: 'var(--surface-soft)' },
};

const Notifications = () => {
    const { data: notifications = [], isLoading } = useNotifications();
    const { mutate: markAllRead, isPending } = useMarkNotificationsRead(
        () => toast.success('All notifications marked as read.'),
        () => toast.error("Couldn't update notifications.")
    );

    const unread = notifications.filter((n) => !n.read);
    const read = notifications.filter((n) => n.read);

    const renderItem = (notification) => {
        const meta = KIND_META[notification.kind] || KIND_META.system;
        return (
            <Box
                key={notification.id}
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.3,
                    bgcolor: notification.read ? 'var(--surface)' : 'var(--accent-soft)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    p: { xs: 1.4, sm: 1.6 },
                    boxShadow: 'var(--shadow-xs)',
                    opacity: notification.read ? 0.72 : 1,
                    transition: 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 'var(--shadow-sm)',
                        borderColor: 'var(--border-strong)',
                    },
                }}
            >
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: meta.soft,
                        color: meta.color,
                    }}
                >
                    {meta.icon}
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{notification.title}</Typography>
                        {!notification.read && (
                            <Box component="span" sx={{ width: 7, height: 7, bgcolor: 'var(--accent)', boxShadow: '0 0 6px var(--accent-glow)', flexShrink: 0 }} />
                        )}
                        <Typography sx={{ fontSize: 11.5, color: 'var(--text-muted)', ml: 'auto', flexShrink: 0 }}>
                            {notification.createdAt ? formatDistanceToNowStrict(new Date(notification.createdAt), { addSuffix: true }) : ''}
                        </Typography>
                    </Box>
                    {notification.body && (
                        <Typography sx={{ fontSize: 13, color: 'var(--text-secondary)', mt: 0.4, lineHeight: 1.5 }}>
                            {notification.body}
                        </Typography>
                    )}
                </Box>
                {notification.priority === 'high' && (
                    <Box sx={{ color: 'var(--error)', flexShrink: 0, mt: 0.4 }} title="High priority">
                        <FiAlertTriangle size={15} />
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
            <PageHeader
                title="Notifications"
                subtitle={unread.length > 0 ? `${unread.length} unread — nothing urgent hiding in here.` : 'You are all caught up.'}
                actions={
                    unread.length > 0 && (
                        <Button
                            variant="outlined"
                            startIcon={<FiCheck size={15} />}
                            onClick={() => markAllRead()}
                            disabled={isPending}
                        >
                            Mark all read
                        </Button>
                    )
                }
            />

            {isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    <Skeleton variant="rounded" height={80} sx={{ borderRadius: '10px' }} />
                    <Skeleton variant="rounded" height={80} sx={{ borderRadius: '10px' }} />
                </Box>
            ) : notifications.length === 0 ? (
                <EmptyState
                    icon="idle"
                    title="No notifications"
                    message="Task deadlines, reminders, and Milo suggestions will show up here."
                />
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {unread.map(renderItem)}
                    {read.map(renderItem)}
                </Box>
            )}
        </Box>
    );
};

export default Notifications;
