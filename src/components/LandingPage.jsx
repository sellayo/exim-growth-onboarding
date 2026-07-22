import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Users, Layers } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto py-8 sm:py-12 px-4"
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-12 text-center relative overflow-hidden">
        {/* Background decorative ambient lighting */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-ocean-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo Emblem */}
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-tr from-ocean-950 via-ocean-900 to-ocean-800 text-gold-400 shadow-2xl mb-8 p-1.5 border border-gold-400/40 relative group">
          <img
            src="/logo.png"
            alt="EXIM Growth Network Official Logo"
            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ocean-950 tracking-tight leading-tight mb-6 font-sans">
          Welcome to the <br />
          <span className="bg-gradient-to-r from-ocean-950 via-ocean-800 to-gold-600 bg-clip-text text-transparent">
            EXIM Growth Network
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal mb-8">
          most trusted EXIM community where manufacturers, exporters, importers, logistics providers, consultants, and trade professionals help each other solve business problems and create opportunities.
        </p>

        {/* Single Bullet Onboarding Checklist */}
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 font-semibold text-sm sm:text-base mb-10 shadow-sm">
          <span className="text-lg">✅</span>
          <span>choose the groups most relevant to you</span>
        </div>

        {/* Feature Pill Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-10 text-left">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
            <Shield className="w-5 h-5 text-ocean-900 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-ocean-950 uppercase tracking-wider">Vetted Profiles</h4>
              <p className="text-xs text-slate-500 mt-0.5">Manual review to block spam</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
            <Users className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-ocean-950 uppercase tracking-wider">Direct Access</h4>
              <p className="text-xs text-slate-500 mt-0.5">Connect with real traders</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
            <Layers className="w-5 h-5 text-ocean-900 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-ocean-950 uppercase tracking-wider">Segmented Groups</h4>
              <p className="text-xs text-slate-500 mt-0.5">High signal, tailored chats</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={onStart}
            className="w-full sm:w-auto min-w-[240px] px-8 py-4 bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-800 hover:from-ocean-900 hover:to-ocean-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-ocean-950/20 hover:shadow-xl hover:shadow-ocean-950/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 inline-flex items-center justify-center gap-3 border border-gold-500/30 group"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5 text-gold-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
