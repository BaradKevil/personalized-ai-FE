import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { FiEdit2, FiTrash2, FiDatabase } from 'react-icons/fi';
import { formatFullDate, formatRelative } from '../utils/date';

const categoryStyle = {
    Personal:    { color: 'var(--accent)',  bg: 'var(--accent-soft)' },
    Preferences: { color: 'var(--info)',    bg: 'var(--info-soft)' },
    Goals:       { color: 'var(--success)', bg: 'var(--success-soft)' },
    Important:   { color: 'var(--error)',   bg: 'var(--error-soft)' },
    Work:        { color: 'var(--warning)', bg: 'var(--warning-soft)' },
};

const MemoryItem = ({ memory, onEdit, onDelete }) => {
    const style = categoryStyle[memory.category] || categoryStyle.Personal;

    return (
        <Box
            className="milo-rise"
            sx={{
                display: 'flex',
                gap: 1.4,
                p: 1.8,
                borderRadius: '10px',
                bgcolor: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xs)',
                transition: 'box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease',
                '&:hover': {
                    boxShadow: 'var(--shadow-sm)',
                    transform: 'translateY(-1px)',
                    borderColor: 'var(--border-strong)',
                },
                '&:hover .mem-actions': { opacity: 1 },
            }}
        >
            <Box
                sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    bgcolor: style.bg,
                    color: style.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.2,
                }}
            >
                <FiDatabase size={16} />
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap', mb: 0.4 }}>
                    <Chip
                        label={memory.category}
                        size="small"
                        sx={{
                            height: 20,
                            fontSize: '11px',
                            fontWeight: 600,
                            borderRadius: '4px',
                            color: style.color,
                            bgcolor: style.bg,
                            '& .MuiChip-label': { px: 0.8 },
                        }}
                    />
                    <Typography sx={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {memory.source} • saved {formatRelative(memory.updatedAt)}
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.55 }}>
                    {memory.content}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: 'var(--text-muted)', mt: 0.5 }}>
                    Created {formatFullDate(memory.createdAt)}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    gap: 0.2,
                    opacity: { xs: 1, md: 0 },
                    transition: 'opacity 0.15s ease',
                }}
                className="mem-actions"
            >
                <Tooltip title="Edit">
                    <IconButton
                        size="small"
                        onClick={() => onEdit(memory)}
                        aria-label={`Edit memory: ${memory.content}`}
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '6px',
                            color: 'var(--text-muted)',
                            '&:hover': { color: 'var(--ink)', bgcolor: 'var(--surface-soft)' },
                        }}
                    >
                        <FiEdit2 size={13} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Forget">
                    <IconButton
                        size="small"
                        onClick={() => onDelete(memory)}
                        aria-label={`Forget: ${memory.content}`}
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '6px',
                            color: 'var(--text-muted)',
                            '&:hover': { color: 'var(--error)', bgcolor: 'var(--error-soft)' },
                        }}
                    >
                        <FiTrash2 size={13} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default MemoryItem;
