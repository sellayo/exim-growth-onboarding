import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { NETWORKS } from '../lib/constants';
import { CheckCircle2, MessageSquare, AlertTriangle, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react';

export default function StepSuccess({ formData, onReset }) {
  const selectedNetworkObjs = NETWORKS.filter(n => formData.selectedNetworks.includes(n.id));

  useEffect(() => {
    // Trigger celebration confetti on view
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#0B3FAD', '#F57E13', '#1052D4', '#E06208', '#10B981']
      });
    } catch (e) {
      console.log('Confetti failed to trigger:', e);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto py-8 px-4"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-ocean-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Official Logo Banner Badge */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-ocean-950 to-ocean-800 text-white shadow-xl mb-6 p-1 border border-gold-400/40">
          <img
            src="/logo.png"
            alt="EXIM Growth Network"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Success Checkmark Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Application Submitted Successfully</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ocean-950 tracking-tight font-sans mb-3">
          Thank You for Joining EXIM Growth
        </h1>

        {/* Body Text */}
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Your profile has been submitted successfully and is currently under manual review. Approvals usually take within 24 hours.
        </p>

        {/* Crucial Instruction Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 border-2 border-amber-300/80 text-left mb-8 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-amber-950 text-sm uppercase tracking-wide">
                Important Action Required
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 mt-1 font-medium leading-relaxed">
                Submitting this form does not automatically add you to the communities. Please request to join your selected WhatsApp networks below. Our admins will accept your request once your application is approved.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic WhatsApp Group Buttons */}
        <div className="mb-8 text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Selected WhatsApp Communities ({selectedNetworkObjs.length})</span>
            <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Group Links
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {selectedNetworkObjs.map((network) => {
              return (
                <a
                  key={network.id}
                  href={network.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white hover:border-emerald-600 hover:shadow-lg transition-all duration-200 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-emerald-950 group-hover:text-emerald-800">
                        {network.title}
                      </h4>
                      <p className="text-[11px] text-emerald-700 font-medium">
                        Click to Join WhatsApp Group
                      </p>
                    </div>
                  </div>

                  <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Restart / Submit Another Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center">
          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-ocean-950 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Submit another application</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
