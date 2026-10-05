import { Box } from '@mui/material';

const shapes = {
    orb: (
        <>
            <circle cx="20" cy="20" r="12" fill="none" strokeWidth="3" />
            <circle cx="20" cy="20" r="3.2" fill="currentColor" />
        </>
    ),
    leaf: (
        <>
            <path d="M20 36C20 28 26 22 34 20c0 8-6 14-14 16z" fill="none" strokeWidth="3" />
            <path d="M20 36c0-8-6-14-14-16 0 8 6 14 14 16z" fill="none" strokeWidth="3" />
        </>
    ),
    wave: (
        <>
            <path d="M12 22c4-6 12-6 16 0s12 6 16 0" fill="none" strokeWidth="3" strokeLinecap="round" />
            <path d="M12 30c4-6 12-6 16 0s12 6 16 0" fill="none" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        </>
    ),
    spark: (
        <>
            <path d="M20 8l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="currentColor" opacity="0.9" />
        </>
    ),
};

const AgentAvatar = ({ avatar = 'orb', color = 'var(--accent)', size = 40, sx = {}, ...props }) => {
    return (
        <Box
            aria-hidden="true"
            sx={{
                width: size,
                height: size,
                borderRadius: '8px',
                bgcolor: 'var(--accent-soft)',
                color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                ...sx,
            }}
            {...props}
        >
            <svg viewBox="0 0 40 40" width={size * 0.62} height={size * 0.62} aria-hidden="true">
                {shapes[avatar] || shapes.orb}
            </svg>
        </Box>
    );
};

export default AgentAvatar;
