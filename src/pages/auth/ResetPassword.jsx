import { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiCheck, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import CustomInput from '../../common/custom/CustomInput';
import AuthLayout from '../../components/AuthLayout';

const ResetPassword = () => {
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || 'demo_token';
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const form = useFormik({
        initialValues: { password: '', confirmPassword: '' },
        validate: (values) => {
            const errors = {};
            if (!values.password) {
                errors.password = 'New password is required';
            } else if (values.password.length < 8 || !/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
                errors.password = 'Must be at least 8 characters with a letter and a number';
            }
            if (!values.confirmPassword) {
                errors.confirmPassword = 'Confirm your new password';
            } else if (values.confirmPassword !== values.password) {
                errors.confirmPassword = 'Passwords do not match';
            }
            return errors;
        },
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 800));
                setIsDone(true);
                toast.success('Your password has been reset successfully.');
            } catch (err) {
                toast.error("Couldn't reset your password. The link may have expired.");
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const pwd = form.values.password;
    const hasMinLength = pwd.length >= 8;
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);

    return (
        <AuthLayout tagline="Autonomous intelligence with enterprise-grade privacy and control.">
            {isDone ? (
                <Box sx={{ textAlign: 'center', py: 1 }}>
                    <Box
                        sx={{
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            bgcolor: 'var(--success-soft)',
                            color: 'var(--success)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                        }}
                    >
                        <FiCheckCircle size={28} />
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.02em', mb: 1, color: 'var(--ink)' }}>
                        Password reset complete
                    </Typography>
                    <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, mb: 3 }}>
                        Your password has been updated. You can now sign in to your Milo workspace with your new credentials.
                    </Typography>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => nav('/login')}
                        sx={{
                            py: 1.2,
                            borderRadius: '8px',
                            fontSize: '13.5px',
                            fontWeight: 600,
                            bgcolor: 'var(--accent)',
                            '&:hover': { bgcolor: 'var(--accent-hover)' },
                        }}
                    >
                        Sign In Now
                    </Button>
                </Box>
            ) : (
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '24px', letterSpacing: '-0.025em', mb: 0.6, color: 'var(--ink)' }}>
                        Set New Password
                    </Typography>
                    <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', mb: 3 }}>
                        Choose a strong password to protect your Milo personal assistant and notes.
                    </Typography>

                    <form onSubmit={form.handleSubmit} noValidate>
                        <Box sx={{ mb: 2 }}>
                            <CustomInput
                                label="New Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                formik={form}
                                autoComplete="new-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword((v) => !v)}
                                                edge="end"
                                                size="small"
                                                sx={{ color: 'var(--text-muted)' }}
                                            >
                                                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 2.5 }}>
                            <CustomInput
                                label="Confirm New Password"
                                name="confirmPassword"
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="••••••••"
                                formik={form}
                                autoComplete="new-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirm((v) => !v)}
                                                edge="end"
                                                size="small"
                                                sx={{ color: 'var(--text-muted)' }}
                                            >
                                                {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {/* Password Requirements Checklist */}
                        <Box sx={{ mb: 3, p: 1.5, borderRadius: '8px', bgcolor: 'var(--surface-soft)', border: '1px solid var(--border)' }}>
                            <Typography sx={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)', mb: 0.8 }}>
                                PASSWORD REQUIREMENTS:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <RequirementItem met={hasMinLength} text="At least 8 characters in length" />
                                <RequirementItem met={hasLetter} text="Contains at least one letter" />
                                <RequirementItem met={hasNumber} text="Contains at least one number" />
                            </Box>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                            sx={{
                                py: 1.2,
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 600,
                                bgcolor: 'var(--accent)',
                                boxShadow: 'var(--shadow-accent)',
                                '&:hover': { bgcolor: 'var(--accent-hover)' },
                            }}
                        >
                            {isSubmitting ? 'Updating Password…' : 'Update Password'}
                        </Button>
                    </form>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Link
                            to="/login"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                            }}
                        >
                            <FiArrowLeft size={14} /> Back to Sign In
                        </Link>
                    </Box>
                </Box>
            )}
        </AuthLayout>
    );
};

const RequirementItem = ({ met, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
            sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: met ? 'var(--success-soft)' : 'var(--border)',
                color: met ? 'var(--success)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <FiCheck size={11} strokeWidth={3} />
        </Box>
        <Typography sx={{ fontSize: '12px', color: met ? 'var(--ink)' : 'var(--text-secondary)' }}>
            {text}
        </Typography>
    </Box>
);

export default ResetPassword;
