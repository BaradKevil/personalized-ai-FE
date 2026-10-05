import { Dialog, DialogTitle, IconButton, Box, Typography, Slide } from '@mui/material';
import { forwardRef } from 'react';
import { FiX } from 'react-icons/fi';

const SlideUp = forwardRef(function SlideUp(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CustomModal = ({ open, onClose, title, subtitle, children, maxWidth = 'sm', hideClose = false }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={SlideUp}
            fullWidth
            maxWidth={maxWidth}
            slotProps={{ paper: { sx: { borderRadius: '16px', px: { xs: 2.5, sm: 3 }, py: 2.5, boxShadow: 'var(--shadow-xl)' } } }}
        >
            {!hideClose && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                    <IconButton onClick={onClose} aria-label="Close" sx={{ color: 'var(--text-muted)' }}>
                        <FiX size={18} />
                    </IconButton>
                </Box>
            )}
            {title && (
                <DialogTitle sx={{ px: 0, pt: 1, pb: 0.5, pr: 5 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 19 }}>{title}</Typography>
                    {subtitle && (
                        <Typography sx={{ fontSize: 13.5, color: 'var(--text-secondary)', fontWeight: 500, mt: 0.4 }}>
                            {subtitle}
                        </Typography>
                    )}
                </DialogTitle>
            )}
            <Box sx={{ px: 0, pt: title ? 1.5 : 2 }}>{children}</Box>
        </Dialog>
    );
};

export default CustomModal;
