import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Share2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  MessageSquare, 
  LogOut, 
  ArrowLeft, 
  User, 
  Building, 
  Phone, 
  Mail,
  PlusCircle,
  RefreshCw,
  Eye,
  ShoppingBag,
  Store,
  Truck,
  Briefcase,
  Search,
  Lock,
  Globe,
  Filter,
  X,
  MousePointerClick,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { fetchAllTradePosts, updateTradePostStatus, updateTradePostVisibility, signUpWithSupabase, signInWithSupabase, signOutSupabase } from '../../lib/supabase';
import { getLoggedInMember, loginUserWithEmail, registerUserWithEmail, logoutMember, isPostOwner } from '../../lib/memberAuth';

export default function MemberDashboard({ onNavigateToGenerator, onEditPost, onInspectPost }) {
  const [member, setMember] = useState(getLoggedInMember());
  const [tradePosts, setTradePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter State
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'open' | 'fulfilled'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'buyer' | 'supplier' | 'logistics' | 'exim_service' | 'question'
  const [scopeFilter, setScopeFilter] = useState('all'); // 'all' (public community) | 'mine' (my posts)
  const [searchQuery, setSearchQuery] = useState('');

  // Email Sign-Up / Login form state
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginConfirmPassword, setLoginConfirmPassword] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginCompany, setLoginCompany] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  const handleEmailLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setAuthSuccessMsg('');

    if (!loginEmail || !loginEmail.includes('@')) {
      setLoginError('Please enter a valid email address.');
      return;
    }
    if (!loginPassword || !loginPassword.trim()) {
      setLoginError('Please enter your password.');
      return;
    }

    try {
      if (authMode === 'register') {
        if (loginPassword.trim().length < 4) {
          setLoginError('Password must be at least 4 characters long.');
          return;
        }
        if (loginPassword !== loginConfirmPassword) {
          setLoginError('Passwords do not match. Please re-enter.');
          return;
        }

        const res = await signUpWithSupabase({
          email: loginEmail,
          password: loginPassword,
          fullName: loginName,
          companyName: loginCompany,
          phone: loginPhone
        });

        if (res.needsVerification) {
          setAuthSuccessMsg(res.message);
          return;
        }

        setMember(res.user);
      } else {
        const user = await signInWithSupabase({
          email: loginEmail,
          password: loginPassword
        });
        setMember(user);
      }
      setLoginError('');
    } catch (err) {
      console.error('Authentication Error:', err);
      setLoginError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  const loadMemberPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await fetchAllTradePosts();
      setTradePosts(allPosts);
    } catch (err) {
      console.error('Failed to load member posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (member) {
      loadMemberPosts();

      // Auto-reload stats when tab regains focus or history state changes
      const handleFocus = () => loadMemberPosts();
      window.addEventListener('focus', handleFocus);
      window.addEventListener('popstate', handleFocus);
      return () => {
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('popstate', handleFocus);
      };
    }
  }, [member]);

  // If user is NOT logged in, show Email Log In / Sign Up card
  if (!member) {
    return (
      <div className="w-full max-w-lg mx-auto py-10 px-4 space-y-6 font-sans">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-center">
          <div className="w-14 h-14 bg-ocean-950 text-gold-400 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl shadow-md">
            <LayoutDashboard className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-black text-ocean-950">
              {authMode === 'login' ? 'Member Log In' : 'Create Free Member Account'}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {authMode === 'login' ? 'Log in to manage your trade leads and poster settings.' : 'Create an account to save, edit, and track live trade leads.'}
            </p>
          </div>

          {/* TAB SELECTOR: LOGIN VS REGISTER */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setLoginError(''); }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                authMode === 'login' ? 'bg-ocean-950 text-gold-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔑 Log In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setLoginError(''); }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                authMode === 'register' ? 'bg-ocean-950 text-gold-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📝 Register / Sign Up
            </button>
          </div>

          {/* Key Member Benefits List */}
          <div className="p-4 rounded-2xl bg-ocean-950 text-white text-left text-xs space-y-2.5 shadow-sm">
            <span className="font-extrabold text-gold-400 uppercase text-[10px] tracking-wider block border-b border-ocean-800 pb-1">
              ✨ Member Advantages & Privileges
            </span>
            <ul className="space-y-2 text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Live Order Tracking Links</strong>: Attach verification URLs to your WhatsApp posts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Status Control</strong>: Toggle lead status (`OPEN` vs `FULFILLED`) to stop unwanted calls.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>15-Second Post Editing</strong>: Re-use previous templates with prefilled commodity specs.</span>
              </li>
            </ul>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200 text-left">
              ⚠️ {loginError}
            </div>
          )}

          {authSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-medium border border-emerald-300 text-left space-y-1">
              <span className="font-extrabold text-emerald-800 text-xs block">📩 Check Your Email Inbox</span>
              <p>{authSuccessMsg}</p>
            </div>
          )}

          {/* Email Log In / Sign Up Form */}
          <form onSubmit={handleEmailLoginSubmit} className="space-y-3 text-xs text-left">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Email Address *</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. trader@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Password *</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
              />
            </div>

            {authMode === 'register' && (
              <>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={loginConfirmPassword}
                    onChange={(e) => setLoginConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Full Name</label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Company Name</label>
                  <input
                    type="text"
                    value={loginCompany}
                    onChange={(e) => setLoginCompany(e.target.value)}
                    placeholder="e.g. EXIM Global Trade Pvt Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all mt-1"
            >
              {authMode === 'login' ? 'Log In to Dashboard' : 'Create Account & Open Dashboard'}
            </button>
          </form>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setLoginError('');
              }}
              className="text-xs font-bold text-slate-500 hover:text-ocean-950 cursor-pointer underline"
            >
              {authMode === 'login' ? "Don't have an account? Create one here" : 'Already have an account? Log In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleStatus = async (post) => {
    const newStatus = post.status === 'fulfilled' ? 'open' : 'fulfilled';
    await updateTradePostStatus(post.id, newStatus);
    setTradePosts(prev => prev.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
  };

  const handleToggleVisibility = async (post) => {
    const currentVis = post.visibility || 'public';
    const newVis = currentVis === 'private' ? 'public' : 'private';
    await updateTradePostVisibility(post.id, newVis);
    setTradePosts(prev => prev.map(p => p.id === post.id ? { ...p, visibility: newVis } : p));
  };

  const handleLogout = () => {
    logoutMember();
    setMember(null);
  };

  // Filtered Posts Logic
  const filteredPosts = tradePosts.filter(p => {
    const isMine = isPostOwner(p, member);
    
    // Scope filter check
    if (scopeFilter === 'mine' && !isMine) return false;
    
    // Hide private posts of other users
    if (p.visibility === 'private' && !isMine) return false;

    // Status filter check
    if (statusFilter === 'open' && p.status === 'fulfilled') return false;
    if (statusFilter === 'fulfilled' && p.status !== 'fulfilled') return false;

    // Type filter check
    if (typeFilter !== 'all' && p.template_type !== typeFilter) return false;

    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const product = (p.product_or_service || p.raw_details?.product || '').toLowerCase();
      const company = (p.company_name || p.raw_details?.companyName || '').toLowerCase();
      const contact = (p.contact_name || p.raw_details?.contactName || '').toLowerCase();
      const location = (p.origin_or_location || p.destination || '').toLowerCase();
      
      const matches = product.includes(q) || company.includes(q) || contact.includes(q) || location.includes(q);
      if (!matches) return false;
    }

    return true;
  });

  // Overview Counts & Analytics Metrics
  const myPosts = tradePosts.filter(p => isPostOwner(p, member));
  const activeSet = scopeFilter === 'mine' ? myPosts : tradePosts;

  const totalCount = activeSet.length;
  const buyerCount = activeSet.filter(p => p.template_type === 'buyer').length;
  const supplierCount = activeSet.filter(p => p.template_type === 'supplier').length;
  const fulfilledCount = activeSet.filter(p => p.status === 'fulfilled').length;

  // View & Click Analytics (Strictly tracking BUY Requirements & SUPPLY Offers)
  const trackedTradeLeads = activeSet.filter(p => p.template_type === 'buyer' || p.template_type === 'supplier');
  const totalViews = trackedTradeLeads.reduce((acc, p) => acc + (Number(p.views_count) || 0), 0);
  const totalClicks = trackedTradeLeads.reduce((acc, p) => acc + (Number(p.clicks_count) || 0), 0);
  const overallCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-4 space-y-4 sm:space-y-6 font-sans">
      {/* Top Header Card */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-ocean-950 text-white border border-ocean-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gold-400 text-ocean-950 flex items-center justify-center font-black shadow-lg shrink-0">
            <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white leading-snug">
              Member Dashboard
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed break-words">
              Welcome, {member?.name || 'EXIM Member'} • {member?.companyName || 'EXIM Trader'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-ocean-800/80">
          <button
            type="button"
            onClick={loadMemberPosts}
            disabled={isLoading}
            className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gold-400 border border-gold-400/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            title="Reload latest trade lead stats"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToGenerator}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Trade Post</span>
          </button>
        </div>
      </div>

      {/* LEAD PERFORMANCE & ANALYTICS OVERVIEW GRID */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <h2 className="text-xs font-black text-ocean-950 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-gold-500" />
            <span>Lead Performance & Traffic Analytics</span>
          </h2>
          <span className="text-[11px] font-extrabold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200 shrink-0">
            {scopeFilter === 'mine' ? 'My Trade Leads' : 'Community Leads'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Leads</span>
              <Share2 className="w-4 h-4 text-ocean-900" />
            </div>
            <div className="text-2xl font-black text-ocean-950 mt-2">{totalCount}</div>
            <span className="text-[10px] text-slate-400 font-semibold mt-1">Active Posts</span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Link Views</span>
              <Eye className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-950 mt-2">{totalViews}</div>
            <span className="text-[10px] text-indigo-700 font-bold mt-1">Page Impressions</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">WhatsApp Clicks</span>
              <MessageSquare className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            </div>
            <div className="text-2xl font-black text-emerald-950 mt-2">{totalClicks}</div>
            <span className="text-[10px] text-emerald-700 font-bold mt-1">Direct Inquiries</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Conversion Rate</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-950 mt-2">{overallCTR}%</div>
            <span className="text-[10px] text-amber-800 font-bold mt-1">Click-Through (CTR)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Fulfilled Orders</span>
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-2xl font-black text-gold-400 mt-2">{fulfilledCount}</div>
            <span className="text-[10px] text-slate-300 font-semibold mt-1">Deals Closed</span>
          </div>
        </div>
      </div>

      {/* Posts Search & Filter Controls Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
        {/* Row 1: Search Input + Scope Pills */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product, company, supplier, location..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium bg-slate-50 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Scope Pills: Community vs My Posts */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => setScopeFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                scopeFilter === 'all' ? 'bg-ocean-950 text-gold-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Leads ({tradePosts.filter(p => (p.visibility || 'public') === 'public' || isPostOwner(p, member)).length})</span>
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('mine')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                scopeFilter === 'mine' ? 'bg-ocean-950 text-gold-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>My Posts ({tradePosts.filter(p => isPostOwner(p, member)).length})</span>
            </button>
          </div>
        </div>

        {/* Row 2: Type Dropdown & Status Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap text-xs font-medium">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Type:
            </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-bold text-ocean-950 outline-none cursor-pointer"
            >
              <option value="all">All Post Types</option>
              <option value="buyer">🛒 BUY Requirements</option>
              <option value="supplier">🏪 SELL Offers</option>
              <option value="logistics">🚚 Logistics & Cargo</option>
              <option value="exim_service">💼 Exim Services</option>
              <option value="question">❓ Questions</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
            {['all', 'open', 'fulfilled'].map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === f ? 'bg-ocean-950 text-gold-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f === 'all' ? 'All Status' : f === 'open' ? '🟢 Open' : '🔴 Fulfilled'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-5 space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Share2 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-sm text-slate-600">No trade posts found matching your search or filters.</p>
            <button
              type="button"
              onClick={onNavigateToGenerator}
              className="px-4 py-2 rounded-xl bg-ocean-950 text-gold-400 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Trade Post</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredPosts.map((post) => {
              const details = post.raw_details || {};
              const isFulfilled = post.status === 'fulfilled';
              const isOwner = isPostOwner(post, member);
              const isPrivate = (post.visibility || 'public') === 'private';

              return (
                <div 
                  key={post.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  {/* Left Specs */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isFulfilled ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isFulfilled ? '🔴 FULFILLED' : '🟢 OPEN & LIVE'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        {post.template_type}
                      </span>
                      
                      {/* Privacy Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        isPrivate ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {isPrivate ? <Lock className="w-3 h-3 text-amber-700" /> : <Globe className="w-3 h-3 text-blue-600" />}
                        <span>{isPrivate ? 'Private' : 'Public'}</span>
                      </span>

                      {isOwner && (
                        <span className="text-[10px] font-bold text-gold-700 bg-gold-50 border border-gold-300 px-2 py-0.5 rounded-full">
                          ⭐ Your Post
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-ocean-950 truncate">
                      {post.product_or_service || details.product || 'Trade Requirement'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      {details.price && <span className="font-bold text-emerald-700">💰 {details.price}</span>}
                      {post.quantity_or_moq && <span>⚖️ {post.quantity_or_moq}</span>}
                      {post.origin_or_location && <span>📍 {post.origin_or_location}</span>}
                    </div>

                    {/* Per-Post View & Click Analytics Indicators */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold text-[11px]" title="Total Link Impressions / Page Views">
                        <Eye className="w-3 h-3 text-indigo-600" />
                        <span>{Number(post.views_count || 0)} Views</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold text-[11px]" title="Direct WhatsApp & Contact Inquiries">
                        <MessageSquare className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                        <span>{Number(post.clicks_count || 0)} Inquiries</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 font-extrabold text-[11px]" title="Conversion Rate = (Clicks / Views) * 100">
                        <TrendingUp className="w-3 h-3 text-amber-600" />
                        <span>
                          {Number(post.views_count || 0) > 0
                            ? `${(((Number(post.clicks_count || 0)) / (Number(post.views_count || 0))) * 100).toFixed(1)}% CTR`
                            : '0.0% CTR'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 shrink-0 justify-start md:justify-end">
                    {isOwner ? (
                      <>
                        {/* Visibility Option Toggle Button (Public vs Private) */}
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(post)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border whitespace-nowrap ${
                            isPrivate
                              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                              : 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                          }`}
                          title="Click to toggle Public vs Private visibility"
                        >
                          {isPrivate ? (
                            <>
                              <Lock className="w-3.5 h-3.5 text-amber-700" />
                              <span>Private</span>
                            </>
                          ) : (
                            <>
                              <Globe className="w-3.5 h-3.5 text-blue-600" />
                              <span>Public</span>
                            </>
                          )}
                        </button>

                        {/* Toggle Status Button (Owner Only) */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(post)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border whitespace-nowrap ${
                            isFulfilled
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300'
                          }`}
                        >
                          {isFulfilled ? 'Re-open' : 'Fulfilled'}
                        </button>

                        {/* Edit / Prefill Button (Owner Only) */}
                        {onEditPost && (
                          <button
                            type="button"
                            onClick={() => onEditPost(details)}
                            className="px-3 py-2 rounded-xl bg-ocean-950 text-gold-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-ocean-900 shadow-sm whitespace-nowrap"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl whitespace-nowrap">
                        🔒 Community Lead
                      </span>
                    )}

                    {/* View Live Link Button */}
                    {onInspectPost && (
                      <button
                        type="button"
                        onClick={() => onInspectPost(post.id)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Live</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
