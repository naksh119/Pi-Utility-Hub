
import React from 'react';
import { Shield, ArrowLeft, ExternalLink } from 'lucide-react';
import { privacyPolicyContent } from '../data/privacyPolicy';

interface PrivacyPolicyScreenProps {
    onBack?: () => void;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onBack }) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-10">
            <div className="flex items-center space-x-3 mb-6">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                <h2 className="text-xl font-bold">Privacy Policy</h2>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold flex items-center space-x-2 text-lg">
                        <Shield size={20} className="text-orange-500" />
                        <span>{privacyPolicyContent.title}</span>
                    </h3>
                    <span className="text-[10px] text-gray-500 italic">Updated: {privacyPolicyContent.lastUpdated}</span>
                </div>

                <div className="space-y-6 text-left">
                    {privacyPolicyContent.sections.map((section) => (
                        <div key={section.id} className="space-y-2">
                            <h4 className="text-sm font-bold text-gray-200">{section.title}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="pt-4 text-center border-t border-white/5">
                    <button className="w-full py-3 bg-white/5 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors flex items-center justify-center space-x-2">
                        <ExternalLink size={14} />
                        <span>View Official Pi Network Privacy</span>
                    </button>
                </div>
            </div>

            <div className="px-4 opacity-50">
                <p className="text-[10px] text-gray-500 text-center">
                    Pi Network Ecosystem Safety: Blockchain Privacy and Web3 Data Protection are our top priorities.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicyScreen;
