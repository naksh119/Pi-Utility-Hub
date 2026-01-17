
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-[#05070a] flex flex-col items-center justify-center max-w-md mx-auto relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/20 rounded-full blur-[100px] animate-pulse"></div>
      
      {/* Animated Rings */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-48 h-48 border-2 border-orange-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute w-40 h-40 border-2 border-cyan-400/30 rounded-full animate-[spin_6s_linear_infinite_reverse]"></div>
        <div className="absolute w-56 h-56 border border-white/10 rounded-full animate-pulse"></div>
        
        {/* Logo */}
        <div className="relative w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/40 z-10 border-4 border-white/10">
          <span className="text-7xl font-bold text-white mb-2 leading-none select-none">π</span>
        </div>
      </div>

      <div className="mt-12 text-center z-10 px-6">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Pi Utility Hub
        </h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Complete Planning & Implementation
        </p>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-20 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-500 to-cyan-400 animate-[loading_3s_ease-in-out]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
