import { Box, Skeleton, Typography } from '@mui/material';
import { FiBarChart2, FiCheckCircle, FiFlag, FiRepeat, FiZap } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import { useProgress } from '../../Api/Api';
import { useStatsOverview } from '../../Api/Api';

/** A compact SVG progress ring with a subtle 3D glow. */
const ProgressRing = ({ value, size = 84, color = 'var(--accent)' }) => {
    const stroke = 8;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - Math.min(Math.max(value, 0), 100) / 100);

    return (
        <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--surface-soft)" strokeWidth={stroke} />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="butt"
                    style={{
                        transition: 'stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                        filter: `drop-shadow(0 0 5px ${color})`,
                    }}
                />
            </svg>
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: size * 0.22,
                }}
            >
                {Math.round(value)}%
            </Box>
        </Box>
    );
};

const StatTile = ({ icon, label, value, color = 'var(--accent)' }) => (
    <Box
        sx={{
            flex: '1 1 140px',
            bgcolor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            p: 1.8,
            boxShadow: 'var(--shadow-xs)',
            transition: 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease',
            '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: 'var(--shadow-sm)',
                borderColor: 'var(--border-strong)',
            },
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, color, fontSize: 13, fontWeight: 600 }}>
            {icon}
            <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
            </Typography>
        </Box>
        <Typography sx={{ fontSize: 26, fontWeight: 800, mt: 0.8, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{value}</Typography>
    </Box>
);

const Progress = () => {
    const { data: progress, isLoading } = useProgress();
    const { data: stats } = useStatsOverview();

    if (isLoading) {
        return (
            <Box sx={{ maxWidth: 860, mx: 'auto' }}>
                <Skeleton variant="rounded" height={120} sx={{ borderRadius: '12px' }} />
                <Skeleton variant="rounded" height={220} sx={{ borderRadius: '12px', mt: 2 }} />
            </Box>
        );
    }

    const goals = progress?.goals || { total: 0, completed: 0, inProgress: 0, avgProgress: 0, list: [] };
    const tasks = progress?.tasks || {};
    const habits = progress?.habits || { total: 0, bestStreak: 0, completedToday: 0, thisWeek: 0 };

    return (
        <Box sx={{ maxWidth: 860, mx: 'auto' }}>
            <PageHeader
                title="Progress"
                subtitle="Goals, weekly momentum, and habits — your progress at a glance."
            />

            {/* Stat tiles */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, mb: 2.4 }}>
                <StatTile icon={<FiFlag size={15} />} label="Goals" value={goals.total} />
                <StatTile icon={<FiCheckCircle size={15} />} label="Goal progress" value={`${goals.avgProgress}%`} color="var(--success)" />
                <StatTile icon={<FiZap size={15} />} label="Task streak" value={`${tasks.streak ?? stats?.streak ?? 0}d`} />
                <StatTile icon={<FiRepeat size={15} />} label="Habit streak" value={`${habits.bestStreak}d`} color="var(--info)" />
            </Box>

            {goals.list.length === 0 ? (
                <EmptyState
                    icon="idle"
                    title="No goals yet"
                    message="Create your first goal and watch it fill up here."
                />
            ) : (
                <>
                    <Typography sx={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)', mb: 1.2 }}>Goals</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 3 }}>
                        {goals.list.map((goal) => (
                            <Box
                                key={goal.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.8,
                                    bgcolor: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '10px',
                                    p: { xs: 1.6, sm: 2 },
                                    boxShadow: 'var(--shadow-xs)',
                                    transition: 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease',
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: 'var(--shadow-sm)',
                                        borderColor: 'var(--border-strong)',
                                    },
                                }}
                            >
                                <ProgressRing value={goal.progress} color={goal.status === 'completed' ? 'var(--success)' : 'var(--accent)'} />
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>
                                        {goal.title}
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'var(--text-muted)', mt: 0.3 }}>
                                        {goal.status === 'completed' ? 'Completed 🎉' : goal.status === 'active' ? 'In progress' : 'Archived'}
                                    </Typography>
                                    <Box sx={{ mt: 1.2, height: 6, bgcolor: 'var(--surface-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                                        <Box
                                            sx={{
                                                height: '100%',
                                                width: `${goal.progress}%`,
                                                borderRadius: '99px',
                                                bgcolor: goal.status === 'completed' ? 'var(--success)' : 'var(--accent)',
                                                transition: 'width 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            {/* Habit summary */}
            {habits.total > 0 && (
                <>
                    <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 1.2 }}>Habits this week</Typography>
                    <Box
                        className="milo-depth"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1.6,
                            bgcolor: 'var(--surface)',
                            border: '1px solid var(--border)',
                            p: { xs: 1.6, sm: 2 },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Box sx={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--info-soft)', color: 'var(--info)' }}>
                                <FiRepeat size={20} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>{habits.total} active habits</Typography>
                                <Typography sx={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                                    {habits.completedToday} logged today · {habits.thisWeek} this week · best streak {habits.bestStreak} days
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'var(--info)' }}>
                            <FiBarChart2 size={16} />
                            <Typography sx={{ fontSize: 13, fontWeight: 800 }}>Consistency is compounding</Typography>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Progress;
