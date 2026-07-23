import React from 'react';
import { motion } from 'framer-motion';
import { ROLES, NETWORKS } from '../../lib/constants';
import { Users, Clock, CheckCircle2, XCircle, TrendingUp, Layers, Store, Handshake, Newspaper, MessageSquare } from 'lucide-react';

export default function AdminOverview({ submissions, onNavigateToTable }) {
  const total = submissions.length;
  const pending = submissions.filter(s => s.status === 'pending').length;
  const approved = submissions.filter(s => s.status === 'approved').length;
  const rejected = submissions.filter(s => s.status === 'rejected').length;

  // Calculate Role Distribution
  const roleCounts = {};
  ROLES.forEach(r => roleCounts[r.id] = 0);
  submissions.forEach(s => {
    if (s.role && roleCounts[s.role] !== undefined) {
      roleCounts[s.role] += 1;
    }
  });

  // Calculate Network Distribution
  const networkCounts = {
    marketplace: 0,
    services: 0,
    news: 0,
    discussion: 0,
  };
  submissions.forEach(s => {
    const netList = Array.isArray(s.selected_networks) ? s.selected_networks : [];
    netList.forEach(nId => {
      if (networkCounts[nId] !== undefined) {
        networkCounts[nId] += 1;
      }
    });
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Metric Cards 2x2 Grid Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Applications
            </span>
            <div className="text-3xl font-extrabold text-ocean-950 mt-1 font-sans">
              {total}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Submitted via Onboarding Flow</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-ocean-50 text-ocean-900 border border-ocean-200 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Review (Clickable to jump to Pending Filter) */}
        <div 
          onClick={() => onNavigateToTable('pending')}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200/90 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Pending Review
            </span>
            <div className="text-3xl font-extrabold text-amber-950 mt-1 font-sans">
              {pending}
            </div>
            <p className="text-[11px] text-amber-700 mt-0.5 group-hover:underline flex items-center gap-1">
              <span>Action required</span> →
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white shadow-sm flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Approved Members */}
        <div 
          onClick={() => onNavigateToTable('approved')}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/90 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Approved Members
            </span>
            <div className="text-3xl font-extrabold text-emerald-950 mt-1 font-sans">
              {approved}
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5 group-hover:underline">
              Verified community access
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white shadow-sm flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Rejected Applications */}
        <div 
          onClick={() => onNavigateToTable('rejected')}
          className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-200/90 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-800">
              Rejected / Spam
            </span>
            <div className="text-3xl font-extrabold text-red-950 mt-1 font-sans">
              {rejected}
            </div>
            <p className="text-[11px] text-red-700 mt-0.5 group-hover:underline">
              Blocked applications
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500 text-white shadow-sm flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Distribution Column (2 cols wide) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-ocean-950 flex items-center gap-2">
                <Layers className="w-4 h-4 text-gold-600" />
                <span>Role Distribution</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Application count by primary EXIM function</p>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              {ROLES.length} Ecosystem Roles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const count = roleCounts[r.id] || 0;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <div key={r.id} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-ocean-950 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{r.title}</h4>
                      <div className="w-24 bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-ocean-900 h-full rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-ocean-950">{count}</span>
                    <span className="text-[10px] text-slate-400 block">{percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Networks Subscription Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-ocean-950 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Networks</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                4 Hubs
              </span>
            </div>

            <div className="space-y-3">
              {NETWORKS.map((n) => {
                const count = networkCounts[n.id] || 0;
                const Icon = n.icon;

                return (
                  <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-ocean-950 text-gold-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-ocean-950">{n.title}</h4>
                        <p className="text-[10px] text-slate-400">Join requests</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-ocean-950">{count}</span>
                      <span className="text-[10px] text-slate-400 block">applicants</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateToTable('all')}
              className="w-full py-3 rounded-xl bg-ocean-950 hover:bg-ocean-900 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Manage All Applications</span> →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
