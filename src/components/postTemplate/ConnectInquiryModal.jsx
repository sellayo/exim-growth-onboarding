import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  X, 
  Building, 
  User, 
  Phone, 
  Mail, 
  Package, 
  DollarSign, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { sendTradeInquiry } from '../../lib/supabase';
import { getLoggedInMember } from '../../lib/memberAuth';

export default function ConnectInquiryModal({ post, isOpen, onClose, onSuccess }) {
  const member = getLoggedInMember();

  const [formData, setFormData] = useState({
    senderName: member?.name || member?.contactName || '',
    senderCompany: member?.companyName || member?.company_name || '',
    senderPhone: member?.phone || member?.contact_phone || '',
    senderEmail: member?.email || member?.contact_email || '',
    senderDesignation: member?.designation || 'Managing Director',
    offeredPrice: '',
    quantityMoq: post?.quantity_or_moq || '',
    portLocation: post?.origin_or_location || post?.destination || '',
    timeline: post?.timeline || 'Immediate',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !post) return null;

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.senderName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.senderPhone.trim() && !formData.senderEmail.trim()) {
      setErrorMsg('Please enter at least a phone number or email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        postId: post.id,
        postTitle: post.product_or_service || 'Trade Requirement',
        postType: post.template_type || 'buyer',
        receiverId: post.user_id || null,
        receiverEmail: post.contact_email || '',
        receiverPhone: post.contact_phone || '',
        receiverCompany: post.company_name || 'EXIM Trader',
        senderName: formData.senderName,
        senderCompany: formData.senderCompany,
        senderPhone: formData.senderPhone,
        senderEmail: formData.senderEmail,
        senderDesignation: formData.senderDesignation,
        offeredPrice: formData.offeredPrice,
        quantityMoq: formData.quantityMoq,
        portLocation: formData.portLocation,
        timeline: formData.timeline,
        message: formData.message
      };

      await sendTradeInquiry(payload);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2200);
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-ocean-950 border border-ocean-800 rounded-3xl shadow-2xl overflow-hidden my-6 text-slate-100"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-ocean-900 via-ocean-950 to-slate-900 border-b border-ocean-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 font-bold">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight">
                  In-Platform Trade Connection
                </h3>
                <p className="text-xs text-gold-400 font-medium">
                  Direct B2B Inquiry to {post.company_name || 'Post Poster'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-ocean-800/60 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Animated State */}
          {isSubmitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-white">Trade Proposal Dispatched!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Your direct trade inquiry has been submitted to <strong className="text-gold-400">{post.company_name || 'the poster'}</strong>. They will see it in their <strong className="text-emerald-400">Leads Dashboard</strong>.
              </p>
              <p className="text-[11px] text-slate-400">
                You can track this proposal anytime under your <strong className="text-gold-400">Dashboard &gt; Leads (Sent Inquiries)</strong> navigation.
              </p>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Post Reference Card Summary */}
              <div className="p-3.5 rounded-2xl bg-ocean-900/70 border border-ocean-800/80 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">INQUIRING ABOUT POST</span>
                  <div className="font-extrabold text-white text-sm truncate">{post.product_or_service || 'Trade Requirement'}</div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-gold-400/10 border border-gold-400/30 text-gold-400 font-extrabold text-[10px] shrink-0 uppercase tracking-wider">
                  {post.template_type === 'buyer' ? 'Buy Requirement' : post.template_type === 'supplier' ? 'Supply Offer' : 'Trade Post'}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              {/* Section 1: Pre-filled Sender Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gold-400 border-b border-ocean-800 pb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>YOUR CONTACT & ENTERPRISE DETAILS (PRE-FILLED)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Your Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={formData.senderName}
                        onChange={(e) => handleChange('senderName', e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-ocean-800 text-white text-xs font-medium focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Company / Enterprise Name</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={formData.senderCompany}
                        onChange={(e) => handleChange('senderCompany', e.target.value)}
                        placeholder="e.g. Apex Global Exports"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-ocean-800 text-white text-xs font-medium focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Phone / WhatsApp Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={formData.senderPhone}
                        onChange={(e) => handleChange('senderPhone', e.target.value)}
                        placeholder="e.g. +91 9876543210"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-ocean-800 text-white text-xs font-medium focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={formData.senderEmail}
                        onChange={(e) => handleChange('senderEmail', e.target.value)}
                        placeholder="e.g. rajesh@apexglobal.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-ocean-800 text-white text-xs font-medium focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Proposal Details */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 border-b border-ocean-800 pb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>YOUR TRADE PROPOSAL & TERMS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Offered / Target Price</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={formData.offeredPrice}
                        onChange={(e) => handleChange('offeredPrice', e.target.value)}
                        placeholder="e.g. $1,250 / MT FOB"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-ocean-800 text-white text-xs font-medium focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Volume / Quantity / MOQ</label>
                    <div className="relative">
                      <Package className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={formData.quantityMoq}
                        onChange={(e) => handleChange('quantityMoq', e.target.value)}
                        placeholder="e.g. 2 x 40ft High Cube Container"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-ocean-800 text-white text-xs font-medium focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Port / Shipping Location</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={formData.portLocation}
                        onChange={(e) => handleChange('portLocation', e.target.value)}
                        placeholder="e.g. Cochin Port / Jebel Ali"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-ocean-800 text-white text-xs font-medium focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Delivery Timeline</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={formData.timeline}
                        onChange={(e) => handleChange('timeline', e.target.value)}
                        placeholder="e.g. Immediate / Next 14 Days"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-ocean-800 text-white text-xs font-medium focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Proposal Message / Remarks</label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Specify your requirements, product specs, certifications, payment terms, or custom notes..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-ocean-800 text-white text-xs font-medium focus:border-emerald-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-ocean-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Direct Proposal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
