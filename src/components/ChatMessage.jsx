import { useState } from 'react';
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { FiCopy, FiEdit2, FiRefreshCw, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import AgentAvatar from './AgentAvatar';
import { renderMarkdown } from '../utils/markdown';
import { formatRelative } from '../utils/date';

const ChatMessage = ({
    message,
    agent,
    user,
    isStreaming = false,
    streamingText = '',
    onCopy,
    onEdit,
    onRegenerate,
    onDelete,
}) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(message?.content || '');
    const [copied, setCopied] = useState(false);

    const content = isStreaming ? streamingText : message?.content || '';
    const isUser = message?.role === 'user';

    const saveEdit = () => {
        if (draft.trim() && draft !== message.content) {
            onEdit?.(message.id, draft.trim());
        }
        setEditing(false);
    };

    const handleCopyClick = () => {
        if (onCopy) {
            onCopy(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        }
    };

    const actionBtnSx = {
        width: 28,
        height: 28,
        borderRadius: '6px',
        color: 'var(--text-muted)',
        transition: 'all 0.12s ease',
        '&:hover': { color: 'var(--ink)', bgcolor: 'var(--surface-soft)' },
    };

    return (
        <Box
            className="milo-rise"
            sx={{
                display: 'flex',
                gap: { xs: 1.2, sm: 1.8 },
                px: { xs: 1, sm: 2 },
                py: 1.4,
                position: 'relative',
                '&:hover .msg-actions': { opacity: 1, visibility: 'visible' },
            }}
        >
            {/* Avatar */}
            <Box sx={{ mt: 0.3, flexShrink: 0, display: 'flex' }}>
                {isUser ? (
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: user?.avatarColor || 'var(--accent)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 700,
                        }}
                    >
                        {(user?.name || 'Y')[0].toUpperCase()}
                    </Box>
                ) : (
                    <Box
                        className={isStreaming ? 'glow-pulse' : undefined}
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            bgcolor: 'var(--surface)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <AgentAvatar avatar={agent?.avatar} color={agent?.color} size={20} />
                    </Box>
                )}
            </Box>

            {/* Message Body */}
            <Box sx={{ maxWidth: { xs: '88%', sm: '82%', md: '78%' }, minWidth: 0, flexGrow: 1 }}>
                {/* Meta Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)' }}>
                        {isUser ? user?.name?.split(' ')[0] || 'You' : agent?.name || 'Milo AI'}
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {isStreaming ? 'typing…' : message ? formatRelative(message.createdAt) : ''}
                    </Typography>
                </Box>

                {/* Content Bubble */}
                <Box
                    sx={{
                        borderRadius: '12px',
                        bgcolor: isUser ? 'var(--accent)' : 'var(--surface)',
                        color: isUser ? '#FFFFFF' : 'var(--ink)',
                        border: isUser ? 'none' : '1px solid var(--border)',
                        px: { xs: 2, sm: 2.2 },
                        py: 1.4,
                        fontSize: '13.5px',
                        lineHeight: 1.65,
                        boxShadow: isUser ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
                        wordBreak: 'break-word',
                        '& p': { m: 0, '& + p': { mt: 1 } },
                        '& ul, & ol': { pl: 2.5, my: 0.8 },
                        '& li': { my: 0.3 },
                        '& pre': {
                            overflowX: 'auto',
                            p: 1.5,
                            borderRadius: '8px',
                            bgcolor: isUser ? 'rgba(0,0,0,0.25)' : 'var(--surface-soft)',
                            border: isUser ? 'none' : '1px solid var(--border)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12.5px',
                            my: 1,
                        },
                        '& code': {
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            px: 0.6,
                            py: 0.2,
                            borderRadius: '4px',
                            bgcolor: isUser ? 'rgba(255,255,255,0.2)' : 'var(--surface-soft)',
                        },
                        '& a': {
                            color: isUser ? '#FFFFFF' : 'var(--accent)',
                            textDecoration: 'underline',
                        },
                    }}
                >
                    {editing ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <TextField
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                multiline
                                minRows={2}
                                maxRows={8}
                                size="small"
                                autoFocus
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'var(--surface)',
                                        borderRadius: '8px',
                                        fontSize: '13.5px',
                                    },
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 0.8, justifyContent: 'flex-end' }}>
                                <IconButton size="small" onClick={() => setEditing(false)} aria-label="Cancel edit" sx={actionBtnSx}>
                                    <FiX size={14} />
                                </IconButton>
                                <IconButton size="small" onClick={saveEdit} aria-label="Save edit" sx={{ ...actionBtnSx, color: 'var(--success)' }}>
                                    <FiCheck size={14} />
                                </IconButton>
                            </Box>
                        </Box>
                    ) : (
                        <div>{renderMarkdown(content)}</div>
                    )}

                    {isStreaming && (
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', mt: 1 }}>
                            {[0, 1, 2].map((i) => (
                                <Box
                                    key={i}
                                    className="milo-typing-dot"
                                    sx={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: '50%',
                                        bgcolor: isUser ? 'rgba(255,255,255,0.8)' : 'var(--accent)',
                                        animationDelay: `${i * 0.18}s`,
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>

                {/* Floating Actions on Hover */}
                {!isStreaming && message && (
                    <Box
                        className="msg-actions"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.3,
                            mt: 0.5,
                            opacity: { xs: 1, md: 0 },
                            visibility: { xs: 'visible', md: 'hidden' },
                            transition: 'opacity 0.15s ease, visibility 0.15s ease',
                        }}
                    >
                        <Tooltip title={copied ? 'Copied!' : 'Copy'}>
                            <IconButton size="small" onClick={handleCopyClick} aria-label="Copy message" sx={actionBtnSx}>
                                {copied ? <FiCheck size={13} style={{ color: 'var(--success)' }} /> : <FiCopy size={13} />}
                            </IconButton>
                        </Tooltip>

                        {!isUser && (
                            <Tooltip title="Regenerate reply">
                                <IconButton size="small" onClick={() => onRegenerate(message.id)} aria-label="Regenerate reply" sx={actionBtnSx}>
                                    <FiRefreshCw size={13} />
                                </IconButton>
                            </Tooltip>
                        )}

                        {isUser && (
                            <Tooltip title="Edit message">
                                <IconButton size="small" onClick={() => setEditing(true)} aria-label="Edit message" sx={actionBtnSx}>
                                    <FiEdit2 size={13} />
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                onClick={() => onDelete(message.id)}
                                aria-label="Delete message"
                                sx={{ ...actionBtnSx, '&:hover': { color: 'var(--error)' } }}
                            >
                                <FiTrash2 size={13} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ChatMessage;
