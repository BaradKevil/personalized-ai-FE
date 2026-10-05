import { NavLink, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { FiHome, FiMessageSquare, FiCheckSquare, FiTarget, FiRepeat } from 'react-icons/fi';

const BOTTOM_ITEMS = [
    { label: 'Home',   icon: FiHome,          path: '/app',         match: ['/app', '/app/'] },
    { label: 'Chat',   icon: FiMessageSquare, path: '/app/chat',    match: ['/app/chat'] },
    { label: 'Tasks',  icon: FiCheckSquare,   path: '/app/tasks',   match: ['/app/tasks'] },
    { label: 'Goals',  icon: FiTarget,        path: '/app/goals',   match: ['/app/goals'] },
    { label: 'Habits', icon: FiRepeat,        path: '/app/habits',  match: ['/app/habits'] },
];

const BottomNav = () => {
    const location = useLocation();

    const isActive = (item) =>
        item.match.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`));

    return (
        <Box
            component="nav"
            aria-label="Bottom navigation"
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 58,
                bgcolor: 'var(--surface)',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                zIndex: 30,
                px: 1,
                pb: 'env(safe-area-inset-bottom)',
                backdropFilter: 'blur(10px)',
            }}
        >
            {BOTTOM_ITEMS.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={{ flex: 1, textDecoration: 'none', display: 'flex' }}
                        aria-current={active ? 'page' : undefined}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.3,
                                py: 0.6,
                                color: active ? 'var(--accent)' : 'var(--text-muted)',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <Box
                                sx={{
                                    px: 1.6,
                                    py: 0.35,
                                    borderRadius: '12px',
                                    bgcolor: active ? 'var(--accent-soft)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background 0.15s ease',
                                }}
                            >
                                <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
                            </Box>
                            <Typography sx={{ fontSize: '10.5px', fontWeight: active ? 600 : 500, lineHeight: 1 }}>
                                {item.label}
                            </Typography>
                        </Box>
                    </NavLink>
                );
            })}
        </Box>
    );
};

export default BottomNav;
