import React, { createContext, useContext, useState, useEffect } from 'react';
import { PiUser } from '../types';

interface AuthContextType {
    user: PiUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    loginAsGuest: () => void;
    authenticate: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    loginAsGuest: () => { },
    authenticate: async () => { },
    logout: () => { },
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

    const logout = () => {
        setUser(null);
        setError(null);
        localStorage.removeItem('user'); // Just in case it was stored elsewhere
    };

    const authenticate = async () => {
        // Essential environment check
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isInIframe = window.self !== window.top;
        const isPiUserAgent = window.navigator.userAgent.toLowerCase().includes('pibrowser');
        const isInSandbox = isLocalhost || isInIframe;

        console.log("Environment check:", { isLocalhost, isInIframe, isPiUserAgent, isInSandbox });

        // Shortcut for localhost if NOT in Pi Browser/Sandbox
        if (isLocalhost && !isPiUserAgent && !isInIframe) {
            console.log("Localhost detected outside Pi Browser/Sandbox. Using instant mock login.");
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

        // Check if SDK was initialized (via flag from index.html)
        if (!(window as any).PiInitialized) {
            console.warn("Pi SDK was not initialized in index.html (likely regular browser access)");
            if (!isLocalhost && !isInIframe && !isPiUserAgent) {
                setError("Pi Authentication is only available inside the Pi Browser. Please open this URL in the Pi Browser or click 'Continue as Guest'.");
                setLoading(false);
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            console.log("Starting Pi Authentication...");

            // Use the global helper defined in index.html for consistency
            // but fallback to direct SDK call if helper is missing for some reason
            const authResult = window.authenticatePi ?
                await window.authenticatePi() :
                await window.Pi.authenticate(['username', 'payments'], (p: any) => console.log('Incomplete payment:', p));

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
                    if (isLocalhost) setIsInitialized(true);
                    setLoading(false);
                    return;
                }

                // Pi SDK is now initialized in index.html for better browser verification.
                // We sync the initialization state from index.html
                const sdkInitialized = (window as any).PiInitialized || false;
                setIsInitialized(sdkInitialized);

                if (sdkInitialized) {
                    console.log("Pi SDK confirmed initialized in AuthContext");
                } else {
                    console.log("Pi SDK present but not initialized (expected if outside Pi Browser)");
                }
            } catch (err) {
                console.error('Pi SDK Initialization failed:', err);
                if (isLocalhost) setIsInitialized(true);
            } finally {
                setLoading(false);
            }
        };

        // Wait a brief moment for SDK script to execute if it hasn't yet
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
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, error, loginAsGuest, authenticate, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
