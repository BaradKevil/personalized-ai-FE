import { useState } from 'react';
import {
    Box,
    Button,
    Card,
    Chip,
    Container,
    LinearProgress,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FiArrowRight,
    FiArrowLeft,
    FiCheck,
    FiClock,
    FiCompass,
    FiUser,
    FiZap,
} from 'react-icons/fi';
import { MiloLogoMark, MiloWordmark } from '../../components/MiloLogo';
import MiloCore from '../../components/milo/MiloCore';
import AgentAvatar from '../../components/AgentAvatar';
import { AVATAR_OPTIONS } from '../../utils/constants';
import { useUpdateUserProfile, useUpdateAgent, useUpdateSettings, useUserProfile } from '../../Api/Api';

const FOCUS_AREAS = [
    'Deep Work & Focus Blocks',
    'Goal & Milestone Breakdown',
    'Daily Schedule & Calendar Sync',
    'Habit Streaks & Routines',
    'Meeting Notes & Task Extraction',
    'Inbox & Communication Management',
];

const TONES = [
    {
        id: 'concise',
        title: 'Concise & Direct',
        desc: 'Short, actionable bullet points without conversational fluff. Perfect for fast execution.',
    },
    {
        id: 'analytical',
        title: 'Strategic & Analytical',
        desc: 'Explores trade-offs, asks clarifying questions, and identifies hidden blockers.',
    },
    {
        id: 'supportive',
        title: 'Encouraging & Accountable',
        desc: 'Warm and proactive accountability partner that celebrates completed milestones.',
    },
];

const Onboarding = () => {
    const nav = useNavigate();
    const { data: user } = useUserProfile();
    const { mutate: updateUser } = useUpdateUserProfile();
    const { mutate: updateAgent } = useUpdateAgent();
    const { mutate: updateSettings } = useUpdateSettings();

    const [step, setStep] = useState(1);
    const [name, setName] = useState(user?.name || '');
    const [role, setRole] = useState('Productivity Enthusiast');
    const [workHours, setWorkHours] = useState('9:00 AM – 6:00 PM');
    const [selectedFocus, setSelectedFocus] = useState([
        'Deep Work & Focus Blocks',
        'Goal & Milestone Breakdown',
    ]);
    const [selectedTone, setSelectedTone] = useState('concise');
    const [selectedAvatar, setSelectedAvatar] = useState('orb');

    const toggleFocus = (item) => {
        setSelectedFocus((prev) =>
            prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
        );
    };

    const handleFinish = () => {
        updateUser({ name: name || user?.name });
        updateAgent({
            avatar: selectedAvatar,
            personality: `Primary focus: ${selectedFocus.join(', ')}. Preferred interaction style: ${selectedTone}.`,
        });
        updateSettings({ dailyBriefing: true, inAppNotifications: true });
        toast.success('Your personalized Milo workspace is ready!');
        nav('/app');
    };

    const progressValue = ((step - 1) / 2) * 100;

    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'var(--bg)', color: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: '1px solid var(--border)', bgcolor: 'var(--surface)' }}>
                <Box sx={{ maxWidth: 760, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MiloLogoMark size={28} />
                        <MiloWordmark size={18} />
                    </Box>
                    <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        Step {step} of 3
                    </Typography>
                </Box>
            </Box>

            {/* Progress Bar */}
            <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                    height: 3,
                    bgcolor: 'var(--border)',
                    '& .MuiLinearProgress-bar': { bgcolor: 'var(--accent)' },
                }}
            />

            {/* Main Content Area */}
            <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 7 }, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {step === 1 && (
                    <Box>
                        <Box sx={{ textAlign: 'center', mb: 3.5 }}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    bgcolor: 'var(--accent-soft)',
                                    color: 'var(--accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 1.5,
                                }}
                            >
                                <FiUser size={22} />
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '26px', letterSpacing: '-0.03em', mb: 0.8, color: 'var(--ink)' }}>
                                Welcome to Milo
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                Let’s personalize your workspace in less than two minutes.
                            </Typography>
                        </Box>

                        <Box sx={{ bgcolor: 'var(--surface)', p: { xs: 2.5, sm: 3.5 }, borderRadius: '14px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
                            <Box sx={{ mb: 2.2 }}>
                                <TextField
                                    label="What should Milo call you?"
                                    size="small"
                                    placeholder="Your preferred name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                />
                            </Box>

                            <Box sx={{ mb: 2.2 }}>
                                <TextField
                                    label="What is your primary role or focus?"
                                    size="small"
                                    placeholder="e.g. Founder, Developer, Designer, Student"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    fullWidth
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    label="Standard Work Hours"
                                    size="small"
                                    placeholder="e.g. 9:00 AM – 6:00 PM"
                                    value={workHours}
                                    onChange={(e) => setWorkHours(e.target.value)}
                                    helperText="Milo will schedule morning briefings and deep work slots during these hours."
                                    fullWidth
                                />
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={() => setStep(2)}
                                endIcon={<FiArrowRight size={16} />}
                                sx={{
                                    bgcolor: 'var(--accent)',
                                    borderRadius: '8px',
                                    py: 1.2,
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    '&:hover': { bgcolor: 'var(--accent-hover)' },
                                }}
                            >
                                Continue to Priorities
                            </Button>
                        </Box>
                    </Box>
                )}

                {step === 2 && (
                    <Box>
                        <Box sx={{ textAlign: 'center', mb: 3.5 }}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    bgcolor: 'var(--accent-soft)',
                                    color: 'var(--accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 1.5,
                                }}
                            >
                                <FiCompass size={22} />
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '26px', letterSpacing: '-0.03em', mb: 0.8, color: 'var(--ink)' }}>
                                What are your productivity priorities?
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                Select the areas where you'd like Milo to be most proactive.
                            </Typography>
                        </Box>

                        <Box sx={{ bgcolor: 'var(--surface)', p: { xs: 2.5, sm: 3.5 }, borderRadius: '14px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 3 }}>
                                {FOCUS_AREAS.map((item) => {
                                    const selected = selectedFocus.includes(item);
                                    return (
                                        <Box
                                            key={item}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => toggleFocus(item)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') toggleFocus(item);
                                            }}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                p: 1.6,
                                                borderRadius: '8px',
                                                border: '1.5px solid',
                                                borderColor: selected ? 'var(--accent)' : 'var(--border)',
                                                bgcolor: selected ? 'var(--accent-soft)' : 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                                '&:hover': { borderColor: 'var(--accent)' },
                                            }}
                                        >
                                            <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: selected ? 'var(--accent-deep)' : 'var(--ink)' }}>
                                                {item}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '4px',
                                                    border: '1.5px solid',
                                                    borderColor: selected ? 'var(--accent)' : 'var(--border-strong)',
                                                    bgcolor: selected ? 'var(--accent)' : 'transparent',
                                                    color: '#FFFFFF',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {selected && <FiCheck size={13} strokeWidth={3} />}
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setStep(1)}
                                    startIcon={<FiArrowLeft size={15} />}
                                    sx={{ borderRadius: '8px', py: 1.1, color: 'var(--ink)', borderColor: 'var(--border-strong)' }}
                                >
                                    Back
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => setStep(3)}
                                    endIcon={<FiArrowRight size={16} />}
                                    sx={{
                                        bgcolor: 'var(--accent)',
                                        borderRadius: '8px',
                                        py: 1.1,
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        '&:hover': { bgcolor: 'var(--accent-hover)' },
                                    }}
                                >
                                    Configure Milo
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}

                {step === 3 && (
                    <Box>
                        <Box sx={{ textAlign: 'center', mb: 3.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
                                <MiloCore size={56} state="thinking" />
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '26px', letterSpacing: '-0.03em', mb: 0.8, color: 'var(--ink)' }}>
                                Choose Milo’s Persona
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                Fine-tune how your AI thinks and communicates with you.
                            </Typography>
                        </Box>

                        <Box sx={{ bgcolor: 'var(--surface)', p: { xs: 2.5, sm: 3.5 }, borderRadius: '14px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
                            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', mb: 1.2 }}>
                                Interaction Style
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 3 }}>
                                {TONES.map((tone) => {
                                    const selected = selectedTone === tone.id;
                                    return (
                                        <Box
                                            key={tone.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => setSelectedTone(tone.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') setSelectedTone(tone.id);
                                            }}
                                            sx={{
                                                p: 1.6,
                                                borderRadius: '8px',
                                                border: '1.5px solid',
                                                borderColor: selected ? 'var(--accent)' : 'var(--border)',
                                                bgcolor: selected ? 'var(--accent-soft)' : 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                                '&:hover': { borderColor: 'var(--accent)' },
                                            }}
                                        >
                                            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: selected ? 'var(--accent-deep)' : 'var(--ink)' }}>
                                                {tone.title}
                                            </Typography>
                                            <Typography sx={{ fontSize: '12px', color: 'var(--text-secondary)', mt: 0.3 }}>
                                                {tone.desc}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>

                            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', mb: 1.2 }}>
                                Avatar Appearance
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1.2, mb: 3 }}>
                                {AVATAR_OPTIONS.map((opt) => {
                                    const selected = selectedAvatar === opt.id;
                                    return (
                                        <Box
                                            key={opt.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => setSelectedAvatar(opt.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') setSelectedAvatar(opt.id);
                                            }}
                                            sx={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                p: 1.2,
                                                borderRadius: '8px',
                                                border: '1.5px solid',
                                                borderColor: selected ? 'var(--accent)' : 'var(--border)',
                                                bgcolor: selected ? 'var(--accent-soft)' : 'transparent',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <AgentAvatar avatar={opt.id} color={opt.color} size={32} />
                                            <Typography sx={{ fontSize: '11px', fontWeight: 600, mt: 0.5, color: selected ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                                {opt.label}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setStep(2)}
                                    startIcon={<FiArrowLeft size={15} />}
                                    sx={{ borderRadius: '8px', py: 1.1, color: 'var(--ink)', borderColor: 'var(--border-strong)' }}
                                >
                                    Back
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleFinish}
                                    sx={{
                                        bgcolor: 'var(--accent)',
                                        borderRadius: '8px',
                                        py: 1.1,
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        '&:hover': { bgcolor: 'var(--accent-hover)' },
                                    }}
                                >
                                    Launch Workspace
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Onboarding;
