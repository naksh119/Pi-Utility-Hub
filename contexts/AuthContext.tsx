import React, { createContext, useContext, useState, useEffect } from 'react';
import { PiUser } from '../types';

interface AuthContextType {
    user: PiUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    loginAsGuest: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<PiUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loginAsGuest = () => {
        setUser({
            username: "Guest_User",
            uid: "guest-uid",
            accessToken: "mock-token"
        });
        setError(null);
        setLoading(false);
    };

    useEffect(() => {
        const initPi = async () => {
            try {
                // Environment detection
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const isNetlify = window.location.hostname.includes('netlify.app');

                if (isLocalhost) {
                    console.log("Running on localhost. Pi SDK initialization skipped to avoid CORS/Origin errors.");
                    setLoading(false);
                    return;
                }

                if (!window.Pi) {
                    throw new Error("Pi SDK not loaded.");
                }

                // If on Netlify or a custom domain, sandbox should likely be false unless we are testing
                // The error "The target origin provided ('https://app-cdn.minepi.com') does not match the recipient window's origin"
                // often happens when sandbox: true is used outside the actual Pi Sandbox environment.
                const useSandbox = !isNetlify && !window.location.hostname.includes('piutilityapp.netlify.app');

                try {
                    // Initialize SDK
                    window.Pi.init({ version: '2.0', sandbox: useSandbox });
                    console.log(`Pi SDK initialized (sandbox: ${useSandbox})`);
                } catch (e) {
                    console.warn("Pi SDK already initialized or failed to init:", e);
                }

                const scopes = ['username', 'payments'];
                const onIncompletePaymentFound = (payment: any) => {
                    console.log('Incomplete payment found', payment);
                };

                // Add a timeout for authentication to prevent infinite loading if SDK hangs
                const authPromise = window.Pi.authenticate(scopes, onIncompletePaymentFound);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Authentication timed out")), 10000)
                );

                const authResult = await Promise.race([authPromise, timeoutPromise]) as any;

                console.log("Pi Auth Result:", authResult);
                if (authResult && authResult.user) {
                    setUser(authResult.user);
                } else {
                    throw new Error("Invalid authentication result");
                }
            } catch (err) {
                console.error('Pi Authentication failed:', err);

                // Fallback for non-Pi environments or errors
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const isNetlify = window.location.hostname.includes('netlify.app');

                if (isLocalhost || isNetlify) {
                    // We don't automatically set user for Netlify unless it's a known debug state
                    // But we clear the error so the user can use Guest mode if they choose
                    setError(err instanceof Error ? err.message : 'Authentication failed');
                } else {
                    setError(err instanceof Error ? err.message : 'Authentication failed');
                }
            } finally {
                setLoading(false);
            }
        };

        // Retry mechanism to wait for SDK to load
        let attempts = 0;
        const checkInterval = setInterval(() => {
            if (window.Pi) {
                clearInterval(checkInterval);
                initPi();
            } else {
                attempts++;
                if (attempts > 30) { // 3 seconds
                    clearInterval(checkInterval);
                    initPi(); // Try anyway to trigger error handling
                }
            }
        }, 100);

        return () => clearInterval(checkInterval);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, error, loginAsGuest }}>
            {children}
        </AuthContext.Provider>
    );
};
