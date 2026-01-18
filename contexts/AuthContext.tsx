import React, { createContext, useContext, useState, useEffect } from 'react';
import { PiUser } from '../types';

interface AuthContextType {
    user: PiUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    loginAsGuest: () => void;
    authenticate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    loginAsGuest: () => { },
    authenticate: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<PiUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isInitialized, setIsInitialized] = useState(false);

    const loginAsGuest = () => {
        setUser({
            username: "Guest_User",
            uid: "guest-uid",
            accessToken: "mock-token"
        });
        setError(null);
        setLoading(false);
    };

    const authenticate = async () => {
        // Essential environment check
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isInPiBrowser = window.navigator.userAgent.toLowerCase().includes('pibrowser') ||
            (window.Pi && window.self !== window.top);

        // Shortcut for localhost if NOT in Pi Browser/Sandbox
        if (isLocalhost && !isInPiBrowser) {
            console.log("Localhost detected outside Pi Browser. Using instant mock login.");
            setLoading(true);
            await new Promise(r => setTimeout(r, 600)); // Brief delay for UX
            setUser({
                username: "Local_Dev",
                uid: "local-dev-uid",
                accessToken: "local-token"
            });
            setError(null);
            setLoading(false);
            return;
        }

        if (!window.Pi) {
            setError("Pi SDK not loaded. Please use the Pi Browser to login.");
            return;
        }

        if (!isInitialized) {
            setError("Pi SDK is initializing. Please wait a moment.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log("Starting Pi Authentication...");
            const scopes = ['username', 'payments'];
            const onIncompletePaymentFound = (payment: any) => {
                console.log('Incomplete payment found', payment);
            };

            // Use a promise with timeout for Pi.authenticate
            const authPromise = window.Pi.authenticate(scopes, onIncompletePaymentFound);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Authentication Timed Out")), 45000)
            );

            const authResult = await Promise.race([authPromise, timeoutPromise]) as any;

            console.log("Pi Auth Success:", authResult);
            if (authResult && authResult.user) {
                setUser(authResult.user);
            } else {
                throw new Error("Invalid response from Pi Network");
            }
        } catch (err) {
            console.error('Pi Authentication error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
            setError(errorMessage);

            // Final fallback for dev environments
            if (isLocalhost) {
                console.warn("Dev mode fallback: Authentication failed, providing mock user.");
                setUser({
                    username: "Dev_Fallback",
                    uid: "dev-uid",
                    accessToken: "mock-token"
                });
                setError(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initPi = async () => {
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

            try {
                if (!window.Pi) {
                    // On localhost, we can still proceed as initialized to allow mock login
                    if (isLocalhost) setIsInitialized(true);
                    setLoading(false);
                    return;
                }

                const isNetlify = window.location.hostname.includes('netlify.app');
                const useSandbox = !isNetlify && !window.location.hostname.includes('piutilityapp.netlify.app');

                try {
                    // Note: window.Pi.init is generally synchronous but we wrap to be safe
                    window.Pi.init({ version: '2.0', sandbox: useSandbox });
                    console.log(`Pi SDK Initialized (sandbox: ${useSandbox})`);
                } catch (e) {
                    if (!(e instanceof Error && e.message.includes("already initialized"))) {
                        console.warn("Pi SDK init warning:", e);
                    }
                }

                setIsInitialized(true);
            } catch (err) {
                console.error('Pi SDK Initialization failed:', err);
                if (isLocalhost) setIsInitialized(true);
            } finally {
                setLoading(false);
            }
        };

        // Wait for SDK to load
        let attempts = 0;
        const checkInterval = setInterval(() => {
            if (window.Pi) {
                clearInterval(checkInterval);
                initPi();
            } else {
                attempts++;
                if (attempts > 30) { // 3 seconds
                    clearInterval(checkInterval);
                    console.warn("Pi SDK load timeout.");
                    setLoading(false);
                }
            }
        }, 100);

        return () => clearInterval(checkInterval);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, error, loginAsGuest, authenticate }}>
            {children}
        </AuthContext.Provider>
    );
};
