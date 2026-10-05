import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MiloLogoMark, MiloWordmark } from '../components/MiloLogo';

const NotFound = () => {
    const nav = useNavigate();
    const hasSession = Boolean(localStorage.getItem('accessToken'));

    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                textAlign: 'center',
                bgcolor: 'var(--bg)',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <MiloLogoMark size={32} />
                <MiloWordmark size={20} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 60, lineHeight: 1, mt: 5, color: 'var(--accent)' }}>404</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: 21, mt: 1 }}>This page wandered off.</Typography>
            <Typography sx={{ fontSize: 14.5, color: 'var(--text-secondary)', mt: 1, mb: 3, maxWidth: 380, lineHeight: 1.6 }}>
                The page you're looking for doesn't exist — but Milo is still right here.
            </Typography>
            <Button variant="contained" onClick={() => nav(hasSession ? '/app' : '/login')} sx={{ px: 3 }}>
                {hasSession ? 'Back to Today' : 'Back to sign in'}
            </Button>
        </Box>
    );
};

export default NotFound;
