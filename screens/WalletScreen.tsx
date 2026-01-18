
import React, { useState } from 'react';
import { ShieldCheck, Search, Activity, Clock, AlertCircle } from 'lucide-react';

const WalletScreen: React.FC = () => {
  const [address, setAddress] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = () => {
    if (!address) return;
    setChecking(true);
    setTimeout(() => {
      setResult({
        balance: 3568.23,
        lastUpdated: 'Just now',
        status: 'Active',
        security: 'Protected'
      });
      setChecking(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 pt-2 animate-in fade-in zoom-in-95 duration-500">
      <div className="glass-card p-6 rounded-[2.5rem] border border-white/10 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <ShieldCheck size={22} className="text-orange-400" />
          </div>
          <h2 className="text-xl font-bold">Wallet Check</h2>
        </div>

        <p className="text-xs text-gray-500">
          Enter your Pi public wallet address to view balance and network status in read-only mode.
        </p>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Pi Wallet Address..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          <button
            onClick={handleCheck}
            disabled={checking || !address}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${checking || !address ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-orange-500/20 active:scale-95'}`}
          >
            {checking ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Checking...</span>
              </div>
            ) : 'CHECK BALANCE'}
          </button>
        </div>
      </div>

      {result && (
        <div className="glass-card p-6 rounded-[2.5rem] border-2 border-cyan-500/30 neon-border-blue animate-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400">Wallet Balance <span className="text-[10px] font-normal opacity-60">(Read-Only)</span></h3>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-white">{result.balance.toLocaleString()}</span>
                <span className="text-xl font-bold text-orange-500">π</span>
                <span className="text-xs text-gray-500">PI</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Activity size={20} className="text-cyan-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="flex items-center space-x-2">
              <Clock size={14} className="text-gray-500" />
              <div>
                <p className="text-[9px] uppercase tracking-tighter text-gray-500 font-bold">Last Updated</p>
                <p className="text-xs font-medium">{result.lastUpdated}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                <p className="text-[9px] uppercase tracking-tighter text-gray-500 font-bold">Network Status</p>
                <p className="text-xs font-medium text-green-500">{result.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 flex items-start space-x-3">
          <AlertCircle size={18} className="text-orange-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Safety Tip: Never enter your secret passphrase anywhere except the official Pi Browser. We only require your public address.
          </p>
        </div>
      )}

      {/* Developer Verification Section */}
      <div className="glass-card p-6 rounded-[2.5rem] border border-cyan-500/20 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Activity size={22} className="text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold">Transaction Test</h2>
        </div>

        <p className="text-xs text-gray-500">
          This section helps you pass <b>Step 10</b> of the Pi Developer Checklist. Tap below to initiate a small payment (0.1 Pi).
        </p>

        <button
          onClick={() => {
            if (!window.Pi) {
              alert("Pi SDK not found. Please open this in the Pi Browser.");
              return;
            }

            try {
              window.Pi.createPayment({
                amount: 0.1,
                memo: "Developer Checklist Step 10 Verification",
                metadata: { type: "verification" }
              }, {
                onReadyForServerApproval: async (paymentId) => {
                  console.log("Payment ready for approval:", paymentId);
                  try {
                    const res = await fetch('/.netlify/functions/pi-approve', {
                      method: 'POST',
                      body: JSON.stringify({ paymentId }),
                    });
                    if (!res.ok) throw new Error("Approval failed on server");
                    console.log("Payment approved by server");
                  } catch (err) {
                    console.error("Approval error:", err);
                    alert("Server failed to approve payment. Make sure PI_API_KEY is set.");
                  }
                },
                onReadyForServerCompletion: async (paymentId, txid) => {
                  console.log("Payment ready for completion:", paymentId, txid);
                  try {
                    const res = await fetch('/.netlify/functions/pi-complete', {
                      method: 'POST',
                      body: JSON.stringify({ paymentId, txid }),
                    });
                    if (!res.ok) throw new Error("Completion failed on server");
                    alert("Payment Successfully Processed and Completed on Chain!");
                  } catch (err) {
                    console.error("Completion error:", err);
                    alert("Payment was submitted to chain but server failed to verify it.");
                  }
                },
                onCancel: (paymentId) => {
                  console.log("Payment cancelled:", paymentId);
                },
                onError: (error, paymentId) => {
                  console.error("Payment error:", error, paymentId);
                  alert("Payment Error: " + error.message);
                }
              });
            } catch (err) {
              console.error("Payment initiation failed:", err);
              alert("Failed to initiate payment. Check console.");
            }
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
        >
          INITIATE TRANSACTION (0.1 π)
        </button>
      </div>
    </div>
  );
};

export default WalletScreen;
