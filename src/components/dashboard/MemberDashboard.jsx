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
  Briefcase
} from 'lucide-react';
import { fetchAllTradePosts, updateTradePostStatus, signUpWithSupabase, signInWithSupabase, signOutSupabase } from '../../lib/supabase';
import { getLoggedInMember, loginUserWithEmail, registerUserWithEmail, logoutMember, isPostOwner } from '../../lib/memberAuth';

export default function MemberDashboard({ onNavigateToGenerator, onEditPost, onInspectPost }) {
  const [member, setMember] = useState(getLoggedInMember());
  const [tradePosts, setTradePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'open' | 'fulfilled'

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

  const handleLogout = () => {
    logoutMember();
    setMember(null);
  };

  const filteredPosts = tradePosts.filter(p => {
    if (statusFilter === 'open') return p.status !== 'fulfilled';
    if (statusFilter === 'fulfilled') return p.status === 'fulfilled';
    return true;
  });

  const openCount = tradePosts.filter(p => p.status !== 'fulfilled').length;
  const fulfilledCount = tradePosts.filter(p => p.status === 'fulfilled').length;

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-6 font-sans">
      {/* Top Header Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-ocean-950 text-gold-400 font-extrabold flex items-center justify-center text-lg">
            {member?.name ? member.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div>
            <h1 className="font-black text-lg text-ocean-950 tracking-tight leading-none">
              Welcome, {member?.name || 'EXIM Member'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {member?.companyName || 'EXIM Growth Trader'} • {member?.phone || 'Verified Session'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToGenerator}
            className="px-4 py-2.5 rounded-xl bg-ocean-950 hover:bg-ocean-900 text-gold-400 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-gold-400" />
            <span>Create New Trade Post</span>
          </button>

          {member && (
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Dashboard Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Saved Posts</span>
            <div className="text-3xl font-black text-ocean-950 mt-1">{tradePosts.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-ocean-50 text-ocean-950 flex items-center justify-center font-bold">
            <Share2 className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('open')}
          className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Active Open Leads</span>
            <div className="text-3xl font-black text-emerald-950 mt-1">{openCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('fulfilled')}
          className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fulfilled / Closed</span>
            <div className="text-3xl font-black text-gold-400 mt-1">{fulfilledCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Posts Management Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-3">
          <div>
            <h2 className="text-base font-black text-ocean-950">My Saved Trade Posts & Templates</h2>
            <p className="text-xs text-slate-500 font-medium">Manage status, edit parameters, or re-share to WhatsApp groups.</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {['all', 'open', 'fulfilled'].map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === f ? 'bg-ocean-950 text-gold-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Share2 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-sm text-slate-600">No trade posts found in this filter.</p>
            <button
              type="button"
              onClick={onNavigateToGenerator}
              className="px-4 py-2 rounded-xl bg-ocean-950 text-gold-400 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Your First Trade Post</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredPosts.map((post) => {
              const details = post.raw_details || {};
              const isFulfilled = post.status === 'fulfilled';
              const isOwner = isPostOwner(post, member);

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
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {isOwner ? (
                      <>
                        {/* Toggle Status Button (Owner Only) */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(post)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                            isFulfilled
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300'
                          }`}
                        >
                          {isFulfilled ? 'Re-open Lead' : 'Mark Fulfilled'}
                        </button>

                        {/* Edit / Prefill Button (Owner Only) */}
                        {onEditPost && (
                          <button
                            type="button"
                            onClick={() => onEditPost(details)}
                            className="px-3 py-2 rounded-xl bg-ocean-950 text-gold-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-ocean-900 shadow-sm"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Details</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl">
                        🔒 Poster Managed
                      </span>
                    )}

                    {/* View Live Link Button */}
                    {onInspectPost && (
                      <button
                        type="button"
                        onClick={() => onInspectPost(post.id)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
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
