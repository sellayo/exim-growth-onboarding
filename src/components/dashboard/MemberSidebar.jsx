import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Wand2, 
  LogOut, 
  User, 
  Building, 
  Globe, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronLeft,
  ChevronRight,
  LogIn,
  Sparkles,
  BarChart3,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getLoggedInMember, logoutMember } from '../../lib/memberAuth';
import { signOutSupabase } from '../../lib/supabase';

export default function MemberSidebar({ children, activeTab, onNavigate }) {
  const [member, setMember] = useState(getLoggedInMember());
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync member state dynamically
  useEffect(() => {
    const checkMember = () => {
      setMember(getLoggedInMember());
    };
    window.addEventListener('storage', checkMember);
    const interval = setInterval(checkMember, 1000);
    return () => {
      window.removeEventListener('storage', checkMember);
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = async () => {
    await signOutSupabase();
    logoutMember();
    setMember(null);
    if (onNavigate) onNavigate('home');
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Member Dashboard',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => {
        setIsMobileOpen(false);
        if (onNavigate) onNavigate('dashboard');
      }
    },
    {
      id: 'generator',
      label: 'Post Generator',
      shortLabel: 'Generator',
      icon: Wand2,
      onClick: () => {
        setIsMobileOpen(false);
        if (onNavigate) onNavigate('generator');
      }
    },
    {
      id: 'analytics',
      label: 'Lead Analytics',
      shortLabel: 'Analytics',
      icon: BarChart3,
      onClick: () => {
        setIsMobileOpen(false);
        if (onNavigate) onNavigate('analytics');
      }
    },
    {
      id: 'profile',
      label: 'EXIM Business Profile',
      shortLabel: 'Profile',
      icon: Building,
      onClick: () => {
        setIsMobileOpen(false);
        if (onNavigate) onNavigate('profile');
      }
    },
    {
      id: 'home',
      label: 'Main Network Home',
      shortLabel: 'Home',
      icon: Globe,
      onClick: () => {
        setIsMobileOpen(false);
        if (onNavigate) onNavigate('home');
      }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900 selection:bg-gold-500 selection:text-white">
      {/* MOBILE TOP HEADER & STICKY DROPDOWN CONTAINER */}
      <div className="md:hidden sticky top-0 z-50 bg-ocean-950 border-b border-ocean-800 shadow-md">
        <div className="text-white px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="EXIM Growth Network"
              className="w-8 h-8 rounded-xl object-cover border border-gold-500/30 shrink-0 shadow"
            />
            <div>
              <h1 className="font-extrabold text-sm leading-none">
                <span className="text-[#38BDF8] font-black">EXIM Growth</span>{' '}
                <span className="text-[#F57E13] font-black">Network</span>
              </h1>
              <span className="text-[10px] text-slate-300 font-medium">Platform Portal</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* MOBILE COLLAPSIBLE DRAWER (ALWAYS VISIBLE UNDER STICKY HEADER) */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-ocean-950 text-white border-t border-ocean-800 px-4 py-4 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
            {/* User Profile Teaser */}
            {member ? (
              <div className="p-3 rounded-2xl bg-ocean-900 border border-ocean-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-400 text-ocean-950 flex items-center justify-center font-black text-base shadow">
                  {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="font-extrabold text-white truncate">{member.name || 'Member Trader'}</div>
                  <div className="text-slate-400 truncate text-[11px]">{member.companyName || member.email}</div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold flex items-center justify-between">
                <span>🔑 Logged in as Guest</span>
                <button
                  type="button"
                  onClick={() => { setIsMobileOpen(false); if (onNavigate) onNavigate('dashboard'); }}
                  className="px-3 py-1 rounded-xl bg-gold-400 text-ocean-950 font-extrabold text-[11px]"
                >
                  Log In
                </button>
              </div>
            )}

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    className={`w-full p-3 rounded-2xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-gold-400 text-ocean-950 shadow-md font-black' 
                        : 'text-slate-200 hover:bg-ocean-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-ocean-950' : 'text-gold-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {member ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

      {/* DESKTOP SIDEBAR (COLLAPSIBLE SIDE NAVIGATION) */}
      <aside 
        className={`hidden md:flex flex-col bg-ocean-950 text-white shrink-0 border-r border-ocean-800 min-h-screen sticky top-0 h-screen shadow-2xl z-30 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64 lg:w-72'
        }`}
      >
        {/* Sidebar Brand & Collapse Toggle Header */}
        <div className="p-4 sm:p-5 border-b border-ocean-800 flex items-center justify-between relative">
          <div className={`flex items-center gap-3 overflow-hidden transition-all ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <img
              src="/logo.png"
              alt="EXIM Growth Network"
              className="w-9 h-9 rounded-2xl object-cover border border-gold-500/30 shrink-0 shadow-md"
            />
            <div className="truncate">
              <h2 className="font-extrabold text-sm tracking-tight leading-none truncate">
                <span className="text-[#38BDF8] font-black">EXIM Growth</span>{' '}
                <span className="text-[#F57E13] font-black">Network</span>
              </h2>
              <span className="text-[10px] text-slate-300 font-semibold block truncate mt-0.5">Member Control Panel</span>
            </div>
          </div>

          {/* COLLAPSE / EXPAND TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-gold-400 border border-ocean-700 transition-all cursor-pointer shadow-sm mx-auto"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Profile Summary (Expanded or Collapsed Avatar) */}
        <div className="px-3 py-4 border-b border-ocean-900 bg-ocean-900/60">
          {member ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold-400 text-ocean-950 border border-gold-300 flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="font-extrabold text-xs text-white truncate">
                    {member.name || 'EXIM Member'}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate font-medium">
                    {member.companyName || member.email}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {!isCollapsed ? (
                <div className="w-full p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold text-center space-y-1.5">
                  <span className="block text-[11px]">Guest Trader Mode</span>
                  <button
                    type="button"
                    onClick={() => { if (onNavigate) onNavigate('dashboard'); }}
                    className="w-full py-1.5 rounded-lg bg-gold-400 text-ocean-950 font-black text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Log In / Sign Up
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { if (onNavigate) onNavigate('dashboard'); }}
                  title="Log In"
                  className="w-10 h-10 rounded-2xl bg-gold-400 text-ocean-950 flex items-center justify-center font-black text-xs shadow-md"
                >
                  <LogIn className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {!isCollapsed && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block">
              Navigation Menu
            </span>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                title={isCollapsed ? item.label : undefined}
                className={`w-full p-3 rounded-2xl text-xs font-extrabold flex items-center transition-all cursor-pointer group ${
                  isCollapsed ? 'justify-center' : 'justify-between'
                } ${
                  isActive
                    ? 'bg-gold-400 text-ocean-950 shadow-lg shadow-gold-500/20'
                    : 'text-slate-300 hover:bg-ocean-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-xl ${
                    isActive ? 'bg-ocean-950 text-gold-400' : 'bg-ocean-900 text-gold-400 group-hover:bg-ocean-800'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: Quick Action & Log Out */}
        <div className="p-3 border-t border-ocean-800 space-y-2 bg-ocean-950">
          {member ? (
            <button
              type="button"
              onClick={handleSignOut}
              title={isCollapsed ? 'Sign Out' : undefined}
              className={`w-full py-2.5 px-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-bold text-xs flex items-center transition-all cursor-pointer ${
                isCollapsed ? 'justify-center' : 'justify-center gap-2'
              }`}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          ) : null}

          {!isCollapsed && (
            <div className="text-center text-[10px] text-slate-400 font-medium">
              EXIM Growth Network v1.0
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
