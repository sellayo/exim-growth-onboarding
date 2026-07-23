import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Navbar({ currentStep, totalSteps, isLanding, onReset }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <img
            src="/logo.png"
            alt="EXIM Growth Network Logo"
            className="w-10 h-10 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-200 border border-ocean-700/30"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight leading-none font-sans">
                <span className="text-[#0B3FAD]">EXIM Growth</span>{' '}
                <span className="text-[#F57E13]">Network</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">
              Global Trade Community
            </p>
          </div>
        </div>

        {/* Status Badge or Security Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Professional Community</span>
          </div>

          {!isLanding && currentStep > 0 && currentStep <= totalSteps && (
            <div className="text-xs font-semibold px-3 py-1 bg-ocean-50 text-ocean-900 rounded-full border border-ocean-200">
              Step {currentStep} of {totalSteps}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
