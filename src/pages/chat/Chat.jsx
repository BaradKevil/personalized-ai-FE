import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { FiEdit2, FiPlus, FiTrash2, FiZap } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import ChatInput from '../../components/ChatInput';
import ChatMessage from '../../components/ChatMessage';
import ConversationList from '../../components/ConversationList';
import MiloCore from '../../components/milo/MiloCore';
import CustomModal from '../../common/custom/CustomModal';
import CustomInput from '../../common/custom/CustomInput';
import { ConfirmDialog } from '../../models/AllModels';
import { streamReply } from '../../utils/demoAi';
import {
    useAgent,
    useConversations,
    useCreateConversation,
    useDeleteConversation,
    useDeleteMessage,
    useEditMessage,
    useFinishMessage,
    useMessages,
    useRegenerate,
    useRenameConversation,
    useSendMessage,
    useUserProfile,
} from '../../Api/Api';

const SUGGESTIONS = [
    { label: 'Plan my day', prompt: 'Plan my day based on current priorities and tasks' },
    { label: 'Review my tasks', prompt: 'Review all my open tasks and highlight urgent items' },
    { label: 'Help me focus', prompt: 'Help me do a 25-minute deep focus sprint on my key goal' },
    { label: "What's important today?", prompt: "What are the most critical deliverables on my agenda today?" },
];

const apiErrorMessage = (error, fallback) => {
    const serverMessage = error?.response?.data?.message;
    return typeof serverMessage === 'string' && serverMessage.trim() ? serverMessage : fallback;
};

const Chat = () => {
    const { conversationId } = useParams();
    const nav = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const ask = searchParams.get('ask');

    const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
    const { data: messages = [] } = useMessages(conversationId);
    const { data: agent } = useAgent();
    const { data: user } = useUserProfile();

    const [streaming, setStreaming] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [renameTarget, setRenameTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteMsgTarget, setDeleteMsgTarget] = useState(null);

    const inputRef = useRef(null);
    const scrollRef = useRef(null);
    const handledAsk = useRef(false);

    const { mutate: createMutate } = useCreateConversation((data) => {
        const id = data?.data?.id || data?.id || data?._id;
        if (id) nav({ pathname: `/app/chat/${id}`, search: searchParams.toString() });
    });
    const { mutate: renameMutate } = useRenameConversation(undefined, () => toast.error("Couldn't rename that."));
    const { mutate: deleteConvMutate } = useDeleteConversation(undefined, () => toast.error("Couldn't delete that."));
    const { mutateAsync: finishMutate } = useFinishMessage(conversationId);
    const { mutate: editMutate } = useEditMessage(conversationId, () => toast.success('Message updated.'));
    const { mutate: deleteMsgMutate } = useDeleteMessage(conversationId, () => toast.success('Message deleted.'));

    const startStream = async (raw) => {
        const text = typeof raw === 'string' ? raw.trim() : '';
        if (!text) {
            setStreaming(false);
            setStreamingText('');
            return;
        }
        setStreaming(true);
        setStreamingText('');
        await streamReply(text, (chunk) => setStreamingText((prev) => prev + chunk));
        await finishMutate(text);
        setStreaming(false);
        setStreamingText('');
    };

    const { mutate: sendMutate, isPending: isSending } = useSendMessage(
        conversationId,
        (data) => {
            startStream(data.reply.text);
        },
        (error) => toast.error(apiErrorMessage(error, "Couldn't reach Milo right now. Please try again."))
    );

    const { mutate: regenMutate } = useRegenerate(
        conversationId,
        (data) => {
            startStream(data.reply.text);
        },
        (error) => toast.error(apiErrorMessage(error, "Couldn't reach Milo right now. Please try again."))
    );

    const current = conversations.find((c) => String(c.id) === String(conversationId));

    useEffect(() => {
        if (conversationId || conversationsLoading) return;
        if (conversations.length === 0) {
            createMutate('New conversation');
        } else {
            nav({ pathname: `/app/chat/${conversations[0].id}`, search: searchParams.toString() }, { replace: true });
        }
    }, [conversationId, conversations, conversationsLoading]);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages.length, streamingText, streaming]);

    useEffect(() => {
        const onKey = (e) => {
            const tag = e.target?.tagName;
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(tag) && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        if (ask && ask !== handledAsk.current && conversationId && !streaming) {
            handledAsk.current = ask;
            sendMutate(ask);
            setSearchParams({}, { replace: true });
        }
    }, [ask, conversationId, streaming]);

    const handleSend = (content) => {
        if (streaming || !conversationId) return;
        sendMutate(content);
    };

    const handleCopy = (content) => {
        navigator.clipboard
            ?.writeText(content)
            .then(() => toast.success('Copied to clipboard.'))
            .catch(() => toast.error('Could not copy.'));
    };

    const confirmDeleteConversation = () => {
        if (!deleteTarget) return;
        deleteConvMutate(deleteTarget.id, {
            onSuccess: () => {
                toast.success('Conversation deleted.');
                const remaining = conversations.filter((c) => c.id !== deleteTarget.id);
                setDeleteTarget(null);
                if (deleteTarget.id === conversationId) {
                    nav(remaining.length ? `/app/chat/${remaining[0].id}` : '/app/chat');
                }
            },
        });
    };

    const hasUserMessages = messages.some((m) => m.role === 'user');

    return (
        <Box
            sx={{
                display: 'flex',
                height: 'calc(100dvh - var(--nav-height) - 48px)',
                minHeight: 460,
                maxWidth: 1280,
                mx: 'auto',
                bgcolor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
            }}
        >
            {/* Thread list sidebar — desktop */}
            <Box
                sx={{
                    width: 280,
                    flexShrink: 0,
                    borderRight: '1px solid var(--border)',
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    bgcolor: 'var(--surface)',
                }}
            >
                <ConversationList
                    conversations={conversations}
                    activeId={conversationId}
                    onSelect={(id) => nav(`/app/chat/${id}`)}
                    onNew={() => createMutate('New conversation')}
                    onRename={(conv) => setRenameTarget(conv)}
                    onDelete={(conv) => setDeleteTarget(conv)}
                />
            </Box>

            {/* Chat conversation area */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'var(--bg)' }}>
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: { xs: 2, sm: 2.5 },
                        py: 1.4,
                        borderBottom: '1px solid var(--border)',
                        bgcolor: 'var(--surface)',
                    }}
                >
                    <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <MiloCore state={streaming ? 'thinking' : 'idle'} size={32} />
                        <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {current?.title || 'New conversation'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: streaming ? 'var(--accent)' : 'var(--success)' }} />
                                <Typography sx={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                                    {streaming ? `${agent?.name || 'Milo'} is formulating…` : `${agent?.name || 'Milo'} • Active`}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <Tooltip title="New chat">
                            <IconButton
                                size="small"
                                onClick={() => createMutate('New conversation')}
                                aria-label="New chat"
                                sx={{ color: 'var(--text-secondary)', borderRadius: '6px', '&:hover': { color: 'var(--ink)' } }}
                            >
                                <FiPlus size={16} />
                            </IconButton>
                        </Tooltip>
                        {current && (
                            <>
                                <Tooltip title="Rename conversation">
                                    <IconButton
                                        size="small"
                                        onClick={() => setRenameTarget(current)}
                                        aria-label="Rename conversation"
                                        sx={{ color: 'var(--text-secondary)', borderRadius: '6px', '&:hover': { color: 'var(--ink)' } }}
                                    >
                                        <FiEdit2 size={14} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete conversation">
                                    <IconButton
                                        size="small"
                                        onClick={() => setDeleteTarget(current)}
                                        aria-label="Delete conversation"
                                        sx={{ color: 'var(--text-secondary)', borderRadius: '6px', '&:hover': { color: 'var(--error)' } }}
                                    >
                                        <FiTrash2 size={14} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Box>
                </Box>

                {/* Messages stream viewport */}
                <Box ref={scrollRef} sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 0, py: 2 }}>
                    {messages.length === 0 && !streaming ? (
                        <Box sx={{ textAlign: 'center', py: { xs: 5, md: 8 }, px: 2, maxWidth: 540, mx: 'auto' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <MiloCore state="idle" size={60} />
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: { xs: '20px', sm: '24px' }, letterSpacing: '-0.02em', mb: 0.8, color: 'var(--ink)' }}>
                                What can {agent?.name || 'Milo'} help you with?
                            </Typography>
                            <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, mb: 3 }}>
                                Ask questions, formulate plans, review deadlines, or analyze your habits. Your conversation is remembered in context.
                            </Typography>

                            {/* Suggestion prompt cards */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.2, textAlign: 'left' }}>
                                {SUGGESTIONS.map((s) => (
                                    <Box
                                        key={s.label}
                                        component="button"
                                        onClick={() => handleSend(s.prompt)}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: '10px',
                                            bgcolor: 'var(--surface)',
                                            border: '1px solid var(--border)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.15s ease',
                                            '&:hover': {
                                                borderColor: 'var(--accent-border)',
                                                bgcolor: 'var(--surface-hover)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: 'var(--shadow-sm)',
                                            },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: 'var(--accent)', mb: 0.4 }}>
                                            <HiSparkles size={13} />
                                            <Typography sx={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)' }}>
                                                {s.label}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                            {s.prompt}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ) : (
                        messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                message={msg}
                                agent={agent}
                                user={user}
                                onCopy={handleCopy}
                                onEdit={(id, content) => editMutate({ id, content })}
                                onRegenerate={() => {
                                    if (!streaming) regenMutate();
                                }}
                                onDelete={(id) => setDeleteMsgTarget(id)}
                            />
                        ))
                    )}

                    {streaming && (
                        <ChatMessage
                            message={null}
                            agent={agent}
                            user={user}
                            isStreaming
                            streamingText={streamingText}
                            onCopy={handleCopy}
                            onEdit={() => {}}
                            onRegenerate={() => {}}
                            onDelete={() => {}}
                        />
                    )}
                </Box>

                {/* Suggestions chips row for active chats */}
                {!hasUserMessages && !streaming && (
                    <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', px: { xs: 1.5, sm: 2.5 }, pb: 0.5 }}>
                        {SUGGESTIONS.map((s) => (
                            <Box
                                key={s.label}
                                component="button"
                                type="button"
                                onClick={() => handleSend(s.prompt)}
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 1.2,
                                    py: 0.5,
                                    borderRadius: '99px',
                                    bgcolor: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    fontSize: '11.5px',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.12s ease',
                                    '&:hover': {
                                        borderColor: 'var(--accent-border)',
                                        color: 'var(--accent)',
                                        bgcolor: 'var(--accent-soft)',
                                    },
                                }}
                            >
                                <FiZap size={11} style={{ color: 'var(--accent)' }} />
                                <span>{s.label}</span>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Composer */}
                <ChatInput
                    onSubmit={handleSend}
                    disabled={streaming || isSending}
                    inputRef={inputRef}
                    placeholder={`Message ${agent?.name || 'Milo'}…`}
                />
            </Box>

            {/* Rename Modal */}
            {renameTarget && (
                <RenameDialog
                    open
                    initial={renameTarget.title}
                    onClose={() => setRenameTarget(null)}
                    onSave={(title) => {
                        renameMutate({ id: renameTarget.id, title });
                        toast.success('Renamed conversation.');
                        setRenameTarget(null);
                    }}
                />
            )}

            {/* Delete conversation confirmation */}
            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDeleteConversation}
                title="Delete this conversation?"
                message={`"${deleteTarget?.title || ''}" and its associated messages will be removed permanently.`}
                confirmText="Delete"
            />

            {/* Delete message confirmation */}
            <ConfirmDialog
                open={Boolean(deleteMsgTarget)}
                onClose={() => setDeleteMsgTarget(null)}
                onConfirm={() => {
                    deleteMsgMutate(deleteMsgTarget);
                    setDeleteMsgTarget(null);
                }}
                title="Delete this message?"
                message="This removes the message from the conversation transcript."
                confirmText="Delete"
            />
        </Box>
    );
};

const RenameDialog = ({ open, initial, onClose, onSave }) => {
    const [value, setValue] = useState(initial);

    return (
        <CustomModal open={open} onClose={onClose} title="Rename Conversation">
            <CustomInput
                label="Conversation Title"
                name="title"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && value.trim()) onSave(value.trim());
                }}
            />
            <Box sx={{ display: 'flex', gap: 1.2, mt: 2.4, justifyContent: 'flex-end' }}>
                <Button variant="outlined" size="small" onClick={onClose} sx={{ borderRadius: '8px' }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    disabled={!value.trim()}
                    onClick={() => onSave(value.trim())}
                    sx={{ borderRadius: '8px', bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-hover)' } }}
                >
                    Save
                </Button>
            </Box>
        </CustomModal>
    );
};

export default Chat;
