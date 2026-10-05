import { Box, Button } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import CustomModal from '../common/custom/CustomModal';
import CustomInput from '../common/custom/CustomInput';
import CustomSelect from '../common/custom/CustomSelect';
import { PRIORITIES, RECURRENCE_OPTIONS } from '../utils/constants';
import { toISO } from '../utils/date';

const toLocalInput = (iso) => {
    if (!iso) return '';
    try {
        return format(parseISO(iso), "yyyy-MM-dd'T'HH:mm");
    } catch {
        return '';
    }
};

const TaskForm = ({ open, task, onClose, onSave }) => {
    const form = useFormik({
        initialValues: {
            title: task?.title || '',
            notes: task?.notes || '',
            priority: task?.priority || 'medium',
            dueDate: toLocalInput(task?.dueDate),
            recurrence: task?.recurrence || 'none',
            tags: task?.tags?.join(', ') || '',
        },
        validate: (values) => {
            const errors = {};
            if (!values.title.trim()) errors.title = 'Give the task a short name';
            return errors;
        },
        onSubmit: (values) => {
            onSave({
                title: values.title.trim(),
                notes: values.notes.trim(),
                priority: values.priority,
                dueDate: values.dueDate ? toISO(new Date(values.dueDate)) : null,
                recurrence: values.recurrence,
                tags: values.tags
                    .split(',')
                    .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
                    .filter(Boolean),
            });
        },
    });

    useEffect(() => {
        if (open) {
            form.resetForm({
                values: {
                    title: task?.title || '',
                    notes: task?.notes || '',
                    priority: task?.priority || 'medium',
                    dueDate: toLocalInput(task?.dueDate),
                    recurrence: task?.recurrence || 'none',
                    tags: task?.tags?.join(', ') || '',
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, task]);

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title={task ? 'Edit task' : 'New task'}
            subtitle={task ? 'Make a small change — your AI will keep up.' : 'Keep it short. Your AI can expand it into a plan.'}
        >
            <form onSubmit={form.handleSubmit} noValidate>
                <Box sx={{ mb: 2 }}>
                    <CustomInput label="Task" name="title" placeholder="e.g. Finish the proposal" formik={form} autoFocus />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <CustomInput label="Notes (optional)" name="notes" placeholder="Any details worth remembering" formik={form} multiline rows={2} />
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box sx={{ flex: 1 }}>
                        <CustomSelect label="Priority" name="priority" options={PRIORITIES} formik={form} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <CustomSelect label="Repeats" name="recurrence" options={RECURRENCE_OPTIONS} formik={form} />
                    </Box>
                </Box>

                <Box sx={{ mb: 2.4 }}>
                    <CustomInput
                        type="datetime-local"
                        label="Due date (optional)"
                        name="dueDate"
                        formik={form}
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>

                <Box sx={{ mb: 2.8 }}>
                    <CustomInput label="Tags (optional)" name="tags" placeholder="work, home, study" formik={form} />
                </Box>

                <Box sx={{ display: 'flex', gap: 1.2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={onClose} sx={{ color: 'var(--ink-soft)', borderColor: 'var(--border-strong)' }}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        {task ? 'Save changes' : 'Add task'}
                    </Button>
                </Box>
            </form>
        </CustomModal>
    );
};

export default TaskForm;
