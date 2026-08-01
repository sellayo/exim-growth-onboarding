import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, 
  Send, 
  Search, 
  Filter, 
  Building, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  Package, 
  DollarSign, 
  MapPin, 
  Clock, 
  Calendar, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { fetchReceivedInquiries, fetchSentInquiries } from '../../lib/supabase';
import { getLoggedInMember } from '../../lib/memberAuth';

export default function LeadsInquiriesView({ onInspectPost, onNavigateToGenerator }) {
  const member = getLoggedInMember();
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
  const [receivedLeads, setReceivedLeads] = useState([]);
  const [sentLeads, setSentLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadInquiriesData = async () => {
    setIsLoading(true);
    try {
      if (member) {
        const inbound = await fetchReceivedInquiries(member.id, member.email, member.phone);
        setReceivedLeads(inbound);

        const outbound = await fetchSentInquiries(member.id, member.email, member.phone);
        setSentLeads(outbound);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInquiriesData();
  }, [member?.id]);

  const currentList = activeTab === 'received' ? receivedLeads : sentLeads;
  const filteredList = currentList.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.post_title && item.post_title.toLowerCase().includes(q)) ||
      (item.sender_name && item.sender_name.toLowerCase().includes(q)) ||
      (item.sender_company && item.sender_company.toLowerCase().includes(q)) ||
      (item.receiver_company && item.receiver_company.toLowerCase().includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q)) ||
      (item.offered_price && item.offered_price.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 font-sans text-slate-100 selection:bg-gold-500 selection:text-white">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-ocean-950 via-ocean-900 to-slate-900 border border-ocean-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-400 text-xs font-black uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>In-Platform B2B Trade Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Trade Leads & Direct Inquiries
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-1 max-w-xl leading-relaxed">
              Track incoming trade proposals from EXIM members, respond directly, and monitor your submitted outreach.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadInquiriesData}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 border border-ocean-700 text-slate-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-gold-400' : ''}`} />
              <span>Refresh Pipeline</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="mt-6 pt-4 border-t border-ocean-800/60 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('received')}
            className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'received'
                ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 shadow-lg shadow-gold-500/20'
                : 'bg-ocean-900/80 hover:bg-ocean-800 text-slate-300 border border-ocean-800'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Received Inquiries (Inbound Leads)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'received' ? 'bg-slate-950 text-gold-400' : 'bg-ocean-800 text-slate-300'
            }`}>
              {receivedLeads.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sent')}
            className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'sent'
                ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 shadow-lg shadow-gold-500/20'
                : 'bg-ocean-900/80 hover:bg-ocean-800 text-slate-300 border border-ocean-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent Inquiries (Outbound Outreach)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'sent' ? 'bg-slate-950 text-gold-400' : 'bg-ocean-800 text-slate-300'
            }`}>
              {sentLeads.length}
            </span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === 'received' ? 'inbound' : 'outbound'} leads by name, company, price...`}
            className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-ocean-950 border border-ocean-800 text-white text-xs font-medium focus:border-gold-400 focus:outline-none"
          />
        </div>

        <div className="text-xs font-bold text-slate-400">
          Showing <span className="text-gold-400 font-extrabold">{filteredList.length}</span> {activeTab === 'received' ? 'Received' : 'Sent'} Inquiries
        </div>
      </div>

      {/* Inquiry List Cards */}
      {isLoading ? (
        <div className="p-12 text-center bg-ocean-950 border border-ocean-800 rounded-3xl">
          <div className="w-10 h-10 border-4 border-ocean-900 border-t-gold-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-bold text-slate-400">Loading Trade Proposals...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center bg-ocean-950/80 border border-ocean-800 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-ocean-900 text-gold-400 flex items-center justify-center mx-auto border border-ocean-800 font-bold">
            {activeTab === 'received' ? <Inbox className="w-7 h-7" /> : <Send className="w-7 h-7" />}
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              {activeTab === 'received' ? 'No Received Inquiries Yet' : 'No Sent Inquiries Yet'}
            </h3>
            <p className="text-xs text-slate-400 font-medium max-w-md mx-auto mt-1 leading-relaxed">
              {activeTab === 'received'
                ? 'When other EXIM traders click "Connect on Platform" on your trade posts, their detailed proposals will show up here.'
                : 'Explore live trade posts on the main network and click "Connect & Send In-Platform Inquiry" to reach out.'}
            </p>
          </div>
          {onNavigateToGenerator && (
            <button
              onClick={() => onNavigateToGenerator()}
              type="button"
              className="px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-slate-950 font-black text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish New Trade Post</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => {
            const isReceived = activeTab === 'received';
            const counterpartyName = isReceived ? item.sender_name : item.receiver_company;
            const counterpartyCompany = isReceived ? item.sender_company : item.receiver_company;
            const counterpartyPhone = isReceived ? item.sender_phone : item.receiver_phone;
            const counterpartyEmail = isReceived ? item.sender_email : item.receiver_email;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-ocean-950/90 border border-ocean-800/90 hover:border-gold-500/40 transition-all shadow-xl space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-ocean-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        isReceived ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-gold-400/10 border border-gold-400/30 text-gold-400'
                      }`}>
                        {isReceived ? 'INBOUND INQUIRY' : 'OUTBOUND PROPOSAL'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.created_at ? new Date(item.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently'}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>Post: {item.post_title}</span>
                      {item.post_id && onInspectPost && (
                        <button
                          onClick={() => onInspectPost(item.post_id)}
                          type="button"
                          className="text-xs text-gold-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>(View Post)</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </h3>
                  </div>

                  {/* Counterparty Identity Badge */}
                  <div className="px-3.5 py-2 rounded-2xl bg-slate-900 border border-ocean-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gold-400/10 text-gold-400 flex items-center justify-center font-black text-xs">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">{counterpartyCompany || counterpartyName || 'EXIM Trader'}</div>
                      <div className="text-[10px] text-slate-400 font-bold">
                        {isReceived ? `Sender: ${item.sender_name || 'Verified Member'}` : `Recipient Company`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proposal Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-ocean-900 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">OFFERED PRICE</span>
                    <div className="font-extrabold text-emerald-400 mt-0.5">
                      {item.offered_price || 'Negotiable'}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MOQ / QUANTITY</span>
                    <div className="font-extrabold text-white mt-0.5">
                      {item.quantity_moq || 'As requested'}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PORT / LOCATION</span>
                    <div className="font-extrabold text-white mt-0.5 truncate">
                      {item.port_location || 'N/A'}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TIMELINE</span>
                    <div className="font-extrabold text-white mt-0.5">
                      {item.timeline || 'Immediate'}
                    </div>
                  </div>
                </div>

                {/* Message / Remarks */}
                {item.message && (
                  <div className="p-3.5 rounded-2xl bg-ocean-900/70 border border-ocean-800 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">PROPOSAL REMARKS / REQ DETAILS</span>
                    <p className="text-slate-200 font-medium leading-relaxed whitespace-pre-wrap">
                      "{item.message}"
                    </p>
                  </div>
                )}

                {/* Sender Contact Details & Action Bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    {counterpartyPhone && (
                      <div className="flex items-center gap-1.5 font-bold">
                        <Phone className="w-3.5 h-3.5 text-gold-400" />
                        <span>{counterpartyPhone}</span>
                      </div>
                    )}
                    {counterpartyEmail && (
                      <div className="flex items-center gap-1.5 font-bold">
                        <Mail className="w-3.5 h-3.5 text-gold-400" />
                        <span>{counterpartyEmail}</span>
                      </div>
                    )}
                  </div>

                  {/* Direct Contact Actions */}
                  <div className="flex items-center gap-2">
                    {counterpartyPhone && (
                      <a
                        href={`https://api.whatsapp.com/send?phone=${counterpartyPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Hi ${counterpartyName || ''}, regarding your trade proposal for ${item.post_title || 'EXIM Requirement'} on EXIM Growth Network.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>Reply on WA</span>
                      </a>
                    )}

                    {counterpartyEmail && (
                      <a
                        href={`mailto:${counterpartyEmail}?subject=${encodeURIComponent(`EXIM Trade Proposal Response: ${item.post_title}`)}`}
                        className="px-3.5 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-slate-200 border border-ocean-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-gold-400" />
                        <span>Send Email</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
