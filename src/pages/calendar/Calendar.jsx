import { useMemo, useState } from 'react';
import { Box, IconButton, Skeleton, Typography } from '@mui/material';
import { FiChevronLeft, FiChevronRight, FiFlag, FiTarget } from 'react-icons/fi';
import { format, isToday, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isSameMonth } from 'date-fns';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import { useCalendarEvents } from '../../Api/Api';

const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const monthKey = (date) => format(date, 'yyyy-MM');

const Calendar = () => {
    const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
    const [selected, setSelected] = useState(() => format(new Date(), 'yyyy-MM-dd'));
    const { data: events = [], isLoading } = useCalendarEvents(monthKey(cursor));

    const days = useMemo(() => eachDayOfInterval({ start: startOfMonth(cursor), end: endOfMonth(cursor) }), [cursor]);

    const eventsByDay = useMemo(() => {
        const map = {};
        for (const event of events) {
            (map[event.date] = map[event.date] || []).push(event);
        }
        return map;
    }, [events]);

    const selectedEvents = eventsByDay[selected] || [];

    const leadingBlanks = days[0].getDay();

    const prev = () => setCursor((c) => addMonths(c, -1));
    const next = () => setCursor((c) => addMonths(c, 1));

    return (
        <Box sx={{ maxWidth: 860, mx: 'auto' }}>
            <PageHeader
                title="Calendar"
                subtitle="Your dated tasks and goal milestones, all in one view."
                actions={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton onClick={prev} aria-label="Previous month" className="milo-focus">
                            <FiChevronLeft size={18} />
                        </IconButton>
                        <Typography sx={{ fontWeight: 800, minWidth: 150, textAlign: 'center', fontSize: 15 }}>
                            {format(cursor, 'MMMM yyyy')}
                        </Typography>
                        <IconButton onClick={next} aria-label="Next month" className="milo-focus">
                            <FiChevronRight size={18} />
                        </IconButton>
                    </Box>
                }
            />

            <Box
                sx={{
                    bgcolor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    p: { xs: 1.2, sm: 2 },
                    overflowX: 'auto',
                    boxShadow: 'var(--shadow-sm)',
                }}
            >
                {/* Weekday header */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.6, mb: 0.8, minWidth: 560 }}>
                    {DAY_KEYS.map((d) => (
                        <Typography key={d} sx={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {d}
                        </Typography>
                    ))}
                </Box>

                {isLoading ? (
                    <Skeleton variant="rounded" height={360} sx={{ borderRadius: '8px' }} />
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.6, minWidth: 560 }}>
                        {Array.from({ length: leadingBlanks }).map((_, i) => (
                            <Box key={`blank-${i}`} />
                        ))}
                        {days.map((day) => {
                            const key = format(day, 'yyyy-MM-dd');
                            const dayEvents = eventsByDay[key] || [];
                            const isCurrentMonth = isSameMonth(day, cursor);
                            const today = isToday(day);
                            const active = selected === key;
                            return (
                                <Box
                                    key={key}
                                    onClick={() => setSelected(key)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && setSelected(key)}
                                    aria-label={`${format(day, 'MMMM d')} — ${dayEvents.length} events`}
                                    sx={{
                                        minHeight: { xs: 64, sm: 84 },
                                        borderRadius: '6px',
                                        border: active ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                                        borderColor: today ? 'var(--accent)' : 'var(--border)',
                                        bgcolor: active ? 'var(--accent-soft)' : today ? 'var(--accent-soft)' : 'var(--surface-soft)',
                                        opacity: isCurrentMonth ? 1 : 0.4,
                                        p: 0.7,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 0.4,
                                        transition: 'transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: 'var(--shadow-xs)',
                                            borderColor: 'var(--accent)',
                                        },
                                    }}
                                >
                                    <Typography sx={{ fontSize: 11.5, fontWeight: today || active ? 700 : 600, color: today ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                        {format(day, 'd')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, mt: 'auto' }}>
                                        {dayEvents.slice(0, 2).map((e) => (
                                            <Box
                                                key={`${e.kind}-${e.id}`}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.4,
                                                    fontSize: 10,
                                                    fontWeight: 600,
                                                    borderRadius: '4px',
                                                    px: 0.5,
                                                    py: 0.2,
                                                    color: e.kind === 'goal' ? 'var(--info)' : e.priority === 'high' ? 'var(--error)' : 'var(--accent)',
                                                    bgcolor: e.kind === 'goal' ? 'var(--info-soft)' : 'var(--accent-soft)',
                                                    textDecoration: e.completed ? 'line-through' : 'none',
                                                    opacity: e.completed ? 0.55 : 1,
                                                }}
                                            >
                                                <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {e.time && `${e.time} `}
                                                    {e.title}
                                                </Box>
                                            </Box>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <Typography sx={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>
                                                +{dayEvents.length - 2} more
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Box>

            {/* Selected-day detail */}
            <Box sx={{ mt: 2.4 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 1.2 }}>
                    {format(new Date(`${selected}T12:00:00`), 'EEEE, MMMM d')}
                </Typography>
                {selectedEvents.length === 0 ? (
                    <EmptyState
                        state="idle"
                        title="Nothing scheduled"
                        message="This day is open. Ask Milo in chat to add a task or a goal milestone."
                    />
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {selectedEvents.map((e) => (
                            <Box
                                key={`${e.kind}-${e.id}`}
                                className="milo-depth"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.2,
                                    bgcolor: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    p: 1.6,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 34,
                                        height: 34,
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: e.kind === 'goal' ? 'var(--info-soft)' : 'var(--accent-soft)',
                                        color: e.kind === 'goal' ? 'var(--info)' : 'var(--accent-deep)',
                                    }}
                                >
                                    {e.kind === 'goal' ? <FiTarget size={16} /> : <FiFlag size={16} />}
                                </Box>
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: 800, fontSize: 14.5, textDecoration: e.completed ? 'line-through' : 'none', opacity: e.completed ? 0.6 : 1 }}>
                                        {e.title}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                        {e.kind === 'goal' ? `Goal milestone · ${e.progress}% complete` : `${e.time || 'All day'} · ${e.priority} priority`}
                                    </Typography>
                                </Box>
                                {e.kind === 'goal' && (
                                    <Typography sx={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-deep)' }}>{e.progress}%</Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Calendar;
