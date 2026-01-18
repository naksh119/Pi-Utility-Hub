import React from 'react';
import { ShieldCheck, User, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.jpg';

const LoginScreen: React.FC = () => {
    const { loginAsGuest, authenticate, loading, error } = useAuth();

    const handlePiLogin = async () => {
        try {
            await authenticate();
        } catch (err) {
            console.error("Login component error:", err);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#05070a] text-white overflow-hidden max-w-md mx-auto relative shadow-2xl items-center justify-center px-6">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex flex-col items-center w-full max-w-sm z-10 space-y-8">
                {/* Logo / Icon */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl shadow-orange-500/30 rotate-3 border border-white/10">
                        <img src={logo} alt="Pi" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#05070a] rounded-xl flex items-center justify-center border border-white/10">
                        <Zap className="text-cyan-400 fill-cyan-400/20" size={20} />
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Pi Utility Hub</h1>
                    <p className="text-gray-400 text-sm">Your all-in-one toolkit for the Pi Network ecosystem.</p>
                </div>

                {/* Error Message Display */}
                {error && (
                    <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div className="text-left">
                            <p className="text-red-200 font-medium text-sm">Authentication Issue</p>
                            <p className="text-red-400/80 text-xs mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="w-full space-y-3 pt-4">
                    <button
                        onClick={handlePiLogin}
                        disabled={loading}
                        className={`w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl font-bold text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Connecting...</span>
                            </div>
                        ) : (
                            <>
                                <ShieldCheck size={20} />
                                <span>Login with Pi Network</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={loginAsGuest}
                        disabled={loading}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-gray-300 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        <User size={20} />
                        <span>Continue as Guest</span>
                    </button>
                </div>

                <p className="text-xs text-gray-600 text-center max-w-[250px]">
                    By continuing, you agree to the Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
