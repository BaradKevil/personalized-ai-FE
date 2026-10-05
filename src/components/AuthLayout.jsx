import { Box, Typography } from '@mui/material';
import { FiCheck } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { MiloLogoMark, MiloWordmark } from './MiloLogo';

const brandPoints = [
    'Autonomous AI context memory that evolves with you',
    'Intelligent task prioritization and active schedule optimization',
    'Effortless natural-language companion across your devices',
];

const AuthLayout = ({ children, tagline }) => {
    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(460px, 45%) 1fr' },
                bgcolor: 'var(--bg)',
            }}
        >
            {/* Brand panel */}
            <Box
                sx={{
                    display: { xs: 'none', lg: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: { lg: 6, xl: 8 },
                    bgcolor: 'var(--surface)',
                    borderRight: '1px solid var(--border)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background ambient glow */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 380,
                        height: 380,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, position: 'relative', zIndex: 2 }}>
                    <MiloLogoMark size={32} />
                    <MiloWordmark size={22} />
                </Box>

                <Box sx={{ position: 'relative', zIndex: 2, my: 'auto' }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.6,
                            px: 1.2,
                            py: 0.4,
                            borderRadius: '99px',
                            bgcolor: 'var(--accent-soft)',
                            border: '1px solid var(--accent-border)',
                            color: 'var(--accent)',
                            fontSize: '12px',
                            fontWeight: 600,
                            mb: 2,
                        }}
                    >
                        <HiSparkles size={12} />
                        Next-Generation AI Workspace
                    </Box>

                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: { lg: '30px', xl: '34px' },
                            letterSpacing: '-0.03em',
                            lineHeight: 1.2,
                            color: 'var(--ink)',
                            mb: 2.5,
                            maxWidth: 420,
                        }}
                    >
                        {tagline}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
                        {brandPoints.map((point) => (
                            <Box key={point} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '6px',
                                        bgcolor: 'var(--accent-soft)',
                                        color: 'var(--accent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        mt: 0.2,
                                    }}
                                >
                                    <FiCheck size={12} strokeWidth={2.5} />
                                </Box>
                                <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    {point}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Typography sx={{ fontSize: '12px', color: 'var(--text-muted)', position: 'relative', zIndex: 2 }}>
                    Designed for focused productivity • 2026 Edition
                </Typography>
            </Box>

            {/* Form panel */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: { xs: 2.5, sm: 4 },
                    py: { xs: 4, sm: 6 },
                    minWidth: 0,
                }}
            >
                {/* Mobile brand header */}
                <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1.2, mb: 4 }}>
                    <MiloLogoMark size={28} />
                    <MiloWordmark size={20} />
                </Box>

                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 420,
                        minWidth: 0,
                        bgcolor: { xs: 'transparent', sm: 'var(--surface)' },
                        p: { xs: 0, sm: 4 },
                        borderRadius: '16px',
                        border: { xs: 'none', sm: '1px solid var(--border)' },
                        boxShadow: { xs: 'none', sm: 'var(--shadow-sm)' },
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default AuthLayout;
