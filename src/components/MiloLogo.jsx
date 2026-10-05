import { Box, Typography } from '@mui/material';

// The Milo mark: an interlocking "M" built from capsule bars and a center
// peak, topped by a small spark — smooth geometry, rounded terminals,
// works from 16px to 64px and on any background.
export const MiloLogoMark = ({ size = 32, color = 'var(--accent)', sx = {} }) => {
    return (
        <Box
            aria-hidden="true"
            sx={{ width: size, height: size, display: 'inline-flex', flexShrink: 0, color, ...sx }}
        >
            <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none" aria-hidden="true">
                {/* left + right capsules */}
                <path d="M11 8v48" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                <path d="M53 8v48" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                {/* center peak */}
                <path d="M18 8 32 40 46 8" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                {/* spark */}
                <path d="M57 2l1.1 2.9L61 6l-2.9 1.1L57 10l-1.1-2.9L53 6l2.9-1.1z" fill="currentColor" />
            </svg>
        </Box>
    );
};

export const MiloWordmark = ({ size = 22, color = 'var(--ink)', weight = 800 }) => {
    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.4, lineHeight: 1 }}>
            <Typography
                component="span"
                sx={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: weight,
                    fontSize: size,
                    letterSpacing: '-0.04em',
                    color,
                    lineHeight: 1,
                }}
            >
                milo
            </Typography>
            <Box
                aria-hidden="true"
                sx={{
                    width: size * 0.22,
                    height: size * 0.22,
                    borderRadius: '50%',
                    bgcolor: 'var(--accent)',
                    display: 'inline-block',
                    transform: 'translateY(-45%)',
                }}
            />
        </Box>
    );
};

const MiloLogo = ({
    size = 32,
    showText = true,
    color = 'var(--ink)',
    markColor,
    logoTextSize,
    sx = {},
}) => {
    const wordSize = logoTextSize || Math.round(size * 0.62);
    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.3, ...sx }}>
            <MiloLogoMark size={size} color={markColor || 'var(--accent)'} />
            {showText && <MiloWordmark size={wordSize} color={color} />}
        </Box>
    );
};

export default MiloLogo;
