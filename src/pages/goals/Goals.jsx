import { useState } from 'react';
import { Box, Button, Skeleton } from '@mui/material';
import { toast } from 'react-toastify';
import { FiPlus, FiTarget, FiMessageCircle } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import GoalCard from '../../components/GoalCard';
import GoalForm from '../../components/GoalForm';
import EmptyState from '../../components/EmptyState';
import { ConfirmDialog } from '../../models/AllModels';
import { useCreateGoal, useDeleteGoal, useGoals, useToggleGoalStep, useUpdateGoal } from '../../Api/Api';

const Goals = () => {
    const nav = useNavigate();
    const { data: goals = [], isLoading } = useGoals();
    const [searchParams, setSearchParams] = useSearchParams();
    // Opens via quick actions (?new=1) without an effect
    const [formOpen, setFormOpen] = useState(() => searchParams.get('new') === '1');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const clearNewParam = () => {
        if (searchParams.get('new') === '1') setSearchParams({}, { replace: true });
    };

    const { mutate: createMutate } = useCreateGoal(
        () => toast.success('Goal created.'),
        () => toast.error("Couldn't create that goal.")
    );
    const { mutate: updateMutate } = useUpdateGoal(
        () => toast.success('Step added.'),
        () => toast.error("Couldn't update that goal.")
    );
    const { mutate: toggleStepMutate } = useToggleGoalStep(undefined, () => toast.error('Something went wrong.'));
    const { mutate: deleteMutate } = useDeleteGoal(
        () => toast.success('Goal deleted.'),
        () => toast.error("Couldn't delete that goal.")
    );

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <PageHeader
                title="Goals"
                subtitle="The bigger things you're working toward — your AI turns them into steps."
                actions={
                    <Button variant="contained" startIcon={<FiPlus size={16} />} onClick={() => setFormOpen(true)}>
                        New goal
                    </Button>
                }
            />

            {isLoading ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.8 }}>
                    {[0, 1].map((i) => (
                        <Skeleton key={i} variant="rounded" height={230} sx={{ borderRadius: '12px' }} />
                    ))}
                </Box>
            ) : goals.length === 0 ? (
                <EmptyState
                    icon={<FiTarget size={26} />}
                    title="No goals yet"
                    message="Tell your AI what you want to accomplish, and it will help you turn it into a plan with real steps."
                    actionLabel="Create a goal"
                    onAction={() => setFormOpen(true)}
                    actionIcon={<FiPlus size={15} />}
                />
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.8 }}>
                    {goals.map((goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onToggleStep={(stepId) => toggleStepMutate({ goalId: goal.id, stepId })}
                            onAddStep={(text) =>
                                updateMutate({
                                    id: goal.id,
                                    steps: [...goal.steps, { id: `${Date.now()}`, text, done: false }],
                                })
                            }
                            onDelete={(g) => setDeleteTarget(g)}
                        />
                    ))}
                </Box>
            )}

            {!isLoading && goals.length > 0 && (
                <Box sx={{ textAlign: 'center', mt: 3.4 }}>
                    <Button
                        variant="text"
                        startIcon={<FiMessageCircle size={16} />}
                        onClick={() => nav('/app/chat')}
                        sx={{ color: 'var(--accent-deep)', fontWeight: 700, fontSize: 14 }}
                    >
                        Ask your AI to break a goal into tasks
                    </Button>
                </Box>
            )}

            <GoalForm
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    clearNewParam();
                }}
                onSave={(payload) => {
                    createMutate(payload);
                    setFormOpen(false);
                }}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                    deleteMutate(deleteTarget.id);
                    setDeleteTarget(null);
                }}
                title="Delete this goal?"
                message={`"${deleteTarget?.title || ''}" and its progress will be removed.`}
                confirmText="Delete goal"
            />
        </Box>
    );
};

export default Goals;
