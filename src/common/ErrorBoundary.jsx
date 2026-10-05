import React from 'react';
import { Box, Button, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/app';
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        minHeight: '100dvh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 3,
                        textAlign: 'center',
                        bgcolor: 'var(--bg)',
                        color: 'var(--ink)',
                        fontFamily: 'var(--font-sans)',
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 480,
                            p: 4,
                            borderRadius: '16px',
                            bgcolor: 'var(--surface)',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
                            Something went wrong
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                            An unexpected interface error occurred. Don't worry, your data is safe on the server.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                            <Button
                                variant="outlined"
                                onClick={this.handleReload}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderColor: 'var(--border-strong)',
                                    color: 'var(--ink-soft)',
                                }}
                            >
                                Reload page
                            </Button>
                            <Button
                                variant="contained"
                                onClick={this.handleReset}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    bgcolor: 'var(--accent)',
                                    '&:hover': { bgcolor: 'var(--accent-hover)' },
                                }}
                            >
                                Return to dashboard
                            </Button>
                        </Box>
                    </Box>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
