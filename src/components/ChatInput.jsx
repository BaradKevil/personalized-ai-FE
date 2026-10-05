import { useState } from 'react';
import { Box, IconButton, TextField, Typography, Tooltip } from '@mui/material';
import { FiArrowUp, FiMic, FiPaperclip } from 'react-icons/fi';

const ChatInput = ({ onSubmit, disabled, placeholder = 'Message Milo…', inputRef }) => {
    const [value, setValue] = useState('');

    const submit = () => {
        const text = value.trim();
        if (!text || disabled) return;
        onSubmit(text);
        setValue('');
    };

    const hasText = Boolean(value.trim());

    return (
        <Box sx={{ px: { xs: 1.5, sm: 2.5 }, pb: { xs: 1.5, sm: 2.5 }, pt: 0.5 }}>
            <Box
                sx={{
                    bgcolor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-md)',
                    p: 1.2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.8,
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    '&:focus-within': {
                        borderColor: 'var(--accent)',
                        boxShadow: 'var(--shadow-glow)',
                    },
                }}
            >
                {/* Input row */}
                <TextField
                    inputRef={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            submit();
                        }
                    }}
                    placeholder={disabled ? 'Milo is formulating a response…' : placeholder}
                    multiline
                    minRows={1}
                    maxRows={6}
                    disabled={disabled}
                    fullWidth
                    variant="standard"
                    slotProps={{
                        input: {
                            disableUnderline: true,
                            sx: {
                                fontSize: '14px',
                                px: 1,
                                py: 0.4,
                                color: 'var(--ink)',
                                lineHeight: 1.5,
                            },
                            'aria-label': 'Message your AI',
                        },
                    }}
                />

                {/* Bottom action row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5, pt: 0.2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Tooltip title="Voice input (coming soon)">
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'var(--text-muted)',
                                    p: 0.6,
                                    borderRadius: '6px',
                                    '&:hover': { color: 'var(--ink)', bgcolor: 'var(--surface-soft)' },
                                }}
                            >
                                <FiMic size={15} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Add context (coming soon)">
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'var(--text-muted)',
                                    p: 0.6,
                                    borderRadius: '6px',
                                    '&:hover': { color: 'var(--ink)', bgcolor: 'var(--surface-soft)' },
                                }}
                            >
                                <FiPaperclip size={15} />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '11px', color: 'var(--text-muted)', display: { xs: 'none', sm: 'block' } }}>
                            <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>Enter</kbd> to send
                        </Typography>
                        <IconButton
                            onClick={submit}
                            disabled={disabled || !hasText}
                            aria-label="Send message"
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '8px',
                                bgcolor: hasText && !disabled ? 'var(--accent)' : 'var(--surface-soft)',
                                color: hasText && !disabled ? '#FFFFFF' : 'var(--text-muted)',
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                    bgcolor: hasText && !disabled ? 'var(--accent-hover)' : 'var(--surface-soft)',
                                    transform: hasText && !disabled ? 'translateY(-1px)' : 'none',
                                },
                            }}
                        >
                            <FiArrowUp size={16} strokeWidth={2.5} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatInput;
