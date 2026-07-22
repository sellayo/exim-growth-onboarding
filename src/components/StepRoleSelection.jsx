import React from 'react';
import { motion } from 'framer-motion';
import { ROLES } from '../lib/constants';
import { ArrowRight, Check } from 'lucide-react';

export default function StepRoleSelection({ selectedRole, onSelectRole, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto py-6 px-4"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
        {/* Step Header */}
        <div className="mb-6 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full">
            Step 1 of 5
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 mt-3 tracking-tight font-sans">
            I am a...
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-1">
            Select your primary business function or professional status in the EXIM ecosystem.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[52vh] overflow-y-auto pr-1 py-1 mb-8">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => onSelectRole(role.id)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 relative flex items-start gap-3.5 group ${
                  isSelected
                    ? 'border-gold-500 bg-gradient-to-br from-gold-50/60 via-amber-50/20 to-white shadow-md ring-2 ring-gold-400/40'
                    : 'border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Role Icon Box */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-ocean-950 text-gold-400 shadow-sm'
                      : 'bg-white text-ocean-900 border border-slate-200 group-hover:bg-ocean-950 group-hover:text-gold-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Role Title & Subtext */}
                <div className="flex-1 min-w-0 pr-5">
                  <div className="font-bold text-sm text-ocean-950 leading-snug group-hover:text-ocean-900">
                    {role.title}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                {/* Selection Radio Circle */}
                <div className="absolute top-3.5 right-3.5">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-gold-500 border-gold-500 text-white shadow-sm'
                        : 'border-slate-300 bg-white group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium">
            {selectedRole ? '1 role selected' : 'Please select 1 role to continue'}
          </p>

          <button
            onClick={onNext}
            disabled={!selectedRole}
            className={`px-8 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition-all duration-200 ${
              selectedRole
                ? 'bg-ocean-950 text-white shadow-lg shadow-ocean-950/20 hover:bg-ocean-900 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-gold-500/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
