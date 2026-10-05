import { Box, Button, Typography } from '@mui/material';
import MiloCore from './MiloCore';

/**
 * MiloEmpty — a warm, on-brand empty state.
 * Milo Core sits beside the message instead of a generic database icon,
 * so "nothing here yet" still feels like a conversation with your AI.
 */
const MiloEmpty = ({ title, message, actionLabel, onAction, actionIcon, state = 'idle', size = 48 }) => {
    return (
        <Box sx={{ textAlign: 'center', py: { xs: 5, sm: 7 }, px: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.4 }}>
                <MiloCore state={state} size={size} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 17, mb: 0.6, letterSpacing: '-0.01em' }}>{title}</Typography>
            <Typography
                sx={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    maxWidth: 400,
                    mx: 'auto',
                    lineHeight: 1.65,
                    mb: 2.6,
                }}
            >
                {message}
            </Typography>
            {actionLabel && onAction && (
                <Button
                    variant="contained"
                    onClick={onAction}
                    startIcon={actionIcon}
                    sx={{ boxShadow: 'var(--shadow-glow)', '&:hover': { transform: 'translateY(-1px)', boxShadow: 'var(--shadow-lift)' } }}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
};

export default MiloEmpty;
