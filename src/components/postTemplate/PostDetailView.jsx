import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Share2, 
  Phone, 
  MessageSquare, 
  Mail, 
  Globe, 
  Building, 
  User, 
  MapPin, 
  Calendar, 
  Lock, 
  ArrowLeft, 
  Clock, 
  ShoppingBag, 
  Store, 
  Truck, 
  Briefcase, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { fetchSingleTradePost, updateTradePostStatus, signUpWithSupabase, signInWithSupabase } from '../../lib/supabase';
import { getLoggedInMember, loginUserWithEmail, registerUserWithEmail, isPostOwner } from '../../lib/memberAuth';

export default function PostDetailView({ postId, onBackToGenerator }) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [member, setMember] = useState(getLoggedInMember());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginConfirmPassword, setLoginConfirmPassword] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginCompany, setLoginCompany] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    async function loadPost() {
      setIsLoading(true);
      try {
        const data = await fetchSingleTradePost(postId);
        setPost(data);
      } catch (err) {
        console.error('Failed to load post detail:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [postId]);

  const handleQuickLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!loginPassword || !loginPassword.trim()) {
      setAuthError('Please enter your password.');
      return;
    }

    try {
      if (authMode === 'register') {
        if (loginPassword.trim().length < 4) {
          setAuthError('Password must be at least 4 characters long.');
          return;
        }
        if (loginPassword !== loginConfirmPassword) {
          setAuthError('Passwords do not match. Please re-enter.');
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

      setShowAuthModal(false);
      setAuthError('');
    } catch (err) {
      console.error('Authentication Error:', err);
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleToggleStatus = async () => {
    if (!post) return;
    setStatusUpdating(true);
    const newStatus = post.status === 'fulfilled' ? 'open' : 'fulfilled';
    await updateTradePostStatus(post.id, newStatus);
    setPost(prev => ({ ...prev, status: newStatus }));
    setStatusUpdating(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `📢 *EXIM Trade Lead Verification & Live Status*\n\n📦 *Product/Service:* ${post.product_or_service || 'Trade Requirement'}\n${post.raw_details?.price ? `💰 *Price:* ${post.raw_details.price}\n` : ''}📍 *Location:* ${post.origin_or_location || post.destination || 'N/A'}\n\n🔗 *Check Live Status & Connect:* ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-ocean-900 border-t-gold-400 rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500">Loading Trade Post Verification Page...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <XCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-extrabold text-ocean-950">Trade Post Not Found</h3>
        <p className="text-xs text-slate-500">The requested trade lead may have expired or been removed.</p>
        <button
          type="button"
          onClick={onBackToGenerator}
          className="px-5 py-2.5 rounded-xl bg-ocean-950 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to EXIM Trade Portal</span>
        </button>
      </div>
    );
  }

  const details = post.raw_details || {};
  const isFulfilled = post.status === 'fulfilled';

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 space-y-6 font-sans">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToGenerator}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to Trade Portal</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Copy Link'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span>Share Post</span>
          </button>
        </div>
      </div>

      {/* Main Trade Post Card */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
      >
        {/* LIVE STATUS BANNER */}
        <div className={`p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 ${
          isFulfilled 
            ? 'bg-slate-900 text-slate-200 border-b border-slate-800' 
            : 'bg-emerald-950 text-emerald-100 border-b border-emerald-900'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`w-3.5 h-3.5 rounded-full ${isFulfilled ? 'bg-red-500' : 'bg-emerald-400 animate-ping'}`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs uppercase tracking-wider">
                  {isFulfilled ? '🔴 ORDER FULFILLED / CLOSED' : '🟢 LIVE & ACCEPTING QUOTES'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 rounded-full">
                  Verified Lead
                </span>
              </div>
              <p className="text-[11px] opacity-80 mt-0.5">
                {isFulfilled ? 'This trade requirement has been fulfilled by the poster.' : 'Active trade requirement on EXIM Growth Network.'}
              </p>
            </div>
          </div>

          {/* Poster Status Toggle Button (Owner Only) */}
          {isPostOwner(post, member) ? (
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={statusUpdating}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/20"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isFulfilled ? 'Mark as Re-opened' : 'Mark as Fulfilled'}</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold opacity-80 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5">
              <span>🔒 Lead Status Managed by Poster</span>
            </span>
          )}
        </div>

        {/* DETAILS BODY */}
        <div className="p-6 space-y-6">
          {/* Title & Type */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-ocean-950 text-gold-400 rounded-full">
                {post.template_type?.toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Created {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recently'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-ocean-950 leading-snug">
              {post.product_or_service || details.product || 'EXIM Trade Requirement'}
            </h1>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            {details.price && (
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <span className="font-extrabold text-emerald-900 uppercase text-[10px] block mb-0.5">
                  💰 Target / Offering Price
                </span>
                <div className="text-base font-black text-emerald-950">{details.price}</div>
              </div>
            )}

            {post.quantity_or_moq && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-extrabold text-slate-400 uppercase text-[10px] block mb-0.5">
                  ⚖️ Quantity / MOQ
                </span>
                <div className="text-sm font-bold text-slate-900">{post.quantity_or_moq}</div>
              </div>
            )}

            {post.origin_or_location && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-extrabold text-slate-400 uppercase text-[10px] block mb-0.5">
                  📍 Origin / Location
                </span>
                <div className="text-sm font-bold text-slate-900">{post.origin_or_location}</div>
              </div>
            )}

            {post.destination && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-extrabold text-slate-400 uppercase text-[10px] block mb-0.5">
                  🏁 Destination Port / Country
                </span>
                <div className="text-sm font-bold text-slate-900">{post.destination}</div>
              </div>
            )}
          </div>

          {/* Requirements & Certifications */}
          {post.requirements_or_certifications && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <span className="font-extrabold text-slate-400 uppercase text-[10px] block">
                📜 Quality Requirements & Certifications
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                {post.requirements_or_certifications}
              </p>
            </div>
          )}

          {/* GATED POSTER CONTACT CARD */}
          <div className="p-5 rounded-3xl bg-ocean-950 text-white space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-ocean-800 pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gold-400" />
                <h3 className="font-extrabold text-sm text-gold-400 uppercase tracking-wider">
                  Poster & Verification Details
                </h3>
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> EXIM Verified Member
              </span>
            </div>

            {member ? (
              /* UNLOCKED CONTACT DETAILS FOR LOGGED-IN MEMBERS */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">COMPANY NAME</span>
                  <div className="font-bold text-sm text-white">{post.company_name || 'Verified Company'}</div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">CONTACT PERSON</span>
                  <div className="font-bold text-sm text-white">{post.contact_name || 'Verified Member'}</div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">PHONE / WHATSAPP</span>
                  <div className="font-bold text-emerald-400 text-sm">{post.contact_phone || 'Available'}</div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">EMAIL ADDRESS</span>
                  <div className="font-bold text-white text-sm">{post.contact_email || 'N/A'}</div>
                </div>

                {post.contact_phone && (
                  <div className="sm:col-span-2 pt-2">
                    <a
                      href={`https://api.whatsapp.com/send?phone=${post.contact_phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Hi ${post.contact_name || ''}, I saw your trade requirement for ${post.product_or_service || ''} on EXIM Growth Network.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>Contact Poster Direct on WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* GATED CONTACT TEASER & MEMBER BENEFITS FOR UNAUTHENTICATED GUESTS */
              <div className="space-y-4 text-center py-2">
                <div className="flex items-center justify-center gap-2 text-gold-400 text-xs font-bold">
                  <Lock className="w-4 h-4 text-gold-400 animate-bounce" />
                  <span>Create a Free Account to Unlock Full Details & Contact Poster</span>
                </div>

                {/* Member Benefits List */}
                <div className="p-4 rounded-2xl bg-ocean-900/90 border border-ocean-800 text-left text-xs space-y-2">
                  <span className="font-extrabold text-gold-400 uppercase text-[10px] tracking-wider block">
                    ✨ Member Privileges & Benefits
                  </span>
                  <ul className="space-y-1.5 text-slate-200">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> Direct WhatsApp & Phone access to verified buyers & sellers
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> Live Lead Status Tracking (`OPEN` vs `FULFILLED`)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> Re-use & Edit saved trade templates in 15 seconds
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span> Zero Commission EXIM Trade Network Directory Listing
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="w-full py-3.5 rounded-2xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Create Free Account / Sign In (10 Seconds)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* QUICK MEMBER AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4"
          >
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-ocean-950 text-gold-400 rounded-2xl mx-auto flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-ocean-950">
                {authMode === 'login' ? 'Member Log In' : 'Create Free Member Account'}
              </h3>
              <p className="text-xs text-slate-500">Access verified buyer & seller contact details.</p>
            </div>

            {/* TAB SELECTOR: LOGIN VS REGISTER */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  authMode === 'login' ? 'bg-ocean-950 text-gold-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔑 Log In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  authMode === 'register' ? 'bg-ocean-950 text-gold-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📝 Register / Sign Up
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                ⚠️ {authError}
              </div>
            )}

            {authSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-medium border border-emerald-300 text-left space-y-1">
                <span className="font-extrabold text-emerald-800 text-xs block">📩 Check Your Email Inbox</span>
                <p>{authSuccessMsg}</p>
              </div>
            )}

            <form onSubmit={handleQuickLogin} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. trader@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none"
                />
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={loginConfirmPassword}
                      onChange={(e) => setLoginConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder="e.g. Rahul Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={loginCompany}
                      onChange={(e) => setLoginCompany(e.target.value)}
                      placeholder="e.g. EXIM Global Trade Pvt Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number / WhatsApp</label>
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md mt-1"
              >
                {authMode === 'login' ? 'Log In & Unlock Contacts' : 'Create Account & Unlock Contacts'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => { setShowAuthModal(false); setAuthError(''); }}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
