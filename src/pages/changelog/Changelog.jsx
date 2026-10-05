import { Box, Button, Chip, Container, Divider, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiGitCommit, FiTag, FiCalendar } from 'react-icons/fi';
import { MiloLogoMark, MiloWordmark } from '../../components/MiloLogo';

const RELEASES = [
    {
        version: 'v2.4.0',
        date: 'October 2026',
        tag: 'Latest Release',
        title: 'Modern 2026 UI Redesign & Settings Production Hub',
        summary: 'A complete ground-up visual redesign inspired by modern productivity leaders (Linear, Notion, Raycast), plus an organized multi-tab settings architecture.',
        highlights: [
            'Revamped Design System: Minimal slate base with electric violet accent and crisp typography.',
            'Production Settings Hub: Organized tabs for Profile, Milo AI, Integrations, Notifications, Billing & Security.',
            'Streamlined Sidebar: 6 focused product destinations (Home, Chat, Tasks, Goals, Calendar, Insights).',
            'Full Auth Lifecycle: Dedicated Forgot Password, Reset Password, and Email Verification workflows.',
            'Public & Legal Suite: Production-ready Privacy Policy, Terms of Service, and Help Knowledge Base.',
        ],
    },
    {
        version: 'v2.3.0',
        date: 'October 2026',
        tag: 'AI Upgrade',
        title: 'Google Gemini 2.0 Flash AI Provider Integration',
        summary: 'Connected Milo’s conversational core to Gemini Flash for ultra-fast, contextual task reasoning.',
        highlights: [
            'Direct Google Generative Language API integration with automatic fallback resilience.',
            'Sub-second query response latency and streaming-ready conversational turns.',
            'Refined system instructions tailored to proactive daily agenda synthesis.',
        ],
    },
    {
        version: 'v2.2.0',
        date: 'September 2026',
        tag: 'Productivity',
        title: 'Smart Calendar & Interactive Daily Timelines',
        summary: 'Introduced visual schedule management linked directly to your active task list.',
        highlights: [
            'Integrated calendar view with daily, weekly, and monthly focus breakdown.',
            'Automatic task due date synchronization onto timeline blocks.',
            'Context-aware time-block suggestions to prevent burnout.',
        ],
    },
    {
        version: 'v2.1.0',
        date: 'August 2026',
        tag: 'Core System',
        title: 'Memory Vault & Goal Milestone Decomposition',
        summary: 'Added persistent personal memory bank and multi-step goal execution.',
        highlights: [
            'Milo Memory Vault: Transparently stores user constraints, work hours, and recurring preferences.',
            'Autonomous Goal Decomposition: Turns high-level aspirations into tangible action steps.',
            'Privacy Boundaries: Complete user control to audit, edit, or purge any stored memory.',
        ],
    },
];

const Changelog = () => {
    const nav = useNavigate();

    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'var(--bg)', color: 'var(--ink)' }}>
            {/* Top Navigation Bar */}
            <Box
                sx={{
                    borderBottom: '1px solid var(--border)',
                    bgcolor: 'var(--surface)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    px: { xs: 2, sm: 4 },
                    py: 1.8,
                }}
            >
                <Box sx={{ maxWidth: 1000, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MiloLogoMark size={28} />
                        <MiloWordmark size={18} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Link to="/help" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                            Help Center
                        </Link>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<FiArrowLeft size={14} />}
                            onClick={() => nav(-1)}
                            sx={{ borderRadius: '7px', textTransform: 'none', fontSize: '13px', color: 'var(--ink)', borderColor: 'var(--border-strong)' }}
                        >
                            Back
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Document Body */}
            <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6 } }}>
                <Box sx={{ mb: 5 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '20px', bgcolor: 'var(--accent-soft)', color: 'var(--accent)', fontSize: '12px', fontWeight: 700, mb: 1.5 }}>
                        <FiGitCommit size={14} /> PRODUCT UPDATES & RELEASE NOTES
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: '28px', sm: '36px' }, letterSpacing: '-0.03em', mb: 1, color: 'var(--ink)' }}>
                        What’s New in Milo
                    </Typography>
                    <Typography sx={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
                        Track weekly improvements, new integrations, and intelligence upgrades across the Milo ecosystem.
                    </Typography>
                </Box>

                {/* Timeline Releases */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                    {RELEASES.map((rel) => (
                        <Box
                            key={rel.version}
                            sx={{
                                p: { xs: 2.5, sm: 3.5 },
                                borderRadius: '12px',
                                bgcolor: 'var(--surface)',
                                border: '1px solid var(--border)',
                                boxShadow: 'var(--shadow-xs)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1.2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>
                                        {rel.version}
                                    </Typography>
                                    <Chip
                                        label={rel.tag}
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            bgcolor: rel.tag === 'Latest Release' ? 'var(--accent-soft)' : 'var(--surface-soft)',
                                            color: rel.tag === 'Latest Release' ? 'var(--accent)' : 'var(--text-secondary)',
                                            border: '1px solid',
                                            borderColor: rel.tag === 'Latest Release' ? 'var(--accent-border)' : 'var(--border)',
                                        }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: 'var(--text-muted)', fontSize: '12.5px' }}>
                                    <FiCalendar size={13} />
                                    <span>{rel.date}</span>
                                </Box>
                            </Box>

                            <Typography sx={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', mb: 0.8 }}>
                                {rel.title}
                            </Typography>
                            <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', mb: 2, lineHeight: 1.6 }}>
                                {rel.summary}
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, pl: 0.5 }}>
                                {rel.highlights.map((item, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'var(--accent)', mt: 0.9, flexShrink: 0 }} />
                                        <Typography sx={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                                            {item}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Divider sx={{ my: 4, borderColor: 'var(--border)' }} />

                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography sx={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                        © 2026 Milo AI Systems Inc. • Continually updated for peak productivity.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Changelog;
