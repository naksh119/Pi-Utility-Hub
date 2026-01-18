
import React, { useState, useEffect } from 'react';
import {
  Home,
  RefreshCw,
  Bell,
  Wallet,
  Newspaper,
  Settings,
  ChevronRight,
  Info
} from 'lucide-react';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import ConverterScreen from './screens/ConverterScreen';
import ReminderScreen from './screens/ReminderScreen';
import WalletScreen from './screens/WalletScreen';
import NewsScreen from './screens/NewsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Screen } from './types';

import { useAuth } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import logo from './assets/logo.jpg';
// ... imports

const App: React.FC = () => {
  const { loading: authLoading, isAuthenticated, error, user, loginAsGuest } = useAuth();
  const [minLoadTimePassed, setMinLoadTimePassed] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>('home');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadTimePassed(true);
    }, 2000); // Reduced to 2s for better UX
    return () => clearTimeout(timer);
  }, []);

  const isLoading = authLoading || !minLoadTimePassed;

  if (isLoading) {
    return <SplashScreen />;
  }

  if (error || !isAuthenticated) {
    return <LoginScreen />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <HomeScreen onNavigate={setActiveScreen} />;
      case 'converter': return <ConverterScreen />;
      case 'reminder': return <ReminderScreen />;
      case 'wallet': return <WalletScreen />;
      case 'news': return <NewsScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <HomeScreen onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#05070a] text-gray-900 dark:text-white transition-colors duration-300 overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-lg shadow-orange-500/20 border border-white/10">
            <img src={logo} alt="Pi" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Pi Utility Hub</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest opacity-80">
              {user ? `Welcome, @${user.username}` : 'Planning & Implementation Guide'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveScreen('settings')}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Settings size={20} className="text-gray-400" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-24 z-10">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 dark:bg-[#0a0d12]/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 px-4 pt-3 pb-8 flex justify-between items-center z-50">
        <NavItem
          icon={<Home size={22} />}
          label="Home"
          active={activeScreen === 'home'}
          onClick={() => setActiveScreen('home')}
        />
        <NavItem
          icon={<RefreshCw size={22} />}
          label="Converter"
          active={activeScreen === 'converter'}
          onClick={() => setActiveScreen('converter')}
        />
        <div className="relative -top-6">
          <button
            onClick={() => setActiveScreen('wallet')}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${activeScreen === 'wallet' ? 'bg-cyan-500 text-white shadow-cyan-500/40 rotate-12 scale-110' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
          >
            <Wallet size={28} />
          </button>
        </div>
        <NavItem
          icon={<Bell size={22} />}
          label="Reminder"
          active={activeScreen === 'reminder'}
          onClick={() => setActiveScreen('reminder')}
        />
        <NavItem
          icon={<Newspaper size={22} />}
          label="News"
          active={activeScreen === 'news'}
          onClick={() => setActiveScreen('news')}
        />
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center space-y-1 transition-all duration-200 ${active ? 'text-orange-500' : 'text-gray-500'}`}
  >
    <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-orange-500/10' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
