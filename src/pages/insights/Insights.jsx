import { Box, Skeleton, Typography } from '@mui/material';
import { FiAward, FiAlertTriangle, FiEye, FiZap } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import MiloCore from '../../components/milo/MiloCore';
import { useInsights } from '../../Api/Api';

const KIND_STYLES = {
    win: { icon: <FiAward size={16} />, color: 'var(--success)', soft: 'var(--success-soft)' },
    notice: { icon: <FiEye size={16} />, color: 'var(--info)', soft: 'var(--info-soft)' },
    warning: { icon: <FiAlertTriangle size={16} />, color: 'var(--warning)', soft: 'var(--warning-soft)' },
    suggestion: { icon: <FiZap size={16} />, color: 'var(--accent-deep)', soft: 'var(--accent-soft)' },
};

const Insights = () => {
    const { data: insights = [], isLoading } = useInsights();

    return (
        <Box sx={{ maxWidth: 760, mx: 'auto' }}>
            <PageHeader
                title="Insights"
                subtitle="What Milo noticed in your data — every one backed by something real."
            />

            {/* Milo intro strip */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.6,
                    bgcolor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    p: { xs: 2, sm: 2.4 },
                    mb: 2.4,
                    boxShadow: 'var(--shadow-xs)',
                }}
            >
                <Box sx={{ flexShrink: 0 }}>
                    <MiloCore size={44} state="idle" />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>Milo noticed</Typography>
                    <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mt: 0.3, lineHeight: 1.55 }}>
                        Patterns from your tasks, goals, habits, and memories — with a suggested next step for each.
                    </Typography>
                </Box>
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    <Skeleton variant="rounded" height={100} sx={{ borderRadius: '10px' }} />
                    <Skeleton variant="rounded" height={100} sx={{ borderRadius: '10px' }} />
                </Box>
            ) : insights.length === 0 ? (
                <EmptyState
                    icon="idle"
                    title="No insights yet"
                    message="Start using tasks, goals, and habits — Milo will surface patterns once there's enough to learn from."
                />
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {insights.map((insight) => {
                        const style = KIND_STYLES[insight.kind] || KIND_STYLES.notice;
                        return (
                            <Box
                                key={insight.id}
                                sx={{
                                    display: 'flex',
                                    gap: 1.4,
                                    bgcolor: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '10px',
                                    p: { xs: 1.6, sm: 1.8 },
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
                                        width: 34,
                                        height: 34,
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: style.soft,
                                        color: style.color,
                                        mt: 0.2,
                                    }}
                                >
                                    {style.icon}
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: 800, fontSize: 14.5 }}>{insight.title}</Typography>
                                    <Typography sx={{ fontSize: 13, color: 'var(--text-secondary)', mt: 0.4, lineHeight: 1.55 }}>
                                        {insight.message}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: 12.5,
                                            mt: 1,
                                            fontWeight: 700,
                                            color: style.color,
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 0.6,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        <Box component="span" sx={{ flexShrink: 0 }}>→</Box>
                                        {insight.suggestion}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
};

export default Insights;
