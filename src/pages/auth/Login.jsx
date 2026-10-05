import { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import CustomInput from '../../common/custom/CustomInput';
import CustomModal from '../../common/custom/CustomModal';
import AuthLayout from '../../components/AuthLayout';
import { useLogin } from '../../Api/Api';
import { DEMO_MODE } from '../../Api/Api';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [forgotOpen, setForgotOpen] = useState(false);
    const nav = useNavigate();

    const { mutate: loginMutate, isPending } = useLogin(
        () => {
            toast.success('Welcome back.');
            nav('/app');
        },
        (error) => {
            const msg = error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
            toast.error(msg);
        }
    );

    const form = useFormik({
        initialValues: { identifier: '', password: '' },
        validate: (values) => {
            const errors = {};
            if (!values.identifier) errors.identifier = 'Email or mobile number is required';
            else if (values.identifier.includes('@') && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.identifier)) {
                errors.identifier = 'Enter a valid email address';
            }
            if (!values.password) errors.password = 'Password is required';
            return errors;
        },
        onSubmit: (values) => loginMutate(values),
    });

    return (
        <AuthLayout tagline="Your autonomous AI companion, always one step ahead.">
            <Typography sx={{ fontWeight: 800, fontSize: '24px', letterSpacing: '-0.025em', mb: 0.6, color: 'var(--ink)' }}>
                Sign In
            </Typography>
            <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', mb: 3 }}>
                Enter your credentials to access your AI workspace.
            </Typography>

            <form onSubmit={form.handleSubmit} noValidate>
                <Box sx={{ mb: 2 }}>
                    <CustomInput
                        label="Email or Mobile"
                        name="identifier"
                        placeholder="you@domain.com or phone"
                        formik={form}
                        autoComplete="username"
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <CustomInput
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        formik={form}
                        autoComplete="current-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
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

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
                    <Link
                        to="/forgot-password"
                        style={{
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: 'var(--accent)',
                            textDecoration: 'none',
                        }}
                    >
                        Forgot password?
                    </Link>
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isPending}
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
                    {isPending ? 'Verifying…' : 'Sign in to Workspace'}
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
                        <strong>Demo Sandbox</strong> — Any email/password will authenticate locally.
                    </Typography>
                </Box>
            )}

            <Typography sx={{ textAlign: 'center', fontSize: '13px', mt: 3, color: 'var(--text-secondary)' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                    Create an account
                </Link>
            </Typography>

            <CustomModal open={forgotOpen} onClose={() => setForgotOpen(false)} title="Forgot password?" subtitle="We're here to help you get back in.">
                <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, mb: 2.5 }}>
                    In production, a secure reset token is dispatched to your registered contact. In demo mode, simply log in with any credentials.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" size="small" onClick={() => setForgotOpen(false)} sx={{ borderRadius: '8px' }}>
                        Understood
                    </Button>
                </Box>
            </CustomModal>
        </AuthLayout>
    );
};

export default Login;
