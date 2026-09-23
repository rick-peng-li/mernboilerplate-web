import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, login as loginRequest, logout as logoutRequest, register as registerRequest } from '@/services/auth-api';
import { clearAuthToken, getAuthToken, setAuthToken } from '@/services/auth-storage';
import { setUnauthorizedHandler } from '@/services/http';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);

    const clearSession = useCallback(() => {
        clearAuthToken();
        setUser(null);
    }, []);

    const hydrateSession = useCallback(async () => {
        const token = getAuthToken();

        if (!token) {
            setIsInitializing(false);
            return;
        }

        try {
            const currentUser = await fetchCurrentUser();
            setUser(currentUser);
        } catch (_error) {
            clearSession();
        } finally {
            setIsInitializing(false);
        }
    }, [clearSession]);

    useEffect(() => {
        hydrateSession();
    }, [hydrateSession]);

    useEffect(() => {
        setUnauthorizedHandler(clearSession);

        return () => {
            setUnauthorizedHandler(null);
        };
    }, [clearSession]);

    const login = useCallback(async (payload) => {
        const result = await loginRequest(payload);
        setAuthToken(result.token);
        setUser(result.user);
        return result;
    }, []);

    const register = useCallback(async (payload) => {
        const result = await registerRequest(payload);
        setAuthToken(result.token);
        setUser(result.user);
        return result;
    }, []);

    const logout = useCallback(async () => {
        try {
            if (getAuthToken()) {
                await logoutRequest();
            }
        } finally {
            clearSession();
        }
    }, [clearSession]);

    const value = useMemo(
        () => ({
            isAuthenticated: Boolean(user),
            isInitializing,
            login,
            logout,
            register,
            user,
        }),
        [isInitializing, login, logout, register, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
