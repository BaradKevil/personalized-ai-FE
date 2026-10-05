import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { FiLogOut, FiAlertTriangle } from 'react-icons/fi';

const paperSx = {
    borderRadius: '16px',
    maxWidth: 400,
    width: '100%',
    boxShadow: 'var(--shadow-xl)',
    p: 0.5,
};

export const LogoutModal = ({ open, onClose, onConfirm, isPending }) => {
    return (
        <Dialog open={open} onClose={isPending ? undefined : onClose} slotProps={{ paper: { sx: paperSx } }}>
            <DialogContent sx={{ p: 3.5, textAlign: 'center' }}>
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '12px',
                        bgcolor: 'var(--error-soft)',
                        color: 'var(--error)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1.8,
                    }}
                >
                    <FiLogOut size={22} />
                </Box>
                <Typography sx={{ fontSize: '18px', fontWeight: 800, mb: 0.8, color: 'var(--ink)' }}>
                    Sign out of Milo?
                </Typography>
                <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.55, mb: 2.5 }}>
                    Your session will end securely. You can sign back in at any time.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onClose}
                        disabled={isPending}
                        sx={{ borderRadius: '8px', color: 'var(--ink-soft)', borderColor: 'var(--border-strong)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={onConfirm}
                        disabled={isPending}
                        sx={{ borderRadius: '8px' }}
                    >
                        {isPending ? 'Signing out…' : 'Sign out'}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmText = 'Delete', isPending, tone = 'error' }) => {
    return (
        <Dialog open={open} onClose={isPending ? undefined : onClose} slotProps={{ paper: { sx: paperSx } }}>
            <DialogContent sx={{ p: 3.5, textAlign: 'center' }}>
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '12px',
                        bgcolor: tone === 'error' ? 'var(--error-soft)' : 'var(--warning-soft)',
                        color: tone === 'error' ? 'var(--error)' : 'var(--warning)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1.8,
                    }}
                >
                    <FiAlertTriangle size={22} />
                </Box>
                <Typography sx={{ fontSize: '17px', fontWeight: 800, mb: 0.8, color: 'var(--ink)' }}>
                    {title}
                </Typography>
                {message && (
                    <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.55, mb: 2.5 }}>
                        {message}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1.2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onClose}
                        disabled={isPending}
                        sx={{ borderRadius: '8px', color: 'var(--ink-soft)', borderColor: 'var(--border-strong)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={onConfirm}
                        disabled={isPending}
                        sx={{ borderRadius: '8px' }}
                    >
                        {isPending ? 'Working…' : confirmText}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
