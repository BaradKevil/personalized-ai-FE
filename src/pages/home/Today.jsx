import { useMemo, useState } from 'react';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
    FiArrowRight,
    FiCheck,
    FiClock,
    FiPlus,
    FiTarget,
    FiZap,
    FiAlertCircle,
    FiCalendar,
    FiSettings,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import AgentAvatar from '../../components/AgentAvatar';
import MiloCore from '../../components/milo/MiloCore';
import TaskForm from '../../components/TaskForm';
import { greetingFor, isDueOverdue, isDueToday, formatTime } from '../../utils/date';
import {
    useAgent,
    useNotifications,
    useStatsOverview,
    useTasks,
    useToggleTask,
    useUpdateTask,
    useGoals,
    useUserProfile,
    useDailyBriefing,
} from '../../Api/Api';

const QUICK_PROMPTS = [
    'Plan my morning',
    'What needs my attention?',
    'Help me prioritize open tasks',
    'Draft a weekly focus plan',
];

const QUICK_ACTIONS = [
    { icon: FiPlus, label: 'New Task', desc: 'Add to agenda', to: '/app/tasks?new=1' },
    { icon: FiTarget, label: 'Goals', desc: 'Milestones & progress', to: '/app/goals' },
    { icon: FiCalendar, label: 'Calendar', desc: 'Schedule & timeline', to: '/app/calendar' },
    { icon: FiZap, label: 'Ask Milo', desc: 'Instant reasoning', to: '/app/chat' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

const Today = () => {
    const nav = useNavigate();
    const { data: user } = useUserProfile();
    const { data: agent } = useAgent();
    const { data: tasks = [], isLoading: tasksLoading } = useTasks();
    const { data: goals = [] } = useGoals();
    const { data: notifications = [] } = useNotifications();
    const { data: stats } = useStatsOverview();
    const { data: serverBriefing } = useDailyBriefing();
    const { mutate: updateTask } = useUpdateTask();
    const { mutate: toggleTask } = useToggleTask();

    const [reschedTask, setReschedTask] = useState(null);

    const firstName = user?.name?.split(' ')[0] || 'there';
    const agentName = agent?.name || 'Milo';

    const { todayTasks, upcomingTasks, overdueCount, focusTask, briefing } = useMemo(() => {
        const open = tasks.filter((t) => !t.completed);
        const today = open
            .filter((t) => isDueToday(t.dueDate) || isDueOverdue(t.dueDate))
            .sort((a, b) => {
                const pa = a.priority === 'high' ? 0 : a.priority === 'medium' ? 1 : 2;
                const pb = b.priority === 'high' ? 0 : b.priority === 'medium' ? 1 : 2;
                if (pa !== pb) return pa - pb;
                return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
            });
        const upcoming = open
            .filter((t) => t.dueDate && !isDueToday(t.dueDate) && !isDueOverdue(t.dueDate))
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        const overdue = open.filter((t) => isDueOverdue(t.dueDate));
        const focus = open.find((t) => t.priority === 'high') || today[0] || open[0] || null;

        let briefingText = serverBriefing?.aiNarrative;
        if (!briefingText) {
            if (overdue.length > 0 && focus) {
                briefingText = `You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}. I recommend focusing on "${focus.title}" first to clear the highest priority item.`;
            } else if (today.length >= 2) {
                briefingText = `You have ${today.length} priorities planned for today. Beginning with "${focus?.title || 'your focus item'}" will set the ideal momentum.`;
            } else if (focus) {
                briefingText = `Your agenda is open and manageable today. Dedicating morning focus to "${focus.title}" will unlock high-impact progress.`;
            } else {
                briefingText = 'Your day looks clear of urgent deadlines. This is an opportune moment to advance key goals or conduct a deep focus session.';
            }
        }

        return {
            todayTasks: today.slice(0, 5),
            upcomingTasks: upcoming.slice(0, 4),
            overdueCount: overdue.length,
            focusTask: focus,
            briefing: briefingText,
        };
    }, [tasks, serverBriefing]);

    const goalOverview = useMemo(
        () =>
            goals
                .map((g) => {
                    const done = (g.steps || []).filter((s) => s.done).length;
                    const total = (g.steps || []).length;
                    return {
                        ...g,
                        percent: total === 0 ? 0 : Math.round((done / total) * 100),
                        next: (g.steps || []).find((s) => !s.done),
                    };
                })
                .slice(0, 3),
        [goals]
    );

    const goalsInProgress = goals.filter((g) => (g.steps || []).some((s) => !s.done)).length;
    const upcomingCount = upcomingTasks.length;

    const noticed = useMemo(() => {
        const seed = notifications.find((n) => n.kind === 'alert' || n.kind === 'insight');
        if (seed) {
            return { title: seed.title, body: seed.body, to: '/app/tasks', action: 'Review tasks' };
        }
        if (overdueCount > 0) {
            return {
                title: 'Attention needed on overdue items',
                body: `You have ${overdueCount} task${overdueCount > 1 ? 's' : ''} past their due date. Let's reschedule or complete them together.`,
                to: '/app/tasks',
                action: 'Manage tasks',
            };
        }
        if (goalsInProgress > 0 && goalOverview[0]) {
            return {
                title: 'Goal momentum available',
                body: `"${goalOverview[0].title}" has actionable steps waiting. A short 20-minute push today can advance this significantly.`,
                to: '/app/goals',
                action: 'Open goal',
            };
        }
        return null;
    }, [notifications, overdueCount, goalsInProgress, goalOverview]);

    if (tasksLoading) {
        return (
            <Box sx={{ maxWidth: 1140, mx: 'auto', p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Skeleton variant="circular" width={52} height={52} />
                    <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width={220} height={32} />
                        <Skeleton variant="text" width={160} height={20} />
                    </Box>
                </Box>
                <Skeleton variant="rounded" height={160} sx={{ mb: 3, borderRadius: '12px' }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} variant="rounded" height={84} sx={{ borderRadius: '12px' }} />
                    ))}
                </Box>
            </Box>
        );
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
            <Box sx={{ maxWidth: 1140, mx: 'auto' }}>
                {/* Header Greeting */}
                <motion.div variants={itemVariants}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                    Daily Intelligence Overview
                                </Typography>
                                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'var(--text-muted)' }} />
                                <Typography sx={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                                    {format(new Date(), 'EEEE, MMMM d, yyyy')}
                                </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: { xs: '26px', sm: '32px' }, letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink)' }}>
                                {greetingFor()}, {firstName}.
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<HiSparkles size={14} />}
                                onClick={() => nav('/app/chat?ask=' + encodeURIComponent('Give me a brief summary of my week'))}
                                sx={{
                                    bgcolor: 'var(--surface)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--ink-soft)',
                                    borderRadius: '8px',
                                    fontSize: '12.5px',
                                    fontWeight: 600,
                                    '&:hover': { borderColor: 'var(--accent-border)', bgcolor: 'var(--surface-soft)' },
                                }}
                            >
                                Weekly AI Summary
                            </Button>
                        </Box>
                    </Box>
                </motion.div>

                {/* AI Briefing Hero Card (Linear / Perplexity style) */}
                <motion.div variants={itemVariants}>
                    <Box
                        sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '16px',
                            border: '1px solid var(--accent-border)',
                            background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-raised) 50%, var(--accent-soft) 100%)',
                            boxShadow: 'var(--shadow-md)',
                            p: { xs: 2.5, sm: 3.5 },
                            mb: 3,
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, gap: { xs: 2, sm: 3 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MiloCore state={overdueCount > 0 ? 'listening' : 'idle'} size={60} />
                            </Box>

                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.6,
                                            px: 1,
                                            py: 0.3,
                                            borderRadius: '99px',
                                            bgcolor: 'var(--accent-soft)',
                                            border: '1px solid var(--accent-border)',
                                            color: 'var(--accent)',
                                            fontSize: '11.5px',
                                            fontWeight: 700,
                                            letterSpacing: '0.02em',
                                        }}
                                    >
                                        <AgentAvatar avatar={agent?.avatar} color={agent?.color} size={15} />
                                        <span>{agentName} AI Briefing</span>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'var(--success)' }} />
                                        <Typography sx={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                                            Live Insights
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography sx={{ fontSize: { xs: '14.5px', md: '16px' }, lineHeight: 1.6, color: 'var(--ink)', fontWeight: 500, maxWidth: 820 }}>
                                    {briefing}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 1, mt: 2.2, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<FiZap size={14} />}
                                        onClick={() => nav('/app/chat?ask=' + encodeURIComponent('Plan my day'))}
                                        sx={{
                                            bgcolor: 'var(--accent)',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            boxShadow: 'var(--shadow-accent)',
                                            '&:hover': { bgcolor: 'var(--accent-hover)' },
                                        }}
                                    >
                                        Plan My Day
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => nav('/app/chat')}
                                        sx={{
                                            borderRadius: '8px',
                                            borderColor: 'var(--border-strong)',
                                            color: 'var(--ink-soft)',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            bgcolor: 'var(--surface)',
                                            '&:hover': { bgcolor: 'var(--surface-soft)', borderColor: 'var(--accent)' },
                                        }}
                                    >
                                        Chat with {agentName}
                                    </Button>
                                    {focusTask && (
                                        <Button
                                            variant="text"
                                            size="small"
                                            startIcon={<FiClock size={14} />}
                                            onClick={() => setReschedTask(focusTask)}
                                            sx={{
                                                borderRadius: '8px',
                                                color: 'var(--text-secondary)',
                                                fontSize: '12.5px',
                                                fontWeight: 600,
                                                '&:hover': { color: 'var(--ink)', bgcolor: 'transparent' },
                                            }}
                                        >
                                            Reschedule Focus Task
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </motion.div>

                {/* 4 Metric KPI Cards */}
                <motion.div variants={itemVariants}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5, mb: 3 }}>
                        <MetricCard
                            label="Due Today"
                            value={todayTasks.length}
                            icon={FiClock}
                            color="var(--accent)"
                            softColor="var(--accent-soft)"
                            subtext="Immediate tasks"
                        />
                        <MetricCard
                            label="Overdue"
                            value={overdueCount}
                            icon={FiAlertCircle}
                            color={overdueCount > 0 ? 'var(--error)' : 'var(--text-muted)'}
                            softColor={overdueCount > 0 ? 'var(--error-soft)' : 'var(--surface-soft)'}
                            subtext={overdueCount > 0 ? 'Needs resolution' : 'Clean schedule'}
                        />
                        <MetricCard
                            label="Upcoming"
                            value={upcomingCount}
                            icon={FiCalendar}
                            color="var(--info)"
                            softColor="var(--info-soft)"
                            subtext="Later this week"
                        />
                        <MetricCard
                            label="Active Goals"
                            value={goalsInProgress}
                            icon={FiTarget}
                            color="var(--success)"
                            softColor="var(--success-soft)"
                            subtext="Tracking progress"
                        />
                    </Box>
                </motion.div>

                {/* Main 2-Column Grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.45fr 1fr' }, gap: 2.5, alignItems: 'start', mb: 3 }}>
                    {/* LEFT COLUMN: Agenda, Upcoming, Analytics */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, minWidth: 0 }}>
                        {/* Agenda Timeline Card */}
                        <motion.div variants={itemVariants}>
                            <Box sx={{ p: 2.5, borderRadius: '12px', bgcolor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography sx={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>
                                            Today's Agenda
                                        </Typography>
                                        <Box sx={{ px: 0.9, py: 0.2, borderRadius: '99px', bgcolor: 'var(--surface-soft)', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                            {todayTasks.length} items
                                        </Box>
                                    </Box>
                                    <Box
                                        component="button"
                                        onClick={() => nav('/app/tasks')}
                                        sx={{
                                            bgcolor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '12.5px',
                                            fontWeight: 600,
                                            color: 'var(--accent)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.4,
                                            '&:hover': { textDecoration: 'underline' },
                                        }}
                                    >
                                        View all <FiArrowRight size={12} />
                                    </Box>
                                </Box>

                                {todayTasks.length === 0 ? (
                                    <Box sx={{ py: 3, textAlign: 'center', bgcolor: 'var(--surface-soft)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                                        <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                            No tasks scheduled for today. You are completely caught up!
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {todayTasks.map((t) => (
                                            <Box
                                                key={t.id}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.4,
                                                    p: 1.25,
                                                    borderRadius: '8px',
                                                    bgcolor: 'var(--surface-soft)',
                                                    border: '1px solid var(--border)',
                                                    transition: 'all 0.15s ease',
                                                    '&:hover': { borderColor: 'var(--accent-border)', bgcolor: 'var(--surface-hover)' },
                                                }}
                                            >
                                                <Box
                                                    component="button"
                                                    onClick={() => toggleTask({ id: t.id, completed: !t.completed })}
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: '6px',
                                                        border: '1.5px solid',
                                                        borderColor: t.completed ? 'var(--accent)' : 'var(--border-strong)',
                                                        bgcolor: t.completed ? 'var(--accent)' : 'transparent',
                                                        color: '#fff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        flexShrink: 0,
                                                        transition: 'all 0.12s ease',
                                                        '&:hover': { borderColor: 'var(--accent)' },
                                                    }}
                                                >
                                                    {t.completed && <FiCheck size={13} strokeWidth={3} />}
                                                </Box>

                                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '13.5px',
                                                            fontWeight: 600,
                                                            color: t.completed ? 'var(--text-muted)' : 'var(--ink)',
                                                            textDecoration: t.completed ? 'line-through' : 'none',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {t.title}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.2 }}>
                                                        <Typography sx={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                            {formatTime(t.dueDate) || 'All day'}
                                                        </Typography>
                                                        {t.priority && (
                                                            <Box
                                                                sx={{
                                                                    fontSize: '10px',
                                                                    fontWeight: 600,
                                                                    textTransform: 'uppercase',
                                                                    color: t.priority === 'high' ? 'var(--error)' : t.priority === 'medium' ? 'var(--warning)' : 'var(--info)',
                                                                }}
                                                            >
                                                                • {t.priority}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </motion.div>

                        {/* Weekly Analytics & Streak */}
                        {stats && stats.week && (
                            <motion.div variants={itemVariants}>
                                <Box sx={{ p: 2.5, borderRadius: '12px', bgcolor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                        <Box>
                                            <Typography sx={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>
                                                Weekly Momentum
                                            </Typography>
                                            <Typography sx={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                Tasks completed across the last 7 days
                                            </Typography>
                                        </Box>
                                        <Box sx={{ px: 1.2, py: 0.4, borderRadius: '99px', bgcolor: 'var(--warning-soft)', border: '1px solid rgba(217,119,6,0.2)', display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                            <Typography sx={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--warning)' }}>
                                                🔥 {stats.streak || 0} Day Streak
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.4fr 1fr' }, gap: 2.5, alignItems: 'center' }}>
                                        {/* Bar chart */}
                                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 100, pt: 1 }}>
                                            {stats.week.map((d, i) => {
                                                const isToday = i === stats.week.length - 1;
                                                const max = Math.max(1, ...stats.week.map((x) => x.count));
                                                const h = d.count === 0 ? 6 : Math.max(12, Math.round((d.count / max) * 76));
                                                return (
                                                    <Box key={d.day} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.6 }}>
                                                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: d.count > 0 ? 'var(--accent)' : 'var(--text-muted)' }}>
                                                            {d.count}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                width: '100%',
                                                                maxWidth: 24,
                                                                height: h,
                                                                borderRadius: '4px',
                                                                bgcolor: d.count > 0 ? (isToday ? 'var(--accent)' : 'var(--accent-light)') : 'var(--surface-soft)',
                                                                transition: 'all 0.3s ease',
                                                            }}
                                                        />
                                                        <Typography sx={{ fontSize: '10.5px', color: isToday ? 'var(--ink)' : 'var(--text-muted)', fontWeight: isToday ? 700 : 500 }}>
                                                            {format(new Date(d.day), 'EEE')}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                        </Box>

                                        {/* Mini metrics */}
                                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                                            <Box sx={{ p: 1.2, borderRadius: '8px', bgcolor: 'var(--surface-soft)' }}>
                                                <Typography sx={{ fontSize: '17px', fontWeight: 700, color: 'var(--accent)' }}>
                                                    {stats.completedThisWeek || 0}
                                                </Typography>
                                                <Typography sx={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                                    Completed
                                                </Typography>
                                            </Box>
                                            <Box sx={{ p: 1.2, borderRadius: '8px', bgcolor: 'var(--surface-soft)' }}>
                                                <Typography sx={{ fontSize: '17px', fontWeight: 700, color: 'var(--success)' }}>
                                                    {stats.completionRate || 0}%
                                                </Typography>
                                                <Typography sx={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                                    Rate
                                                </Typography>
                                            </Box>
                                            <Box sx={{ p: 1.2, borderRadius: '8px', bgcolor: 'var(--surface-soft)' }}>
                                                <Typography sx={{ fontSize: '17px', fontWeight: 700, color: stats.highPriorityOpen > 0 ? 'var(--error)' : 'var(--ink)' }}>
                                                    {stats.highPriorityOpen || 0}
                                                </Typography>
                                                <Typography sx={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                                    High Priority
                                                </Typography>
                                            </Box>
                                            <Box sx={{ p: 1.2, borderRadius: '8px', bgcolor: 'var(--surface-soft)' }}>
                                                <Typography sx={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)' }}>
                                                    {stats.conversations || 0}
                                                </Typography>
                                                <Typography sx={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                                    AI Dialogs
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </motion.div>
                        )}
                    </Box>

                    {/* RIGHT COLUMN: Quick actions, Goals, AI Nudges */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, minWidth: 0 }}>
                        {/* Quick Action Shortcuts */}
                        <motion.div variants={itemVariants}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}>
                                {QUICK_ACTIONS.map((qa) => (
                                    <Box
                                        key={qa.label}
                                        component="button"
                                        onClick={() => nav(qa.to)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.2,
                                            p: 1.5,
                                            borderRadius: '10px',
                                            bgcolor: 'var(--surface)',
                                            border: '1px solid var(--border)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            boxShadow: 'var(--shadow-xs)',
                                            transition: 'all 0.15s ease',
                                            '&:hover': {
                                                borderColor: 'var(--accent-border)',
                                                bgcolor: 'var(--surface-soft)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: 'var(--shadow-sm)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 34,
                                                height: 34,
                                                borderRadius: '8px',
                                                bgcolor: 'var(--accent-soft)',
                                                color: 'var(--accent)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <qa.icon size={16} />
                                        </Box>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                                                {qa.label}
                                            </Typography>
                                            <Typography sx={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                {qa.desc}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </motion.div>

                        {/* Active Goals with Clean Bars */}
                        <motion.div variants={itemVariants}>
                            <Box sx={{ p: 2.5, borderRadius: '12px', bgcolor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography sx={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>
                                        Key Goals
                                    </Typography>
                                    <Box
                                        component="button"
                                        onClick={() => nav('/app/goals')}
                                        sx={{
                                            bgcolor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '12.5px',
                                            fontWeight: 600,
                                            color: 'var(--accent)',
                                            '&:hover': { textDecoration: 'underline' },
                                        }}
                                    >
                                        All Goals
                                    </Box>
                                </Box>

                                {goalOverview.length === 0 ? (
                                    <Box sx={{ py: 2, textAlign: 'center', bgcolor: 'var(--surface-soft)', borderRadius: '8px' }}>
                                        <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mb: 1.2 }}>
                                            No goals defined yet.
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<FiTarget size={13} />}
                                            onClick={() => nav('/app/goals?new=1')}
                                            sx={{ borderRadius: '6px', fontSize: '12px' }}
                                        >
                                            Set First Goal
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                                        {goalOverview.map((g) => (
                                            <Box
                                                key={g.id}
                                                component="button"
                                                onClick={() => nav('/app/goals')}
                                                sx={{
                                                    textAlign: 'left',
                                                    bgcolor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    p: 0,
                                                    width: '100%',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
                                                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                                                        {g.title}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                                                        {g.percent}%
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ height: 6, bgcolor: 'var(--surface-soft)', borderRadius: '99px', overflow: 'hidden', mb: 0.6 }}>
                                                    <Box
                                                        sx={{
                                                            height: '100%',
                                                            width: `${g.percent}%`,
                                                            bgcolor: g.percent === 100 ? 'var(--success)' : 'var(--accent)',
                                                            borderRadius: '99px',
                                                            transition: 'width 0.5s ease',
                                                        }}
                                                    />
                                                </Box>
                                                <Typography sx={{ fontSize: '11.5px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {g.next ? `Next: ${g.next.text}` : 'All steps achieved 🎉'}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </motion.div>

                        {/* Proactive AI Insight Nudge */}
                        {noticed && (
                            <motion.div variants={itemVariants}>
                                <Box
                                    sx={{
                                        p: 2.5,
                                        borderRadius: '12px',
                                        bgcolor: 'var(--accent-soft)',
                                        border: '1px solid var(--accent-border)',
                                        position: 'relative',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
                                        <HiSparkles size={14} style={{ color: 'var(--accent)' }} />
                                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                            Proactive Nudge
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', mb: 0.4 }}>
                                        {noticed.title}
                                    </Typography>
                                    <Typography sx={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.55, mb: 1.8 }}>
                                        {noticed.body}
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => nav(noticed.to)}
                                        sx={{
                                            bgcolor: 'var(--accent)',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            boxShadow: 'none',
                                            '&:hover': { bgcolor: 'var(--accent-hover)' },
                                        }}
                                    >
                                        {noticed.action}
                                    </Button>
                                </Box>
                            </motion.div>
                        )}
                    </Box>
                </Box>

                {/* Bottom Prompt Discovery Bar */}
                <motion.div variants={itemVariants}>
                    <Box sx={{ p: 2.2, borderRadius: '12px', bgcolor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1.2 }}>
                            Quick AI Queries
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {QUICK_PROMPTS.map((p) => (
                                <Box
                                    key={p}
                                    component="button"
                                    onClick={() => nav(`/app/chat?ask=${encodeURIComponent(p)}`)}
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.6,
                                        px: 1.4,
                                        py: 0.7,
                                        borderRadius: '8px',
                                        bgcolor: 'var(--surface-soft)',
                                        border: '1px solid var(--border)',
                                        fontSize: '12.5px',
                                        fontWeight: 500,
                                        color: 'var(--ink-soft)',
                                        cursor: 'pointer',
                                        transition: 'all 0.12s ease',
                                        '&:hover': {
                                            borderColor: 'var(--accent-border)',
                                            bgcolor: 'var(--accent-soft)',
                                            color: 'var(--accent)',
                                        },
                                    }}
                                >
                                    <span>{p}</span>
                                    <FiArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </motion.div>

                {/* Reschedule Modal */}
                {reschedTask && (
                    <TaskForm
                        open
                        task={reschedTask}
                        onClose={() => setReschedTask(null)}
                        onSave={(payload) => {
                            updateTask({ id: reschedTask.id, ...payload });
                            setReschedTask(null);
                        }}
                    />
                )}
            </Box>
        </motion.div>
    );
};

const MetricCard = ({ label, value, icon: Icon, color, softColor, subtext }) => (
    <Box
        sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 0.15s ease',
            '&:hover': { borderColor: 'var(--border-strong)', boxShadow: 'var(--shadow-sm)' },
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {label}
            </Typography>
            <Box
                sx={{
                    width: 26,
                    height: 26,
                    borderRadius: '6px',
                    bgcolor: softColor,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Icon size={14} />
            </Box>
        </Box>
        <Typography sx={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.1, mb: 0.3 }}>
            {value}
        </Typography>
        <Typography sx={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {subtext}
        </Typography>
    </Box>
);

export default Today;
