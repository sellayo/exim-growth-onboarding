import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  LogIn, 
  UserPlus, 
  BarChart3, 
  Building, 
  LayoutDashboard, 
  Sparkles, 
  ArrowRight,
  Eye,
  MessageSquare,
  Wand2,
  AlertCircle
} from 'lucide-react';
import { signInWithSupabase, signUpWithSupabase, resetPasswordWithSupabase } from '../../lib/supabase';
import { getLoggedInMember } from '../../lib/memberAuth';

export default function GuestAuthGate({ targetFeature = 'dashboard', onAuthSuccess, onNavigateToGenerator }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  
  // UI Feedback States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Content Configuration based on requested feature
  const featureConfigs = {
    analytics: {
      title: 'Lead Analytics & Impression Metrics',
      badge: 'Member Analytics Privileges',
      icon: BarChart3,
      tagline: 'Track real-time WhatsApp inquiry counts, CTR conversion rates, and buyer/supplier engagement for all your trade leads.',
      benefits: [
        '👁️ Real-time impression & page view tracking for all your trade posts',
        '💬 Direct WhatsApp inquiry click counter & conversion rate (CTR %)',
        '🎯 Top-performing trade lead highlights & category analytics'
      ]
    },
    profile: {
      title: 'EXIM Business Profile Creator',
      badge: 'Verified Business Directory',
      icon: Building,
      tagline: 'Build your verified enterprise profile with IEC/GSTIN codes, operating ports, and 6-image product gallery attached to your posts.',
      benefits: [
        '🏢 Verified enterprise page accessible at clean URLs (/profile/your-company)',
        '📸 6-Image high-res compressed product & facility photo gallery',
        '🔗 Auto-attach verified company profile link to all generated WhatsApp posts'
      ]
    },
    dashboard: {
      title: 'Member Control Center & Lead Manager',
      badge: 'Member Portal Privileges',
      icon: LayoutDashboard,
      tagline: 'Manage all your active trade posts, toggle order fulfillment status in 1 click, and edit details in 15 seconds.',
      benefits: [
        '⚡ 1-Click trade lead status toggle (Mark Fulfilled / Re-open Lead)',
        '⏱️ 15-Second lead editing to prefill specs without retyping',
        '📋 Consolidated dashboard of all your active buy/sell trade leads'
      ]
    }
  };

  const config = featureConfigs[targetFeature] || featureConfigs.dashboard;
  const FeatureIcon = config.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    if (!password || !password.trim()) {
      setErrorMsg('Please enter your password.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (authMode === 'register') {
        if (password.trim().length < 4) {
          setErrorMsg('Password must be at least 4 characters long.');
          setIsSubmitting(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match. Please re-enter.');
          setIsSubmitting(false);
          return;
        }

        const res = await signUpWithSupabase({
          email,
          password,
          fullName,
          companyName,
          phone
        });

        if (res.needsVerification) {
          setSuccessMsg(res.message);
          setIsSubmitting(false);
          return;
        }

        const memberUser = res.user || getLoggedInMember();
        if (onAuthSuccess) onAuthSuccess(memberUser);
      } else {
        const user = await signInWithSupabase({
          email,
          password
        });
        if (onAuthSuccess) onAuthSuccess(user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter your valid email address in the field above first.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPasswordWithSupabase(email);
      setSuccessMsg(res.message);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-8 px-3 sm:px-6 font-sans">
      {/* Top Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-ocean-950 via-ocean-900 to-slate-900 text-white p-6 sm:p-8 border border-ocean-800 shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ocean-800/80 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold-400 text-ocean-950 flex items-center justify-center font-black shadow-lg shrink-0">
              <FeatureIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                <Lock className="w-3 h-3" />
                <span>{config.badge}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                {config.title}
              </h1>
            </div>
          </div>

          {onNavigateToGenerator && (
            <button
              type="button"
              onClick={onNavigateToGenerator}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer shrink-0"
            >
              <Wand2 className="w-4 h-4 text-gold-400" />
              <span>Use Post Generator (Free)</span>
            </button>
          )}
        </div>

        {/* Feature Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {config.benefits.map((benefit, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-ocean-900/90 border border-ocean-800 text-xs font-semibold text-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{benefit}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Authentication Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
      >
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-4 px-6 text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-ocean-950 border-b-2 border-ocean-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <LogIn className="w-4 h-4 text-ocean-950" />
            <span>Log In to Member Account</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-4 px-6 text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-white text-ocean-950 border-b-2 border-ocean-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <UserPlus className="w-4 h-4 text-gold-600" />
            <span>Create New Account</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-950 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Company / Enterprise Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Malabar Spices Pvt Ltd"
                    value={companyName}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-950 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Business Email Address</label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-950 transition-all"
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">WhatsApp / Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-950 transition-all"
                />
              </div>
            )}

            <div className={`grid grid-cols-1 ${authMode === 'register' ? 'sm:grid-cols-2' : ''} gap-4`}>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] font-extrabold text-ocean-950 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-950 transition-all"
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-950 transition-all"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-ocean-950 hover:bg-ocean-900 text-gold-400 font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{authMode === 'register' ? 'Complete Registration & Access Page' : 'Log In & Access Page'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guest Clarification Footer */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
            <span>Looking to create a WhatsApp trade post right away? </span>
            <button
              type="button"
              onClick={onNavigateToGenerator}
              className="font-bold text-ocean-950 hover:underline cursor-pointer"
            >
              Go to Post Generator (No login needed)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
