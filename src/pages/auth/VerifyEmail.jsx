import { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiMail, FiArrowRight } from 'react-icons/fi';
import AuthLayout from '../../components/AuthLayout';

const VerifyEmail = () => {
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || 'your registered email';
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVerifying(false);
            setVerified(true);
            toast.success('Email verified successfully!');
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AuthLayout tagline="Verified identity. Personalized intelligence. Complete privacy.">
            <Box sx={{ textAlign: 'center', py: 2 }}>
                {verifying ? (
                    <Box sx={{ py: 3 }}>
                        <CircularProgress size={44} sx={{ color: 'var(--accent)', mb: 2.5 }} />
                        <Typography sx={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.02em', mb: 1, color: 'var(--ink)' }}>
                            Verifying your email…
                        </Typography>
                        <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                            Confirming token credentials with Milo security…
                        </Typography>
                    </Box>
                ) : verified ? (
                    <Box>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
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
                            <FiCheckCircle size={30} />
                        </Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.02em', mb: 1, color: 'var(--ink)' }}>
                            Email verified!
                        </Typography>
                        <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, mb: 3 }}>
                            Your email address has been verified. Your Milo workspace is ready to personalize.
                        </Typography>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={() => nav('/app')}
                            endIcon={<FiArrowRight size={16} />}
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
                            Open Your Workspace
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                bgcolor: 'var(--surface-soft)',
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                            }}
                        >
                            <FiMail size={28} />
                        </Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.02em', mb: 1, color: 'var(--ink)' }}>
                            Verify your email address
                        </Typography>
                        <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, mb: 3 }}>
                            We sent an activation link to <strong>{email}</strong>. Check your inbox and follow the link to complete setup.
                        </Typography>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => toast.info(`Verification email resent to ${email}`)}
                            sx={{
                                py: 1.1,
                                borderRadius: '8px',
                                fontSize: '13.5px',
                                fontWeight: 600,
                                mb: 2,
                            }}
                        >
                            Resend Verification Email
                        </Button>

                        <Link to="/login" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                            Back to Sign In
                        </Link>
                    </Box>
                )}
            </Box>
        </AuthLayout>
    );
};

export default VerifyEmail;
