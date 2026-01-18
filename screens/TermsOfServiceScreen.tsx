
import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { privacyPolicyContent } from '../data/privacyPolicy';

interface TermsOfServiceScreenProps {
    onBack?: () => void;
}

const TermsOfServiceScreen: React.FC<TermsOfServiceScreenProps> = ({ onBack }) => {
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
                <h2 className="text-xl font-bold">Terms of Service</h2>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold flex items-center space-x-2 text-lg">
                        <FileText size={20} className="text-orange-500" />
                        <span>Terms of Service</span>
                    </h3>
                    <span className="text-[10px] text-gray-500 italic">Updated: {privacyPolicyContent.lastUpdated}</span>
                </div>

                <div className="space-y-6 text-left">
                    {privacyPolicyContent.terms.map((term, index) => (
                        <div key={index} className="space-y-2">
                            <h4 className="text-sm font-bold text-gray-200">{term.title}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                                {term.content}
                            </p>
                        </div>
                    ))}

                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-gray-200">Independent Provider</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Pi Utility Hub is an independent community project. We are not affiliated with, authorized, maintained, sponsored or endorsed by the Pi Core Team.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-gray-200">User Responsibility</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Users are responsible for maintaining the security of their Pi Network accounts. Do not share your 24-word passphrase with any third-party app, including this one.
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 opacity-50">
                <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
                    Pioneer Community Project
                </p>
            </div>
        </div>
    );
};

export default TermsOfServiceScreen;
