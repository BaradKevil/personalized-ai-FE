import { useState, useMemo } from 'react';
import { Box, Button, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { FiMessageSquare, FiMoreVertical, FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { formatRelative } from '../utils/date';

const ConversationList = ({ conversations = [], activeId, onSelect, onNew, onRename, onDelete }) => {
    const [search, setSearch] = useState('');
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuConv, setMenuConv] = useState(null);

    const openMenu = (e, conv) => {
        e.stopPropagation();
        setMenuConv(conv);
        setMenuAnchor(e.currentTarget);
    };

    const filtered = useMemo(() => {
        if (!search.trim()) return conversations;
        const q = search.toLowerCase();
        return conversations.filter((c) => (c.title || '').toLowerCase().includes(q));
    }, [conversations, search]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            {/* Top Action Header */}
            <Box sx={{ p: 1.5, pb: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={<FiPlus size={15} />}
                    onClick={onNew}
                    sx={{
                        bgcolor: 'var(--accent)',
                        borderRadius: '8px',
                        py: 0.9,
                        fontSize: '13px',
                        fontWeight: 600,
                        boxShadow: 'var(--shadow-xs)',
                        '&:hover': { bgcolor: 'var(--accent-hover)' },
                    }}
                >
                    New Chat
                </Button>

                {/* Filter search */}
                <TextField
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filter chats…"
                    size="small"
                    slotProps={{
                        input: {
                            startAdornment: <FiSearch size={13} style={{ color: 'var(--text-muted)', marginRight: 6 }} />,
                            sx: {
                                fontSize: '12.5px',
                                py: 0.4,
                                bgcolor: 'var(--surface)',
                                borderRadius: '8px',
                            },
                        },
                    }}
                />
            </Box>

            {/* Conversation list */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1, pb: 1 }}>
                {filtered.length === 0 ? (
                    <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                            {search ? 'No matching conversations' : 'No chats yet. Start a new one!'}
                        </Typography>
                    </Box>
                ) : (
                    filtered.map((conv) => {
                        const active = String(conv.id) === String(activeId);
                        return (
                            <Box
                                key={conv.id}
                                onClick={() => onSelect(conv.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') onSelect(conv.id);
                                }}
                                aria-current={active ? 'true' : undefined}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.1,
                                    px: 1.2,
                                    py: 0.85,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    mb: 0.35,
                                    bgcolor: active ? 'var(--accent-soft)' : 'transparent',
                                    border: '1px solid',
                                    borderColor: active ? 'var(--accent-border)' : 'transparent',
                                    transition: 'all 0.12s ease',
                                    '&:hover': {
                                        bgcolor: active ? 'var(--accent-soft)' : 'var(--surface-soft)',
                                    },
                                }}
                            >
                                <FiMessageSquare
                                    size={14}
                                    style={{
                                        flexShrink: 0,
                                        color: active ? 'var(--accent)' : 'var(--text-muted)',
                                    }}
                                />
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography
                                        sx={{
                                            fontSize: '13px',
                                            fontWeight: active ? 600 : 500,
                                            color: active ? 'var(--accent)' : 'var(--ink)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {conv.title || 'Untitled conversation'}
                                    </Typography>
                                    <Typography sx={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        {formatRelative(conv.updatedAt)}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={(e) => openMenu(e, conv)}
                                    aria-label={`Options for ${conv.title}`}
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        color: 'var(--text-muted)',
                                        borderRadius: '4px',
                                        '&:hover': { color: 'var(--ink)', bgcolor: 'var(--surface-hover)' },
                                    }}
                                >
                                    <FiMoreVertical size={13} />
                                </IconButton>
                            </Box>
                        );
                    })
                )}
            </Box>

            {/* Menu options */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                slotProps={{ paper: { sx: { borderRadius: '8px', minWidth: 150, p: 0.4, boxShadow: 'var(--shadow-md)' } } }}
            >
                <MenuItem
                    onClick={() => {
                        setMenuAnchor(null);
                        if (menuConv) onRename(menuConv);
                    }}
                    sx={{ borderRadius: '6px', fontSize: '12.5px', fontWeight: 500 }}
                >
                    <FiEdit2 size={13} style={{ marginRight: 8, color: 'var(--text-secondary)' }} /> Rename
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setMenuAnchor(null);
                        if (menuConv) onDelete(menuConv);
                    }}
                    sx={{ borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, color: 'var(--error)' }}
                >
                    <FiTrash2 size={13} style={{ marginRight: 8 }} /> Delete
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default ConversationList;
