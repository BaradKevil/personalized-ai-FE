import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiMail, FiCheckCircle } from 'react-icons/fi';
import CustomInput from '../../common/custom/CustomInput';
import AuthLayout from '../../components/AuthLayout';
import { DEMO_MODE } from '../../Api/Api';

const ForgotPassword = () => {
    const [submittedEmail, setSubmittedEmail] = useState(null);
    const [isSending, setIsSending] = useState(false);

    const form = useFormik({
        initialValues: { email: '' },
        validate: (values) => {
            const errors = {};
            if (!values.email) {
                errors.email = 'Email address is required';
            } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
                errors.email = 'Enter a valid email address';
            }
            return errors;
        },
        onSubmit: async (values) => {
            setIsSending(true);
            try {
                // Simulate network latency / API call
                await new Promise((resolve) => setTimeout(resolve, 800));
                setSubmittedEmail(values.email);
                toast.success('Password reset link sent.');
            } catch (err) {
                toast.error("Couldn't send reset link. Please try again.");
            } finally {
                setIsSending(false);
            }
        },
    });

    return (
        <AuthLayout tagline="Keep your autonomous AI workspace securely under your control.">
            {submittedEmail ? (
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
                        Check your email
                    </Typography>
                    <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, mb: 3 }}>
                        We sent a secure password reset link to <strong>{submittedEmail}</strong>. Follow the instructions to choose a new password.
                    </Typography>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                            toast.info(`Recovery link resent to ${submittedEmail}`);
                        }}
                        sx={{
                            py: 1.2,
                            borderRadius: '8px',
                            fontSize: '13.5px',
                            fontWeight: 600,
                            bgcolor: 'var(--accent)',
                            mb: 2,
                            '&:hover': { bgcolor: 'var(--accent-hover)' },
                        }}
                    >
                        Resend Reset Link
                    </Button>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Link
                            to="/login"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--accent)',
                                textDecoration: 'none',
                            }}
                        >
                            <FiArrowLeft size={14} /> Back to Sign In
                        </Link>
                    </Box>
                </Box>
            ) : (
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '24px', letterSpacing: '-0.025em', mb: 0.6, color: 'var(--ink)' }}>
                        Reset Password
                    </Typography>
                    <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', mb: 3 }}>
                        Enter your registered email address and we'll send you a link to reset your password.
                    </Typography>

                    <form onSubmit={form.handleSubmit} noValidate>
                        <Box sx={{ mb: 2.5 }}>
                            <CustomInput
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="you@domain.com"
                                formik={form}
                                autoComplete="email"
                            />
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isSending}
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
                            {isSending ? 'Sending Recovery Link…' : 'Send Recovery Link'}
                        </Button>
                    </form>

                    {DEMO_MODE && (
                        <Box
                            sx={{
                                mt: 2.5,
                                p: 1.4,
                                borderRadius: '8px',
                                bgcolor: 'var(--surface-soft)',
                                border: '1px dashed var(--border-strong)',
                                textAlign: 'center',
                            }}
                        >
                            <Typography sx={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                <strong>Demo Sandbox</strong> — You can enter any test email to verify the recovery workflow.
                            </Typography>
                        </Box>
                    )}

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

export default ForgotPassword;
