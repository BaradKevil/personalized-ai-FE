import { Box, Button } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import CustomModal from '../common/custom/CustomModal';
import CustomInput from '../common/custom/CustomInput';
import CustomSelect from '../common/custom/CustomSelect';
import { MEMORY_CATEGORIES } from '../utils/constants';

const MemoryForm = ({ open, memory, onClose, onSave }) => {
    const form = useFormik({
        initialValues: { category: 'Personal', content: '' },
        validate: (values) => {
            const errors = {};
            if (!values.content.trim()) errors.content = 'What should your AI remember?';
            return errors;
        },
        onSubmit: (values) => {
            onSave({ category: values.category, content: values.content.trim() });
        },
    });

    useEffect(() => {
        if (open) {
            form.resetForm({
                values: { category: memory?.category || 'Personal', content: memory?.content || '' },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, memory]);

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title={memory ? 'Edit memory' : 'Add a memory'}
            subtitle="Something worth keeping? Your AI will use it to be more helpful."
        >
            <form onSubmit={form.handleSubmit} noValidate>
                <Box sx={{ mb: 2 }}>
                    <CustomSelect label="Category" name="category" options={MEMORY_CATEGORIES} formik={form} />
                </Box>
                <Box sx={{ mb: 2.8 }}>
                    <CustomInput
                        label="What to remember"
                        name="content"
                        placeholder="e.g. I prefer short, direct answers"
                        formik={form}
                        multiline
                        rows={2}
                        autoFocus
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 1.2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={onClose} sx={{ color: 'var(--ink-soft)', borderColor: 'var(--border-strong)' }}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        {memory ? 'Save changes' : 'Save memory'}
                    </Button>
                </Box>
            </form>
        </CustomModal>
    );
};

export default MemoryForm;
