
import React, { useState } from 'react';
import {
    Bell,
    Moon,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    Globe,
    Smartphone,
    ArrowLeft,
    Check,
    Mail,
    FileText
} from 'lucide-react';

type SettingsView = 'main' | 'language' | 'privacy' | 'help' | 'about';

const SettingsScreen: React.FC = () => {
    const [currentView, setCurrentView] = useState<SettingsView>('main');
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [language, setLanguage] = useState('English');

    const renderHeader = () => (
        <div className="flex items-center space-x-3 mb-6">
            {currentView !== 'main' && (
                <button
                    onClick={() => setCurrentView('main')}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
            )}
            <h2 className="text-xl font-bold">
                {currentView === 'main' ? 'Settings' :
                    currentView === 'language' ? 'Language' :
                        currentView === 'privacy' ? 'Privacy & Security' :
                            currentView === 'help' ? 'Help & Support' : 'About App'}
            </h2>
        </div>
    );

    const renderLanguageView = () => {
        const languages = [
            'English', 'Español', 'Français', 'Deutsch', '中文', '日本語'
        ];

        return (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="glass-card rounded-2xl overflow-hidden">
                    {languages.map((lang, index) => (
                        <div key={lang}>
                            <button
                                onClick={() => setLanguage(lang)}
                                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <span className="font-medium">{lang}</span>
                                {language === lang && <Check size={18} className="text-orange-500" />}
                            </button>
                            {index < languages.length - 1 && <div className="h-[1px] bg-white/5 mx-4" />}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderPrivacyView = () => (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="glass-card p-5 rounded-2xl space-y-4">
                <h3 className="font-bold flex items-center space-x-2">
                    <Shield size={18} className="text-orange-500" />
                    <span>Data Privacy</span>
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                    We take your privacy seriously. All your personal data is encrypted and stored locally on your device where possible.
                    We do not sell your personal information to third parties.
                </p>

                <div className="h-[1px] bg-white/5 my-4" />

                <h3 className="font-bold">Terms of Service</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                    By using Pi Utility Hub, you agree to our terms of service which ensure a safe and compliant environment for all users within the Pi ecosystem.
                </p>

                <div className="h-[1px] bg-white/5 my-4" />

                <button className="w-full py-2 bg-white/5 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">
                    View Full Privacy Policy
                </button>
            </div>
        </div>
    );

    const renderHelpView = () => (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="glass-card p-5 rounded-2xl space-y-4">
                <h3 className="font-bold mb-2">FAQ</h3>
                <div className="space-y-3">
                    <details className="group">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm">
                            <span>How do I sync my wallet?</span>
                            <span className="transition group-open:rotate-180">
                                <ChevronRight size={16} />
                            </span>
                        </summary>
                        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                            Go to the Wallet tab and click "Sync" to update your balance relative to the Pi Mainnet.
                        </p>
                    </details>
                    <div className="h-[1px] bg-white/5" />
                    <details className="group">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm">
                            <span>Is this app official?</span>
                            <span className="transition group-open:rotate-180">
                                <ChevronRight size={16} />
                            </span>
                        </summary>
                        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                            This is a utility hub built for the Pi ecosystem but is not directly affiliated with the Pi Core Team.
                        </p>
                    </details>
                </div>
            </div>

            <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                        <Mail size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold">Contact Support</h3>
                        <p className="text-[10px] text-gray-400">help@piutilityhub.com</p>
                    </div>
                </div>
                <ChevronRight size={18} className="text-gray-500" />
            </div>
        </div>
    );

    const renderAboutView = () => (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col items-center justify-center py-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
                    <span className="text-4xl font-bold text-white">π</span>
                </div>
                <h3 className="text-xl font-bold">Pi Utility Hub</h3>
                <p className="text-sm text-gray-400">Version 1.0.0 (Beta)</p>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <SettingItem icon={<FileText size={18} />} label="Licenses" hasArrow />
                <div className="h-[1px] bg-white/5 mx-4" />
                <SettingItem icon={<Globe size={18} />} label="Visit Website" hasArrow />
            </div>

            <p className="text-center text-[10px] text-gray-600 px-8">
                Designed and developed for the Pi Network community. © 2026 Pi Utility Hub.
            </p>
        </div>
    );

    const renderMainView = () => (
        <div className="animate-in slide-in-from-left-4 duration-300">
            {/* Profile Section */}
            <div className="glass-card p-4 rounded-2xl flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold text-xl">
                    JD
                </div>
                <div>
                    <h3 className="font-bold">John Doe</h3>
                    <p className="text-xs text-gray-400">@johndoe_pi</p>
                </div>
                <div className="flex-1 text-right">
                    <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">
                        Edit
                    </button>
                </div>
            </div>

            {/* App Preferences */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Preferences</h3>

                <div className="glass-card rounded-2xl overflow-hidden">
                    <SettingItem
                        icon={<Bell size={18} />}
                        label="Notifications"
                        toggle
                        value={notifications}
                        onChange={() => setNotifications(!notifications)}
                    />
                    <div className="h-[1px] bg-white/5 mx-4" />
                    <SettingItem
                        icon={<Moon size={18} />}
                        label="Dark Mode"
                        toggle
                        value={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                    />
                    <div className="h-[1px] bg-white/5 mx-4" />
                    <SettingItem
                        icon={<Globe size={18} />}
                        label="Language"
                        value={language}
                        hasArrow
                        onChange={() => setCurrentView('language')}
                    />
                </div>
            </div>

            {/* Support & About */}
            <div className="space-y-4 mt-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Support</h3>

                <div className="glass-card rounded-2xl overflow-hidden">
                    <SettingItem
                        icon={<Shield size={18} />}
                        label="Privacy & Security"
                        hasArrow
                        onChange={() => setCurrentView('privacy')}
                    />
                    <div className="h-[1px] bg-white/5 mx-4" />
                    <SettingItem
                        icon={<HelpCircle size={18} />}
                        label="Help & Support"
                        hasArrow
                        onChange={() => setCurrentView('help')}
                    />
                    <div className="h-[1px] bg-white/5 mx-4" />
                    <SettingItem
                        icon={<Smartphone size={18} />}
                        label="About App"
                        value="v1.0.0"
                        hasArrow
                        onChange={() => setCurrentView('about')}
                    />
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 mb-8">
                <button className="w-full glass-card p-4 rounded-2xl flex items-center justify-center space-x-2 text-red-400 hover:bg-red-500/10 transition-colors border border-red-500/20">
                    <LogOut size={18} />
                    <span className="font-bold">Sign Out</span>
                </button>
                <p className="text-center text-[10px] text-gray-600 mt-4">
                    Pi Utility Hub • Build 2026.01.17
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 pt-2">
            {renderHeader()}
            {currentView === 'main' && renderMainView()}
            {currentView === 'language' && renderLanguageView()}
            {currentView === 'privacy' && renderPrivacyView()}
            {currentView === 'help' && renderHelpView()}
            {currentView === 'about' && renderAboutView()}
        </div>
    );
};

interface SettingItemProps {
    icon: React.ReactNode;
    label: string;
    value?: string | boolean;
    toggle?: boolean;
    hasArrow?: boolean;
    onChange?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, value, toggle, hasArrow, onChange }) => (
    <button
        onClick={onChange}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
    >
        <div className="flex items-center space-x-3">
            <div className="text-gray-400">
                {icon}
            </div>
            <span className="text-sm font-medium">{label}</span>
        </div>

        <div className="flex items-center space-x-2">
            {toggle ? (
                <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${value ? 'bg-orange-500' : 'bg-gray-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-4' : ''}`} />
                </div>
            ) : (
                <span className="text-xs text-gray-500">{value}</span>
            )}

            {hasArrow && <ChevronRight size={16} className="text-gray-600" />}
        </div>
    </button>
);

export default SettingsScreen;
