import React from 'react';
import { motion } from 'framer-motion';
import { NETWORKS } from '../lib/constants';
import { ArrowRight, ArrowLeft, Check, Users2 } from 'lucide-react';

export default function StepNetworkSelection({ selectedNetworks, onToggleNetwork, onNext, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto py-6 px-4"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
        {/* Step Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full">
              Step 4 of 5
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Users2 className="w-3.5 h-3.5 text-ocean-800" /> WhatsApp Community Hubs
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 mt-3 tracking-tight font-sans">
            Which network would you like to join?
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-1">
            Choose one or multiple community channels relevant to your daily business needs.
          </p>
        </div>

        {/* Networks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {NETWORKS.map((network) => {
            const Icon = network.icon;
            const isSelected = selectedNetworks.includes(network.id);

            return (
              <button
                key={network.id}
                type="button"
                onClick={() => onToggleNetwork(network.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between group ${
                  isSelected
                    ? 'border-gold-500 bg-gradient-to-br from-gold-50/50 via-amber-50/20 to-white shadow-lg ring-2 ring-gold-400/40'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-ocean-950 text-gold-400 shadow-sm'
                          : 'bg-white text-ocean-900 border border-slate-200 group-hover:bg-ocean-950 group-hover:text-gold-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-gold-500 border-gold-500 text-white shadow-sm'
                          : 'border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-ocean-950 group-hover:text-ocean-900 mb-1">
                    {network.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {network.subtext}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-gold-700' : 'text-slate-400'}`}>
                    {isSelected ? '✓ Selected' : '+ Tap to Select'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3 rounded-2xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={selectedNetworks.length === 0}
            className={`px-8 py-3.5 rounded-2xl font-bold text-base flex items-center gap-2 transition-all duration-200 ${
              selectedNetworks.length > 0
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
