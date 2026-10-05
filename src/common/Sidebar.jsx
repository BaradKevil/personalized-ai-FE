import { NavLink, useLocation } from 'react-router-dom';
import { Avatar, Box, Typography } from '@mui/material';
import {
    FiHome,
    FiMessageSquare,
    FiCheckSquare,
    FiCalendar,
    FiSettings,
} from 'react-icons/fi';
import { MiloLogoMark, MiloWordmark } from '../components/MiloLogo';
import { useUserProfile, DEMO_MODE } from '../Api/Api';

const NAV_ITEMS = [
    { key: 'home',     icon: FiHome,          label: 'Home',     path: '/app',         match: ['/app', '/app/'] },
    { key: 'chat',     icon: FiMessageSquare, label: 'Chat',     path: '/app/chat',    match: ['/app/chat'] },
    { key: 'tasks',    icon: FiCheckSquare,   label: 'Tasks',    path: '/app/tasks',   match: ['/app/tasks'] },
    { key: 'calendar', icon: FiCalendar,      label: 'Calendar', path: '/app/calendar', match: ['/app/calendar'] },
    { key: 'settings', icon: FiSettings,      label: 'Settings', path: '/app/settings', match: ['/app/settings'] },
];

const NavItem = ({ item, active, onNavigate }) => {
    const Icon = item.icon;
    return (
        <NavLink
            to={item.path}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            style={{ textDecoration: 'none', display: 'block' }}
        >
            <Box
                className="focus-ring"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.3,
                    px: 1.4,
                    py: 1.05,
                    borderRadius: '9px',
                    fontSize: '13.5px',
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    bgcolor: active ? 'var(--accent-soft)' : 'transparent',
                    transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                    '&:hover': {
                        bgcolor: active ? 'var(--accent-soft)' : 'var(--surface-soft)',
                        color: active ? 'var(--accent)' : 'var(--ink)',
                    },
                    position: 'relative',
                    userSelect: 'none',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 22,
                        height: 22,
                        flexShrink: 0,
                        color: active ? 'var(--accent)' : 'var(--text-muted)',
                        transition: 'color 0.15s ease',
                    }}
                >
                    <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                </Box>
                <Box component="span" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1 }}>
                    {item.label}
                </Box>
            </Box>
        </NavLink>
    );
};

const Sidebar = ({ onNavigate }) => {
    const location = useLocation();
    const { data: user } = useUserProfile();

    const isActive = (item) =>
        item.match.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`));

    const initials = (user?.name || 'A')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 2, px: 1.5 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9, px: 1, mb: 2.2 }}>
                <MiloLogoMark size={28} />
                <MiloWordmark size={17} />
            </Box>

            {/* Navigation */}
            <Box
                component="nav"
                aria-label="Main navigation"
                sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}
            >
                <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                    {NAV_ITEMS.map((item) => (
                        <Box component="li" key={item.path}>
                            <NavItem item={item} active={isActive(item)} onNavigate={onNavigate} />
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* User footer */}
            <Box sx={{ pt: 1.5, borderTop: '1px solid var(--border)' }}>
                <NavLink to="/app/settings" onClick={onNavigate} style={{ textDecoration: 'none' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.2,
                            px: 1.25,
                            py: 1,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.12s ease',
                            '&:hover': { bgcolor: 'var(--surface-soft)' },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: user?.avatarColor || 'var(--accent)',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                flexShrink: 0,
                            }}
                        >
                            {initials}
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                                {user?.name || 'You'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'var(--success)', flexShrink: 0 }} />
                                <Typography sx={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1 }}>
                                    Active
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </NavLink>

                {DEMO_MODE && (
                    <Box sx={{ mt: 1, mx: 1, px: 1, py: 0.6, borderRadius: '6px', bgcolor: 'var(--surface-soft)', border: '1px solid var(--border)' }}>
                        <Typography sx={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, textAlign: 'center' }}>
                            Demo mode
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Sidebar;
