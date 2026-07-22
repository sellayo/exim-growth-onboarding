import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLES, NETWORKS } from '../../lib/constants';
import { 
  X, 
  User, 
  Building2, 
  Briefcase, 
  Phone, 
  Globe, 
  Mail, 
  Link as LinkIcon, 
  Linkedin, 
  Share2, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Calendar,
  ExternalLink,
  Tag
} from 'lucide-react';

export default function MemberDetailModal({ submission, onClose, onUpdateStatus, onDelete }) {
  if (!submission) return null;

  const roleObj = ROLES.find(r => r.id === submission.role);
  const selectedNetworkObjs = NETWORKS.filter(n => (submission.selected_networks || []).includes(n.id));

  // Format WhatsApp phone number for direct messaging
  const cleanPhone = (submission.phone_number || '').replace(/[^0-9]/g, '');
  const whatsappDirectUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

  // Format date
  const submittedAt = submission.created_at
    ? new Date(submission.created_at).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'N/A';

  const dynamicAns = submission.dynamic_answers || {};

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-auto"
        >
          {/* Top Header Bar */}
          <div className="px-6 py-4 bg-gradient-to-r from-ocean-950 to-ocean-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500 text-ocean-950 flex items-center justify-center font-extrabold shadow-sm">
                {submission.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">{submission.full_name}</h3>
                <p className="text-xs text-slate-300">Role: {roleObj?.title || submission.role}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Status & Actions Badge Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                {submission.status === 'approved' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                  </span>
                )}
                {submission.status === 'rejected' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Rejected
                  </span>
                )}
                {submission.status === 'pending' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Pending Manual Review
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {submittedAt}
                </span>
              </div>
            </div>

            {/* Basic Information Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ocean-950 mb-3 border-b pb-1">
                Basic Business Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-ocean-800" /> Full Name
                  </span>
                  <strong className="text-slate-900 font-bold text-sm">{submission.full_name}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-ocean-800" /> Designation
                  </span>
                  <strong className="text-slate-900 font-bold text-sm">{submission.designation || 'N/A'}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-ocean-800" /> Company Name
                  </span>
                  <strong className="text-slate-900 font-bold text-sm">{submission.company_name || 'N/A'}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-ocean-800" /> Country
                  </span>
                  <strong className="text-slate-900 font-bold text-sm">{submission.country}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-ocean-800" /> WhatsApp Phone
                  </span>
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold text-sm">{submission.phone_number}</strong>
                    {whatsappDirectUrl && (
                      <a
                        href={whatsappDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" /> Chat
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-ocean-800" /> Email
                  </span>
                  <strong className="text-slate-900 font-semibold">{submission.email || 'Not Provided'}</strong>
                </div>
              </div>
            </div>

            {/* Optional Links */}
            {(submission.website || submission.linkedin || submission.social_media) && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ocean-950 mb-2 border-b pb-1">
                  Web & Social Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {submission.website && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 truncate">
                      <span className="text-slate-400 block text-[10px]">Website</span>
                      <a 
                        href={submission.website.startsWith('http') ? submission.website : `https://${submission.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ocean-900 font-semibold hover:underline flex items-center gap-1 truncate"
                      >
                        <span>{submission.website}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                      </a>
                    </div>
                  )}

                  {submission.linkedin && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 truncate">
                      <span className="text-slate-400 block text-[10px]">LinkedIn</span>
                      <span className="text-slate-900 font-semibold truncate block">{submission.linkedin}</span>
                    </div>
                  )}

                  {submission.social_media && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 truncate">
                      <span className="text-slate-400 block text-[10px]">Social Media</span>
                      <span className="text-slate-900 font-semibold truncate block">{submission.social_media}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dynamic Role-Based Answers */}
            {Object.keys(dynamicAns).length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ocean-950 mb-2 border-b pb-1">
                  Role Specialization & Answers
                </h4>
                <div className="space-y-3">
                  {Object.entries(dynamicAns).map(([qKey, answers]) => (
                    <div key={qKey} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-xs font-bold text-ocean-950 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-gold-600" />
                        <span>{qKey.replace(/_/g, ' ')}</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(answers) && answers.map((ans, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-ocean-950 text-gold-400 font-bold text-xs">
                            {ans}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Networks */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ocean-950 mb-2 border-b pb-1">
                Requested WhatsApp Networks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedNetworkObjs.map((net) => {
                  const Icon = net.icon;
                  return (
                    <div key={net.id} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-emerald-950">{net.title}</h5>
                        <p className="text-[10px] text-emerald-700">Requested Access</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => onDelete(submission.id)}
              className="px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Record</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateStatus(submission.id, 'rejected')}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Reject</span>
              </button>

              <button
                onClick={() => onUpdateStatus(submission.id, 'approved')}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Member</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
