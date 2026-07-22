import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ currentStep, totalSteps }) {
  if (currentStep <= 0 || currentStep > totalSteps) return null;

  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full bg-slate-200/80 h-1.5 overflow-hidden relative">
      <motion.div
        className="h-full bg-gradient-to-r from-ocean-900 via-ocean-700 to-gold-500 shadow-sm"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}
