
import React from 'react';
import { ChevronRight, TrendingUp, ShieldCheck, Zap, Info } from 'lucide-react';
import { Screen } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pt-2">
      {/* Converter Widget Widget */}
      <div 
        onClick={() => onNavigate('converter')}
        className="glass-card p-5 rounded-3xl cursor-pointer hover:bg-white/10 transition-all border-l-4 border-l-orange-500 group"
      >
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Pi to Fiat Converter</span>
          <TrendingUp size={16} className="text-orange-400" />
        </div>
        <div className="flex items-baseline space-x-2">
          <h2 className="text-2xl font-bold">1 Pi = 58.75 <span className="text-orange-500">USD</span></h2>
        </div>
        <p className="text-xs text-gray-500 mt-1">4,200 INR (Simulated Rate)</p>
        <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="w-[65%] h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"></div>
        </div>
      </div>

      {/* Quick Access Tools */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('reminder')}
          className="glass-card p-4 rounded-3xl text-left border border-white/5 hover:border-cyan-500/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Zap size={20} className="text-cyan-400" />
          </div>
          <h3 className="font-semibold text-sm">Mining Reminder</h3>
          <p className="text-[10px] text-gray-500 mt-1">Set daily notification</p>
        </button>

        <button 
          onClick={() => onNavigate('wallet')}
          className="glass-card p-4 rounded-3xl text-left border border-white/5 hover:border-orange-500/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShieldCheck size={20} className="text-orange-400" />
          </div>
          <h3 className="font-semibold text-sm text-balance">Wallet Balance</h3>
          <p className="text-[10px] text-gray-500 mt-1">Check address safety</p>
        </button>
      </div>

      {/* Featured News Preview */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Pi News & Announcements</h2>
          <button onClick={() => onNavigate('news')} className="text-xs text-orange-400 font-medium flex items-center">
            View All <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="glass-card p-3 rounded-2xl flex space-x-4 items-center border border-white/5">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <img src="https://picsum.photos/seed/pinetwork1/200/200" alt="News" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold line-clamp-1">Pi Hackathon Winners Announced</h4>
              <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">The latest Pi Network hackathon concluded with innovative utility apps...</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[9px] px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">Community</span>
                <span className="text-[9px] text-gray-600">2h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Tip */}
      <div className="glass-card p-4 rounded-3xl bg-gradient-to-br from-[#1a1c24] to-[#0a0d12] border border-orange-500/20">
        <div className="flex items-center space-x-2 mb-2">
          <Info size={14} className="text-orange-400" />
          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Daily Pi Tip</span>
        </div>
        <p className="text-xs text-gray-300 italic leading-relaxed">
          "Connect a wallet for future rewards! Make sure your passphrase is saved in a secure location outside of your mobile device."
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
