import { useMemo, useState } from 'react';
import { Box, Button, Chip, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { FiDatabase, FiPlus, FiSearch, FiPower } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader';
import MemoryItem from '../../components/MemoryItem';
import MemoryForm from '../../components/MemoryForm';
import EmptyState from '../../components/EmptyState';
import { ConfirmDialog } from '../../models/AllModels';
import { MEMORY_CATEGORIES } from '../../utils/constants';
import { useCreateMemory, useDeleteMemory, useMemories, useSettings, useUpdateMemory, useUpdateSettings } from '../../Api/Api';

const Memory = () => {
    const { data: memories = [], isLoading } = useMemories();
    const { data: settings } = useSettings();
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { mutate: createMutate } = useCreateMemory(
        () => toast.success("Got it — I'll remember that."),
        () => toast.error("Couldn't save that memory.")
    );
    const { mutate: updateMutate } = useUpdateMemory(
        () => toast.success('Memory updated.'),
        () => toast.error("Couldn't update that memory.")
    );
    const { mutate: deleteMutate } = useDeleteMemory(
        () => toast.success('Forgotten.'),
        () => toast.error("Couldn't forget that.")
    );
    const { mutate: updateSettingsMutate } = useUpdateSettings(
        () => toast.success('Memory is on again.'),
        () => toast.error("Couldn't update settings.")
    );

    const memoryEnabled = settings?.memoryEnabled !== false;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return memories.filter((m) => {
            const matchCat = category === 'All' || m.category === category;
            const matchQuery = !q || m.content.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
            return matchCat && matchQuery;
        });
    }, [memories, query, category]);

    const categoryCounts = useMemo(() => {
        const counts = { All: memories.length };
        MEMORY_CATEGORIES.forEach((c) => {
            counts[c.value] = memories.filter((m) => m.category === c.value).length;
        });
        return counts;
    }, [memories]);

    return (
        <Box sx={{ maxWidth: 780, mx: 'auto' }}>
            <PageHeader
                title="Memory"
                subtitle="Things your AI remembers about you — always visible, always yours to control."
                actions={
                    <Button variant="contained" startIcon={<FiPlus size={16} />} onClick={() => setFormOpen(true)} disabled={!memoryEnabled}>
                        Add memory
                    </Button>
                }
            />

            {!memoryEnabled && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        flexWrap: 'wrap',
                        p: 1.8,
                        borderRadius: '10px',
                        bgcolor: 'var(--warning-soft)',
                        border: '1px solid var(--border)',
                        mb: 2.4,
                    }}
                >
                    <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'var(--warning)' }}>Memory is paused</Typography>
                        <Typography sx={{ fontSize: 13, color: 'var(--text-secondary)', mt: 0.3 }}>
                            Your AI isn't saving anything new right now.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<FiPower size={14} />}
                        onClick={() => updateSettingsMutate({ memoryEnabled: true })}
                        sx={{ borderRadius: '8px' }}
                    >
                        Turn back on
                    </Button>
                </Box>
            )}

            {/* Search + categories */}
            <Box sx={{ mb: 2.4 }}>
                <TextField
                    fullWidth
                    placeholder="Search memories…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiSearch size={15} style={{ color: 'var(--text-muted)' }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '8px', fontSize: '13.5px' },
                        },
                    }}
                    sx={{ mb: 1.6 }}
                />
                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                    {['All', ...MEMORY_CATEGORIES.map((c) => c.value)].map((cat) => (
                        <Chip
                            key={cat}
                            label={`${cat}${categoryCounts[cat] ? ` (${categoryCounts[cat]})` : ''}`}
                            onClick={() => setCategory(cat)}
                            sx={{
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: 12.5,
                                bgcolor: category === cat ? 'var(--accent)' : 'var(--surface)',
                                color: category === cat ? '#fff' : 'var(--text-secondary)',
                                border: category === cat ? 'none' : '1px solid var(--border)',
                                '&:hover': { bgcolor: category === cat ? 'var(--accent)' : 'var(--surface-soft)' },
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.4 }}>
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} variant="rounded" height={92} sx={{ borderRadius: '10px' }} />
                    ))}
                </Box>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={<FiDatabase size={26} />}
                    title={query || category !== 'All' ? 'No matching memories' : 'Nothing remembered yet'}
                    message={
                        query || category !== 'All'
                            ? 'Try a different search, or clear your filters.'
                            : 'Tell your AI things in conversation — "remember that I prefer mornings" — or add them here.'
                    }
                    actionLabel={query || category !== 'All' ? undefined : 'Add a memory'}
                    onAction={query || category !== 'All' ? undefined : () => setFormOpen(true)}
                    actionIcon={<FiPlus size={15} />}
                />
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {filtered.map((mem) => (
                        <MemoryItem
                            key={mem.id}
                            memory={mem}
                            onEdit={(m) => {
                                setEditing(m);
                                setFormOpen(true);
                            }}
                            onDelete={(m) => setDeleteTarget(m)}
                        />
                    ))}
                </Box>
            )}

            <MemoryForm
                open={formOpen}
                memory={editing}
                onClose={() => {
                    setFormOpen(false);
                    setEditing(null);
                }}
                onSave={(payload) => {
                    if (editing) updateMutate({ id: editing.id, ...payload });
                    else createMutate(payload);
                    setFormOpen(false);
                    setEditing(null);
                }}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                    deleteMutate(deleteTarget.id);
                    setDeleteTarget(null);
                }}
                title="Forget this?"
                message={`"${deleteTarget?.content || ''}" will be removed from your AI's memory.`}
                confirmText="Forget it"
            />
        </Box>
    );
};

export default Memory;
