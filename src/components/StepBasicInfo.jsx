import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { COUNTRIES, ROLES } from '../lib/constants';
import { ArrowRight, ArrowLeft, User, Building2, Briefcase, Phone, Globe, Mail, Link as LinkIcon, Linkedin, AlertCircle } from 'lucide-react';

export default function StepBasicInfo({ formData, onChange, onNext, onBack, roleId }) {
  const roleObj = ROLES.find(r => r.id === roleId);
  const isCompanyOptional = roleId === 'student' || roleId === 'aspiring_exporter';

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    // Full Name
    if (!formData.fullName?.trim()) {
      errs.fullName = 'Full name is required';
    }

    // Designation
    if (!formData.designation?.trim()) {
      errs.designation = 'Designation is required';
    }

    // Phone Number validation (Must be 7-15 digits, allowing leading +, spaces, dashes)
    const phoneVal = formData.phoneNumber?.trim() || '';
    const phoneDigits = phoneVal.replace(/[^0-9]/g, '');
    if (!phoneVal) {
      errs.phoneNumber = 'Phone number is required';
    } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      errs.phoneNumber = 'Please enter a valid phone number (7-15 digits)';
    }

    // Country
    if (!formData.country?.trim()) {
      errs.country = 'Country is required';
    }

    // Company Name (Required unless student / aspiring_exporter)
    if (!isCompanyOptional && !formData.companyName?.trim()) {
      errs.companyName = `Company name is required for ${roleObj?.title || 'your role'}`;
    }

    // Email validation (if filled)
    const emailVal = formData.email?.trim() || '';
    if (emailVal) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        errs.email = 'Please enter a valid email address (e.g. name@company.com)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    } else {
      // Scroll to top of card so errors are immediately visible
      window.scrollTo({ top: 100, behavior: 'smooth' });
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full">
              Step 2 of 5
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Role: <strong className="text-ocean-950">{roleObj?.title || roleId}</strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 mt-3 tracking-tight font-sans">
            Basic Details
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-1">
            Provide your business contact details for manual community verification.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleContinue} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-ocean-800" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                value={formData.fullName || ''}
                onChange={(e) => {
                  onChange('fullName', e.target.value);
                  if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null }));
                }}
                placeholder="e.g. Rajesh Sharma"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${
                  errors.fullName
                    ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400'
                    : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-ocean-950 focus:ring-2 focus:ring-ocean-950/10'
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-ocean-800" />
                <span>Designation *</span>
              </label>
              <input
                type="text"
                value={formData.designation || ''}
                onChange={(e) => {
                  onChange('designation', e.target.value);
                  if (errors.designation) setErrors(prev => ({ ...prev, designation: null }));
                }}
                placeholder="e.g. Founder & Managing Director"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${
                  errors.designation
                    ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400'
                    : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-ocean-950 focus:ring-2 focus:ring-ocean-950/10'
                }`}
              />
              {errors.designation && (
                <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.designation}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-ocean-800" />
                <span>Phone Number (WhatsApp) *</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber || ''}
                onChange={(e) => {
                  onChange('phoneNumber', e.target.value);
                  if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: null }));
                }}
                placeholder="+91 98765 43210"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${
                  errors.phoneNumber
                    ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400'
                    : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-ocean-950 focus:ring-2 focus:ring-ocean-950/10'
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-ocean-800" />
                <span>Country *</span>
              </label>
              <select
                value={formData.country || ''}
                onChange={(e) => {
                  onChange('country', e.target.value);
                  if (errors.country) setErrors(prev => ({ ...prev, country: null }));
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none bg-slate-50/50 focus:bg-white ${
                  errors.country
                    ? 'border-red-400 text-red-900 focus:ring-2 focus:ring-red-400'
                    : 'border-slate-200 text-slate-900 focus:border-ocean-950 focus:ring-2 focus:ring-ocean-950/10'
                }`}
              >
                <option value="">-- Select Country --</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other Country</option>
              </select>
              {errors.country && (
                <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.country}
                </p>
              )}
            </div>
          </div>

          {/* Company Name (Conditional Requirement) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-ocean-800" />
                <span>Company Name {isCompanyOptional ? '(Optional)' : '*'}</span>
              </label>
              {isCompanyOptional && (
                <span className="text-[11px] text-gold-700 font-semibold bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                  Optional for {roleObj?.title}
                </span>
              )}
            </div>
            <input
              type="text"
              value={formData.companyName || ''}
              onChange={(e) => {
                onChange('companyName', e.target.value);
                if (errors.companyName) setErrors(prev => ({ ...prev, companyName: null }));
              }}
              placeholder="e.g. Apex Global International Pvt Ltd"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${
                errors.companyName
                  ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400'
                  : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-ocean-950 focus:ring-2 focus:ring-ocean-950/10'
              }`}
            />
            {errors.companyName && (
              <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.companyName}
              </p>
            )}
          </div>

          {/* Optional Fields Divider */}
          <div className="pt-3 pb-1 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Web & Social Presence
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>Email</span>
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => {
                  onChange('email', e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                }}
                placeholder="name@company.com"
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium transition-all outline-none ${
                  errors.email
                    ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400'
                    : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-ocean-950'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-slate-400" />
                <span>Website</span>
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => onChange('website', e.target.value)}
                placeholder="https://company.com"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:border-ocean-950 outline-none"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                <Linkedin className="w-3 h-3 text-slate-400" />
                <span>LinkedIn</span>
              </label>
              <input
                type="text"
                value={formData.linkedin || ''}
                onChange={(e) => onChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/username"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:border-ocean-950 outline-none"
              />
            </div>
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
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-ocean-950 text-white font-bold text-base shadow-lg shadow-ocean-950/20 hover:bg-ocean-900 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 transition-all border border-gold-500/30"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
