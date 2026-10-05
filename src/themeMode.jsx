import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from './theme';

// Theme mode preference: 'light' | 'system' | 'dark'.
// 'system' follows the OS setting via prefers-color-scheme.
const STORAGE_KEY = 'milo:theme';
const DEFAULT_MODE = 'system';

const getStoredMode = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    } catch {
        // localStorage unavailable — fall through to default
    }
    return DEFAULT_MODE;
};

const systemPrefersDark = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

const ThemeModeContext = createContext({ mode: DEFAULT_MODE, resolved: 'light', setMode: () => {} });

export const ThemeModeProvider = ({ children }) => {
    const [mode, setModeState] = useState(getStoredMode);
    const [systemDark, setSystemDark] = useState(systemPrefersDark);

    // Follow OS preference changes while in 'system' mode
    useEffect(() => {
        if (!window.matchMedia) return undefined;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = (event) => setSystemDark(event.matches);
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    const setMode = (next) => {
        if (next !== 'light' && next !== 'dark' && next !== 'system') return;
        setModeState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // ignore storage failures
        }
    };

    // Resolve the effective theme: 'system' → OS preference
    const resolved = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

    // Drive the CSS variable palette (App.css [data-theme='dark'])
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', resolved);
    }, [resolved]);

    const theme = useMemo(() => createAppTheme(resolved), [resolved]);

    return (
        <ThemeModeContext.Provider value={{ mode, resolved, setMode }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeModeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeMode = () => useContext(ThemeModeContext);
