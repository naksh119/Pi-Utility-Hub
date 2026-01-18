
import React, { useState } from 'react';
import { Bell, Clock, CheckCircle2 } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const ReminderScreen: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [time, setTime] = useState('12:00');

  return (
    <div className="space-y-6 pt-2 animate-in slide-in-from-bottom-4 duration-500">
      <div className="glass-card p-6 rounded-[2.5rem] border border-white/10 text-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
            <Bell size={32} className="text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold">Set Daily Mining Reminder</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">(Recommended Feature)</p>
        </div>

        <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
          <span className="font-medium">Enable Reminder</span>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${enabled ? 'bg-orange-500' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${enabled ? 'left-8' : 'left-1'}`}></div>
          </button>
        </div>

        {/* Futuristic Clock Interface */}
        <div className="relative py-10 flex flex-col items-center">
          <div className="w-56 h-56 rounded-full border-2 border-dashed border-cyan-500/20 animate-[spin_20s_linear_infinite] flex items-center justify-center">
            {/* Counter-rotate the inner content to keep it stable */}
            <div className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center animate-[spin_20s_linear_infinite_reverse]">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#1a1c24] to-[#0a0d12] border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col items-center justify-center relative">
                {/* Hidden time input */}
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {/* Display formatted time */}
                <div className="text-3xl font-black text-white text-center pointer-events-none">
                  {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
                <span className="text-[10px] font-bold text-cyan-400 mt-1 tracking-widest uppercase pointer-events-none">Select Time</span>
              </div>
            </div>
          </div>

          {/* Tick Marks Decoration */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-2 bg-white/20 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 30}deg) translateY(-100px)`
              }}
            ></div>
          ))}
        </div>

        <p className="text-xs text-gray-500 px-4 leading-relaxed">
          Receive push notifications daily to remind you to tap the lightning button in your Pi Network app.
        </p>

        <button className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-2xl font-bold shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2">
          <span>Save Reminder</span>
          <CheckCircle2 size={18} />
        </button>
      </div>

      <div className="px-4 py-3 bg-white/5 rounded-2xl flex items-center space-x-3 border border-white/5">
        <Clock size={16} className="text-gray-500" />
        <span className="text-xs text-gray-400">Next Reminder: <span className="text-white font-medium">Tomorrow, {time}</span></span>
      </div>
    </div>
  );
};

export default ReminderScreen;
