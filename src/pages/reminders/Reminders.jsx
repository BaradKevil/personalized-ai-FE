import { Box, Skeleton, Typography } from '@mui/material';
import { FiBell, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import { useUpcomingReminders } from '../../Api/Api';
import { dueLabel, formatDay } from '../../utils/date';

const Reminders = () => {
    const { data: reminders = [], isLoading } = useUpcomingReminders(7);

    const taskReminders = reminders.filter((r) => r.kind === 'task');

    return (
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
            <PageHeader
                title="Reminders"
                subtitle={
                    taskReminders.length > 0
                        ? `${taskReminders.length} thing${taskReminders.length > 1 ? 's' : ''} coming up in the next 7 days.`
                        : 'Nothing due soon — enjoy the quiet.'
                }
            />

            {isLoading ? (
                <Skeleton variant="rounded" height={180} sx={{ borderRadius: '12px' }} />
            ) : reminders.length === 0 ? (
                <EmptyState
                    icon="idle"
                    title="All clear"
                    message="When you ask Milo to remind you about something, it appears here — with the exact time."
                />
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {reminders.map((reminder) => {
                        const isTask = reminder.kind === 'task';
                        return (
                            <Box
                                key={`${reminder.kind}-${reminder.id}`}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.3,
                                    bgcolor: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '10px',
                                    p: { xs: 1.3, sm: 1.5 },
                                    boxShadow: 'var(--shadow-xs)',
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
                                        width: 38,
                                        height: 38,
                                        borderRadius: '8px',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: isTask ? (reminder.priority === 'high' ? 'var(--error-soft)' : 'var(--accent-soft)') : 'var(--info-soft)',
                                        color: isTask ? (reminder.priority === 'high' ? 'var(--error)' : 'var(--accent)') : 'var(--info)',
                                    }}
                                >
                                    {isTask ? <FiClock size={18} /> : <FiBell size={18} />}
                                </Box>
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: 800, fontSize: 14.5 }}>{reminder.title}</Typography>
                                    <Typography sx={{ fontSize: 12.5, color: 'var(--text-muted)', mt: 0.2 }}>
                                        {isTask ? formatDay(reminder.dueAt) : format(new Date(reminder.dueAt), 'MMM d · h:mm a')}
                                        {reminder.detail ? ` — ${reminder.detail}` : ''}
                                    </Typography>
                                </Box>
                                {isTask && (
                                    <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-secondary)', flexShrink: 0 }}>
                                        {dueLabel(reminder.dueAt)}
                                    </Typography>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
};

export default Reminders;
