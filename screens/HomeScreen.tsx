
import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Info,
  ArrowUpRight,
  Activity,
  LayoutGrid,
  History,
  AlertCircle,
  RefreshCw,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Screen } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { fetchCurrentPiPrice, fetchPiPriceHistory, PiPriceData, ChartPoint } from '../utils/piPriceApi';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [priceData, setPriceData] = useState<PiPriceData | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [current, history] = await Promise.all([
        fetchCurrentPiPrice(),
        fetchPiPriceHistory(7)
      ]);
      if (current) setPriceData(current);
      if (history.length > 0) setChartData(history);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Refresh every minute
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const isPositive = (priceData?.usd_24h_change || 0) >= 0;

  return (
    <div className="space-y-6 pt-2 pb-10">
      {/* 1. Profile & Status Overview */}
      <div className="relative overflow-hidden glass-card p-5 rounded-[2.5rem] border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <span className="text-xl font-bold">{user?.username?.[0].toUpperCase() || 'P'}</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Mining Node</p>
              <h2 className="text-lg font-bold">@{user?.username || 'Pioneer'}</h2>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Active</span>
            </div>
            {isLoading && <span className="text-[8px] text-gray-500 mt-1 uppercase animate-pulse">Syncing...</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <p className="text-[10px] text-gray-400 mb-1">Total Balance</p>
            <div className="flex items-baseline space-x-1 text-orange-500">
              <span className="text-xl font-black">124.50</span>
              <span className="text-xs font-bold">π</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <p className="text-[10px] text-gray-400 mb-1">Mining Rate</p>
            <div className="flex items-baseline space-x-1 text-cyan-500">
              <span className="text-xl font-black">0.25</span>
              <span className="text-xs font-bold">π/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Real-time Price Analytics (Live Graph) */}
      <div
        className="glass-card p-6 rounded-[2.5rem] bg-gradient-to-br from-[#1a1c24] to-[#0a0d12] border border-white/5 overflow-hidden relative"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Activity size={16} className="text-orange-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Market Live</span>
              <div className="flex items-center space-x-1 text-gray-600 text-[8px] font-bold uppercase mt-0.5">
                <Clock size={8} />
                <span>Last updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
          <div className={`flex items-center space-x-1 ${isPositive ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'} px-2 py-0.5 rounded-full text-[10px] font-bold`}>
            {isPositive ? <ArrowUpRight size={10} /> : <TrendingUp size={10} className="rotate-180" />}
            <span>{isPositive ? '+' : ''}{priceData?.usd_24h_change?.toFixed(2) || '0.00'}%</span>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-end">
          <div>
            <h3 className="text-3xl font-black tracking-tight">
              ${priceData?.usd?.toFixed(2) || '58.75'}
              <span className="text-sm font-medium text-gray-500 ml-1">USD/PI</span>
            </h3>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-semibold flex items-center space-x-1">
              <span>Coingecko Live Data</span>
              <span className="inline-block w-1 h-1 rounded-full bg-gray-600"></span>
              <span>Est. {priceData?.inr?.toLocaleString() || '4,200'} INR</span>
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={isLoading}
            className={`p-2 rounded-full hover:bg-white/5 transition-colors ${isLoading ? 'animate-spin opacity-50' : ''}`}
          >
            <RefreshCw size={14} className="text-gray-500" />
          </button>
        </div>

        {/* Real-time Recharts Graph */}
        <div className="h-28 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.length > 0 ? chartData : [{ time: '', price: 58 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ backgroundColor: '#0a0d12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: '#f97316' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#f97316"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPrice)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center space-x-2">
            <LayoutGrid size={14} className="text-orange-500" />
            <span>Quick Services</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('wallet')}
            className="flex flex-col items-start p-5 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 hover:scale-[1.02] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck size={20} className="text-indigo-400" />
            </div>
            <h4 className="font-bold text-sm">Wallet Shield</h4>
            <p className="text-[10px] text-gray-500 mt-1">Verify address safety</p>
          </button>

          <button
            onClick={() => onNavigate('reminder')}
            className="flex flex-col items-start p-5 rounded-[2rem] bg-cyan-500/5 border border-cyan-500/10 hover:bg-cyan-500/10 hover:scale-[1.02] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap size={20} className="text-cyan-400" />
            </div>
            <h4 className="font-bold text-sm">Mining Pulse</h4>
            <p className="text-[10px] text-gray-500 mt-1">Daily notification set</p>
          </button>
        </div>
      </div>

      {/* 4. Recent Activity/News Preview */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center space-x-2">
            <History size={14} className="text-orange-500" />
            <span>Ecosystem News</span>
          </h3>
          <button
            onClick={() => onNavigate('news')}
            className="text-[10px] font-bold text-orange-500 flex items-center hover:opacity-80"
          >
            DISCOVER <ChevronRight size={12} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center space-x-4 group hover:bg-white/[0.04] transition-colors cursor-pointer"
            onClick={() => onNavigate('news')}>
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-800">
              <img src="https://picsum.photos/seed/pinetwork1/200/200" alt="News" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-tighter bg-cyan-400/10 px-1.5 py-0.5 rounded">Major Update</span>
                <span className="text-[8px] text-gray-600 font-medium">2H AGO</span>
              </div>
              <h4 className="text-xs font-bold leading-tight mt-1 group-hover:text-orange-400 transition-colors">Pi Network Mainnet Migration Roadmap Released</h4>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Utility Insight Card */}
      <div className="p-5 rounded-[2.5rem] bg-orange-500/5 border border-orange-500/10 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-5">
          <AlertCircle size={80} className="text-orange-500" />
        </div>
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-orange-500/10 mt-1">
            <Info size={16} className="text-orange-400" />
          </div>
          <div>
            <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">Pioneer Security Tip</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed italic">
              "Never share your 24-word passphrase with anyone. Pi Core Team will never ask for your passphrase."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
