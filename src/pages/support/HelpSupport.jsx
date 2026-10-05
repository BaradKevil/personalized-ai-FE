import { useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Container,
    Divider,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FiArrowLeft,
    FiChevronDown,
    FiHelpCircle,
    FiMail,
    FiMessageSquare,
    FiSend,
    FiCheckCircle,
    FiExternalLink,
} from 'react-icons/fi';
import { MiloLogoMark, MiloWordmark } from '../../components/MiloLogo';
import CustomSelect from '../../common/custom/CustomSelect';

const FAQS = [
    {
        q: 'How does Milo learn my personal preferences and habits?',
        a: "Milo extracts notable facts, recurring schedule constraints, and working preferences from your conversations and explicitly stored items in your Memory Vault. You can view, edit, or delete any memory Milo retains at any time from Settings > Memory.",
    },
    {
        q: 'How does the Task & Goal breakdown feature work?',
        a: "When you share a high-level goal (e.g. 'Launch marketing campaign by Friday'), Milo analyzes the requirements, identifies dependencies, and converts it into actionable task steps scheduled across your agenda.",
    },
    {
        q: 'Are my private conversations used to train AI models?',
        a: "No. Milo utilizes enterprise zero-data-retention APIs (such as Google Gemini Flash and Vertex AI). Your private messages and tasks are never incorporated into public foundational model training datasets.",
    },
    {
        q: 'How do I connect Google Calendar or Notion?',
        a: "Navigate to Settings > Integrations tab. Select 'Connect Account' on Google Calendar or Notion and authorize permissions. Milo will automatically synchronize focus blocks and agendas.",
    },
    {
        q: 'What happens when I reach my monthly AI token quota?',
        a: "Free accounts receive 50 AI queries daily. Pro accounts include 25,000 monthly reasoning queries with automatic grace protection. You can monitor your current usage anytime under Settings > Billing.",
    },
    {
        q: 'How can I completely delete all my stored data?',
        a: "Under Settings > Security > Account Actions, select 'Delete Account'. All your tasks, goals, conversation logs, and memory vault items are permanently wiped from our databases.",
    },
];

const TICKET_CATEGORIES = [
    { value: 'general', label: 'General Question' },
    { value: 'bug', label: 'Report a Bug' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'billing', label: 'Billing & Subscription' },
    { value: 'integrations', label: 'Integrations Support' },
];

const HelpSupport = () => {
    const nav = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('general');
    const [ticketMessage, setTicketMessage] = useState('');
    const [ticketEmail, setTicketEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedTicketId, setSubmittedTicketId] = useState(null);

    const filteredFaqs = FAQS.filter(
        (f) =>
            f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmitTicket = (e) => {
        e.preventDefault();
        if (!ticketMessage.trim()) {
            toast.error('Please enter a description of your issue or question.');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            const ticketId = `MLO-${Math.floor(100000 + Math.random() * 900000)}`;
            setSubmittedTicketId(ticketId);
            setIsSubmitting(false);
            toast.success(`Support ticket ${ticketId} created!`);
        }, 700);
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
                        <Link to="/changelog" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                            Changelog
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
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.4, py: 0.5, borderRadius: '20px', bgcolor: 'var(--accent-soft)', color: 'var(--accent)', fontSize: '12px', fontWeight: 700, mb: 1.5 }}>
                        <FiHelpCircle size={14} /> HELP CENTER & KNOWLEDGE BASE
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: '28px', sm: '36px' }, letterSpacing: '-0.03em', mb: 1, color: 'var(--ink)' }}>
                        How can we assist you?
                    </Typography>
                    <Typography sx={{ fontSize: '14.5px', color: 'var(--text-secondary)', maxWidth: 520, mx: 'auto' }}>
                        Find answers to common questions about Milo AI features, data security, and workspace settings.
                    </Typography>

                    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 3 }}>
                        <TextField
                            placeholder="Search questions (e.g. memory, calendar, billing)…"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            fullWidth
                            sx={{
                                bgcolor: 'var(--surface)',
                                borderRadius: '10px',
                                '& .MuiOutlinedInput-root': { borderRadius: '10px' },
                            }}
                        />
                    </Box>
                </Box>

                {/* FAQs */}
                <Box sx={{ mb: 6 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '18px', color: 'var(--ink)', mb: 2 }}>
                        Frequently Asked Questions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {filteredFaqs.map((faq, i) => (
                            <Accordion
                                key={i}
                                disableGutters
                                elevation={0}
                                sx={{
                                    bgcolor: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '10px !important',
                                    '&:before': { display: 'none' },
                                    overflow: 'hidden',
                                }}
                            >
                                <AccordionSummary expandIcon={<FiChevronDown size={18} />}>
                                    <Typography sx={{ fontWeight: 600, fontSize: '14.5px', color: 'var(--ink)' }}>
                                        {faq.q}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                                    <Typography sx={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                                        {faq.a}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </Box>

                {/* Submit Ticket Card */}
                <Box
                    sx={{
                        p: { xs: 2.5, sm: 3.5 },
                        borderRadius: '14px',
                        bgcolor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-xs)',
                    }}
                >
                    {submittedTicketId ? (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Box
                                sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: '50%',
                                    bgcolor: 'var(--success-soft)',
                                    color: 'var(--success)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 2,
                                }}
                            >
                                <FiCheckCircle size={28} />
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '20px', color: 'var(--ink)', mb: 0.8 }}>
                                Ticket Submitted Successfully
                            </Typography>
                            <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', mb: 2 }}>
                                Your reference ID is <strong>{submittedTicketId}</strong>. Our engineering & support team will respond within 24 hours.
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    setSubmittedTicketId(null);
                                    setTicketMessage('');
                                }}
                                sx={{ borderRadius: '8px', textTransform: 'none' }}
                            >
                                Submit Another Request
                            </Button>
                        </Box>
                    ) : (
                        <form onSubmit={handleSubmitTicket}>
                            <Typography sx={{ fontWeight: 700, fontSize: '18px', color: 'var(--ink)', mb: 0.5 }}>
                                Contact Our Support Team
                            </Typography>
                            <Typography sx={{ fontSize: '13px', color: 'var(--text-secondary)', mb: 3 }}>
                                Have a question that isn't answered above? Reach out and we'll get right back to you.
                            </Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                                <CustomSelect
                                    label="Category"
                                    name="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    options={TICKET_CATEGORIES}
                                />
                                <TextField
                                    label="Your Contact Email"
                                    size="small"
                                    placeholder="you@domain.com"
                                    value={ticketEmail}
                                    onChange={(e) => setTicketEmail(e.target.value)}
                                    fullWidth
                                />
                            </Box>

                            <Box sx={{ mb: 2.5 }}>
                                <TextField
                                    label="Describe your inquiry or issue"
                                    size="small"
                                    multiline
                                    minRows={4}
                                    maxRows={8}
                                    value={ticketMessage}
                                    onChange={(e) => setTicketMessage(e.target.value)}
                                    placeholder="Include as much detail as possible so we can help quickly..."
                                    fullWidth
                                />
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={isSubmitting}
                                startIcon={<FiSend size={15} />}
                                sx={{
                                    bgcolor: 'var(--accent)',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '13.5px',
                                    textTransform: 'none',
                                    py: 1.1,
                                    px: 3,
                                    '&:hover': { bgcolor: 'var(--accent-hover)' },
                                }}
                            >
                                {isSubmitting ? 'Sending Ticket…' : 'Submit Support Request'}
                            </Button>
                        </form>
                    )}
                </Box>

                <Divider sx={{ my: 4, borderColor: 'var(--border)' }} />

                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography sx={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                        © 2026 Milo AI Systems Inc. • Direct support: support@milo-ai.com
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default HelpSupport;
