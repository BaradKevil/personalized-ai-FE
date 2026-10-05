import { Box, Button } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import CustomModal from '../common/custom/CustomModal';
import CustomInput from '../common/custom/CustomInput';

const GoalForm = ({ open, onClose, onSave }) => {
    const form = useFormik({
        initialValues: { title: '', description: '' },
        validate: (values) => {
            const errors = {};
            if (!values.title.trim()) errors.title = 'Give your goal a name';
            return errors;
        },
        onSubmit: (values) => {
            onSave({ title: values.title.trim(), description: values.description.trim() });
        },
    });

    useEffect(() => {
        if (open) form.resetForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title="New goal"
            subtitle="Something meaningful you're working toward. Your AI will help you break it down."
        >
            <form onSubmit={form.handleSubmit} noValidate>
                <Box sx={{ mb: 2 }}>
                    <CustomInput label="Goal" name="title" placeholder="e.g. Launch my startup" formik={form} autoFocus />
                </Box>
                <Box sx={{ mb: 2.8 }}>
                    <CustomInput
                        label="Why it matters (optional)"
                        name="description"
                        placeholder="A line or two about what success looks like"
                        formik={form}
                        multiline
                        rows={2}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 1.2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={onClose} sx={{ color: 'var(--ink-soft)', borderColor: 'var(--border-strong)' }}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        Create goal
                    </Button>
                </Box>
            </form>
        </CustomModal>
    );
};

export default GoalForm;
