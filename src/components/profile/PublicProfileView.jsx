import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  Linkedin, 
  MapPin, 
  Award, 
  ShieldCheck, 
  MessageSquare, 
  ExternalLink, 
  Image as ImageIcon, 
  ArrowLeft, 
  CheckCircle2, 
  Maximize2, 
  X,
  Share2,
  Check,
  ShoppingBag,
  Store,
  Lock,
  Shield,
  Bot,
  RefreshCw,
  Eye,
  LogIn
} from 'lucide-react';
import { fetchMemberProfileBySlug, fetchAllTradePosts, signUpWithSupabase, signInWithSupabase } from '../../lib/supabase';
import { getLoggedInMember, loginUserWithEmail, registerUserWithEmail } from '../../lib/memberAuth';

export default function PublicProfileView({ profileId, onBack }) {
  const [member, setMember] = useState(getLoggedInMember());
  const [profile, setProfile] = useState(null);
  const [tradePosts, setTradePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Visual Canvas Captcha State (Bot protection for revealing contact details & person name)
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const canvasRef = useRef(null);

  // Guest Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  const drawVisualCaptcha = (code) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Fill Canvas Background
    ctx.fillStyle = '#0F172A'; // Slate-900
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw random noise dots
    for (let i = 0; i < 45; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.35)`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw distortion lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.45)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw distorted alphanumeric characters
    const colors = ['#38BDF8', '#F57E13', '#10B981', '#F43F5E', '#A855F7', '#FACC15'];
    ctx.font = 'black 22px monospace';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = 16 + i * 26;
      const y = canvas.height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() - 0.5) * 0.45;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
  };

  const generateNewCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
    setCaptchaError('');
    setTimeout(() => drawVisualCaptcha(code), 60);
  };

  useEffect(() => {
    generateNewCaptcha();
  }, []);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const prof = await fetchMemberProfileBySlug(profileId);
        setProfile(prof);

        const posts = await fetchAllTradePosts();
        if (prof) {
          const ownerPosts = posts.filter(p => {
            if (prof.user_id && p.user_id === prof.user_id) return true;
            if (prof.phone && p.contact_phone && p.contact_phone.includes(prof.phone.slice(-8))) return true;
            if (prof.email && p.contact_email && p.contact_email.toLowerCase() === prof.email.toLowerCase()) return true;
            return false;
          });
          setTradePosts(ownerPosts);
        }
      } catch (err) {
        console.error('Failed to load public profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [profileId]);

  const handleGoBack = () => {
    if (window.history.length > 1 && document.referrer && !document.referrer.includes('/profile/')) {
      window.history.back();
    } else if (onBack) {
      onBack();
    } else {
      window.location.href = '/dashboard/profile';
    }
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleVerifyCaptcha = (e) => {
    e.preventDefault();
    if (captchaInput.trim().toUpperCase() === captchaCode) {
      setIsCaptchaVerified(true);
      setCaptchaError('');
    } else {
      setCaptchaError('Incorrect captcha code. Please try again.');
      generateNewCaptcha();
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        const user = loginUserWithEmail(authEmail, authPassword);
        setMember(user);
        setShowAuthModal(false);
      } else {
        const user = registerUserWithEmail({
          email: authEmail,
          password: authPassword,
          name: authName || authEmail.split('@')[0],
          companyName: 'EXIM Trader'
        });
        setMember(user);
        setShowAuthModal(false);
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-ocean-950 border-t-gold-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-extrabold text-ocean-950 uppercase tracking-wider">Loading EXIM Enterprise Profile...</p>
        </div>
      </div>
    );
  }

  // 🔒 REQUIRE LOGIN TO VIEW BUSINESS PROFILE (GUEST LOCK SCREEN)
  if (!member) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans selection:bg-gold-500 selection:text-white">
        <div className="max-w-md w-full p-8 rounded-3xl bg-ocean-950 text-white border border-ocean-800 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="w-14 h-14 rounded-2xl bg-gold-400 text-ocean-950 flex items-center justify-center mx-auto font-black shadow-lg animate-bounce">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold-400/20 text-gold-400 border border-gold-400/30">
              MEMBER PROFILE ACCESS
            </span>
            <h2 className="text-xl font-black text-white">Log In to View EXIM Business Profile</h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Create a free account or log in in 10 seconds to access company details, product commodities, and 6-image factory galleries.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="w-full py-3.5 rounded-2xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to View Profile</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
              className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer border border-white/15"
            >
              Create Free Account
            </button>
          </div>

          <div className="pt-2 text-[11px] text-slate-400">
            <button
              type="button"
              onClick={handleGoBack}
              className="text-slate-400 hover:text-gold-400 font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Business Profile</span>
            </button>
          </div>
        </div>

        {/* AUTH MODAL FOR GUESTS */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="max-w-sm w-full bg-white rounded-3xl p-6 space-y-5 text-slate-900 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-ocean-950">
                  {authMode === 'login' ? 'Log In to Your Account' : 'Create Free Member Account'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Access trader profiles on EXIM Growth Network</p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs font-medium">
                {authMode === 'register' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. trader@eximgrowth.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all mt-2"
                >
                  {authMode === 'login' ? 'Log In to Account' : 'Create Free Account & Log In'}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                    setAuthError('');
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-ocean-950 underline cursor-pointer"
                >
                  {authMode === 'login' ? "Don't have an account? Sign up free" : 'Already registered? Log in here'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto font-bold">
            <Building className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-ocean-950">Enterprise Profile Not Found</h2>
          <p className="text-xs text-slate-500 font-medium">
            The requested business profile clean link may have moved or been updated.
          </p>
          <button
            type="button"
            onClick={handleGoBack}
            className="px-5 py-2.5 rounded-xl bg-ocean-950 hover:bg-ocean-900 text-gold-400 font-bold text-xs cursor-pointer transition-all shadow-md inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Business Profile</span>
          </button>
        </div>
      </div>
    );
  }

  const galleryImages = (profile.gallery_images || []).filter(img => img && img.dataUrl);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-gold-500 selection:text-white py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Navigation Bar */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleGoBack}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareProfile}
              className="px-3.5 py-2 rounded-xl bg-ocean-950 text-gold-400 hover:bg-ocean-900 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Profile URL Copied' : 'Share Profile'}</span>
            </button>
          </div>
        </div>

        {/* HERO COMPANY CARD */}
        <div className="relative rounded-3xl bg-ocean-950 text-white border border-ocean-800 p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Company Badges & Name */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold-400 text-ocean-950 shadow">
                {(profile.role || 'EXIM TRADER').toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {profile.company_name || 'EXIM Global Enterprise'}
            </h1>

            {/* PERSON NAME: HIDDEN BY DEFAULT UNTIL CAPTCHA IS VERIFIED */}
            <div className="text-xs text-gold-400 font-bold flex items-center gap-2">
              {isCaptchaVerified ? (
                <span>👤 {profile.contact_name || 'EXIM Member'}</span>
              ) : (
                <span className="text-slate-300 font-semibold bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                  👤 Contact Person: <span className="text-gold-400 font-bold">Complete Security Check Below to Reveal</span>
                </span>
              )}
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 font-medium">{profile.designation || 'Managing Director'}</span>
            </div>
          </div>

          {/* Direct WhatsApp Action Button (REVEALED ONLY AFTER VISUAL CANVAS CAPTCHA VERIFICATION) */}
          {profile.phone && (
            <div className="pt-2 border-t border-ocean-800/80">
              {isCaptchaVerified ? (
                <a
                  href={`https://api.whatsapp.com/send?phone=${profile.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Hi ${profile.contact_name || ''}, I saw your business profile for ${profile.company_name || ''} on EXIM Growth Network.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span>Contact Direct on WhatsApp: {profile.phone}</span>
                </a>
              ) : (
                <div className="p-5 rounded-2xl bg-ocean-900 border border-ocean-800 text-center space-y-3.5">
                  <div className="flex items-center justify-center gap-2 text-gold-400 font-bold text-xs uppercase tracking-wider">
                    <Shield className="w-4 h-4 text-gold-400" />
                    <span>Visual Bot Protection & Contact Security Check</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Type the 5-character visual captcha code shown in the image below to reveal person name, WhatsApp & email details:
                  </p>

                  <form onSubmit={handleVerifyCaptcha} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                    {/* VISUAL HTML5 CANVAS CAPTCHA IMAGE (UNREADABLE TO DOM SCRAPERS) */}
                    <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-700 shadow-inner">
                      <canvas
                        ref={canvasRef}
                        width={150}
                        height={40}
                        className="rounded-lg cursor-pointer"
                        onClick={generateNewCaptcha}
                        title="Click to generate new captcha image"
                      />
                      <button
                        type="button"
                        onClick={generateNewCaptcha}
                        title="Refresh Captcha"
                        className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="ENTER CODE"
                      className="w-32 px-3 py-2 rounded-xl bg-white text-ocean-950 font-black text-center text-sm uppercase outline-none tracking-widest"
                    />

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs cursor-pointer shadow transition-all shrink-0 uppercase tracking-wider"
                    >
                      Reveal Contact
                    </button>
                  </form>

                  {captchaError && (
                    <p className="text-[11px] text-red-400 font-bold">{captchaError}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ENTERPRISE SPECS & OVERVIEW GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trade Specs Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-xs font-black text-ocean-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-4 h-4 text-gold-500" />
              <span>Trade Commodities & Port Logistics</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-extrabold uppercase block mb-1">Export / Import Commodities</span>
                <p className="font-bold text-ocean-950 text-sm leading-relaxed">
                  {profile.commodities || 'Spices, Agricultural Produce, General Commodities'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] font-extrabold uppercase block mb-1">Operating Ports & Hubs</span>
                <p className="font-semibold text-slate-700">
                  📍 {profile.operating_ports || 'Major Sea & Air Ports'}
                </p>
              </div>

              {profile.iec_or_gst && (
                <div>
                  <span className="text-slate-400 text-[10px] font-extrabold uppercase block mb-1">Registration / IEC Code</span>
                  <p className="font-mono text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 inline-block">
                    {profile.iec_or_gst}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact & Bio Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-xs font-black text-ocean-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Company Overview & Channels</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-extrabold uppercase block mb-1">Business Bio</span>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {profile.bio || 'Leading global trade enterprise registered on EXIM Growth Network.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                {profile.email && (
                  isCaptchaVerified ? (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-slate-700 hover:text-ocean-950 font-medium">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{profile.email}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{profile.email.slice(0, 3)}••••@••••.com (Complete Security Check to reveal)</span>
                    </div>
                  )
                )}

                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:underline font-bold">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}

                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline font-bold">
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 6-IMAGE PRODUCT & FACTORY GALLERY */}
        {galleryImages.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-black text-ocean-950 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Product & Factory Photo Gallery</span>
              </h2>
              <span className="text-[11px] font-bold text-slate-400">
                {galleryImages.length} Photos
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {galleryImages.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setPreviewImage(img.dataUrl)}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-900 aspect-square shadow-sm cursor-pointer"
                >
                  <img
                    src={img.dataUrl}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ocean-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1">
                    <Maximize2 className="w-4 h-4" />
                    <span>Inspect</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE TRADE LEADS PUBLISHED BY THIS COMPANY */}
        {tradePosts.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-xs font-black text-ocean-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShoppingBag className="w-4 h-4 text-gold-500" />
              <span>Active Trade Leads Published ({tradePosts.length})</span>
            </h2>

            <div className="space-y-3">
              {tradePosts.map(post => (
                <div key={post.id} className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-ocean-950 text-gold-400">
                        {post.template_type}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {post.origin_or_location || post.destination || 'Global Trade'}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-ocean-950">
                      {post.product_or_service || post.raw_details?.product}
                    </h4>
                  </div>

                  <a
                    href={`/post/${post.id}`}
                    className="px-3.5 py-2 rounded-xl bg-ocean-950 hover:bg-ocean-900 text-gold-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                  >
                    <span>View Trade Post Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 font-medium py-4">
          EXIM Enterprise Profile • Official Trade Portal
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full text-center space-y-4">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Product Full Preview"
              className="max-h-[80vh] mx-auto rounded-2xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
