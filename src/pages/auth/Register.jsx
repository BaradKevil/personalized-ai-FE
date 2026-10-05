import { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, FormHelperText, IconButton, InputAdornment, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import CustomInput from '../../common/custom/CustomInput';
import CustomSelect from '../../common/custom/CustomSelect';
import AuthLayout from '../../components/AuthLayout';
import { TIMEZONES } from '../../utils/constants';
import { useRegister } from '../../Api/Api';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const nav = useNavigate();

    const { mutate: registerMutate, isPending } = useRegister(
        () => {
            toast.success('Welcome to Milo. Your workspace is ready.');
            nav('/app');
        },
        (error) => {
            const msg = error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
            toast.error(msg);
        }
    );

    const zones = TIMEZONES;

    const form = useFormik({
        initialValues: {
            name: '',
            mobile: '',
            email: '',
            password: '',
            confirmPassword: '',
            timezone: '',
            terms: false,
        },
        validate: (values) => {
            const errors = {};
            if (!values.name.trim()) errors.name = 'Your full name is required';
            else if (values.name.trim().length < 2) errors.name = 'Enter your full name';
            if (!values.mobile) errors.mobile = 'Mobile number is required';
            else if (!/^\+?[\d\s-]{8,15}$/.test(values.mobile.trim())) errors.mobile = 'Enter a valid mobile number';
            if (!values.email) errors.email = 'Email is required';
            else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) errors.email = 'Enter a valid email address';
            if (!values.password) errors.password = 'Password is required';
            else if (values.password.length < 8) errors.password = 'Use at least 8 characters';
            else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
                errors.password = 'Include at least one letter and one number';
            }
            if (!values.confirmPassword) errors.confirmPassword = 'Confirm your password';
            else if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords don't match";
            if (!values.terms) errors.terms = 'Please accept the Terms & Privacy Policy';
            return errors;
        },
        onSubmit: (values) => {
            registerMutate({
                name: values.name.trim(),
                mobile: values.mobile.trim(),
                email: values.email.trim(),
                password: values.password,
                timezone: values.timezone || undefined,
            });
        },
    });

    return (
        <AuthLayout tagline="Build your autonomous AI workspace.">
            <Typography sx={{ fontWeight: 800, fontSize: '24px', letterSpacing: '-0.025em', mb: 0.6, color: 'var(--ink)' }}>
                Create Account
            </Typography>
            <Typography sx={{ fontSize: '13.5px', color: 'var(--text-secondary)', mb: 3 }}>
                Get started with your personalized intelligence companion.
            </Typography>

            <form onSubmit={form.handleSubmit} noValidate>
                <Box sx={{ mb: 1.8 }}>
                    <CustomInput label="Full Name" name="name" placeholder="Alex Morgan" formik={form} autoComplete="name" />
                </Box>
                <Box sx={{ mb: 1.8 }}>
                    <CustomInput label="Mobile Number" name="mobile" placeholder="+91 98765 43210" formik={form} autoComplete="tel" />
                </Box>
                <Box sx={{ mb: 1.8 }}>
                    <CustomInput label="Email Address" name="email" type="email" placeholder="you@domain.com" formik={form} autoComplete="email" />
                </Box>
                <Box sx={{ mb: 1.8 }}>
                    <CustomInput
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min 8 characters, letters & numbers"
                        formik={form}
                        autoComplete="new-password"
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
                <Box sx={{ mb: 1.8 }}>
                    <CustomInput
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat password"
                        formik={form}
                        autoComplete="new-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirm((v) => !v)}
                                        aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
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
                <Box sx={{ mb: 1.2 }}>
                    <CustomSelect
                        label="Timezone (Optional)"
                        name="timezone"
                        options={zones}
                        placeholder="Detected automatically"
                        formik={form}
                    />
                </Box>

                <FormControlLabel
                    control={
                        <Checkbox
                            name="terms"
                            checked={form.values.terms}
                            onChange={form.handleChange}
                            sx={{
                                color: 'var(--border-strong)',
                                '&.Mui-checked': { color: 'var(--accent)' },
                                '& .MuiSvgIcon-root': { fontSize: 18 },
                            }}
                        />
                    }
                    label={
                        <Typography sx={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                            I agree to the{' '}
                            <Link to="/terms" target="_blank" style={{ fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
                                Terms of Service
                            </Link>{' '}
                            &{' '}
                            <Link to="/privacy" target="_blank" style={{ fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
                                Privacy Policy
                            </Link>
                        </Typography>
                    }
                    sx={{ mb: 0.5 }}
                />
                {form.touched.terms && form.errors.terms && (
                    <FormHelperText error sx={{ mt: 0, mb: 1, fontSize: '12px' }}>
                        {form.errors.terms}
                    </FormHelperText>
                )}

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
                        mt: 1,
                        '&:hover': { bgcolor: 'var(--accent-hover)' },
                    }}
                >
                    {isPending ? 'Creating Workspace…' : 'Create Account'}
                </Button>
            </form>

            <Typography sx={{ textAlign: 'center', fontSize: '13px', mt: 3, color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                    Sign in
                </Link>
            </Typography>
        </AuthLayout>
    );
};

export default Register;
