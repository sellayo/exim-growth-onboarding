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
  Check,
  Sparkles,
  Unlock
} from 'lucide-react';
import { 
  fetchSingleTradePost, 
  updateTradePostStatus, 
  signUpWithSupabase, 
  signInWithSupabase,
  checkPosterCommunityVerification
} from '../../lib/supabase';
import { getLoggedInMember, loginUserWithEmail, registerUserWithEmail, isPostOwner } from '../../lib/memberAuth';

export default function PostDetailView({ postId, onBackToGenerator }) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posterVerification, setPosterVerification] = useState('checking'); // 'approved_member' | 'unverified'
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
        if (data) {
          const ver = await checkPosterCommunityVerification(data.contact_email, data.contact_phone);
          setPosterVerification(ver);
        }
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
    <div className="w-full max-w-3xl mx-auto py-4 sm:py-6 px-3 sm:px-4 space-y-4 sm:space-y-6 font-sans">
      {/* Top Header Controls (Responsive for Mobile) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToGenerator}
          className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to Trade Portal</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Copy Link'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
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
        {/* LIVE STATUS BANNER (Responsive Mobile Header) */}
        <div className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isFulfilled 
            ? 'bg-slate-900 text-slate-200 border-b border-slate-800' 
            : 'bg-emerald-950 text-emerald-100 border-b border-emerald-900'
        }`}>
          <div className="flex items-start sm:items-center gap-3">
            <span className={`w-3.5 h-3.5 rounded-full mt-1 sm:mt-0 shrink-0 ${isFulfilled ? 'bg-red-500' : 'bg-emerald-400 animate-ping'}`} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                  {isFulfilled ? '🔴 ORDER FULFILLED / CLOSED' : '🟢 LIVE & ACCEPTING QUOTES'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 rounded-full shrink-0">
                  Verified Lead
                </span>
              </div>
              <p className="text-[11px] opacity-80 mt-0.5 leading-tight">
                {isFulfilled ? 'This trade requirement has been fulfilled by the poster.' : 'Active trade requirement on EXIM Growth Network.'}
              </p>
            </div>
          </div>

          {/* TOP RIGHT BADGE: Poster Status Toggle (Owner) OR Community Verification Badge */}
          {isPostOwner(post, member) ? (
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={statusUpdating}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/20 shrink-0"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isFulfilled ? 'Re-open Trade Lead' : 'Mark Order as Fulfilled'}</span>
            </button>
          ) : posterVerification === 'approved_member' ? (
            <span className="w-full sm:w-auto text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 flex items-center justify-center gap-1.5 shrink-0 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>EXIM Approved Community Member</span>
            </span>
          ) : (
            <span className="w-full sm:w-auto text-[11px] font-bold bg-white/10 text-slate-200 px-3 py-1.5 rounded-xl border border-white/15 flex items-center justify-center gap-1.5 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>EXIM Growth Network Trader</span>
            </span>
          )}
        </div>

        {/* DETAILS BODY */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Title & Type */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs font-medium">
            {details.price && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <span className="font-extrabold text-emerald-900 uppercase text-[10px] block mb-0.5">
                  💰 Target / Offering Price
                </span>
                <div className="text-sm sm:text-base font-black text-emerald-950">{details.price}</div>
              </div>
            )}

            {post.quantity_or_moq && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-extrabold text-slate-400 uppercase text-[10px] block mb-0.5">
                  ⚖️ Quantity / MOQ
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900">{post.quantity_or_moq}</div>
              </div>
            )}

            {post.origin_or_location && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-extrabold text-slate-400 uppercase text-[10px] block mb-0.5">
                  📍 Origin / Location
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900">{post.origin_or_location}</div>
              </div>
            )}

            {post.destination && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-extrabold text-slate-400 uppercase text-[10px] block mb-0.5">
                  🏁 Destination Port / Country
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900">{post.destination}</div>
              </div>
            )}
          </div>

          {/* Requirements & Certifications */}
          {post.requirements_or_certifications && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <span className="font-extrabold text-slate-400 uppercase text-[10px] block">
                📜 Quality Requirements & Certifications
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                {post.requirements_or_certifications}
              </p>
            </div>
          )}

          {/* POSTER & VERIFICATION CARD (BLURRED GATED OVERLAY FOR GUESTS) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-ocean-950 text-white space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-ocean-800 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gold-400 shrink-0" />
                <h3 className="font-extrabold text-xs sm:text-sm text-gold-400 uppercase tracking-wider">
                  Poster & Verification Details
                </h3>
              </div>
              {posterVerification === 'approved_member' ? (
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1 self-start sm:self-auto">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> EXIM Approved Community Member
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 text-slate-300 border border-white/20 rounded-full flex items-center gap-1 self-start sm:self-auto">
                  <ShieldCheck className="w-3 h-3 text-gold-400" /> EXIM Verified Trader
                </span>
              )}
            </div>

            {member ? (
              /* UNLOCKED CONTACT DETAILS FOR LOGGED-IN MEMBERS */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">COMPANY NAME</span>
                  <div className="font-bold text-sm text-white">{post.company_name || 'Verified Company'}</div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">CONTACT PERSON</span>
                  <div className="font-bold text-sm text-white">{post.contact_name || 'Verified Member'}</div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">PHONE / WHATSAPP</span>
                  <div className="font-bold text-emerald-400 text-sm">{post.contact_phone || 'Available'}</div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">EMAIL ADDRESS</span>
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
              /* BLURRED CONTACT PREVIEW + UNLOCK OVERLAY FOR UNAUTHENTICATED GUESTS */
              <div 
                onClick={() => setShowAuthModal(true)}
                className="relative overflow-hidden rounded-2xl bg-ocean-900/90 border border-ocean-800 p-4 cursor-pointer group"
              >
                {/* BLURRED PREVIEW OF CONTACT INFO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs filter blur-sm select-none opacity-35 pointer-events-none transition-all">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">COMPANY NAME</span>
                    <div className="font-bold text-sm text-white">{post.company_name || 'EXIM Global Trader Pvt Ltd'}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">CONTACT PERSON</span>
                    <div className="font-bold text-sm text-white">{post.contact_name || 'Verified Exporter'}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">PHONE / WHATSAPP</span>
                    <div className="font-bold text-emerald-400 text-sm">
                      {post.contact_phone ? post.contact_phone.slice(0, 4) + '••••••••' : '+91 98••••••••'}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">EMAIL ADDRESS</span>
                    <div className="font-bold text-white text-sm">
                      {post.contact_email ? post.contact_email.slice(0, 3) + '••••@••••.com' : 'trader••••@eximgrowth.com'}
                    </div>
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <div className="w-full py-3 rounded-xl bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>Contact Poster Direct on WhatsApp</span>
                    </div>
                  </div>
                </div>

                {/* PROMINENT GLASSMORPHISM UNLOCK OVERLAY */}
                <div className="absolute inset-0 bg-ocean-950/85 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center p-4 text-center space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gold-400 text-ocean-950 flex items-center justify-center font-extrabold shadow-lg animate-bounce">
                    <Lock className="w-5 h-5" />
                  </div>
                  
                  <div className="space-y-0.5 max-w-sm">
                    <h4 className="font-extrabold text-xs sm:text-sm text-gold-400 uppercase tracking-wider">
                      Unlock Verified Poster Contact Info
                    </h4>
                    <p className="text-[11px] text-slate-300 font-medium leading-snug">
                      Create a free account or log in in 10 seconds to access direct WhatsApp & phone contact details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowAuthModal(true); }}
                    className="px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-gold-500/20 transition-all cursor-pointer group-hover:scale-105"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Create Free Account / Sign In to Unlock</span>
                  </button>
                </div>
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
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200 flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{authSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleQuickLogin} className="space-y-3">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Full Name</label>
                    <input
                      type="text"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Company Name</label>
                    <input
                      type="text"
                      value={loginCompany}
                      onChange={(e) => setLoginCompany(e.target.value)}
                      placeholder="e.g. EXIM Global Trade Pvt Ltd"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="exporter@eximgrowth.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                  required
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Confirm Password</label>
                  <input
                    type="password"
                    value={loginConfirmPassword}
                    onChange={(e) => setLoginConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all mt-1"
              >
                {authMode === 'login' ? 'Log In & View Details' : 'Create Free Account & View Details'}
              </button>
            </form>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setAuthError('');
                }}
                className="text-xs font-bold text-slate-500 hover:text-ocean-950 cursor-pointer underline"
              >
                {authMode === 'login' ? "Don't have an account? Create one" : 'Already registered? Log In'}
              </button>

              <button
                type="button"
                onClick={() => { setShowAuthModal(false); setAuthError(''); }}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
