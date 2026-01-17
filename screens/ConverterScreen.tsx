
import React, { useState } from 'react';
// Added ChevronRight to the lucide-react imports to fix the "Cannot find name 'ChevronRight'" error
import { RefreshCw, ArrowUpDown, TrendingUp, History, ChevronRight } from 'lucide-react';

const ConverterScreen: React.FC = () => {
  const [piAmount, setPiAmount] = useState<string>('1');
  const [currency, setCurrency] = useState('USD');
  const rate = 58.75; // Mock rate

  const calculatedValue = (parseFloat(piAmount) || 0) * rate;

  return (
    <div className="space-y-6 pt-2 animate-in fade-in duration-500">
      <div className="glass-card p-6 rounded-[2.5rem] border border-white/10 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Converter</h2>
          <button className="p-2 bg-white/5 rounded-xl text-gray-400">
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-medium px-1">Pi Amount</label>
            <div className="relative">
              <input 
                type="number" 
                value={piAmount}
                onChange={(e) => setPiAmount(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-xl font-bold focus:outline-none focus:border-orange-500/50 transition-colors"
                placeholder="0.00"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 font-bold">π</div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
              <ArrowUpDown size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-medium px-1">Fiat Currency</label>
            <div className="flex space-x-3">
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-lg font-semibold focus:outline-none appearance-none"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex justify-between items-center text-gray-400 text-sm mb-1">
            <span>Result (Estimated)</span>
            <div className="flex items-center space-x-1">
              <TrendingUp size={12} className="text-green-500" />
              <span className="text-[10px]">+2.4%</span>
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {calculatedValue.toLocaleString('en-US', { style: 'currency', currency: currency })}
          </div>
        </div>

        <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-transform">
          GET LIVE RATE
        </button>
      </div>

      <div className="glass-card p-5 rounded-3xl border border-white/5 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400">
          <History size={24} />
        </div>
        <div>
          <h4 className="font-semibold text-sm">Historical Data</h4>
          <p className="text-xs text-gray-500 mt-0.5">View price trends over the last 30 days</p>
        </div>
        <div className="flex-1 text-right">
          <ChevronRight size={20} className="text-gray-700 ml-auto" />
        </div>
      </div>
    </div>
  );
};

export default ConverterScreen;
