import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ROLES, NETWORKS } from '../../lib/constants';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Download, 
  MessageSquare, 
  Building2, 
  Globe, 
  RefreshCw,
  Trash2
} from 'lucide-react';

export default function AdminMembersTable({ 
  submissions, 
  onUpdateStatus, 
  onDelete, 
  onInspect, 
  onRefresh,
  initialStatusFilter = 'all'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [roleFilter, setRoleFilter] = useState('all');
  const [networkFilter, setNetworkFilter] = useState('all');

  // Filter Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    // Search query
    const query = searchTerm.toLowerCase();
    const matchesSearch = !query || (
      sub.full_name?.toLowerCase().includes(query) ||
      sub.company_name?.toLowerCase().includes(query) ||
      sub.phone_number?.toLowerCase().includes(query) ||
      sub.country?.toLowerCase().includes(query) ||
      sub.email?.toLowerCase().includes(query) ||
      sub.designation?.toLowerCase().includes(query)
    );

    // Status filter
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;

    // Role filter
    const matchesRole = roleFilter === 'all' || sub.role === roleFilter;

    // Network filter
    const matchesNetwork = networkFilter === 'all' || (sub.selected_networks || []).includes(networkFilter);

    return matchesSearch && matchesStatus && matchesRole && matchesNetwork;
  });

  // Export Filtered Submissions to CSV
  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) return;

    const headers = [
      'ID', 'Full Name', 'Designation', 'Company Name', 'Role', 'Phone Number', 
      'Country', 'Email', 'Website', 'LinkedIn', 'Social Media', 'Selected Networks', 'Status', 'Submitted At'
    ];

    const rows = filteredSubmissions.map(s => [
      `"${s.id || ''}"`,
      `"${s.full_name || ''}"`,
      `"${s.designation || ''}"`,
      `"${s.company_name || ''}"`,
      `"${s.role || ''}"`,
      `"${s.phone_number || ''}"`,
      `"${s.country || ''}"`,
      `"${s.email || ''}"`,
      `"${s.website || ''}"`,
      `"${s.linkedin || ''}"`,
      `"${s.social_media || ''}"`,
      `"${(s.selected_networks || []).join(', ')}"`,
      `"${s.status || 'pending'}"`,
      `"${s.created_at || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EXIM_Members_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Search & Filter Header Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, company, phone, country..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:border-ocean-950 outline-none transition-all"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-ocean-950 text-white hover:bg-ocean-900 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border border-gold-500/30"
          >
            <Download className="w-3.5 h-3.5 text-gold-400" />
            <span>Export CSV ({filteredSubmissions.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Dropdowns Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5 text-ocean-950" />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none focus:border-ocean-950"
        >
          <option value="all">All Statuses ({submissions.length})</option>
          <option value="pending">Pending ({submissions.filter(s => s.status === 'pending').length})</option>
          <option value="approved">Approved ({submissions.filter(s => s.status === 'approved').length})</option>
          <option value="rejected">Rejected ({submissions.filter(s => s.status === 'rejected').length})</option>
        </select>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none focus:border-ocean-950 max-w-[180px]"
        >
          <option value="all">All Roles</option>
          {ROLES.map(r => (
            <option key={r.id} value={r.id}>{r.title}</option>
          ))}
        </select>

        {/* Network Filter */}
        <select
          value={networkFilter}
          onChange={(e) => setNetworkFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none focus:border-ocean-950"
        >
          <option value="all">All Networks</option>
          {NETWORKS.map(n => (
            <option key={n.id} value={n.id}>{n.title}</option>
          ))}
        </select>

        {/* Active filter count badge */}
        {(statusFilter !== 'all' || roleFilter !== 'all' || networkFilter !== 'all' || searchTerm) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setRoleFilter('all');
              setNetworkFilter('all');
            }}
            className="text-[11px] font-bold text-red-600 hover:underline ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3.5">Applicant Name</th>
                <th className="px-4 py-3.5">Role & Company</th>
                <th className="px-4 py-3.5">Phone / Country</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Submitted</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-400 font-semibold">
                    No member applications found matching your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const roleObj = ROLES.find(r => r.id === sub.role);
                  const cleanPhone = (sub.phone_number || '').replace(/[^0-9]/g, '');
                  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Designation */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 text-sm">{sub.full_name}</div>
                        <div className="text-[11px] text-slate-500">{sub.designation}</div>
                      </td>

                      {/* Role & Company */}
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-ocean-50 text-ocean-900 text-[10px] font-bold border border-ocean-200 inline-block mb-0.5">
                          {roleObj?.title || sub.role}
                        </span>
                        <div className="text-slate-800 text-xs font-semibold flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{sub.company_name || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Phone & Country */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span>{sub.phone_number}</span>
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 p-0.5"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{sub.country}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3.5">
                        {sub.status === 'approved' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                          </span>
                        )}
                        {sub.status === 'rejected' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300 inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-red-600" /> Rejected
                          </span>
                        )}
                        {(!sub.status || sub.status === 'pending') && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                        {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Profile */}
                          <button
                            onClick={() => onInspect(sub)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Approve */}
                          {sub.status !== 'approved' && (
                            <button
                              onClick={() => onUpdateStatus(sub.id, 'approved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 shadow-sm transition-all"
                            >
                              Approve
                            </button>
                          )}

                          {/* Quick Reject */}
                          {sub.status !== 'rejected' && (
                            <button
                              onClick={() => onUpdateStatus(sub.id, 'rejected')}
                              className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-300 transition-all"
                            >
                              Reject
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => onDelete(sub.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
