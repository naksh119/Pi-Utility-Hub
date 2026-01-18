
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
    FileText,
    ExternalLink
} from 'lucide-react';
import { privacyPolicyContent } from '../data/privacyPolicy';
import { helpSupportContent } from '../data/helpSupport';
import { useTheme } from '../contexts/ThemeContext';

type SettingsView = 'main' | 'language' | 'privacy' | 'help' | 'about';

interface SettingsScreenProps {
    onNavigate?: (screen: any) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
    const [currentView, setCurrentView] = useState<SettingsView>('main');
    const [notifications, setNotifications] = useState(true);
    const { theme, toggleTheme } = useTheme();
    const darkMode = theme === 'dark';
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
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-10">
            <div className="glass-card p-6 rounded-2xl space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold flex items-center space-x-2 text-lg">
                        <Shield size={20} className="text-orange-500" />
                        <span>{privacyPolicyContent.title}</span>
                    </h3>
                    <span className="text-[10px] text-gray-500 italic">Updated: {privacyPolicyContent.lastUpdated}</span>
                </div>

                <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar text-left">
                    {privacyPolicyContent.sections.map((section) => (
                        <div key={section.id} className="space-y-2">
                            <h4 className="text-sm font-bold text-gray-200">{section.title}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                                {section.content}
                            </p>
                        </div>
                    ))}

                    <div className="h-[1px] bg-white/5 my-4" />

                    {privacyPolicyContent.terms.map((term, index) => (
                        <div key={index} className="space-y-2">
                            <h4 className="text-sm font-bold text-gray-200">{term.title}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                {term.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="pt-4 space-y-3">
                    <button
                        onClick={() => onNavigate?.('privacy')}
                        className="w-full py-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs font-bold text-orange-500 hover:bg-orange-500/20 transition-colors flex items-center justify-center space-x-2"
                    >
                        <Shield size={14} />
                        <span>Full Privacy Policy Page</span>
                    </button>
                    <button
                        onClick={() => onNavigate?.('terms')}
                        className="w-full py-3 bg-white/5 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
                    >
                        <FileText size={14} />
                        <span>Terms of Service Page</span>
                    </button>
                    <button className="w-full py-3 bg-white/5 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors flex items-center justify-center space-x-2">
                        <ExternalLink size={14} />
                        <span>View Official Pi Network Privacy</span>
                    </button>
                </div>
            </div>

            {/* SEO Keywords for transparency (hidden or subtle) */}
            <div className="px-4 opacity-20 hover:opacity-100 transition-opacity">
                <p className="text-[8px] text-gray-500 text-center">
                    Keywords: Pi Network, Blockchain Security, Data Privacy, Web3 Ecosystem.
                </p>
            </div>
        </div>
    );

    const renderHelpView = () => (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-10">
            <div className="text-center px-4">
                <h3 className="font-bold text-lg mb-1">{helpSupportContent.title}</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">{helpSupportContent.description}</p>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                {helpSupportContent.categories.map((category) => (
                    <div key={category.id} className="glass-card p-5 rounded-2xl space-y-4">
                        <h4 className="font-bold text-orange-500 text-sm">{category.title}</h4>
                        <div className="space-y-3">
                            {category.faqs.map((faq, fIndex) => (
                                <div key={fIndex}>
                                    <details className="group">
                                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm">
                                            <span className="pr-4">{faq.q}</span>
                                            <span className="transition-transform duration-300 group-open:rotate-180 shrink-0">
                                                <ChevronRight size={16} />
                                            </span>
                                        </summary>
                                        <p className="text-xs text-gray-400 mt-2 leading-relaxed pl-1 border-l-2 border-orange-500/20 py-1">
                                            {faq.a}
                                        </p>
                                    </details>
                                    {fIndex < category.faqs.length - 1 && <div className="h-[1px] bg-white/5 mt-3" />}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
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
                <button
                    onClick={() => window.location.href = 'mailto:help@piutilityhub.com'}
                    className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ChevronRight size={18} className="text-gray-500" />
                </button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center px-4">
                {helpSupportContent.seoKeywords.map((kw, i) => (
                    <span key={i} className="text-[8px] px-2 py-1 bg-white/5 rounded-full text-gray-500">
                        #{kw.replace(/\s+/g, '')}
                    </span>
                ))}
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
                        onChange={toggleTheme}
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
