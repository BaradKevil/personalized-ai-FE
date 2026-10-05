import { createTheme } from '@mui/material/styles';

const light = {
    primary:    { main: '#7C3AED', light: '#8B5CF6', dark: '#5B21B6', contrastText: '#FFFFFF' },
    secondary:  { main: '#71717A' },
    background: { default: '#FAFAFA', paper: '#FFFFFF' },
    text:       { primary: '#09090B', secondary: '#71717A' },
    divider:    '#E4E4E7',
    success:    { main: '#16A34A', light: '#22C55E', dark: '#15803D' },
    warning:    { main: '#D97706', light: '#F59E0B', dark: '#B45309' },
    error:      { main: '#DC2626', light: '#EF4444', dark: '#B91C1C' },
    info:       { main: '#2563EB', light: '#3B82F6', dark: '#1D4ED8' },
};

const dark = {
    primary:    { main: '#8B5CF6', light: '#A78BFA', dark: '#7C3AED', contrastText: '#FFFFFF' },
    secondary:  { main: '#A1A1AA' },
    background: { default: '#09090B', paper: '#111113' },
    text:       { primary: '#FAFAFA', secondary: '#A1A1AA' },
    divider:    '#27272A',
    success:    { main: '#22C55E', light: '#4ADE80', dark: '#16A34A' },
    warning:    { main: '#F59E0B', light: '#FCD34D', dark: '#D97706' },
    error:      { main: '#EF4444', light: '#F87171', dark: '#DC2626' },
    info:       { main: '#3B82F6', light: '#60A5FA', dark: '#2563EB' },
};

export const createAppTheme = (mode = 'light') => {
    const palette = mode === 'dark' ? dark : light;
    const isDark = mode === 'dark';

    return createTheme({
        palette: {
            mode,
            ...palette,
        },
        shape: { borderRadius: 8 },
        typography: {
            fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontWeightLight:   400,
            fontWeightRegular: 400,
            fontWeightMedium:  500,
            fontWeightBold:    700,
            h1: { fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 },
            h2: { fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15 },
            h3: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
            h4: { fontWeight: 600, letterSpacing: '-0.015em' },
            h5: { fontWeight: 600, letterSpacing: '-0.01em' },
            h6: { fontWeight: 600 },
            body1: { fontSize: '13.5px', lineHeight: 1.6 },
            body2: { fontSize: '12px',   lineHeight: 1.55 },
            button: { textTransform: 'none', fontWeight: 600, letterSpacing: '-0.01em' },
            caption: { fontSize: '11px', fontWeight: 500 },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 8,
                        padding: '8px 16px',
                        fontSize: '13.5px',
                        letterSpacing: '-0.01em',
                        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                    },
                    containedPrimary: {
                        boxShadow: '0 1px 2px rgba(124, 58, 237, 0.2), 0 0 0 0 transparent',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                            transform: 'translateY(-1px)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                            boxShadow: '0 1px 2px rgba(124, 58, 237, 0.2)',
                        },
                    },
                    outlinedPrimary: {
                        borderColor: 'var(--accent-border)',
                        '&:hover': {
                            background: 'var(--accent-soft)',
                            borderColor: 'var(--accent)',
                        },
                    },
                    sizeSmall: { padding: '5px 12px', fontSize: '12px' },
                    sizeLarge: { padding: '11px 24px', fontSize: '15px' },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        transition: 'background 0.12s ease, color 0.12s ease',
                    },
                },
            },
            MuiAvatar: {
                styleOverrides: {
                    root: { borderRadius: '50%', fontWeight: 700 },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: { borderRadius: 99, fontWeight: 600, fontSize: '12px' },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 8,
                            backgroundColor: palette.background.paper,
                            fontSize: '13.5px',
                            transition: 'box-shadow 0.15s ease',
                            '& fieldset': { borderColor: isDark ? '#27272A' : '#E4E4E7', transition: 'border-color 0.15s ease' },
                            '&:hover fieldset': { borderColor: isDark ? '#52525B' : '#A1A1AA' },
                            '&.Mui-focused fieldset': {
                                borderColor: palette.primary.main,
                                borderWidth: '1.5px',
                            },
                            '&.Mui-focused': {
                                boxShadow: `0 0 0 3px ${isDark ? 'rgba(139,92,246,0.18)' : 'rgba(124,58,237,0.12)'}`,
                            },
                        },
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        fontSize: '13.5px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: isDark ? '#27272A' : '#E4E4E7',
                            transition: 'border-color 0.15s ease',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: isDark ? '#52525B' : '#A1A1AA',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: palette.primary.main,
                            borderWidth: '1.5px',
                        },
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        fontSize: '13.5px',
                        fontWeight: 500,
                        '&.Mui-focused': { color: palette.primary.main },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                        border: `1px solid ${isDark ? '#27272A' : '#E4E4E7'}`,
                        backgroundColor: palette.background.paper,
                        transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        borderRadius: 12,
                        border: `1px solid ${isDark ? '#27272A' : '#E4E4E7'}`,
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 16,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    },
                },
            },
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        borderRadius: 10,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        minWidth: 180,
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        borderRadius: 6,
                        fontSize: '13.5px',
                        fontWeight: 500,
                        margin: '2px 4px',
                        padding: '7px 10px',
                        '&:hover': { backgroundColor: isDark ? '#1E1E24' : '#F4F4F5' },
                        '&.Mui-selected': {
                            backgroundColor: isDark ? '#1E1032' : '#F5F3FF',
                            color: palette.primary.main,
                            fontWeight: 600,
                        },
                    },
                },
            },
            MuiPopover: {
                styleOverrides: {
                    paper: {
                        borderRadius: 12,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        border: `1px solid ${isDark ? '#27272A' : '#E4E4E7'}`,
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor: isDark ? '#E4E4E7' : '#18181B',
                        color: isDark ? '#09090B' : '#FAFAFA',
                        fontSize: '11.5px',
                        fontWeight: 500,
                        borderRadius: 6,
                        padding: '5px 9px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                    arrow: {
                        color: isDark ? '#E4E4E7' : '#18181B',
                    },
                },
                defaultProps: { arrow: true, enterDelay: 300 },
            },
            MuiDivider: {
                styleOverrides: {
                    root: { borderColor: isDark ? '#27272A' : '#E4E4E7' },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundImage: 'none',
                        backgroundColor: isDark ? '#111113' : '#FFFFFF',
                        border: 'none',
                    },
                },
            },
            MuiSkeleton: {
                styleOverrides: {
                    root: { borderRadius: 8 },
                },
            },
            MuiLinearProgress: {
                styleOverrides: {
                    root: {
                        borderRadius: 99,
                        backgroundColor: isDark ? '#27272A' : '#E4E4E7',
                        height: 4,
                    },
                    bar: { borderRadius: 99 },
                },
            },
        },
    });
};

export default createAppTheme('light');
