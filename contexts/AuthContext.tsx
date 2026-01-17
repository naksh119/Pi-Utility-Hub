import React, { createContext, useContext, useState, useEffect } from 'react';
import { PiUser } from '../types';

interface AuthContextType {
    user: PiUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<PiUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initPi = async () => {
            try {
                // Check if running in development (localhost) and outside of an iframe (not in Sandbox)
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                // Note: Pi Sandbox loads app in an iframe. If we are top level on localhost, we are likely not in the sandbox.
                // However, the error "does not match the recipient window's origin" suggests we might be sending messages to a wrong target.

                if (isLocalhost) {
                    console.log("Running on localhost. Attempting to mock authentication if SDK fails.");
                }

                // Double check availability
                if (!window.Pi) {
                    throw new Error("Pi SDK not loaded.");
                }

                try {
                    window.Pi.init({ version: '2.0', sandbox: true });
                } catch (e) {
                    // If init fails (e.g. postMessage error), and we are on localhost, switch to mock
                    if (isLocalhost) {
                        console.warn("Pi.init failed on localhost. Using mock user.", e);
                        setUser({
                            username: "TestUser",
                            uid: "test-uid-123",
                            accessToken: "mock-token"
                        });
                        setLoading(false);
                        return;
                    }
                    throw e;
                }

                const scopes = ['username', 'payments'];
                const onIncompletePaymentFound = (payment: any) => {
                    console.log('Incomplete payment found', payment);
                };

                const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
                console.log("Pi Auth Result:", authResult);
                setUser(authResult.user);
            } catch (err) {
                console.error('Pi Authentication failed', err);

                // Fallback for localhost if even the initial check didn't catch it or if authenticate caught the error
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                if (isLocalhost) {
                    console.warn("Authentication failed on localhost. Fallback to mock user.");
                    setUser({
                        username: "TestUser",
                        uid: "test-uid-123",
                        accessToken: "mock-token"
                    });
                    setError(null); // Clear error since we are mocking
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
                if (attempts > 20) { // 2 seconds
                    clearInterval(checkInterval);
                    // If checking fails, try initPi anyway to trigger error handling
                    initPi();
                }
            }
        }, 100);

        return () => clearInterval(checkInterval);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
