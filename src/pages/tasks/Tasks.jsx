import { useMemo, useState } from 'react';
import { Box, Button, Chip, Skeleton, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { FiCheckSquare, FiPlus } from 'react-icons/fi';
import PageHeader from '../../components/PageHeader';
import TaskItem from '../../components/TaskItem';
import TaskForm from '../../components/TaskForm';
import EmptyState from '../../components/EmptyState';
import { ConfirmDialog } from '../../models/AllModels';
import { useCreateTask, useDeleteTask, useTasks, useToggleTask, useUpdateTask } from '../../Api/Api';
import { isDueOverdue, isDueToday } from '../../utils/date';

const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'today', label: 'Today' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Done' },
];

const Tasks = () => {
    const { data: tasks = [], isLoading } = useTasks();
    const [searchParams, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState('all');
    // Opens via quick actions (?new=1) without an effect
    const [formOpen, setFormOpen] = useState(() => searchParams.get('new') === '1');
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const clearNewParam = () => {
        if (searchParams.get('new') === '1') setSearchParams({}, { replace: true });
    };

    const { mutate: createMutate } = useCreateTask(
        () => toast.success('Task added.'),
        () => toast.error("Couldn't add that task.")
    );
    const { mutate: updateMutate } = useUpdateTask(
        () => toast.success('Task updated.'),
        () => toast.error("Couldn't update that task.")
    );
    const { mutate: toggleMutate } = useToggleTask(undefined, () => toast.error('Something went wrong.'));
    const { mutate: deleteMutate } = useDeleteTask(
        () => toast.success('Task deleted.'),
        () => toast.error("Couldn't delete that task.")
    );

    const counts = useMemo(() => {
        const open = tasks.filter((t) => !t.completed);
        return {
            all: open.length,
            today: open.filter((t) => isDueToday(t.dueDate) || isDueOverdue(t.dueDate)).length,
            upcoming: open.filter((t) => !isDueToday(t.dueDate) && !isDueOverdue(t.dueDate) && t.dueDate).length,
            completed: tasks.filter((t) => t.completed).length,
        };
    }, [tasks]);

    const filtered = useMemo(() => {
        switch (filter) {
            case 'today':
                return tasks.filter((t) => !t.completed && (isDueToday(t.dueDate) || isDueOverdue(t.dueDate)));
            case 'upcoming':
                return tasks.filter((t) => !t.completed && t.dueDate && !isDueToday(t.dueDate) && !isDueOverdue(t.dueDate));
            case 'completed':
                return tasks.filter((t) => t.completed);
            default:
                return tasks.filter((t) => !t.completed);
        }
    }, [tasks, filter]);

    const openForm = (task = null) => {
        setEditing(task);
        setFormOpen(true);
    };

    const handleSave = (payload) => {
        if (editing) updateMutate({ id: editing.id, ...payload });
        else createMutate(payload);
        setFormOpen(false);
    };

    const overdueCount = tasks.filter((t) => !t.completed && isDueOverdue(t.dueDate)).length;

    return (
        <Box sx={{ maxWidth: 760, mx: 'auto' }}>
            <PageHeader
                title="Tasks"
                subtitle={
                    overdueCount > 0
                        ? `${overdueCount} overdue — want to tackle these first?`
                        : "Everything you've asked to remember, in one calm list."
                }
                actions={
                    <Button variant="contained" startIcon={<FiPlus size={16} />} onClick={() => openForm(null)}>
                        New task
                    </Button>
                }
            />

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 2.4 }}>
                {FILTERS.map((f) => (
                    <Chip
                        key={f.id}
                        label={`${f.label}${counts[f.id] ? ` (${counts[f.id]})` : ''}`}
                        onClick={() => setFilter(f.id)}
                        sx={{
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: 12.5,
                            bgcolor: filter === f.id ? 'var(--accent)' : 'var(--surface)',
                            color: filter === f.id ? '#fff' : 'var(--text-secondary)',
                            border: filter === f.id ? 'none' : '1px solid var(--border)',
                            '&:hover': { bgcolor: filter === f.id ? 'var(--accent)' : 'var(--surface-soft)' },
                        }}
                    />
                ))}
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.4 }}>
                    {[0, 1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rounded" height={78} sx={{ borderRadius: '10px' }} />
                    ))}
                </Box>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={<FiCheckSquare size={26} />}
                    title={
                        filter === 'completed'
                            ? 'Nothing finished yet'
                            : filter === 'today'
                              ? 'Nothing due today'
                              : filter === 'upcoming'
                                ? 'No upcoming tasks'
                                : 'No tasks yet'
                    }
                    message={
                        filter === 'all'
                            ? 'Tell your AI something like "remind me to call Rahul next Tuesday", or add a task right here.'
                            : 'You can add one below, or ask your AI in the chat.'
                    }
                    actionLabel={filter === 'all' ? 'Add your first task' : 'Add a task'}
                    onAction={() => openForm(null)}
                    actionIcon={<FiPlus size={15} />}
                />
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {filtered.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={(id) => toggleMutate(id)}
                            onEdit={(t) => openForm(t)}
                            onDelete={(t) => setDeleteTarget(t)}
                        />
                    ))}
                </Box>
            )}

            <TaskForm
                open={formOpen}
                task={editing}
                onClose={() => {
                    setFormOpen(false);
                    clearNewParam();
                }}
                onSave={handleSave}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                    deleteMutate(deleteTarget.id);
                    setDeleteTarget(null);
                }}
                title="Delete this task?"
                message={`"${deleteTarget?.title || ''}" will be removed from your list.`}
                confirmText="Delete task"
            />

            {!isLoading && tasks.length > 0 && filter === 'all' && (
                <Typography sx={{ textAlign: 'center', fontSize: 12.5, color: 'var(--text-muted)', mt: 2.6 }}>
                    Tip: try "remind me to …" in Chat and your AI will add tasks for you.
                </Typography>
            )}
        </Box>
    );
};

export default Tasks;
