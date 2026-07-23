import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLogin from './AdminLogin';
import AdminOverview from './AdminOverview';
import AdminMembersTable from './AdminMembersTable';
import MemberDetailModal from './MemberDetailModal';
import AdminSidebar from './AdminSidebar';
import AdminTradePostsHub from './AdminTradePostsHub';
import { isAdminAuthenticated, logoutAdmin } from '../../lib/adminAuth';
import { 
  fetchAllSubmissions, 
  updateSubmissionStatus, 
  deleteSubmission, 
  fetchAllTradePosts 
} from '../../lib/supabase';
import { 
  ShieldCheck, 
  LogOut, 
  LayoutDashboard, 
  Users, 
  RefreshCw, 
  ArrowLeft, 
  Menu, 
  Share2 
} from 'lucide-react';

export default function AdminPortal({ onExitAdmin }) {
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [activeSection, setActiveSection] = useState('applications'); // 'applications' | 'tradeposts'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'members'
  const [statusFilterOverride, setStatusFilterOverride] = useState('all');
  
  const [submissions, setSubmissions] = useState([]);
  const [tradePosts, setTradePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subsData, postsData] = await Promise.all([
        fetchAllSubmissions(),
        fetchAllTradePosts()
      ]);
      setSubmissions(subsData || []);
      setTradePosts(postsData || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
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
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900 w-full overflow-x-hidden">
      {/* SIDEBAR NAVIGATION */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalSubmissions={submissions.length}
        totalTradePosts={tradePosts.length}
        onExitAdmin={onExitAdmin}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col p-3 sm:p-6 space-y-5 overflow-y-auto">
        {/* MOBILE & DESKTOP TOP CONTROLS BAR */}
        <div className="p-3.5 sm:p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-sm sm:text-lg text-ocean-950 tracking-tight leading-none">
                  {activeSection === 'applications' 
                    ? (activeTab === 'overview' ? 'Applications Overview' : 'Member Control Center') 
                    : 'Trade Posts & Leads Hub'}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full hidden sm:inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Live
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                EXIM Growth Network • Admin Management Portal
              </p>
            </div>
          </div>

          {/* Section Navigation Tabs (When in Applications Control) */}
          {activeSection === 'applications' && (
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-ocean-950 text-gold-400 shadow-sm'
                    : 'text-slate-600 hover:text-ocean-950'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusFilterOverride('all');
                  setActiveTab('members');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'members'
                    ? 'bg-ocean-950 text-gold-400 shadow-sm'
                    : 'text-slate-600 hover:text-ocean-950'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Applications ({submissions.length})</span>
              </button>
            </div>
          )}

          {/* Quick Refresh Button */}
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Sync Data</span>
          </button>
        </div>

        {/* SECTION VIEW RENDERING */}
        {activeSection === 'applications' ? (
          activeTab === 'overview' ? (
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
          )
        ) : (
          <AdminTradePostsHub
            tradePosts={tradePosts}
            onRefresh={loadData}
          />
        )}
      </main>

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
