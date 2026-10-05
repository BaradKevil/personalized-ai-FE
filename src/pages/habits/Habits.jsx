import { useState } from 'react';
import { Box, Button, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { FiCheck, FiPlus, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import { ConfirmDialog } from '../../models/AllModels';
import { useCreateHabit, useDeleteHabit, useHabits, useToggleHabitLog } from '../../Api/Api';
import { format } from 'date-fns';

/** A 7-day square strip showing the habit's real recent completion rhythm. */
const WeekStrip = ({ habit }) => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i -= 1) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push(d);
    }

    const loggedKeys = new Set(habit.recentDates || []);

    return (
        <Box sx={{ display: 'flex', gap: 0.45 }}>
            {days.map((d) => {
                const key = format(d, 'yyyy-MM-dd');
                const logged = loggedKeys.has(key);
                return (
                    <Box
                        key={key}
                        title={format(d, 'EEE, MMM d')}
                        sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '4px',
                            bgcolor: logged ? 'var(--success)' : 'var(--surface-soft)',
                            border: '1px solid',
                            borderColor: logged ? 'var(--success)' : 'var(--border)',
                            transition: 'transform 0.15s ease',
                            '&:hover': { transform: 'scale(1.15)' },
                        }}
                    />
                );
            })}
        </Box>
    );
};

const Habits = () => {
    const { data: habits = [], isLoading } = useHabits();
    const [name, setName] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { mutate: createMutate, isPending: creating } = useCreateHabit(
        () => { toast.success('Habit added.'); setName(''); },
        () => toast.error("Couldn't add that habit.")
    );
    const { mutate: toggleMutate } = useToggleHabitLog(undefined, () => toast.error('Something went wrong.'));
    const { mutate: deleteMutate } = useDeleteHabit(
        () => toast.success('Habit deleted.'),
        () => toast.error("Couldn't delete that habit.")
    );

    const handleCreate = () => {
        const trimmed = name.trim();
        if (!trimmed) return;
        createMutate({ name: trimmed, frequency: 'daily' });
    };

    const completedToday = habits.filter((h) => h.loggedToday).length;

    return (
        <Box sx={{ maxWidth: 760, mx: 'auto' }}>
            <PageHeader
                title="Habits"
                subtitle={
                    habits.length > 0
                        ? `${completedToday} of ${habits.length} done today — consistency beats intensity.`
                        : 'Small daily actions, quietly compounding.'
                }
            />

            {/* Add habit */}
            <Box
                className="milo-depth"
                sx={{
                    display: 'flex',
                    gap: 1,
                    bgcolor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    p: 1.2,
                    mb: 2.4,
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="New habit — e.g. Morning run"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
                <Button variant="contained" startIcon={<FiPlus size={15} />} onClick={handleCreate} disabled={creating || !name.trim()}>
                    Add
                </Button>
            </Box>

            {isLoading ? (
                <Skeleton variant="rounded" height={160} sx={{ borderRadius: '12px' }} />
            ) : habits.length === 0 ? (
                <EmptyState
                    icon="idle"
                    title="No habits yet"
                    message="Add a small daily habit and log it once a day. Milo will track your streak."
                />
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {habits.map((habit) => (
                        <Box
                            key={habit.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.4,
                                bgcolor: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '10px',
                                p: { xs: 1.4, sm: 1.6 },
                                boxShadow: 'var(--shadow-xs)',
                                transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: 'var(--shadow-sm)',
                                    borderColor: 'var(--border-strong)',
                                },
                            }}
                        >
                            {/* Log toggle */}
                            <Button
                                onClick={() => toggleMutate({ id: habit.id })}
                                aria-label={habit.loggedToday ? `Un-log ${habit.name}` : `Log ${habit.name} today`}
                                sx={{
                                    minWidth: 40,
                                    width: 40,
                                    height: 40,
                                    p: 0,
                                    borderRadius: '8px',
                                    border: '2px solid',
                                    borderColor: habit.loggedToday ? 'var(--success)' : 'var(--border)',
                                    bgcolor: habit.loggedToday ? 'var(--success)' : 'transparent',
                                    color: habit.loggedToday ? '#fff' : 'var(--text-muted)',
                                    '&:hover': { bgcolor: habit.loggedToday ? 'var(--success)' : 'var(--success-soft)' },
                                }}
                            >
                                <FiCheck size={18} strokeWidth={2.5} />
                            </Button>

                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>
                                    {habit.name}
                                </Typography>
                                <Typography sx={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.4, flexWrap: 'wrap' }}>
                                    <Box component="span" sx={{ fontWeight: 800, color: habit.streak > 0 ? 'var(--accent-deep)' : 'var(--text-muted)' }}>
                                        🔥 {habit.streak} day{habit.streak === 1 ? '' : 's'}
                                    </Box>
                                    <Box component="span">· {habit.totalLogs} total</Box>
                                    <Box sx={{ display: { xs: 'none', sm: 'inline-flex' }, ml: 'auto' }}>
                                        <WeekStrip habit={habit} />
                                    </Box>
                                </Typography>
                            </Box>

                            <IconButton onClick={() => setDeleteTarget(habit)} aria-label={`Delete ${habit.name}`} className="milo-focus">
                                <FiTrash2 size={16} />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => { deleteMutate(deleteTarget.id); setDeleteTarget(null); }}
                title="Delete habit?"
                message={`"${deleteTarget?.name}" and its history will be removed.`}
                confirmText="Delete"
            />
        </Box>
    );
};

export default Habits;
