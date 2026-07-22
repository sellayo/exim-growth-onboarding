import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DYNAMIC_ROLE_CONFIG, ROLES } from '../lib/constants';
import { ArrowRight, ArrowLeft, Plus, Check, Sparkles, Tag, AlertCircle } from 'lucide-react';

export default function StepDynamicQuestions({ roleId, dynamicAnswers, onUpdateAnswer, onNext, onBack }) {
  const roleObj = ROLES.find(r => r.id === roleId);
  const questions = DYNAMIC_ROLE_CONFIG[roleId] || DYNAMIC_ROLE_CONFIG['other'];

  const [customInputValues, setCustomInputValues] = useState({});
  const [customAddedMap, setCustomAddedMap] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const toggleOption = (qKey, option) => {
    setErrorMsg(null);
    const current = dynamicAnswers[qKey] || [];
    let updated;
    if (current.includes(option)) {
      updated = current.filter(item => item !== option);
    } else {
      updated = [...current, option];
    }
    onUpdateAnswer(qKey, updated);
  };

  const handleAddCustom = (qKey) => {
    setErrorMsg(null);
    const customVal = customInputValues[qKey]?.trim();
    if (!customVal) return;

    // Add to local custom options list for this question
    setCustomAddedMap(prev => {
      const existing = prev[qKey] || [];
      if (!existing.includes(customVal)) {
        return { ...prev, [qKey]: [...existing, customVal] };
      }
      return prev;
    });

    // Mark it as selected in dynamicAnswers
    const current = dynamicAnswers[qKey] || [];
    if (!current.includes(customVal)) {
      onUpdateAnswer(qKey, [...current, customVal]);
    }

    // Clear input
    setCustomInputValues(prev => ({ ...prev, [qKey]: '' }));
  };

  const handleContinue = () => {
    // Check if at least 1 answer has been selected across all questions for this role
    const totalSelectedCount = questions.reduce((sum, q) => {
      const list = dynamicAnswers[q.key] || [];
      return sum + list.length;
    }, 0);

    if (totalSelectedCount === 0) {
      setErrorMsg('Please select or add at least one item to continue.');
      return;
    }

    setErrorMsg(null);
    onNext();
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full">
              Step 3 of 5
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" /> Tailored for <strong className="text-ocean-950">{roleObj?.title}</strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 mt-3 tracking-tight font-sans">
            Specialization & Domain
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-1">
            Tap pills to select options or type custom items below.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dynamic Questions List */}
        <div className="space-y-6">
          {questions.map((q) => {
            const selectedList = dynamicAnswers[q.key] || [];
            const customAddedList = customAddedMap[q.key] || [];

            // Combine standard options + custom added options + any pre-selected answers
            const allDisplayOptions = Array.from(new Set([
              ...q.options,
              ...customAddedList,
              ...selectedList
            ]));

            return (
              <div key={q.key} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-ocean-950 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gold-600" />
                      <span>{q.label}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{q.subtitle}</p>
                  </div>
                  {selectedList.length > 0 && (
                    <span className="text-[11px] font-bold text-ocean-900 bg-ocean-100/70 px-2.5 py-0.5 rounded-full">
                      {selectedList.length} selected
                    </span>
                  )}
                </div>

                {/* Interactive Pills Grid (Renders default + custom added pills) */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {allDisplayOptions.map((opt) => {
                    const isSelected = selectedList.includes(opt);
                    const isCustomItem = !q.options.includes(opt);

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleOption(q.key, opt)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 ${
                          isSelected
                            ? 'bg-ocean-950 text-gold-400 shadow-md ring-2 ring-gold-400/40 border border-ocean-800'
                            : 'bg-white text-slate-700 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-100/60'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-gold-400 stroke-[3]" />}
                        <span>{opt}</span>
                        {isCustomItem && (
                          <span className="text-[9px] uppercase tracking-wider bg-gold-400/20 text-gold-600 px-1.5 py-0.2 rounded font-extrabold ml-0.5">
                            Custom
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Item Entry Input */}
                {q.allowCustom && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2">
                    <input
                      type="text"
                      value={customInputValues[q.key] || ''}
                      onChange={(e) => setCustomInputValues({ ...customInputValues, [q.key]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustom(q.key);
                        }
                      }}
                      placeholder="+ Type custom product/service & click Add..."
                      className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium outline-none focus:border-ocean-950 focus:ring-2 focus:ring-ocean-950/10 text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustom(q.key)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold text-xs hover:from-gold-600 hover:to-gold-700 shadow-sm transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Add</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
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
            onClick={handleContinue}
            className="px-8 py-3.5 rounded-2xl bg-ocean-950 text-white font-bold text-base shadow-lg shadow-ocean-950/20 hover:bg-ocean-900 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 transition-all border border-gold-500/30"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
