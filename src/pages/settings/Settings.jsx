import { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    FormControlLabel,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

const PERMISSIONS = [
    { icon: FiDatabase, title: 'Memory', detail: 'Reads and edits what you ask it to remember. You control everything in the Memory tab.' },
    { icon: FiCheck, title: 'Tasks & goals', detail: 'Creates, updates and completes tasks and goal steps you approve.' },
    { icon: FiCalendar, title: 'Calendar', detail: 'Coming soon — will read your schedule and suggest, never create without approval.' },
    { icon: FiMail, title: 'Email', detail: 'Coming soon — will draft messages and always ask before sending anything.' },
];

const INTEGRATIONS = [
    { icon: FiCalendar, name: 'Google Calendar', desc: 'Understand your schedule' },
    { icon: FiMail, name: 'Gmail', desc: 'Summarise and draft email' },
    { icon: FiMessageSquare, name: 'Notion', desc: 'Read your notes' },
    { icon: FiCheck, name: 'Todoist', desc: 'Sync your tasks' },
    { icon: FiSlack, name: 'Slack', desc: 'Team communication' },
    { icon: FiGitBranch, name: 'GitHub', desc: 'Developer workflow' },
];

const APPEARANCE_OPTIONS = [
    { id: 'light', label: 'Light', icon: FiSun },
    { id: 'system', label: 'System', icon: FiCheck },
    { id: 'dark', label: 'Dark', icon: FiMoon },
];

const Settings = () => {
    const nav = useNavigate();
    const { data: user } = useUserProfile();
    const { data: agent } = useAgent();
    const { data: settings } = useSettings();
    const { mode, setMode } = useThemeMode();
    const { mutate: updateUser } = useUpdateUserProfile(
        () => toast.success('Account updated.'),
        () => toast.error("Couldn't update your account.")
    );
    const { mutate: updateAgent } = useUpdateAgent(
        () => toast.success('Your AI has a new look.'),
        () => toast.error("Couldn't update your AI.")
    );
    const { mutate: updateSettings } = useUpdateSettings(
        () => toast.success('Preferences saved.'),
        () => toast.error("Couldn't save those preferences.")
    );
    const { mutate: logoutMutate } = useLogout(
        () => {
            toast.success('Logged out. See you soon.');
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

    const { mutate: changePwdMutate, isPending: isChangingPwd } = useChangePassword();
    const { mutate: deleteAccountMutate, isPending: isDeleting } = useDeleteAccount(
        () => {
            toast.success('Your Milo space has been removed. Goodbye.');
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
            toast.success('Your Milo space has been removed.');
            nav('/register');
        } else {
            deleteAccountMutate(delPassword);
        }
    };

    const section = {
        bgcolor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-xs)',
        p: { xs: 2, sm: 2.6 },
        mb: 2.4,
    };

    const accentSwitch = {
        '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'var(--accent)' },
    };

    return (
        <Box sx={{ maxWidth: 820, mx: 'auto' }}>
            <PageHeader title="Settings" subtitle="Make Milo feel like yours." />

            {/* Account */}
            <Box sx={section}>
                <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 0.3 }}>Account</Typography>
                <Typography sx={{ fontSize: 13, color: 'var(--text-secondary)', mb: 2 }}>
                    How Milo knows you.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, mb: 2 }}>
                    <Avatar
                        sx={{ width: 52, height: 52, bgcolor: user?.avatarColor || 'var(--accent)', fontWeight: 800, fontSize: 20, color: '#fff' }}
                    >
                        {(user?.name || 'A').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 15.5 }}>{user?.name}</Typography>
                        <Typography sx={{ fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.email}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, mb: 1.5 }}>
                    <TextField
                        label="Full name"
                        size="small"
                        defaultValue={user?.name}
                        onBlur={(e) => e.target.value.trim() && updateUser({ name: e.target.value.trim() })}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Mobile number"
                        size="small"
                        defaultValue={user?.mobile}
                        onBlur={(e) => e.target.value.trim() && updateUser({ mobile: e.target.value.trim() })}
                        sx={{ flex: 1 }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Email"
                        size="small"
                        type="email"
                        defaultValue={user?.email}
                        onBlur={(e) => e.target.value.trim() && updateUser({ email: e.target.value.trim() })}
                        fullWidth
                    />
                </Box>
                <Box sx={{ maxWidth: 320 }}>
                    <CustomSelect
                        label="Timezone"
                        name="timezone"
                        value={user?.timezone}
                        onChange={(e) => updateUser({ timezone: e.target.value })}
                        options={TIMEZONES}
                    />
                </Box>
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', mt: 2, mb: 1 }}>
                    Avatar colour
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.9 }}>
                    {USER_AVATAR_COLORS.map((color) => (
                        <Box
                            key={color}
                            role="button"
                            tabIndex={0}
                            onClick={() => updateUser({ avatarColor: color })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') updateUser({ avatarColor: color });
                            }}
                            aria-label={`Use ${color} avatar colour`}
                            sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                bgcolor: color,
                                cursor: 'pointer',
                                border: user?.avatarColor === color ? '3px solid var(--ink)' : '3px solid transparent',
                                transition: 'transform 0.12s ease',
                                '&:hover': { transform: 'scale(1.12)' },
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Milo */}
            <Box sx={section}>
                <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 0.3 }}>Milo</Typography>
                <Typography sx={{ fontSize: 13, color: 'var(--text-secondary)', mb: 2 }}>
                    The name and look of your AI assistant.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, mb: 2, flexWrap: 'wrap' }}>
                    <AgentAvatar avatar={agent?.avatar} color={agent?.color} size={52} />
                    <TextField
                        label="AI name"
                        size="small"
                        defaultValue={agent?.name || 'Novi'}
                        onBlur={(e) => e.target.value.trim() && updateAgent({ name: e.target.value.trim() })}
                    />
                </Box>
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', mb: 1 }}>Personality</Typography>
                <TextField
                    label="How should your AI behave?"
                    size="small"
                    multiline
                    minRows={3}
                    maxRows={6}
                    defaultValue={agent?.personality || ''}
                    onBlur={(e) => {
                        const v = e.target.value.trim();
                        if (v) updateAgent({ personality: v });
                    }}
                    helperText="A short description of your AI's tone and style — it shapes how Novi talks to you."
                    sx={{ maxWidth: 520 }}
                    fullWidth
                />
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', mb: 1 }}>Look</Typography>
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
                                    p: 1.2,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    border: selected ? '2px solid var(--accent)' : '2px solid var(--border)',
                                    bgcolor: selected ? 'var(--accent-soft)' : 'transparent',
                                    transition: 'all 0.12s ease',
                                    '&:hover': { borderColor: 'var(--accent)' },
                                }}
                            >
                                <AgentAvatar avatar={opt.id} color={opt.color} size={36} />
                                <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: selected ? 'var(--accent-deep)' : 'var(--text-secondary)' }}>
                                    {opt.label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            {/* Notifications */}
            <Box sx={section}>
                <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 0.3 }}>Notifications</Typography>
                <Typography sx={{ fontSize: 13, color: 'var(--text-secondary)', mb: 1.5 }}>
                    What Milo shares with you — never spam.
                </Typography>
                <NotificationRow
                    title="Daily briefing"
                    desc="A calm morning summary of what matters."
                    checked={settings?.dailyBriefing}
                    onChange={(v) => updateSettings({ dailyBriefing: v })}
                    switchSx={accentSwitch}
                />
                <NotificationRow
                    title="Reminders"
                    desc="Nudges for tasks and due dates."
                    checked={settings?.inAppNotifications}
                    onChange={(v) => updateSettings({ inAppNotifications: v })}
                    switchSx={accentSwitch}
                />
                <NotificationRow
                    title="Proactive suggestions"
                    desc="Milo notices things worth your attention."
                    checked={settings?.proactiveSuggestions}
                    onChange={(v) => updateSettings({ proactiveSuggestions: v })}
                    switchSx={accentSwitch}
                />
            </Box>

            {/* Privacy */}
            <Box sx={section}>
                <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 0.3 }}>Privacy</Typography>
                <Typography sx={{ fontSize: 13, color: 'var(--text-secondary)', mb: 1.5 }}>
                    Your space stays yours.
                </Typography>
                <NotificationRow
                    title="Memory"
                    desc="Let Milo remember what you tell it. Manage memories in the Memory tab."
                    checked={settings?.memoryEnabled !== false}
                    onChange={(v) => updateSettings({ memoryEnabled: v })}
                    switchSx={accentSwitch}
                />
                <Divider sx={{ borderColor: 'var(--border)', my: 1.6 }} />
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', mb: 1.2 }}>
                    What Milo can access
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, mb: 1.8 }}>
                    {PERMISSIONS.map((perm) => (
                        <Box key={perm.title} sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start', py: 0.6 }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'var(--surface-soft)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2 }}>
                                <perm.icon size={14} />
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>{perm.title}</Typography>
                                <Typography sx={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{perm.detail}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: 'var(--info-soft)', display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <FiEye size={15} style={{ color: 'var(--info)', marginTop: 2, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                        Sensitive actions — sending email, deleting data, anything financial — will always require your explicit confirmation.
                    </Typography>
                </Box>
                <Divider sx={{ borderColor: 'var(--border)', my: 1.6 }} />
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', mb: 1.2 }}>Integrations</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' }, gap: 1.2 }}>
                    {INTEGRATIONS.map((int) => (
                        <Box key={int.name} sx={{ p: 1.5, borderRadius: '8px', border: '1px dashed var(--border-strong)', bgcolor: 'var(--surface-soft)', opacity: 0.75, minWidth: 0 }}>
                            <int.icon size={17} style={{ color: 'var(--text-secondary)', marginBottom: 8 }} />
                            <Typography sx={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{int.name}</Typography>
                            <Typography sx={{ fontSize: 11.5, color: 'var(--text-secondary)', mt: 0.2 }}>{int.desc}</Typography>
                            <Chip label="Coming soon" size="small" sx={{ mt: 1, height: 19, fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', bgcolor: 'var(--surface)', borderRadius: '4px' }} />
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Appearance */}
            <Box sx={section}>
                <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 0.3 }}>Appearance</Typography>
                <Typography sx={{ fontSize: 13, color: 'var(--text-secondary)', mb: 2 }}>
                    Choose how Milo looks on your screens.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {APPEARANCE_OPTIONS.map((opt) => {
                        const selected = mode === opt.id;
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
                                    gap: 0.7,
                                    px: 1.6,
                                    py: 1,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    border: selected ? '2px solid var(--accent)' : '2px solid var(--border)',
                                    bgcolor: selected ? 'var(--accent-soft)' : 'var(--surface)',
                                    transition: 'all 0.12s ease',
                                    '&:hover': { borderColor: 'var(--accent)' },
                                }}
                            >
                                <opt.icon size={15} style={{ color: selected ? 'var(--accent-deep)' : 'var(--text-secondary)' }} />
                                <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: selected ? 'var(--accent-deep)' : 'var(--ink-soft)' }}>
                                    {opt.label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            {/* Security */}
            <Box sx={section}>
                <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 0.3 }}>Security</Typography>
                <Typography sx={{ fontSize: 13, color: 'var(--text-secondary)', mb: 2 }}>
                    Keep your account safe. Changing your password signs out other sessions.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6, maxWidth: 440 }}>
                    <TextField
                        label="Current password"
                        type="password"
                        size="small"
                        value={pwd.current}
                        onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                        autoComplete="current-password"
                    />
                    <TextField
                        label="New password"
                        type="password"
                        size="small"
                        value={pwd.next}
                        onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                        helperText="At least 8 characters, with a letter and a number."
                        autoComplete="new-password"
                    />
                    <TextField
                        label="Confirm new password"
                        type="password"
                        size="small"
                        value={pwd.confirm}
                        onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                        autoComplete="new-password"
                    />
                    {pwdError && (
                        <Typography sx={{ fontSize: 12.5, color: 'var(--error)', fontWeight: 600 }}>{pwdError}</Typography>
                    )}
                    <Box>
                        <Button
                            variant="contained"
                            startIcon={<FiKey size={15} />}
                            disabled={!pwd.current || !pwd.next || !pwd.confirm || isChangingPwd}
                            onClick={handleChangePassword}
                        >
                            {isChangingPwd ? 'Updating…' : 'Change password'}
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Account actions */}
            <Box sx={section}>
                <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 1.6 }}>Account actions</Typography>
                <Box sx={{ display: 'flex', gap: 1.4, flexWrap: 'wrap' }}>
                    <Button variant="outlined" startIcon={<FiLogOut size={15} />} onClick={() => setLogoutOpen(true)} sx={{ color: 'var(--ink-soft)', borderColor: 'var(--border-strong)' }}>
                        Log out
                    </Button>
                    {DEMO_MODE && (
                        <Button variant="outlined" startIcon={<FiRefreshCw size={15} />} onClick={() => setResetOpen(true)} sx={{ color: 'var(--ink-soft)', borderColor: 'var(--border-strong)' }}>
                            Reset demo data
                        </Button>
                    )}
                    <Button variant="outlined" color="error" startIcon={<FiTrash2 size={15} />} onClick={() => setDeleteOpen(true)} sx={{ borderColor: 'var(--error)', color: 'var(--error)', '&:hover': { bgcolor: 'var(--error-soft)' } }}>
                        Delete account
                    </Button>
                </Box>
            </Box>

            {/* Dialogs */}
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
                    <Typography sx={{ fontSize: 13.5, color: 'var(--text-secondary)', mb: 2 }}>
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
                    <Typography sx={{ fontSize: 12.5, color: 'var(--error)', fontWeight: 600, mb: 1.6 }}>{delError}</Typography>
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
                message="Your data stays safely on this device. You can sign back in anytime."
                confirmText="Sign out"
                tone="warning"
            />
        </Box>
    );
};

const NotificationRow = ({ title, desc, checked, onChange, switchSx }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 1.1, minWidth: 0 }}>
        <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{title}</Typography>
            <Typography sx={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{desc}</Typography>
        </Box>
        <FormControlLabel
            control={<Switch checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} sx={switchSx} />}
            label=""
            sx={{ m: 0, flexShrink: 0 }}
        />
    </Box>
);

export default Settings;
