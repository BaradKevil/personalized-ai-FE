import { Navigate } from 'react-router-dom';

const hasValidSession = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!accessToken && !refreshToken) return false;

    if (accessToken) {
        try {
            const parts = accessToken.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                // If access token is expired and there's no refresh token to rotate it, session is invalid
                if (payload.exp && Date.now() >= payload.exp * 1000) {
                    if (!refreshToken) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        return false;
                    }
                }
            }
        } catch {
            // If decoding fails, rely on server 401 via ApiClient
        }
    }

    return true;
};

export const LogGuard = ({ children }) => {
    if (hasValidSession()) {
        return <Navigate to="/app" replace />;
    }
    return children;
};

export const AuthGuard = ({ children }) => {
    if (hasValidSession()) {
        return children;
    }
    return <Navigate to="/login" replace />;
};

// Aliases for backward compatibility with existing imports
export const LogGaurd = LogGuard;
export const AuthGaurd = AuthGuard;

