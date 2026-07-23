import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Share2, 
  ShieldCheck, 
  LogOut, 
  ArrowLeft, 
  X, 
  Menu, 
  FileText, 
  Sparkles,
  ShoppingBag,
  Store,
  Truck,
  Briefcase,
  HelpCircle
} from 'lucide-react';

export default function AdminSidebar({ 
  activeSection, 
  setActiveSection, 
  activeTab, 
  setActiveTab, 
  totalSubmissions, 
  totalTradePosts,
  onExitAdmin, 
  onLogout,
  isOpen,
  setIsOpen
}) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Main Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Header & Brand */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="EXIM Growth Network"
                className="w-9 h-9 rounded-xl object-cover border border-ocean-500/30"
              />
              <div>
                <h2 className="font-extrabold text-sm text-white tracking-tight leading-none">
                  <span className="text-blue-400">EXIM Growth</span> Hub
                </h2>
                <span className="text-[10px] font-bold text-gold-400 flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Admin Control
                </span>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
          {/* SECTION 1: MEMBER APPLICATIONS */}
          <div>
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              Applications Control
            </span>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setActiveSection('applications');
                  setActiveTab('overview');
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeSection === 'applications' && activeTab === 'overview'
                    ? 'bg-ocean-950 text-gold-400 border border-gold-500/30 shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-blue-400" />
                  <span>Overview & Stats</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveSection('applications');
                  setActiveTab('members');
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeSection === 'applications' && activeTab === 'members'
                    ? 'bg-ocean-950 text-gold-400 border border-gold-500/30 shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Member Applications</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-800 text-slate-300 rounded-full">
                  {totalSubmissions}
                </span>
              </button>
            </div>
          </div>

          {/* SECTION 2: TRADE POST GENERATION DATA */}
          <div>
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              Trade Posts & Leads Hub
            </span>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setActiveSection('tradeposts');
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeSection === 'tradeposts'
                    ? 'bg-ocean-950 text-gold-400 border border-gold-500/30 shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>Trade Posts Log</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-950 text-gold-400 border border-gold-500/30 rounded-full">
                  {totalTradePosts}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/50">
          {onExitAdmin && (
            <button
              type="button"
              onClick={onExitAdmin}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to User App</span>
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="w-full px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
