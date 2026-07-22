import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ROLES, NETWORKS } from '../lib/constants';
import { ArrowLeft, ShieldAlert, CheckCircle2, Loader2, Send } from 'lucide-react';

export default function StepSubmission({ formData, onSubmit, onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const roleObj = ROLES.find(r => r.id === formData.role);
  const selectedNetworkObjs = NETWORKS.filter(n => formData.selectedNetworks.includes(n.id));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onSubmit();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit application. Please check network connection.');
      setIsSubmitting(false);
    }
  };

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
              Step 5 of 5
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Final Review
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 mt-3 tracking-tight font-sans">
            Community Guidelines
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-1">
            Review community standards and verify your details before submitting.
          </p>
        </div>

        {/* Community Guidelines Card */}
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-amber-950 text-base mb-1">
              Strict Verification Policy
            </h3>
            <p className="text-xs text-amber-900 leading-relaxed">
              Every application is manually reviewed. Provide accurate business info, respect members, avoid spam, and focus on genuine business opportunities.
            </p>
          </div>
        </div>

        {/* Application Summary Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ocean-950 border-b border-slate-200 pb-2">
            Application Summary
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Selected Role</span>
              <strong className="text-ocean-950 font-bold text-sm">{roleObj?.title || formData.role}</strong>
            </div>

            <div>
              <span className="text-slate-400 block">Applicant Name</span>
              <strong className="text-slate-900 font-bold text-sm">{formData.fullName}</strong>
            </div>

            <div>
              <span className="text-slate-400 block">Designation</span>
              <span className="text-slate-800 font-semibold">{formData.designation}</span>
            </div>

            <div>
              <span className="text-slate-400 block">Company Name</span>
              <span className="text-slate-800 font-semibold">{formData.companyName || 'N/A'}</span>
            </div>

            <div>
              <span className="text-slate-400 block">WhatsApp Phone</span>
              <span className="text-slate-800 font-semibold">{formData.phoneNumber} ({formData.country})</span>
            </div>

            {formData.socialMedia && (
              <div>
                <span className="text-slate-400 block">Social Media Link / ID</span>
                <span className="text-slate-800 font-semibold">{formData.socialMedia}</span>
              </div>
            )}

            <div>
              <span className="text-slate-400 block">Networks to Join ({selectedNetworkObjs.length})</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedNetworkObjs.map(n => (
                  <span key={n.id} className="px-2 py-0.5 rounded bg-ocean-100 text-ocean-900 text-[10px] font-bold">
                    {n.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="px-5 py-3 rounded-2xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm transition-all disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-9 py-4 rounded-2xl bg-gradient-to-r from-ocean-950 via-ocean-900 to-gold-600 text-white font-bold text-base shadow-xl shadow-ocean-950/25 hover:shadow-2xl hover:shadow-ocean-950/40 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 transition-all border border-gold-400/40"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-gold-400" />
                <span>Saving Application...</span>
              </>
            ) : (
              <>
                <span>Submit Application</span>
                <Send className="w-4 h-4 text-gold-400" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
