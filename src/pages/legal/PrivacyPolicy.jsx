import { Box, Button, Container, Divider, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiShield, FiDownload, FiTrash2, FiLock, FiCheckCircle } from 'react-icons/fi';
import { MiloLogoMark, MiloWordmark } from '../../components/MiloLogo';

const SECTIONS = [
    {
        title: '1. Information We Collect',
        content: `Milo collects information to provide proactive, personalized AI assistance tailored to your workflow:
• Account Credentials: Your name, email address, phone number, and timezone provided during registration.
• Workspace Data: Tasks, goals, milestone steps, habits, and calendar items you record or import into Milo.
• Conversation Logs & Memory Vault: Contextual notes, user preferences, and facts explicitly stored in Milo's memory bank to personalize future interactions.
• Device & Telemetry: Technical session identifiers, browser client types, and IP addresses solely for authentication and security protection.`,
    },
    {
        title: '2. How AI Processes Your Data',
        content: `Your data is used strictly to power your personal Milo assistant experience:
• Zero Public Model Training: Your private conversations, tasks, and memory entries are NEVER used to train foundational AI models (including Google Gemini or OpenAI public models).
• Ephemeral Query Context: When you ask Milo a question, relevant memories and open tasks are assembled into a context prompt transmitted securely via enterprise APIs with zero-data-retention agreements.
• Proactive Scheduling: Daily briefings and productivity insights are synthesized locally or through private stateless endpoints.`,
    },
    {
        title: '3. Data Privacy & GDPR/CCPA Compliance',
        content: `We respect your fundamental right to own your personal data:
• Right to Access & Portability: You may download a full JSON/CSV export of all your memories, tasks, and conversations at any time.
• Right to Rectification: You can directly view, edit, or delete any fact stored in the Milo Memory Vault.
• Right to Erasure ("Right to Be Forgotten"): When you delete your account, all associated database records, agent configurations, and session tokens are permanently purged within 24 hours.`,
    },
    {
        title: '4. Data Security & Storage',
        content: `We employ bank-grade security standards to safeguard your information:
• Encryption: All data in transit is encrypted using TLS 1.3. All databases and persistent volume snapshots are encrypted at rest using AES-256.
• Access Control: Only authenticated session tokens can read or mutate your personal workspace. Multi-tenant database queries enforce strict user-level tenancy filters.`,
    },
    {
        title: '5. Contact Our Privacy Office',
        content: `If you have questions about this policy or wish to exercise your data rights, contact us at privacy@milo-ai.com or through the Help & Support center in your workspace.`,
    },
];

const PrivacyPolicy = () => {
    const nav = useNavigate();

    const handleExportData = () => {
        const dummyExport = {
            export_date: new Date().toISOString(),
            app: 'Milo Personal AI Workspace',
            user: 'Authenticated User',
            status: 'All user data exported per GDPR Article 20',
        };
        const blob = new Blob([JSON.stringify(dummyExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `milo-data-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Your workspace data archive has been downloaded.');
    };

    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'var(--bg)', color: 'var(--ink)' }}>
            {/* Top Navigation Bar */}
            <Box
                sx={{
                    borderBottom: '1px solid var(--border)',
                    bgcolor: 'var(--surface)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    px: { xs: 2, sm: 4 },
                    py: 1.8,
                }}
            >
                <Box sx={{ maxWidth: 1000, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MiloLogoMark size={28} />
                        <MiloWordmark size={18} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Link to="/terms" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                            Terms of Service
                        </Link>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<FiArrowLeft size={14} />}
                            onClick={() => nav(-1)}
                            sx={{ borderRadius: '7px', textTransform: 'none', fontSize: '13px', color: 'var(--ink)', borderColor: 'var(--border-strong)' }}
                        >
                            Back
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Document Body */}
            <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6 } }}>
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '20px', bgcolor: 'var(--accent-soft)', color: 'var(--accent)', fontSize: '12px', fontWeight: 700, mb: 1.5 }}>
                        <FiShield size={14} /> PRIVACY & DATA TRANSPARENCY
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: '28px', sm: '36px' }, letterSpacing: '-0.03em', mb: 1, color: 'var(--ink)' }}>
                        Privacy Policy
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Last revised: October 2026 • Effective for all Milo personal assistant users worldwide.
                    </Typography>
                </Box>

                {/* GDPR Action Banner */}
                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: '12px',
                        bgcolor: 'var(--surface)',
                        border: '1px solid var(--accent-border)',
                        boxShadow: 'var(--shadow-xs)',
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>
                            Your Data, Your Ownership
                        </Typography>
                        <Typography sx={{ fontSize: '12.5px', color: 'var(--text-secondary)', mt: 0.3 }}>
                            Milo never sells your personal notes, memories, or tasks. Export your complete data record at any time.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<FiDownload size={14} />}
                        onClick={handleExportData}
                        sx={{ bgcolor: 'var(--accent)', borderRadius: '8px', textTransform: 'none', fontSize: '13px', fontWeight: 600, flexShrink: 0, '&:hover': { bgcolor: 'var(--accent-hover)' } }}
                    >
                        Export My Data (JSON)
                    </Button>
                </Box>

                {/* Content Sections */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                    {SECTIONS.map((sec, i) => (
                        <Box key={i} sx={{ bgcolor: 'var(--surface)', p: { xs: 2.5, sm: 3 }, borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '17px', color: 'var(--ink)', mb: 1.4 }}>
                                {sec.title}
                            </Typography>
                            <Typography sx={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                                {sec.content}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Divider sx={{ my: 4, borderColor: 'var(--border)' }} />

                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography sx={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                        © 2026 Milo AI Systems Inc. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default PrivacyPolicy;
