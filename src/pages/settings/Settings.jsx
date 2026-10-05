import { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    FormControlLabel,
    LinearProgress,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FiCalendar,
    FiCheck,
    FiDatabase,
    FiEye,
    FiGitBranch,
    FiKey,
    FiLogOut,
    FiMail,
    FiMessageSquare,
    FiMoon,
    FiRefreshCw,
    FiSlack,
    FiSun,
    FiTrash2,
    FiUser,
    FiCpu,
    FiBell,
    FiCreditCard,
    FiShield,
    FiSmartphone,
    FiMonitor,
    FiDownload,
    FiCheckCircle,
    FiExternalLink,
} from 'react-icons/fi';
import PageHeader from '../../components/PageHeader';
import AgentAvatar from '../../components/AgentAvatar';
import CustomSelect from '../../common/custom/CustomSelect';
import CustomModal from '../../common/custom/CustomModal';
import { ConfirmDialog } from '../../models/AllModels';
import { AVATAR_OPTIONS, TIMEZONES, USER_AVATAR_COLORS } from '../../utils/constants';
import { useThemeMode } from '../../themeMode';
import {
    DEMO_MODE,
    useAgent,
    useChangePassword,
    useDeleteAccount,
    useLogout,
    useSettings,
    useUpdateAgent,
    useUpdateSettings,
    useUpdateUserProfile,
    useUserProfile,
} from '../../Api/Api';
import { demoStore } from '../../utils/demoStore';

const TABS = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'agent', label: 'Milo AI', icon: FiCpu },
    { id: 'integrations', label: 'Integrations', icon: FiGitBranch },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'billing', label: 'Billing & Plans', icon: FiCreditCard },
    { id: 'security', label: 'Security', icon: FiShield },
];

const PERMISSIONS = [
    { icon: FiDatabase, title: 'Memory Vault', detail: 'Reads and manages facts you ask Milo to remember. Full user control.' },
    { icon: FiCheck, title: 'Tasks & Agendas', detail: 'Creates and prioritizes tasks and milestone steps with your permission.' },
    { icon: FiCalendar, title: 'Calendar Sync', detail: 'Reads your events and suggests optimal focus blocks without conflicting.' },
    { icon: FiMail, title: 'Email Assistance', detail: 'Drafts responses and summarizes threads with zero automated sends.' },
];

const INTEGRATIONS_LIST = [
    { id: 'gcal', name: 'Google Calendar', desc: 'Sync events, smart focus blocks, and meeting reminders', connected: true, icon: FiCalendar },
    { id: 'gmail', name: 'Gmail', desc: 'Summarize key threads and draft context-aware follow-ups', connected: false, icon: FiMail },
    { id: 'notion', name: 'Notion', desc: 'Import project docs, notes, and task databases directly', connected: true, icon: FiMessageSquare },
    { id: 'slack', name: 'Slack', desc: 'Receive morning briefing cards and urgent task pings in Slack', connected: false, icon: FiSlack },
    { id: 'github', name: 'GitHub', desc: 'Link pull requests, assigned issues, and code reviews to tasks', connected: false, icon: FiGitBranch },
];

const APPEARANCE_OPTIONS = [
    { id: 'light', label: 'Light', icon: FiSun },
    { id: 'system', label: 'System', icon: FiCheck },
    { id: 'dark', label: 'Dark', icon: FiMoon },
];

const PLANS = [
    {
        id: 'free',
        name: 'Starter',
        price: '$0',
        period: 'forever',
        desc: 'Essential personalized daily assistance for individuals.',
        features: ['Up to 50 AI messages/day', 'Standard task & calendar loop', '1 connected integration', 'Core memory bank'],
        current: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$19',
        period: 'per month',
        badge: 'Recommended',
        desc: 'Unlimited AI reasoning, multi-app sync, and proactive briefings.',
        features: ['Unlimited AI messages & reasoning', 'Real-time calendar & inbox sync', 'Advanced weekly productivity analytics', 'Priority Gemini 2.0 Flash engine', 'Customizable AI personality & tone'],
        current: true,
    },
    {
        id: 'team',
        name: 'Team / Workspace',
        price: '$49',
        period: 'per month',
        desc: 'Collaborative task pipelines and workspace AI intelligence.',
        features: ['Shared workspace agendas & tasks', 'Everything in Pro for up to 5 seats', 'Admin usage & token audit logs', 'Custom webhook & API integrations', 'Dedicated support & SLA'],
        current: false,
    },
];

const INVOICES = [
    { id: 'INV-2026-003', date: 'Oct 01, 2026', amount: '$19.00', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Sep 01, 2026', amount: '$19.00', status: 'Paid' },
    { id: 'INV-2026-001', date: 'Aug 01, 2026', amount: '$19.00', status: 'Paid' },
];

const SESSIONS = [
    { id: 'sess-1', device: 'Chrome on Windows 11', location: 'Active Now • Current Session', icon: FiMonitor, current: true },
    { id: 'sess-2', device: 'Safari on iPhone 16 Pro', location: 'Yesterday at 8:42 PM', icon: FiSmartphone, current: false },
    { id: 'sess-3', device: 'Firefox on macOS Sonoma', location: '3 days ago', icon: FiMonitor, current: false },
];

const Settings = () => {
    const nav = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile';

    const handleTabChange = (newTab) => {
        setSearchParams({ tab: newTab }, { replace: true });
    };

    const { data: user } = useUserProfile();
    const { data: agent } = useAgent();
    const { data: settings } = useSettings();
    const { mode, setMode } = useThemeMode();

    const { mutate: updateUser } = useUpdateUserProfile(
        () => toast.success('Profile updated.'),
        () => toast.error("Couldn't update your profile.")
    );
    const { mutate: updateAgent } = useUpdateAgent(
        () => toast.success('AI settings updated.'),
        () => toast.error("Couldn't update AI settings.")
    );
    const { mutate: updateSettings } = useUpdateSettings(
        () => toast.success('Preferences saved.'),
        () => toast.error("Couldn't save preferences.")
    );
    const { mutate: logoutMutate } = useLogout(
        () => {
            toast.success('Signed out. See you soon.');
            nav('/login');
        },
        () => toast.error("Couldn't log out right now.")
    );

    const [resetOpen, setResetOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [delPassword, setDelPassword] = useState('');
    const [delError, setDelError] = useState('');
    const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
    const [pwdError, setPwdError] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [integrationsState, setIntegrationsState] = useState(() =>
        INTEGRATIONS_LIST.reduce((acc, item) => ({ ...acc, [item.id]: item.connected }), {})
    );

    const { mutate: changePwdMutate, isPending: isChangingPwd } = useChangePassword();
    const { mutate: deleteAccountMutate, isPending: isDeleting } = useDeleteAccount(
        () => {
            toast.success('Your Milo workspace has been deleted.');
            nav('/register');
        },
        (err) => setDelError(err?.response?.data?.message || "Couldn't delete your account.")
    );

    const handleChangePassword = () => {
        if (pwd.next.length < 8 || !/[A-Za-z]/.test(pwd.next) || !/\d/.test(pwd.next)) {
            setPwdError('New password must be at least 8 characters and contain a letter and a number.');
            return;
        }
        if (pwd.next !== pwd.confirm) {
            setPwdError('New passwords do not match.');
            return;
        }
        setPwdError('');
        changePwdMutate(
            { current_password: pwd.current, new_password: pwd.next },
            {
                onSuccess: () => {
                    setPwd({ current: '', next: '', confirm: '' });
                    toast.success('Password changed successfully.');
                },
                onError: (err) => setPwdError(err?.response?.data?.message || "Couldn't change your password."),
            }
        );
    };

    const handleDeleteConfirm = () => {
        if (DEMO_MODE) {
            localStorage.removeItem('milo:db');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('role');
            localStorage.removeItem('two_fa_verified');
            setDeleteOpen(false);
            toast.success('Your Milo workspace has been removed.');
            nav('/register');
        } else {
            deleteAccountMutate(delPassword);
        }
    };

    const toggleIntegration = (id) => {
        setIntegrationsState((prev) => {
            const nextState = !prev[id];
            toast.info(`${INTEGRATIONS_LIST.find((i) => i.id === id)?.name} ${nextState ? 'connected' : 'disconnected'}.`);
            return { ...prev, [id]: nextState };
        });
    };

    const card = {
        bgcolor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        p: { xs: 2.2, sm: 2.8 },
        mb: 2.5,
        boxShadow: 'var(--shadow-xs)',
    };

    const accentSwitch = {
        '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'var(--accent)' },
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', pb: 5 }}>
            <PageHeader
                title="Settings"
                subtitle="Manage your personal profile, Milo AI preferences, integrations, and workspace security."
            />

            {/* Top Navigation Tabs */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.6,
                    overflowX: 'auto',
                    borderBottom: '1px solid var(--border)',
                    mb: 3,
                    pb: 0.4,
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {TABS.map((tab) => {
                    const active = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <Box
                            key={tab.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleTabChange(tab.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleTabChange(tab.id);
                            }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.9,
                                px: 1.6,
                                py: 1.1,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '13.5px',
                                fontWeight: active ? 600 : 500,
                                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                                bgcolor: active ? 'var(--accent-soft)' : 'transparent',
                                border: '1px solid',
                                borderColor: active ? 'var(--accent-border)' : 'transparent',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                    bgcolor: active ? 'var(--accent-soft)' : 'var(--surface-soft)',
                                    color: active ? 'var(--accent)' : 'var(--ink)',
                                },
                            }}
                        >
                            <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                            <span>{tab.label}</span>
                        </Box>
                    );
                })}
            </Box>

            {/* TAB 1: PROFILE */}
            {activeTab === 'profile' && (
                <Box>
                    <Box sx={card}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)', mb: 0.4 }}>
                            Personal Profile
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mb: 2.5 }}>
                            Your identity across Milo and connected productivity integrations.
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar
                                sx={{
                                    width: 58,
                                    height: 58,
                                    bgcolor: user?.avatarColor || 'var(--accent)',
                                    fontWeight: 700,
                                    fontSize: '20px',
                                    color: '#FFFFFF',
                                    boxShadow: 'var(--shadow-sm)',
                                }}
                            >
                                {(user?.name || 'A').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '15.5px', color: 'var(--ink)' }}>
                                    {user?.name || 'Your Account'}
                                </Typography>
                                <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    {user?.email || 'user@example.com'}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                            <TextField
                                label="Full Name"
                                size="small"
                                defaultValue={user?.name}
                                onBlur={(e) => e.target.value.trim() && updateUser({ name: e.target.value.trim() })}
                                fullWidth
                            />
                            <TextField
                                label="Mobile Number"
                                size="small"
                                defaultValue={user?.mobile}
                                onBlur={(e) => e.target.value.trim() && updateUser({ mobile: e.target.value.trim() })}
                                fullWidth
                            />
                        </Box>

                        <Box sx={{ mb: 2.5 }}>
                            <TextField
                                label="Email Address"
                                size="small"
                                type="email"
                                defaultValue={user?.email}
                                onBlur={(e) => e.target.value.trim() && updateUser({ email: e.target.value.trim() })}
                                fullWidth
                            />
                        </Box>

                        <Box sx={{ maxWidth: 360, mb: 2.5 }}>
                            <CustomSelect
                                label="Timezone"
                                name="timezone"
                                value={user?.timezone}
                                onChange={(e) => updateUser({ timezone: e.target.value })}
                                options={TIMEZONES}
                            />
                        </Box>

                        <Typography sx={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', mb: 1.2 }}>
                            Avatar Color
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {USER_AVATAR_COLORS.map((color) => (
                                <Box
                                    key={color}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => updateUser({ avatarColor: color })}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') updateUser({ avatarColor: color });
                                    }}
                                    aria-label={`Select ${color} avatar color`}
                                    sx={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: '50%',
                                        bgcolor: color,
                                        cursor: 'pointer',
                                        border: user?.avatarColor === color ? '3px solid var(--ink)' : '2px solid transparent',
                                        transition: 'transform 0.12s ease',
                                        '&:hover': { transform: 'scale(1.12)' },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Appearance */}
                    <Box sx={card}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)', mb: 0.4 }}>
                            Interface Appearance
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mb: 2 }}>
                            Choose your preferred visual theme across devices.
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap' }}>
                            {APPEARANCE_OPTIONS.map((opt) => {
                                const selected = mode === opt.id;
                                const Icon = opt.icon;
                                return (
                                    <Box
                                        key={opt.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setMode(opt.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') setMode(opt.id);
                                        }}
                                        aria-pressed={selected}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.8,
                                            px: 2,
                                            py: 1.1,
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            border: '1.5px solid',
                                            borderColor: selected ? 'var(--accent)' : 'var(--border)',
                                            bgcolor: selected ? 'var(--accent-soft)' : 'var(--surface)',
                                            transition: 'all 0.12s ease',
                                            '&:hover': { borderColor: 'var(--accent)' },
                                        }}
                                    >
                                        <Icon size={16} style={{ color: selected ? 'var(--accent)' : 'var(--text-secondary)' }} />
                                        <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: selected ? 'var(--accent)' : 'var(--ink)' }}>
                                            {opt.label}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            )}

            {/* TAB 2: MILO AI */}
            {activeTab === 'agent' && (
                <Box>
                    <Box sx={card}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)', mb: 0.4 }}>
                            AI Companion Profile
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mb: 2.5 }}>
                            Configure your AI agent’s persona, responsiveness, and interaction style.
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <AgentAvatar avatar={agent?.avatar} color={agent?.color} size={54} />
                            <TextField
                                label="AI Agent Name"
                                size="small"
                                defaultValue={agent?.name || 'Milo'}
                                onBlur={(e) => e.target.value.trim() && updateAgent({ name: e.target.value.trim() })}
                                sx={{ maxWidth: 260 }}
                            />
                        </Box>

                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', mb: 0.8 }}>
                            Tone & Personality Instructions
                        </Typography>
                        <TextField
                            label="How should your AI interact with you?"
                            size="small"
                            multiline
                            minRows={3}
                            maxRows={6}
                            defaultValue={agent?.personality || ''}
                            onBlur={(e) => {
                                const v = e.target.value.trim();
                                if (v) updateAgent({ personality: v });
                            }}
                            helperText="Provide guidance on tone (e.g., 'Concise and proactive, prioritize deep work time, use bullet points')."
                            fullWidth
                            sx={{ mb: 3 }}
                        />

                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', mb: 1.2 }}>
                            Visual Form
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1.4, flexWrap: 'wrap' }}>
                            {AVATAR_OPTIONS.map((opt) => {
                                const selected = agent?.avatar === opt.id;
                                return (
                                    <Box
                                        key={opt.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => updateAgent({ avatar: opt.id, color: opt.color })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') updateAgent({ avatar: opt.id, color: opt.color });
                                        }}
                                        aria-pressed={selected}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 0.6,
                                            p: 1.4,
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            border: '1.5px solid',
                                            borderColor: selected ? 'var(--accent)' : 'var(--border)',
                                            bgcolor: selected ? 'var(--accent-soft)' : 'transparent',
                                            transition: 'all 0.12s ease',
                                            minWidth: 90,
                                            '&:hover': { borderColor: 'var(--accent)' },
                                        }}
                                    >
                                        <AgentAvatar avatar={opt.id} color={opt.color} size={38} />
                                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: selected ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                            {opt.label}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* AI Memory Permissions */}
                    <Box sx={card}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)', mb: 0.4 }}>
                            Memory Vault & Boundaries
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mb: 2 }}>
                            Define what Milo is allowed to retain across your conversations.
                        </Typography>

                        <NotificationRow
                            title="Persistent Memory"
                            desc="Allow Milo to remember key details (preferences, ongoing projects, habits) from chat."
                            checked={settings?.memoryEnabled !== false}
                            onChange={(v) => updateSettings({ memoryEnabled: v })}
                            switchSx={accentSwitch}
                        />

                        <Divider sx={{ my: 2, borderColor: 'var(--border)' }} />

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                            {PERMISSIONS.map((perm) => (
                                <Box
                                    key={perm.title}
                                    sx={{
                                        p: 1.6,
                                        borderRadius: '8px',
                                        bgcolor: 'var(--surface-soft)',
                                        border: '1px solid var(--border)',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.4 }}>
                                        <perm.icon size={15} style={{ color: 'var(--accent)' }} />
                                        <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>
                                            {perm.title}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                        {perm.detail}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            )}

            {/* TAB 3: INTEGRATIONS */}
            {activeTab === 'integrations' && (
                <Box>
                    <Box sx={card}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)', mb: 0.4 }}>
                            Connected Tools & Workspaces
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mb: 2.5 }}>
                            Connect third-party apps so Milo can coordinate your schedule, notes, and task pipelines seamlessly.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
                            {INTEGRATIONS_LIST.map((tool) => {
                                const isConnected = Boolean(integrationsState[tool.id]);
                                const Icon = tool.icon;
                                return (
                                    <Box
                                        key={tool.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: { xs: 'flex-start', sm: 'center' },
                                            justifyContent: 'space-between',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            gap: 1.5,
                                            p: 2,
                                            borderRadius: '10px',
                                            border: '1px solid',
                                            borderColor: isConnected ? 'var(--accent-border)' : 'var(--border)',
                                            bgcolor: isConnected ? 'var(--accent-soft)' : 'var(--surface)',
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.6, minWidth: 0 }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '8px',
                                                    bgcolor: isConnected ? 'var(--accent)' : 'var(--surface-soft)',
                                                    color: isConnected ? '#FFFFFF' : 'var(--text-secondary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Icon size={18} />
                                            </Box>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)' }}>
                                                        {tool.name}
                                                    </Typography>
                                                    {isConnected ? (
                                                        <Chip
                                                            label="Connected"
                                                            size="small"
                                                            sx={{
                                                                height: 20,
                                                                fontSize: '11px',
                                                                fontWeight: 600,
                                                                bgcolor: 'var(--success-soft)',
                                                                color: 'var(--success)',
                                                            }}
                                                        />
                                                    ) : (
                                                        <Chip
                                                            label="Disconnected"
                                                            size="small"
                                                            sx={{
                                                                height: 20,
                                                                fontSize: '11px',
                                                                fontWeight: 500,
                                                                bgcolor: 'var(--surface-soft)',
                                                                color: 'var(--text-muted)',
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                                <Typography sx={{ fontSize: '12.5px', color: 'var(--text-secondary)', mt: 0.3 }}>
                                                    {tool.desc}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Button
                                            variant={isConnected ? 'outlined' : 'contained'}
                                            size="small"
                                            onClick={() => toggleIntegration(tool.id)}
                                            sx={{
                                                borderRadius: '7px',
                                                fontSize: '12.5px',
                                                textTransform: 'none',
                                                flexShrink: 0,
                                                borderColor: isConnected ? 'var(--border-strong)' : undefined,
                                                color: isConnected ? 'var(--ink)' : '#FFFFFF',
                                                bgcolor: isConnected ? 'var(--surface)' : 'var(--accent)',
                                                '&:hover': {
                                                    bgcolor: isConnected ? 'var(--surface-soft)' : 'var(--accent-hover)',
                                                },
                                            }}
                                        >
                                            {isConnected ? 'Disconnect' : 'Connect Account'}
                                        </Button>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            )}

            {/* TAB 4: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
                <Box>
                    <Box sx={card}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)', mb: 0.4 }}>
                            Notification Preferences
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mb: 2 }}>
                            Fine-tune how and when Milo communicates with you throughout your workday.
                        </Typography>

                        <NotificationRow
                            title="Daily Morning Briefing"
                            desc="Receive a concise overview of priority tasks and events at your work start time."
                            checked={settings?.dailyBriefing}
                            onChange={(v) => updateSettings({ dailyBriefing: v })}
                            switchSx={accentSwitch}
                        />
                        <Divider sx={{ my: 1.5, borderColor: 'var(--border)' }} />

                        <NotificationRow
                            title="Task Due Reminders"
                            desc="Receive gentle prompts ahead of deadlines and upcoming scheduled calendar items."
                            checked={settings?.inAppNotifications}
                            onChange={(v) => updateSettings({ inAppNotifications: v })}
                            switchSx={accentSwitch}
                        />
                        <Divider sx={{ my: 1.5, borderColor: 'var(--border)' }} />

                        <NotificationRow
                            title="Proactive Productivity Insights"
                            desc="Allow Milo to surface overdue tasks, streak milestones, and weekly summary trends."
                            checked={settings?.proactiveSuggestions}
                            onChange={(v) => updateSettings({ proactiveSuggestions: v })}
                            switchSx={accentSwitch}
                        />
                        <Divider sx={{ my: 1.5, borderColor: 'var(--border)' }} />

                        <NotificationRow
                            title="Audio Feedback & Chimes"
                            desc="Play subtle audio cues when messages send or task milestones complete."
                            checked={true}
                            onChange={() => toast.info('Audio feedback preference saved.')}
                            switchSx={accentSwitch}
                        />
                    </Box>
                </Box>
            )}

            {/* TAB 5: BILLING & PLANS */}
            {activeTab === 'billing' && (
                <Box>
                    {/* Current Plan Overview */}
                    <Box sx={card}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)' }}>
                                    Current Plan & Usage
                                </Typography>
                                <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mt: 0.3 }}>
                                    Your workspace is on the <strong>Pro Plan</strong> ($19/mo, auto-renews Nov 01, 2026).
                                </Typography>
                            </Box>
                            <Chip
                                label="Active Pro"
                                sx={{
                                    bgcolor: 'var(--accent-soft)',
                                    color: 'var(--accent)',
                                    fontWeight: 700,
                                    fontSize: '12px',
                                    border: '1px solid var(--accent-border)',
                                }}
                            />
                        </Box>

                        <Box sx={{ p: 2, borderRadius: '10px', bgcolor: 'var(--surface-soft)', border: '1px solid var(--border)', mb: 2.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                                    Monthly AI Token & Query Quota
                                </Typography>
                                <Typography sx={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--accent)' }}>
                                    17,420 / 25,000 queries used (70%)
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={70}
                                sx={{
                                    height: 7,
                                    borderRadius: 4,
                                    bgcolor: 'var(--border)',
                                    '& .MuiLinearProgress-bar': { bgcolor: 'var(--accent)' },
                                }}
                            />
                            <Typography sx={{ fontSize: '11.5px', color: 'var(--text-secondary)', mt: 0.8 }}>
                                Resets on the 1st of each calendar month. Pro subscribers have grace overage protection.
                            </Typography>
                        </Box>

                        {/* Payment Method */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.8, borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 36, height: 26, borderRadius: '4px', bgcolor: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                                    VISA
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>
                                        •••• 4242 (Stripe / Razorpay)
                                    </Typography>
                                    <Typography sx={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                                        Expires 08/2028 • Default billing method
                                    </Typography>
                                </Box>
                            </Box>
                            <Button size="small" variant="text" sx={{ color: 'var(--accent)', fontWeight: 600, fontSize: '12.5px' }}>
                                Update Card
                            </Button>
                        </Box>
                    </Box>

                    {/* Plan Tiers */}
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)', mb: 1.8 }}>
                            Available Workspace Plans
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.8 }}>
                            {PLANS.map((plan) => (
                                <Box
                                    key={plan.id}
                                    sx={{
                                        p: 2.2,
                                        borderRadius: '12px',
                                        bgcolor: 'var(--surface)',
                                        border: '1.5px solid',
                                        borderColor: plan.current ? 'var(--accent)' : 'var(--border)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        boxShadow: plan.current ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
                                    }}
                                >
                                    {plan.badge && (
                                        <Chip
                                            label={plan.badge}
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                height: 20,
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                bgcolor: 'var(--accent)',
                                                color: '#FFFFFF',
                                            }}
                                        />
                                    )}
                                    <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)' }}>
                                        {plan.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'var(--text-secondary)', mt: 0.3, mb: 1.5 }}>
                                        {plan.desc}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 2 }}>
                                        <Typography sx={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)' }}>
                                            {plan.price}
                                        </Typography>
                                        <Typography sx={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            /{plan.period}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5, flexGrow: 1 }}>
                                        {plan.features.map((feat, idx) => (
                                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FiCheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                                                <Typography sx={{ fontSize: '12px', color: 'var(--ink-soft)' }}>
                                                    {feat}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Button
                                        variant={plan.current ? 'outlined' : 'contained'}
                                        fullWidth
                                        disabled={plan.current}
                                        onClick={() => toast.success(`Switched to ${plan.name} plan.`)}
                                        sx={{
                                            borderRadius: '8px',
                                            py: 0.9,
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            borderColor: plan.current ? 'var(--accent)' : undefined,
                                            color: plan.current ? 'var(--accent)' : '#fff',
                                            bgcolor: plan.current ? 'transparent' : 'var(--accent)',
                                        }}
                                    >
                                        {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Invoice History */}
                    <Box sx={card}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)', mb: 1.5 }}>
                            Invoice & Payment History
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {INVOICES.map((inv) => (
                                <Box
                                    key={inv.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: 1.4,
                                        borderRadius: '8px',
                                        bgcolor: 'var(--surface-soft)',
                                    }}
                                >
                                    <Box>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                                            {inv.id}
                                        </Typography>
                                        <Typography sx={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                                            {inv.date} • {inv.amount}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Chip
                                            label={inv.status}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                bgcolor: 'var(--success-soft)',
                                                color: 'var(--success)',
                                            }}
                                        />
                                        <Button
                                            size="small"
                                            startIcon={<FiDownload size={13} />}
                                            onClick={() => toast.info(`Downloading invoice ${inv.id}...`)}
                                            sx={{ color: 'var(--text-secondary)', fontSize: '12px' }}
                                        >
                                            PDF
                                        </Button>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            )}

            {/* TAB 6: SECURITY */}
            {activeTab === 'security' && (
                <Box>
                    {/* Password Change */}
                    <Box sx={card}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)', mb: 0.4 }}>
                            Change Password
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mb: 2 }}>
                            Keep your workspace secure. Changing your password signs out other active sessions.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6, maxWidth: 440 }}>
                            <TextField
                                label="Current Password"
                                type="password"
                                size="small"
                                value={pwd.current}
                                onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                                autoComplete="current-password"
                            />
                            <TextField
                                label="New Password"
                                type="password"
                                size="small"
                                value={pwd.next}
                                onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                                helperText="At least 8 characters with letters and numbers."
                                autoComplete="new-password"
                            />
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                size="small"
                                value={pwd.confirm}
                                onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                                autoComplete="new-password"
                            />
                            {pwdError && (
                                <Typography sx={{ fontSize: '12.5px', color: 'var(--error)', fontWeight: 600 }}>
                                    {pwdError}
                                </Typography>
                            )}
                            <Box>
                                <Button
                                    variant="contained"
                                    startIcon={<FiKey size={15} />}
                                    disabled={!pwd.current || !pwd.next || !pwd.confirm || isChangingPwd}
                                    onClick={handleChangePassword}
                                    sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-hover)' } }}
                                >
                                    {isChangingPwd ? 'Updating…' : 'Update Password'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* 2FA */}
                    <Box sx={card}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)' }}>
                                    Two-Factor Authentication (2FA)
                                </Typography>
                                <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mt: 0.3 }}>
                                    Add an extra layer of security using an authenticator app (Google Authenticator, 1Password).
                                </Typography>
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={twoFactorEnabled}
                                        onChange={(e) => {
                                            setTwoFactorEnabled(e.target.checked);
                                            toast.success(`Two-Factor Authentication ${e.target.checked ? 'enabled' : 'disabled'}.`);
                                        }}
                                        sx={accentSwitch}
                                    />
                                }
                                label=""
                                sx={{ m: 0 }}
                            />
                        </Box>
                    </Box>

                    {/* Active Sessions */}
                    <Box sx={card}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)', mb: 0.4 }}>
                            Active Sessions & Devices
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mb: 2 }}>
                            Devices currently authenticated to your Milo account.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                            {SESSIONS.map((sess) => {
                                const Icon = sess.icon;
                                return (
                                    <Box
                                        key={sess.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            p: 1.5,
                                            borderRadius: '8px',
                                            bgcolor: 'var(--surface-soft)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Icon size={18} style={{ color: 'var(--text-secondary)' }} />
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>
                                                        {sess.device}
                                                    </Typography>
                                                    {sess.current && (
                                                        <Chip
                                                            label="Current"
                                                            size="small"
                                                            sx={{
                                                                height: 18,
                                                                fontSize: '10px',
                                                                fontWeight: 700,
                                                                bgcolor: 'var(--success-soft)',
                                                                color: 'var(--success)',
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                                <Typography sx={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                                                    {sess.location}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {!sess.current && (
                                            <Button
                                                size="small"
                                                variant="text"
                                                color="error"
                                                onClick={() => toast.info(`Signed out of ${sess.device}.`)}
                                                sx={{ fontSize: '12px' }}
                                            >
                                                Revoke
                                            </Button>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* Account Danger Actions */}
                    <Box sx={card}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)', mb: 1.8 }}>
                            Account Actions
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                startIcon={<FiLogOut size={15} />}
                                onClick={() => setLogoutOpen(true)}
                                sx={{ color: 'var(--ink)', borderColor: 'var(--border-strong)' }}
                            >
                                Sign Out
                            </Button>
                            {DEMO_MODE && (
                                <Button
                                    variant="outlined"
                                    startIcon={<FiRefreshCw size={15} />}
                                    onClick={() => setResetOpen(true)}
                                    sx={{ color: 'var(--ink)', borderColor: 'var(--border-strong)' }}
                                >
                                    Reset Demo Data
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<FiTrash2 size={15} />}
                                onClick={() => setDeleteOpen(true)}
                                sx={{ borderColor: 'var(--error)', color: 'var(--error)' }}
                            >
                                Delete Account
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Modals & Dialogs */}
            <ConfirmDialog
                open={resetOpen}
                onClose={() => setResetOpen(false)}
                onConfirm={() => {
                    demoStore.reset();
                    setResetOpen(false);
                    toast.success('Demo data reset. Reloading…');
                    setTimeout(() => window.location.reload(), 400);
                }}
                title="Reset all demo data?"
                message="Tasks, goals, memories, conversations and settings will return to their starting state."
                confirmText="Reset everything"
                tone="warning"
            />

            <CustomModal
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setDelPassword('');
                    setDelError('');
                }}
                title="Delete your account?"
                subtitle="This permanently removes your account and everything inside it. There is no undo."
            >
                {DEMO_MODE ? (
                    <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', mb: 2 }}>
                        Tasks, goals, memories, conversations and settings will be removed from this device.
                    </Typography>
                ) : (
                    <TextField
                        label="Enter your password to confirm"
                        type="password"
                        size="small"
                        fullWidth
                        value={delPassword}
                        onChange={(e) => {
                            setDelPassword(e.target.value);
                            setDelError('');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && delPassword.trim()) handleDeleteConfirm();
                        }}
                        sx={{ mb: 1.6 }}
                        autoFocus
                    />
                )}
                {delError && (
                    <Typography sx={{ fontSize: '12.5px', color: 'var(--error)', fontWeight: 600, mb: 1.6 }}>
                        {delError}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                        onClick={() => {
                            setDeleteOpen(false);
                            setDelPassword('');
                            setDelError('');
                        }}
                        sx={{ color: 'var(--ink-soft)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={!isDeleting ? <FiTrash2 size={15} /> : null}
                        disabled={!DEMO_MODE && (!delPassword.trim() || isDeleting)}
                        onClick={handleDeleteConfirm}
                    >
                        {isDeleting ? 'Deleting…' : 'Delete everything'}
                    </Button>
                </Box>
            </CustomModal>

            <ConfirmDialog
                open={logoutOpen}
                onClose={() => setLogoutOpen(false)}
                onConfirm={() => {
                    setLogoutOpen(false);
                    logoutMutate();
                }}
                title="Sign out of Milo?"
                message="Your data stays safely stored. You can sign back in anytime."
                confirmText="Sign out"
                tone="warning"
            />
        </Box>
    );
};

const NotificationRow = ({ title, desc, checked, onChange, switchSx }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 1.1, minWidth: 0 }}>
        <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{title}</Typography>
            <Typography sx={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{desc}</Typography>
        </Box>
        <FormControlLabel
            control={<Switch checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} sx={switchSx} />}
            label=""
            sx={{ m: 0, flexShrink: 0 }}
        />
    </Box>
);

export default Settings;
