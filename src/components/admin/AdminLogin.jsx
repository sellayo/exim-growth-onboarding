import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react';
import { loginAdmin } from '../../lib/adminAuth';

export default function AdminLogin({ onAuthenticated }) {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginAdmin(passcode)) {
      setErrorMsg('');
      onAuthenticated();
    } else {
      setErrorMsg('Invalid admin passcode. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto py-12 px-4"
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-ocean-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header emblem */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-ocean-950 to-ocean-900 text-gold-400 shadow-xl mb-6 border border-gold-400/30">
          <KeyRound className="w-8 h-8 text-gold-400" />
        </div>

        <h2 className="text-2xl font-extrabold text-ocean-950 tracking-tight font-sans mb-1">
          Admin Control Center
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mb-6">
          Enter admin security passcode to access member management & approval tools.
        </p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-ocean-800" />
              <span>Admin Security Passcode</span>
            </label>

            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter passcode (e.g. admin123)"
                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium focus:bg-white focus:border-ocean-950 focus:ring-2 focus:ring-ocean-950/10 outline-none transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                ⚠️ {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ocean-950 via-ocean-900 to-gold-600 text-white font-bold text-sm shadow-lg shadow-ocean-950/20 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer border border-gold-400/40"
          >
            <span>Authenticate & Access</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Restricted Admin Portal Access</span>
        </div>
      </div>
    </motion.div>
  );
}
