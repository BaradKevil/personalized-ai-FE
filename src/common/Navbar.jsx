import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Popover,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    FiArrowRight,
    FiBell,
    FiBookmark,
    FiCheck,
    FiCommand,
    FiHelpCircle,
    FiLogOut,
    FiMenu,
    FiMoon,
    FiSearch,
    FiSettings,
    FiSun,
    FiTarget,
    FiUser,
    FiZap,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeMode } from '../themeMode';
import { useMarkNotificationsRead, useNotifications, useUserProfile } from '../Api/Api';
import { DEMO_MODE } from '../Api/Api';
import NotificationItem from '../components/NotificationItem';
import CustomModal from './custom/CustomModal';
import { MiloLogoMark, MiloWordmark } from '../components/MiloLogo';
import { toast } from 'react-toastify';

const COMMAND_SUGGESTIONS = [
    { icon: FiSun, label: 'Plan my day', ask: 'Plan my day' },
    { icon: FiZap, label: 'What should I focus on?', ask: 'What should I focus on?' },
    { icon: FiCheck, label: 'Show overdue tasks', to: '/app/tasks' },
    { icon: FiTarget, label: 'Create a goal', to: '/app/goals?new=1' },
    { icon: FiBookmark, label: 'Remember this…', ask: 'Remember that' },
    { icon: FiBell, label: 'Review my week', ask: 'Review my week' },
];

const isToday = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    return d.toDateString() === now.toDateString();
};

const Navbar = ({ onMenuClick, onLogoutClick }) => {
    const nav = useNavigate();
    const { data: user } = useUserProfile();
    const { data: notifications = [] } = useNotifications();
    const { mutate: markRead } = useMarkNotificationsRead();
    const { resolved: resolvedTheme, setMode: setThemeMode } = useThemeMode();

    const [bellAnchor, setBellAnchor] = useState(null);
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [helpOpen, setHelpOpen] = useState(false);
    const [ask, setAsk] = useState('');
    const [cmdOpen, setCmdOpen] = useState(false);
    const cmdBoxRef = useRef(null);
    const askRef = useRef(null);

    const unread = notifications.filter((n) => !n.read).length;
    const initials = (user?.name || 'A')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const submitAsk = () => {
        const q = ask.trim();
        if (!q) return;
        setAsk('');
        setCmdOpen(false);
        nav(`/app/chat?ask=${encodeURIComponent(q)}`);
    };

    const runSuggestion = (s) => {
        setAsk('');
        setCmdOpen(false);
        askRef.current?.blur();
        if (s.to) {
            nav(s.to);
        } else if (s.ask) {
            nav(`/app/chat?ask=${encodeURIComponent(s.ask)}`);
        }
    };

    // Close the command palette on outside click
    useEffect(() => {
        const onClick = (e) => {
            if (cmdBoxRef.current && !cmdBoxRef.current.contains(e.target)) setCmdOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    // '/' or Cmd+K to focus search shortcut
    useEffect(() => {
        const onKey = (e) => {
            const tag = e.target?.tagName;
            if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !['INPUT', 'TEXTAREA'].includes(tag)) {
                e.preventDefault();
                askRef.current?.focus();
                setCmdOpen(true);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const today = notifications.filter((n) => isToday(n.createdAt));
    const earlier = notifications.filter((n) => !isToday(n.createdAt));

    return (
        <Box
            component="header"
            sx={{
                height: 'var(--nav-height)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, md: 2 },
                px: { xs: 1.5, sm: 2.5, md: 3 },
                borderBottom: '1px solid var(--border)',
                bgcolor: 'var(--surface)',
                position: 'relative',
                zIndex: 20,
                backdropFilter: 'blur(8px)',
            }}
        >
            {/* Left: Mobile menu toggle + Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                <IconButton
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                    size="small"
                    sx={{ display: { md: 'none' }, color: 'var(--ink-soft)' }}
                >
                    <FiMenu size={19} />
                </IconButton>
                <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.8 }}>
                    <MiloLogoMark size={24} />
                    <MiloWordmark size={16} />
                </Box>
                {DEMO_MODE && (
                    <Box
                        sx={{
                            px: 1,
                            py: 0.3,
                            borderRadius: '99px',
                            bgcolor: 'var(--accent-soft)',
                            border: '1px solid var(--accent-border)',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--accent)',
                            display: { xs: 'none', sm: 'block' },
                            lineHeight: 1.2,
                        }}
                    >
                        Demo
                    </Box>
                )}
            </Box>

            {/* Center: Command Search Bar (Linear / Raycast aesthetic) */}
            <Box ref={cmdBoxRef} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', minWidth: 0, position: 'relative' }}>
                <TextField
                    inputRef={askRef}
                    value={ask}
                    onChange={(e) => setAsk(e.target.value)}
                    onFocus={() => setCmdOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') submitAsk();
                        if (e.key === 'Escape') {
                            setCmdOpen(false);
                            askRef.current?.blur();
                        }
                    }}
                    placeholder="Search or ask Milo anything…"
                    size="small"
                    slotProps={{
                        input: {
                            startAdornment: <FiSearch size={14} style={{ color: 'var(--text-muted)', marginRight: 8, flexShrink: 0 }} />,
                            endAdornment: (
                                <Box
                                    component="span"
                                    sx={{
                                        display: { xs: 'none', sm: 'inline-flex' },
                                        alignItems: 'center',
                                        gap: 0.25,
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '4px',
                                        px: 0.6,
                                        py: 0.1,
                                        bgcolor: 'var(--surface)',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    <FiCommand size={10} /> K
                                </Box>
                            ),
                        },
                    }}
                    aria-label="Ask Milo anything"
                    aria-expanded={cmdOpen}
                    sx={{
                        width: { xs: '100%', sm: 'min(460px, 100%)' },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            bgcolor: 'var(--surface-soft)',
                            fontSize: '13.5px',
                            transition: 'all 0.15s ease',
                            '& fieldset': { borderColor: 'var(--border)' },
                            '&:hover fieldset': { borderColor: 'var(--border-strong)' },
                            '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: '1.5px' },
                            '&.Mui-focused': {
                                bgcolor: 'var(--surface)',
                                boxShadow: 'var(--shadow-glow)',
                            },
                        },
                    }}
                />

                {/* Command palette popup */}
                <AnimatePresence>
                    {cmdOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.14, ease: 'easeOut' }}
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                left: 0,
                                right: 0,
                                zIndex: 35,
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    boxShadow: 'var(--shadow-lg)',
                                    overflow: 'hidden',
                                    textAlign: 'left',
                                    p: 0.8,
                                }}
                            >
                                <Typography
                                    sx={{
                                        px: 1.2,
                                        pt: 0.8,
                                        pb: 0.6,
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                    }}
                                >
                                    Suggested actions
                                </Typography>
                                {COMMAND_SUGGESTIONS.map((s) => (
                                    <Box
                                        key={s.label}
                                        component="button"
                                        type="button"
                                        onClick={() => runSuggestion(s)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.2,
                                            width: '100%',
                                            px: 1.2,
                                            py: 0.85,
                                            borderRadius: '6px',
                                            bgcolor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: 'var(--ink-soft)',
                                            textAlign: 'left',
                                            transition: 'all 0.12s ease',
                                            '&:hover': {
                                                bgcolor: 'var(--surface-soft)',
                                                color: 'var(--accent)',
                                            },
                                        }}
                                    >
                                        <Box sx={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>
                                            <s.icon size={14} />
                                        </Box>
                                        <Box sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {s.label}
                                        </Box>
                                        <FiArrowRight size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                    </Box>
                                ))}
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* Right: theme toggle, notifications, profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, flexShrink: 0 }}>
                {/* Theme toggle */}
                <Tooltip title={resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}>
                    <IconButton
                        aria-label="Toggle color theme"
                        size="small"
                        onClick={() => setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark')}
                        sx={{
                            color: 'var(--text-secondary)',
                            p: 0.9,
                            '&:hover': { color: 'var(--ink)', bgcolor: 'var(--surface-soft)' },
                        }}
                    >
                        {resolvedTheme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
                    </IconButton>
                </Tooltip>

                {/* Notifications */}
                <Tooltip title="Notifications">
                    <IconButton
                        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
                        size="small"
                        onClick={(e) => setBellAnchor(e.currentTarget)}
                        sx={{
                            color: 'var(--text-secondary)',
                            p: 0.9,
                            '&:hover': { color: 'var(--ink)', bgcolor: 'var(--surface-soft)' },
                        }}
                    >
                        <Badge
                            badgeContent={unread}
                            color="primary"
                            sx={{
                                '& .MuiBadge-badge': {
                                    fontSize: 10,
                                    height: 16,
                                    minWidth: 16,
                                    bgcolor: 'var(--accent)',
                                },
                            }}
                        >
                            <FiBell size={17} />
                        </Badge>
                    </IconButton>
                </Tooltip>

                {/* Profile Avatar trigger */}
                <Box
                    component="button"
                    onClick={(e) => setProfileAnchor(e.currentTarget)}
                    aria-label="Profile menu"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.9,
                        bgcolor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        p: 0.4,
                        borderRadius: '8px',
                        transition: 'background 0.12s ease',
                        '&:hover': { bgcolor: 'var(--surface-soft)' },
                    }}
                >
                    <Avatar
                        sx={{
                            width: 30,
                            height: 30,
                            bgcolor: user?.avatarColor || 'var(--accent)',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                        }}
                    >
                        {initials}
                    </Avatar>
                    <Box sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'left', minWidth: 0 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.name || 'You'}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Notifications Popover */}
            <Popover
                open={Boolean(bellAnchor)}
                anchorEl={bellAnchor}
                onClose={() => setBellAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { width: 360, maxWidth: '94vw', borderRadius: '12px', mt: 1, overflow: 'hidden', boxShadow: 'var(--shadow-xl)' } } }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.4, borderBottom: '1px solid var(--border)' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Notifications</Typography>
                    {unread > 0 && (
                        <Box
                            component="button"
                            onClick={() => {
                                markRead();
                                toast.success('All marked as read');
                            }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.4,
                                bgcolor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--accent)',
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            <FiCheck size={13} /> Mark all read
                        </Box>
                    )}
                </Box>
                <Box sx={{ maxHeight: 380, overflowY: 'auto', p: 0.5 }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ px: 2, py: 5, textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                All caught up! No unread notifications.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {today.length > 0 && <NotificationGroup label="Today" items={today} />}
                            {earlier.length > 0 && <NotificationGroup label="Earlier" items={earlier} />}
                        </>
                    )}
                </Box>
            </Popover>

            {/* Profile Menu */}
            <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={() => setProfileAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { borderRadius: '10px', mt: 1, minWidth: 210, p: 0.5, boxShadow: 'var(--shadow-lg)' } } }}
            >
                <Box sx={{ px: 1.5, py: 1, mb: 0.4 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '13.5px' }}>{user?.name || 'You'}</Typography>
                    <Typography sx={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                        {user?.email}
                    </Typography>
                </Box>
                <Divider sx={{ borderColor: 'var(--border)', my: 0.5 }} />
                <MenuItem
                    onClick={() => {
                        setProfileAnchor(null);
                        nav('/app/settings');
                    }}
                    sx={{ borderRadius: '6px', fontSize: '13px', fontWeight: 500, my: 0.2 }}
                >
                    <FiUser size={14} style={{ marginRight: 10, color: 'var(--text-secondary)' }} /> Profile
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setProfileAnchor(null);
                        nav('/app/settings');
                    }}
                    sx={{ borderRadius: '6px', fontSize: '13px', fontWeight: 500, my: 0.2 }}
                >
                    <FiSettings size={14} style={{ marginRight: 10, color: 'var(--text-secondary)' }} /> Settings
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setProfileAnchor(null);
                        setHelpOpen(true);
                    }}
                    sx={{ borderRadius: '6px', fontSize: '13px', fontWeight: 500, my: 0.2 }}
                >
                    <FiHelpCircle size={14} style={{ marginRight: 10, color: 'var(--text-secondary)' }} /> Shortcuts & Help
                </MenuItem>
                <Divider sx={{ borderColor: 'var(--border)', my: 0.5 }} />
                <MenuItem
                    onClick={() => {
                        setProfileAnchor(null);
                        onLogoutClick?.();
                    }}
                    sx={{ borderRadius: '6px', fontSize: '13px', fontWeight: 600, my: 0.2, color: 'var(--error)' }}
                >
                    <FiLogOut size={14} style={{ marginRight: 10 }} /> Sign out
                </MenuItem>
            </Menu>

            <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
        </Box>
    );
};

const NotificationGroup = ({ label, items }) => (
    <Box sx={{ mb: 0.5 }}>
        <Typography sx={{ px: 1.5, pt: 1, pb: 0.3, fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {label}
        </Typography>
        {items.map((n) => (
            <NotificationItem key={n.id} notification={n} />
        ))}
    </Box>
);

const HelpDialog = ({ open, onClose }) => {
    const shortcuts = [
        ['⌘ / Ctrl + K or /', 'Focus search & AI command bar'],
        ['Enter', 'Send message in chat'],
        ['Shift + Enter', 'Add new line in composer'],
        ['Esc', 'Close modals and palettes'],
    ];
    return (
        <CustomModal open={open} onClose={onClose} title="Shortcuts & Tips" subtitle="Quick keys to navigate Milo effortlessly.">
            <Typography sx={{ fontSize: '11.5px', fontWeight: 700, mb: 1, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Prompt examples
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 2.5 }}>
                {[
                    '“Plan my day based on urgent priorities”',
                    '“Remember that my review meeting is with Sarah”',
                    '“What goals have pending steps this week?”',
                    '“Summarize overdue tasks and recommend a schedule”',
                ].map((s) => (
                    <Box key={s} sx={{ p: 1, borderRadius: '6px', bgcolor: 'var(--surface-soft)', border: '1px solid var(--border)', fontSize: '13px', color: 'var(--ink)' }}>
                        {s}
                    </Box>
                ))}
            </Box>
            <Typography sx={{ fontSize: '11.5px', fontWeight: 700, mb: 1, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Keyboard shortcuts
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 2.5 }}>
                {shortcuts.map(([key, desc]) => (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0.8, borderRadius: '6px', bgcolor: 'var(--surface-soft)' }}>
                        <Typography sx={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{desc}</Typography>
                        <Box sx={{ px: 0.8, py: 0.2, borderRadius: '4px', bgcolor: 'var(--surface)', border: '1px solid var(--border)', fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                            {key}
                        </Box>
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" size="small" onClick={onClose}>
                    Done
                </Button>
            </Box>
        </CustomModal>
    );
};

export default Navbar;
