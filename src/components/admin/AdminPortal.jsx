import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLogin from './AdminLogin';
import AdminOverview from './AdminOverview';
import AdminMembersTable from './AdminMembersTable';
import MemberDetailModal from './MemberDetailModal';
import { isAdminAuthenticated, logoutAdmin } from '../../lib/adminAuth';
import { fetchAllSubmissions, updateSubmissionStatus, deleteSubmission } from '../../lib/supabase';
import { ShieldCheck, LogOut, LayoutDashboard, Users, RefreshCw, ArrowLeft } from 'lucide-react';

export default function AdminPortal({ onExitAdmin }) {
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'members'
  const [statusFilterOverride, setStatusFilterOverride] = useState('all');
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllSubmissions();
      setSubmissions(data || []);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateSubmissionStatus(id, newStatus);
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      await deleteSubmission(id);
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    } catch (err) {
      console.error('Failed to delete submission:', err);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-4 px-4 sm:px-6 space-y-6">
      {/* Top Admin Header Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand & Admin Indicator */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="EXIM Growth Network"
            className="w-10 h-10 rounded-xl object-cover border border-ocean-800/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-ocean-950 tracking-tight leading-none font-sans">
                Admin Control Center
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Live
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              EXIM Growth Network • Verification & Management
            </p>
          </div>
        </div>

        {/* Center: Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-ocean-950 text-gold-400 shadow-md'
                : 'text-slate-600 hover:text-ocean-950'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview Stats</span>
          </button>

          <button
            onClick={() => {
              setStatusFilterOverride('all');
              setActiveTab('members');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'members'
                ? 'bg-ocean-950 text-gold-400 shadow-md'
                : 'text-slate-600 hover:text-ocean-950'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Member Applications ({submissions.length})</span>
          </button>
        </div>

        {/* Right: Exit / Logout Controls */}
        <div className="flex items-center gap-2">
          {onExitAdmin && (
            <button
              onClick={onExitAdmin}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>User View</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Tab View Rendering */}
      {activeTab === 'overview' ? (
        <AdminOverview
          submissions={submissions}
          onNavigateToTable={(filterStatus) => {
            setStatusFilterOverride(filterStatus);
            setActiveTab('members');
          }}
        />
      ) : (
        <AdminMembersTable
          submissions={submissions}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
          onInspect={(sub) => setSelectedSubmission(sub)}
          onRefresh={loadData}
          initialStatusFilter={statusFilterOverride}
        />
      )}

      {/* Member Detail Inspection Modal */}
      {selectedSubmission && (
        <MemberDetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
