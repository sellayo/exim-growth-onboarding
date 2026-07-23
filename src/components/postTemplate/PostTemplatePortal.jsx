import React, { useState, useRef } from 'react';
import PostCardCanvas from './PostCardCanvas';
import { EXIM_COMMODITY_CATALOG, getStockImageUrl } from '../../lib/stockImages';
import { saveTradePost, signInWithEmail, signUpWithSupabase, signInWithSupabase } from '../../lib/supabase';
import { getLoggedInMember, loginUserWithEmail, registerUserWithEmail, logoutMember } from '../../lib/memberAuth';
import { 
  ShoppingBag, 
  Store, 
  Truck, 
  Briefcase,
  HelpCircle, 
  Search, 
  Upload, 
  Copy, 
  Check, 
  Share2, 
  MessageSquare, 
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
  Phone,
  Mail,
  Globe,
  Building,
  User,
  Wand2,
  Send,
  Download,
  CheckCircle2,
  FileImage,
  LogOut,
  X,
  ShieldCheck,
  Lock,
  Key
} from 'lucide-react';

const KERALA_EXPORT_HSN_CODES = [
  { code: '0904.11', title: 'Black Pepper (Whole / Dried)' },
  { code: '0908.31', title: 'Cardamom (Small Green Cardamom)' },
  { code: '0910.11', title: 'Fresh / Dried Ginger' },
  { code: '0910.30', title: 'Turmeric (Curcuma Whole/Powder)' },
  { code: '0801.32', title: 'Cashew Nuts (Shelled Kernels)' },
  { code: '0801.19', title: 'Desiccated Coconut / Coconut Products' },
  { code: '1513.19', title: 'Coconut Oil (Refined / Virgin Oil)' },
  { code: '0306.17', title: 'Frozen Shrimps & Prawns' },
  { code: '0307.43', title: 'Frozen Squid & Cuttlefish' },
  { code: '0902.30', title: 'Black Tea (Kerala Hill Garden Tea)' },
  { code: '0901.11', title: 'Coffee Beans (Robusta / Arabica)' },
  { code: '4001.22', title: 'Natural Rubber (Technically Specified)' },
  { code: '5702.20', title: 'Coir Mats & Fibre Floor Coverings' },
  { code: '0803.90', title: 'Fresh Bananas / Nendran Chips' },
  { code: '3301.90', title: 'Spice Extract Oleoresins & Oils' },
  { code: '6802.21', title: 'Granite & Natural Stone Slabs' },
  { code: '1006.30', title: 'Rice (Basmati & Non-Basmati)' },
  { code: '1701.99', title: 'Refined White / Raw Sugar' },
  { code: '0703.10', title: 'Fresh Onions & Shallots' },
  { code: '0702.00', title: 'Fresh Tomatoes & Vegetables' }
];

const COMMON_CERTIFICATIONS = [
  'FSSAI (Food Safety India)',
  'ISO 9001:2015 (Quality Management)',
  'ISO 22000 / HACCP (Food Safety)',
  'APEDA Registration',
  'Spices Board Certificate (CRES)',
  'CDB Coconut Development Board',
  'Coir Board Registration',
  'US FDA Registration',
  'EU Organic Certification',
  'Halal Certification',
  'Kosher Certified',
  'GMP Certified (Good Manufacturing)',
  'SGS Inspection Certificate',
  'Phytosanitary Certificate',
  'Certificate of Origin (e-COO)',
  'CE Marking (European Conformity)'
];

const PORT_PRESETS = [
  'Cochin Port (Vallarpadam Terminal), Kerala',
  'Jebel Ali Port, Dubai (UAE)',
  'Hamad Port, Doha (Qatar)',
  'Shuwaikh Port, Kuwait',
  'Sohar Port, Oman',
  'Port of Felixstowe / London Gateway (UK)',
  'Port of Rotterdam, Netherlands (EU)',
  'Port of Hamburg, Germany',
  'Port of New York & New Jersey (USA)',
  'Port of Los Angeles / Long Beach (USA)',
  'Port of Singapore (SEA Hub)',
  'Port Klang, Malaysia',
  'Tutuicorin Port (V.O.Chidambaranar), TN',
  'Chennai Port, Tamil Nadu',
  'JNPT / Nhava Sheva, Mumbai'
];

const TIMELINE_PRESETS = [
  'Immediate / Next 7 Days',
  'Within 15 Days',
  'Within 30 Days',
  'Monthly Contract Shipment',
  'Spot Buying / Ready Cargo'
];

const CONTAINER_PRESETS = [
  '20ft Standard Dry Container (FCL)',
  '40ft High Cube Container (FCL)',
  '40ft Reefer Container (Temperature Controlled)',
  'LCL (Consolidated Parcel)',
  'Air Freight Cargo',
  'Break Bulk / Dry Bulk Vessel'
];

const EXIM_SERVICE_PRESETS = [
  'Customs Clearance (CHA)',
  'DGFT Export/Import Licensing & IEC',
  'Sea / Air Freight Forwarding',
  'Certificate of Origin (e-COO)',
  'Quality Inspection & SGS Certification',
  'Export Credit Insurance (ECGC)',
  'Trade Finance & Letter of Credit (LC)',
  'Legal & Trade Compliance Advisory',
  'Export Packaging & Palletization'
];

export default function PostTemplatePortal({ onExit, initialData = null }) {
  const [templateType, setTemplateType] = useState('buyer');
  const canvasRef = useRef(null);
  const [currentPostId] = useState(() => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : null));
  const [savedPostId, setSavedPostId] = useState(null);

  const initialMember = getLoggedInMember();
  const [loggedInMember, setLoggedInMember] = useState(initialMember);

  // Email Sign Up / Login Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authCompany, setAuthCompany] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  const [formData, setFormData] = useState(() => ({
    product: initialData?.product || 'Kerala Black Pepper (Whole / Dried)',
    price: initialData?.price || '$6,500 / Metric Ton (FOB)',
    quantity: initialData?.quantity || '50 Metric Tons (MT)',
    destination: initialData?.destination || 'Jebel Ali Port, Dubai (UAE)',
    timeline: initialData?.timeline || 'Immediate / Next 7 Days',
    requirements: initialData?.requirements || 'FSSAI (Food Safety India), Spices Board Certificate (CRES), ISO 22000 / HACCP',

    moq: initialData?.moq || '5 Metric Tons (MT)',
    location: initialData?.location || 'Cochin Port (Vallarpadam Terminal), Kerala',
    certifications: initialData?.certifications || 'ISO 9001:2015 (Quality), FSSAI (Food Safety India), Phytosanitary Certificate',

    origin: initialData?.origin || 'Cochin Port (Vallarpadam Terminal), Kerala',
    container: initialData?.container || '40ft High Cube Container (FCL)',

    serviceType: initialData?.serviceType || 'Customs Clearance (CHA)',
    serviceDetails: initialData?.serviceDetails || 'Need CHA assistance for DGFT export licensing & e-COO documentation.',
    locationPort: initialData?.locationPort || 'Cochin Port (Vallarpadam Terminal), Kerala',

    problem: initialData?.problem || 'DGFT Export License & COO Process',
    context: initialData?.context || 'We are starting exports of organic spices from Kerala to Europe and need guidance on Certificate of Origin.',
    question: initialData?.question || 'What is the fastest way to issue e-COO via DGFT portal for EU shipments?',

    // Contact Details
    companyName: initialData?.companyName || initialMember?.companyName || 'EXIM Global Trade Pvt Ltd',
    contactName: initialData?.contactName || initialMember?.name || 'Rahul Sharma',
    contactPhone: initialData?.contactPhone || initialMember?.phone || '+91 98765 43210',
    contactEmail: initialData?.contactEmail || initialMember?.email || 'trade@eximglobal.com',
    contactWebsite: initialData?.contactWebsite || 'www.eximglobal.com'
  }));

  const [searchInputText, setSearchInputText] = useState('Pepper');
  const [selectedImageUrl, setSelectedImageUrl] = useState(EXIM_COMMODITY_CATALOG[2].url);
  
  // Generation & Share state
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [shareNotice, setShareNotice] = useState('');

  const handleEmailAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');

    if (!authEmail || !authEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!authPassword || !authPassword.trim()) {
      setAuthError('Please enter your password.');
      return;
    }

    try {
      if (authMode === 'register') {
        if (authPassword.trim().length < 4) {
          setAuthError('Password must be at least 4 characters long.');
          return;
        }
        if (authPassword !== authConfirmPassword) {
          setAuthError('Passwords do not match. Please re-enter.');
          return;
        }

        const res = await signUpWithSupabase({
          email: authEmail,
          password: authPassword,
          fullName: authName,
          companyName: authCompany,
          phone: authPhone
        });

        if (res.needsVerification) {
          setAuthSuccessMsg(res.message);
          return;
        }

        setLoggedInMember(res.user);
        setFormData(prev => ({
          ...prev,
          contactName: res.user.name || prev.contactName,
          contactEmail: res.user.email || prev.contactEmail,
          companyName: res.user.companyName || prev.companyName,
          contactPhone: res.user.phone || prev.contactPhone
        }));
      } else {
        const user = await signInWithSupabase({
          email: authEmail,
          password: authPassword
        });
        setLoggedInMember(user);
        setFormData(prev => ({
          ...prev,
          contactName: user.name || prev.contactName,
          contactEmail: user.email || prev.contactEmail,
          companyName: user.companyName || prev.companyName,
          contactPhone: user.phone || prev.contactPhone
        }));
      }

      setShowEmailModal(false);
      setAuthError('');
    } catch (err) {
      console.error('Authentication Error:', err);
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleMemberLogout = () => {
    logoutMember();
    setLoggedInMember(null);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasGenerated(false); // Reset generated state when details change
  };

  const triggerImageSearch = (query) => {
    const cleanQuery = (query || searchInputText).trim();
    if (!cleanQuery) return;
    const matchedUrl = getStockImageUrl(cleanQuery);
    setSelectedImageUrl(matchedUrl);
    setHasGenerated(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedImageUrl(uploadEvent.target.result);
          setHasGenerated(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate WhatsApp Formatted Text
  const generateWhatsAppText = () => {
    let mainBody = '';
    
    if (templateType === 'buyer') {
      mainBody = `📢 *EXIM GROWTH NETWORK - BUY REQUIREMENT*
─────────────────────────────
📦 *Product Required:* ${formData.product || 'N/A'}
${formData.price ? `💰 *Target Price:* ${formData.price}\n` : ''}⚖️ *Quantity:* ${formData.quantity || 'N/A'}
📍 *Destination:* ${formData.destination || 'N/A'}
⏱️ *Timeline:* ${formData.timeline || 'Immediate'}
📝 *Requirements:* ${formData.requirements || 'Standard Quality'}`;

    } else if (templateType === 'supplier') {
      mainBody = `📢 *EXIM GROWTH NETWORK - SELL OFFER / SUPPLY*
─────────────────────────────
📦 *Product Offered:* ${formData.product || 'N/A'}
${formData.price ? `💰 *Offering Price:* ${formData.price}\n` : ''}🔢 *MOQ:* ${formData.moq || 'Flexible'}
🏭 *Origin / Location:* ${formData.location || 'N/A'}
🏆 *Certifications:* ${formData.certifications || 'ISO Certified'}`;

    } else if (templateType === 'logistics') {
      mainBody = `📢 *EXIM GROWTH NETWORK - LOGISTICS & SHIPPING*
─────────────────────────────
🚢 *Cargo / Container:* ${formData.container || 'FCL/LCL'}
${formData.product ? `📦 *Product / Cargo:* ${formData.product}\n` : ''}🛫 *Origin:* ${formData.origin || 'N/A'}
🛬 *Destination:* ${formData.destination || 'N/A'}
⏱️ *Timeline:* ${formData.timeline || 'Immediate'}`;

    } else if (templateType === 'exim_service') {
      mainBody = `📢 *EXIM GROWTH NETWORK - EXIM SERVICE REQUEST*
─────────────────────────────
🛠️ *Service Required:* ${formData.serviceType || 'EXIM Advisory'}
📝 *Details & Compliance:* ${formData.serviceDetails || formData.requirements || 'General Assistance'}
📍 *Location / Port:* ${formData.locationPort || 'N/A'}
⏱️ *Timeline:* ${formData.timeline || 'Immediate'}`;

    } else {
      mainBody = `📢 *EXIM GROWTH NETWORK - COMMUNITY QUESTION*
─────────────────────────────
❓ *Topic:* ${formData.problem || 'N/A'}
📌 *Context:* ${formData.context || 'N/A'}
💡 *Question:* ${formData.question || 'N/A'}`;
    }

    // Poster & Contact block
    const contacts = [];
    if (formData.companyName?.trim()) contacts.push(`🏢 *Company:* ${formData.companyName.trim()}`);
    if (formData.contactName?.trim()) contacts.push(`👤 *Contact:* ${formData.contactName.trim()}`);
    if (formData.contactPhone?.trim()) contacts.push(`📞 *Phone / WA:* ${formData.contactPhone.trim()}`);
    if (formData.contactEmail?.trim()) contacts.push(`✉️ ${formData.contactEmail.trim()}`);
    if (formData.contactWebsite?.trim()) contacts.push(`🌐 ${formData.contactWebsite.trim()}`);

    let contactBlock = '';
    if (contacts.length > 0) {
      contactBlock = `\n─────────────────────────────\n` + contacts.join('\n');
    }

    // Attach tracking link ONLY for logged in members
    const activeId = savedPostId || currentPostId;
    const trackingBlock = loggedInMember
      ? `\n─────────────────────────────\n🔗 *Check Live Status & Connect:* ${window.location.origin}/post/${activeId}`
      : '';

    return `${mainBody}${contactBlock}${trackingBlock}
─────────────────────────────
💬 *DM for details | EXIM Growth Network*`;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 450);
  };

  const handleCopyText = () => {
    const text = generateWhatsAppText();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const persistPostToDB = async () => {
    try {
      setSaveStatus('Saving Details to DB...');
      const targetId = savedPostId || currentPostId;
      const res = await saveTradePost(templateType, formData, targetId);
      if (res && res[0]?.id) {
        setSavedPostId(res[0].id);
      }
      setSaveStatus('✅ Details Saved to DB!');
      setTimeout(() => setSaveStatus(''), 3500);
      return res && res[0] ? res[0] : null;
    } catch (err) {
      console.error('Save to DB error:', err);
      setSaveStatus('⚠️ Saved to LocalStorage');
      setTimeout(() => setSaveStatus(''), 3500);
      return null;
    }
  };

  const getCanvasImageFile = async () => {
    const canvas = canvasRef.current || document.querySelector('canvas');
    if (!canvas) return null;
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        const file = new File([blob], `EXIM_Trade_Post_${templateType}_${Date.now()}.png`, { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    });
  };

  const triggerImageDownload = () => {
    const canvas = canvasRef.current || document.querySelector('canvas');
    if (!canvas) return;
    try {
      const link = document.createElement('a');
      link.download = `EXIM_Trade_Post_${templateType}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.warn('Canvas download error:', err);
    }
  };

  const handleShareDirectGroup = async () => {
    await persistPostToDB();
    triggerImageDownload();
    handleCopyText();

    let targetGroupUrl = 'https://chat.whatsapp.com/Hbxjyk6YE0hLf9Pt8XPl1k';
    if (templateType === 'logistics' || templateType === 'exim_service') {
      targetGroupUrl = 'https://chat.whatsapp.com/GP9H7iXzciZ0tcPG8Oj3mw';
    } else if (templateType === 'question') {
      targetGroupUrl = 'https://chat.whatsapp.com/Kan62U7jTiyJHBXhVPSBbx';
    }

    setShareNotice('📷 Image downloaded & 📋 text copied! Opening WhatsApp group...');
    setTimeout(() => {
      window.open(targetGroupUrl, '_blank');
      setShareNotice('');
    }, 1500);
  };

  const handleShareWhatsAppTextOnly = async () => {
    await persistPostToDB();
    const text = generateWhatsAppText();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleShareImageOnly = async () => {
    await persistPostToDB();
    triggerImageDownload();
    setShareNotice('📷 Banner image downloaded! You can now attach & share it in WhatsApp groups.');
    setTimeout(() => setShareNotice(''), 3500);
  };

  const handleShareTextOnly = async () => {
    await handleShareWhatsAppTextOnly();
  };

  const handleShareBoth = async () => {
    await persistPostToDB();
    triggerImageDownload();
    handleCopyText();
    setShareNotice('📷 Banner downloaded & 📋 text copied! Opening WhatsApp...');
    const text = generateWhatsAppText();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    setTimeout(() => {
      window.open(waUrl, '_blank');
      setShareNotice('');
    }, 1200);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-6 space-y-4 sm:space-y-6 font-sans">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="EXIM Growth Network"
            className="w-10 h-10 rounded-xl object-cover border border-ocean-800/30 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-extrabold text-base sm:text-xl tracking-tight leading-none">
                <span className="text-[#0B3FAD]">EXIM Growth</span>{' '}
                <span className="text-[#F57E13]">Network</span>
                <span className="text-slate-700 font-semibold text-xs sm:text-sm ml-2">| Trade Post Generator</span>
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-gold-50 text-gold-700 border border-gold-300 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-500" /> High Visibility
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
              Generate standardized visual banners & formatted posts for WhatsApp & Social Groups.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {loggedInMember ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{loggedInMember.name || 'Logged In'}</span>
              </span>
              <button
                type="button"
                onClick={handleMemberLogout}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="px-3.5 py-2 rounded-xl bg-ocean-950 text-white hover:bg-ocean-900 font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer border border-gold-500/30"
            >
              <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>Sign In / Register with Email</span>
            </button>
          )}

          {onExit && (
            <button
              onClick={onExit}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>

      {/* WHY CREATE AN ACCOUNT / MEMBER ADVANTAGE BANNER */}
      {!loggedInMember && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-ocean-950 via-slate-900 to-ocean-950 text-white shadow-lg border border-gold-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-gold-400 text-ocean-950 rounded-full">
                ✨ Member Advantage
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Why Create a Free Account on EXIM Growth Network?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Sign up or log in with Email to unlock <strong>Live Status Tracking Links</strong> on your shared WhatsApp posts, <strong>15-second template re-use</strong>, and <strong>direct WhatsApp contact details</strong> for verified buyers & sellers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowEmailModal(true)}
            className="px-4 py-3 rounded-2xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>Continue with Email</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <button
          type="button"
          onClick={() => { setTemplateType('buyer'); setHasGenerated(false); }}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
            templateType === 'buyer'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/40'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${templateType === 'buyer' ? 'bg-white text-emerald-700' : 'bg-emerald-200 text-emerald-900'}`}>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-sm sm:text-base tracking-wider uppercase truncate">BUY</h3>
            <p className={`text-[10px] truncate ${templateType === 'buyer' ? 'text-emerald-100' : 'text-emerald-700'}`}>Buying Requirements</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => { setTemplateType('supplier'); setHasGenerated(false); }}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
            templateType === 'supplier'
              ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-400/40'
              : 'bg-red-50 text-red-900 border-red-200 hover:bg-red-100'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${templateType === 'supplier' ? 'bg-white text-red-700' : 'bg-red-200 text-red-900'}`}>
            <Store className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-sm sm:text-base tracking-wider uppercase truncate">SELL</h3>
            <p className={`text-[10px] truncate ${templateType === 'supplier' ? 'text-red-100' : 'text-red-700'}`}>Supply Offers</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => { setTemplateType('logistics'); setHasGenerated(false); }}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
            templateType === 'logistics'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/40'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${templateType === 'logistics' ? 'bg-white text-blue-700' : 'bg-slate-100 text-ocean-900'}`}>
            <Truck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm truncate">Logistics</h3>
            <p className={`text-[10px] truncate ${templateType === 'logistics' ? 'text-blue-100' : 'text-slate-400'}`}>Freight & Cargo</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => { setTemplateType('exim_service'); setHasGenerated(false); }}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
            templateType === 'exim_service'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${templateType === 'exim_service' ? 'bg-white text-amber-700' : 'bg-slate-100 text-ocean-900'}`}>
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm truncate">Exim Services</h3>
            <p className={`text-[10px] truncate ${templateType === 'exim_service' ? 'text-amber-100' : 'text-slate-400'}`}>CHA, License, COO</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => { setTemplateType('question'); setHasGenerated(false); }}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
            templateType === 'question'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400/40'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${templateType === 'question' ? 'bg-white text-purple-700' : 'bg-slate-100 text-ocean-900'}`}>
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm truncate">Question</h3>
            <p className={`text-[10px] truncate ${templateType === 'question' ? 'text-purple-100' : 'text-slate-400'}`}>Ask Community</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm sm:text-base font-extrabold text-ocean-950 uppercase tracking-wide">
              Fill Trade & Contact Details
            </h3>
            {saveStatus && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 animate-pulse">
                {saveStatus}
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs font-medium">
            {/* BUY Form */}
            {templateType === 'buyer' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      ● Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.product}
                      onChange={(e) => handleFieldChange('product', e.target.value)}
                      placeholder="e.g. Kerala Black Pepper, Cashew Kernels, Coir Mats"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Target Price / Rate <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleFieldChange('price', e.target.value)}
                      placeholder="e.g. $6,500 / MT, ₹450 / Kg, Negotiable"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <QuantityWithUnitInput
                    label="Quantity Required"
                    required
                    value={formData.quantity}
                    onChange={(val) => handleFieldChange('quantity', val)}
                  />
                  <DropdownWithCustomInput
                    label="Destination Port / Country"
                    required
                    options={PORT_PRESETS}
                    value={formData.destination}
                    onChange={(val) => handleFieldChange('destination', val)}
                  />
                </div>

                <div className="space-y-3">
                  <DropdownWithCustomInput
                    label="Timeline"
                    required
                    options={TIMELINE_PRESETS}
                    value={formData.timeline}
                    onChange={(val) => handleFieldChange('timeline', val)}
                  />
                  <MultiSelectCertificationsInput
                    label="Quality Requirements & Certifications"
                    value={formData.requirements}
                    onChange={(val) => handleFieldChange('requirements', val)}
                    placeholder="Type custom compliance/test report & press Enter..."
                  />
                </div>
              </>
            )}

            {/* SELL Form */}
            {templateType === 'supplier' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      ● Product Offered *
                    </label>
                    <input
                      type="text"
                      value={formData.product}
                      onChange={(e) => handleFieldChange('product', e.target.value)}
                      placeholder="e.g. Green Cardamom 8mm+, Virgin Coconut Oil"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Offering Price / Rate <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleFieldChange('price', e.target.value)}
                      placeholder="e.g. ₹520 / Kg, $7,200 / MT, Best Market Rate"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <QuantityWithUnitInput
                    label="MOQ (Min Order Qty)"
                    required
                    value={formData.moq}
                    onChange={(val) => handleFieldChange('moq', val)}
                  />
                  <DropdownWithCustomInput
                    label="Origin / Location"
                    required
                    options={PORT_PRESETS}
                    value={formData.location}
                    onChange={(val) => handleFieldChange('location', val)}
                  />
                </div>

                <MultiSelectCertificationsInput
                  label="Certifications & Compliance"
                  value={formData.certifications}
                  onChange={(val) => handleFieldChange('certifications', val)}
                  placeholder="Type custom certificate/license & press Enter..."
                />
              </>
            )}

            {/* LOGISTICS Form */}
            {templateType === 'logistics' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DropdownWithCustomInput
                    label="Container & Cargo Type"
                    required
                    options={CONTAINER_PRESETS}
                    value={formData.container}
                    onChange={(val) => handleFieldChange('container', val)}
                  />
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Product / Cargo Name <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.product}
                      onChange={(e) => handleFieldChange('product', e.target.value)}
                      placeholder="e.g. Frozen Shrimps, Spices & Tea, Granite Slabs"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <DropdownWithCustomInput
                    label="Origin Port / City"
                    required
                    options={PORT_PRESETS}
                    value={formData.origin}
                    onChange={(val) => handleFieldChange('origin', val)}
                  />
                  <DropdownWithCustomInput
                    label="Destination Port"
                    required
                    options={PORT_PRESETS}
                    value={formData.destination}
                    onChange={(val) => handleFieldChange('destination', val)}
                  />
                  <DropdownWithCustomInput
                    label="Timeline"
                    required
                    options={TIMELINE_PRESETS}
                    value={formData.timeline}
                    onChange={(val) => handleFieldChange('timeline', val)}
                  />
                </div>
              </>
            )}

            {/* EXIM SERVICES Form */}
            {templateType === 'exim_service' && (
              <>
                <DropdownWithCustomInput
                  label="Service Type Required"
                  required
                  options={EXIM_SERVICE_PRESETS}
                  value={formData.serviceType}
                  onChange={(val) => handleFieldChange('serviceType', val)}
                />

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Service Request Details</label>
                  <input
                    type="text"
                    value={formData.serviceDetails}
                    onChange={(e) => handleFieldChange('serviceDetails', e.target.value)}
                    placeholder="e.g. Need CHA clearance for 2x 40ft containers of spices at Vallarpadam Terminal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                  />
                </div>

                <MultiSelectCertificationsInput
                  label="Required Compliance & Licenses"
                  value={formData.requirements}
                  onChange={(val) => handleFieldChange('requirements', val)}
                  placeholder="Type compliance/license needed & press Enter..."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DropdownWithCustomInput
                    label="Location / Port"
                    required
                    options={PORT_PRESETS}
                    value={formData.locationPort}
                    onChange={(val) => handleFieldChange('locationPort', val)}
                  />
                  <DropdownWithCustomInput
                    label="Timeline"
                    required
                    options={TIMELINE_PRESETS}
                    value={formData.timeline}
                    onChange={(val) => handleFieldChange('timeline', val)}
                  />
                </div>
              </>
            )}

            {templateType === 'question' && (
              <>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Problem / Topic *</label>
                  <input
                    type="text"
                    value={formData.problem}
                    onChange={(e) => handleFieldChange('problem', e.target.value)}
                    placeholder="e.g. DGFT Export License & COO Process"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Context *</label>
                  <textarea
                    rows="2"
                    value={formData.context}
                    onChange={(e) => handleFieldChange('context', e.target.value)}
                    placeholder="Describe background context..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none resize-none text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Specific Question *</label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => handleFieldChange('question', e.target.value)}
                    placeholder="e.g. What is the fastest way to get e-COO approved?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                  />
                </div>
              </>
            )}

            <div className="pt-3 border-t border-slate-200">
              <span className="block font-bold text-slate-600 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Poster & Contact Details (Appears on Card & Text)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-500" /> Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleFieldChange('companyName', e.target.value)}
                    placeholder="e.g. EXIM Global Trade Pvt Ltd"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" /> Contact Person Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => handleFieldChange('contactName', e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" /> Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-blue-600" /> Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                    placeholder="trade@company.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-purple-600" /> Website / Link
                  </label>
                  <input
                    type="text"
                    value={formData.contactWebsite}
                    onChange={(e) => handleFieldChange('contactWebsite', e.target.value)}
                    placeholder="www.company.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-extrabold text-ocean-950 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-gold-600" />
              <span>Product Image (Stock Search & Device Upload)</span>
            </h4>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchInputText}
                  onChange={(e) => setSearchInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      triggerImageSearch(searchInputText);
                    }
                  }}
                  placeholder="Type commodity (e.g. Rice, Sugar, Mango, Tiles) & press Enter..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-ocean-950 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => triggerImageSearch(searchInputText)}
                className="px-4 py-2.5 rounded-xl bg-ocean-950 hover:bg-ocean-900 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <span>Search Image</span>
              </button>

              <label className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                <Upload className="w-3.5 h-3.5 text-ocean-900" />
                <span>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {EXIM_COMMODITY_CATALOG.map((imgItem, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchInputText(imgItem.title);
                    setSelectedImageUrl(imgItem.url);
                    setHasGenerated(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    selectedImageUrl === imgItem.url
                      ? 'bg-ocean-950 text-gold-400 border-ocean-950 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <img src={imgItem.url} alt={imgItem.title} className="w-4 h-4 rounded object-cover" />
                  <span>{imgItem.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 px-5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-ocean-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-gold-500/20 transition-all cursor-pointer ring-2 ring-gold-400/50 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Wand2 className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generating Post Banner & Text...' : '✨ Generate Post Banner & Text'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          {!hasGenerated ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-center space-y-4 min-h-[420px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gold-50 text-gold-600 border border-gold-200 flex items-center justify-center shadow-inner">
                <FileImage className="w-8 h-8 text-gold-500" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="font-extrabold text-slate-800 text-base">
                  Post Preview & Share Options
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fill in your trade details on the left and click the <strong className="text-gold-600 font-bold">"Generate"</strong> button to create your custom 800x800 visual image banner and formatted WhatsApp post.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 rounded-xl bg-ocean-950 hover:bg-ocean-900 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Wand2 className="w-4 h-4 text-gold-400" />
                <span>Generate Now</span>
              </button>
            </div>
          ) : (
            <>
              {shareNotice && (
                <div className="p-3 rounded-2xl bg-emerald-900 text-emerald-100 text-xs font-bold flex items-center gap-2 shadow-lg border border-emerald-700 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{shareNotice}</span>
                </div>
              )}

              <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-xs sm:text-sm font-extrabold text-ocean-950 flex items-center gap-2">
                    <span>Generated Post Banner</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Ready
                    </span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">800x800 PNG</span>
                </div>

                <PostCardCanvas
                  templateType={templateType}
                  data={formData}
                  imageUrl={selectedImageUrl}
                  canvasRef={canvasRef}
                />
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ocean-950 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Formatted Text</span>
                  </h4>
                  {copiedText && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Copied to Clipboard!
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono whitespace-pre-wrap max-h-44 overflow-y-auto leading-relaxed border border-slate-800">
                  {generateWhatsAppText()}
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleShareImageOnly}
                      className="py-3 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-blue-200" />
                      <span>Share Image Banner</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShareTextOnly}
                      className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-200" />
                      <span>Share Text (WhatsApp)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleShareBoth}
                      className="py-3 px-3 rounded-xl bg-ocean-950 hover:bg-ocean-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer border border-gold-500/30"
                    >
                      <Share2 className="w-4 h-4 text-gold-400" />
                      <span>Share Both (Image + Text)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShareDirectGroup}
                      className="py-3 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-amber-100" />
                      <span>Share to EXIM Group</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyText}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      copiedText
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Text Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>Copy Formatted Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* EMAIL SIGN-UP & LOGIN MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-ocean-950 text-gold-400 rounded-xl flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-ocean-950">
                    {authMode === 'login' ? 'Member Log In' : 'Create Free Member Account'}
                  </h3>
                  <p className="text-[11px] text-slate-500">EXIM Growth Network Platform</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowEmailModal(false); setAuthError(''); }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB SELECTOR: LOGIN VS REGISTER */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  authMode === 'login' ? 'bg-ocean-950 text-gold-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔑 Log In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
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
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-medium border border-emerald-300 space-y-1">
                <span className="font-extrabold text-emerald-800 text-xs block">📩 Check Your Email Inbox</span>
                <p>{authSuccessMsg}</p>
              </div>
            )}

            <form onSubmit={handleEmailAuthSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="e.g. trader@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                />
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={authConfirmPassword}
                      onChange={(e) => setAuthConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={authCompany}
                      onChange={(e) => setAuthCompany(e.target.value)}
                      placeholder="e.g. EXIM Global Trade Pvt Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>
                </>
              )}

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
                className="text-xs font-bold text-slate-500 hover:text-ocean-950 cursor-pointer underline"
              >
                {authMode === 'login' ? "Don't have an account? Create one here" : 'Already have an account? Log In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KeralaHsnDropdown({ label, value, onChange }) {
  const isMatched = KERALA_EXPORT_HSN_CODES.some(item => value?.includes(item.code));
  const [isCustom, setIsCustom] = useState(!isMatched && value !== '');

  return (
    <div>
      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-xs">
        {label} <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
      </label>
      <div className="space-y-1.5">
        <select
          value={isCustom ? 'OTHER_CUSTOM' : (value || '')}
          onChange={(e) => {
            if (e.target.value === 'OTHER_CUSTOM') {
              setIsCustom(true);
              onChange('');
            } else {
              setIsCustom(false);
              onChange(e.target.value);
            }
          }}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium cursor-pointer"
        >
          <option value="">-- Select HSN Code --</option>
          {KERALA_EXPORT_HSN_CODES.map((item, idx) => (
            <option key={idx} value={`${item.code} - ${item.title}`}>
              {item.code} | {item.title}
            </option>
          ))}
          <option value="OTHER_CUSTOM">✏️ Other (Type Custom HSN Code)...</option>
        </select>

        {isCustom && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type custom HSN Code (e.g. 0904.12)..."
            className="w-full px-3.5 py-2 rounded-xl border border-gold-400 bg-gold-50/40 focus:bg-white outline-none text-xs font-medium"
            autoFocus
          />
        )}
      </div>
    </div>
  );
}

function QuantityWithUnitInput({ label, value, onChange, required = false }) {
  const UNITS = [
    'Metric Tons (MT)',
    'Kilograms (Kg)',
    'Pounds (Lbs)',
    'Grams (g)',
    '20ft Container (FCL)',
    '40ft High Cube (FCL)',
    'LCL Boxes / Pallets',
    'Cartons / Boxes',
    'Pieces / Units'
  ];

  let initialQty = value || '';
  let initialUnit = 'Metric Tons (MT)';

  UNITS.forEach(u => {
    if (typeof value === 'string' && value.includes(u)) {
      initialQty = value.replace(u, '').trim();
      initialUnit = u;
    }
  });

  const [qtyVal, setQtyVal] = useState(initialQty);
  const [unitVal, setUnitVal] = useState(initialUnit);
  const [isCustomUnit, setIsCustomUnit] = useState(!UNITS.includes(initialUnit));
  const [customUnit, setCustomUnit] = useState(isCustomUnit ? initialUnit : '');

  const updateCombined = (newQty, newUnit) => {
    setQtyVal(newQty);
    const finalUnit = newUnit === 'OTHER_CUSTOM' ? customUnit : newUnit;
    const combined = newQty ? `${newQty} ${finalUnit}`.trim() : '';
    onChange(combined);
  };

  return (
    <div>
      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-xs">
        {required ? '● ' : ''}{label} {required ? '*' : ''}
      </label>
      <div className="flex gap-1.5">
        <input
          type="text"
          value={qtyVal}
          onChange={(e) => updateCombined(e.target.value, unitVal)}
          placeholder="e.g. 50, 100, 2x 40ft"
          className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
        />
        <select
          value={isCustomUnit ? 'OTHER_CUSTOM' : unitVal}
          onChange={(e) => {
            if (e.target.value === 'OTHER_CUSTOM') {
              setIsCustomUnit(true);
              updateCombined(qtyVal, customUnit || 'Units');
            } else {
              setIsCustomUnit(false);
              setUnitVal(e.target.value);
              updateCombined(qtyVal, e.target.value);
            }
          }}
          className="w-36 px-2.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-bold cursor-pointer shrink-0"
        >
          {UNITS.map((u, idx) => (
            <option key={idx} value={u}>{u}</option>
          ))}
          <option value="OTHER_CUSTOM">✏️ Custom Unit...</option>
        </select>
      </div>

      {isCustomUnit && (
        <input
          type="text"
          value={customUnit}
          onChange={(e) => {
            setCustomUnit(e.target.value);
            updateCombined(qtyVal, e.target.value);
          }}
          placeholder="Type custom unit (e.g. Barrels, Bags)..."
          className="w-full mt-1.5 px-3 py-2 rounded-xl border border-gold-400 bg-gold-50/40 text-xs font-medium outline-none"
        />
      )}
    </div>
  );
}

function MultiSelectCertificationsInput({ label, value, onChange, placeholder }) {
  const [customTag, setCustomTag] = useState('');

  const selectedTags = (value || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  const toggleTag = (tag) => {
    let updated;
    if (selectedTags.includes(tag)) {
      updated = selectedTags.filter(t => t !== tag);
    } else {
      updated = [...selectedTags, tag];
    }
    onChange(updated.join(', '));
  };

  const addCustomTag = () => {
    const tag = customTag.trim();
    if (tag && !selectedTags.includes(tag)) {
      const updated = [...selectedTags, tag];
      onChange(updated.join(', '));
      setCustomTag('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-bold text-slate-700 uppercase tracking-wider text-xs">
        ● {label}
      </label>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
          {selectedTags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-ocean-950 text-gold-400 text-[11px] font-bold flex items-center gap-1.5 shadow-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                className="hover:text-red-400 font-extrabold cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomTag();
            }
          }}
          placeholder={placeholder || "Type custom certificate/compliance & press Enter..."}
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:border-ocean-950 outline-none"
        />
        <button
          type="button"
          onClick={addCustomTag}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shrink-0 cursor-pointer"
        >
          + Add Tag
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {COMMON_CERTIFICATIONS.map((cert, idx) => {
          const isSelected = selectedTags.includes(cert);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggleTag(cert)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isSelected ? '✓ ' : '+ '}{cert}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DropdownWithCustomInput({ label, options, value, onChange, placeholder, required = false }) {
  const isPreset = options.includes(value);
  const [isCustomMode, setIsCustomMode] = useState(!isPreset && value !== '');

  return (
    <div>
      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
        {required ? '● ' : ''}{label} {required ? '*' : ''}
      </label>
      <div className="space-y-1.5">
        <select
          value={isCustomMode ? 'OTHER_CUSTOM' : value}
          onChange={(e) => {
            if (e.target.value === 'OTHER_CUSTOM') {
              setIsCustomMode(true);
              onChange('');
            } else {
              setIsCustomMode(false);
              onChange(e.target.value);
            }
          }}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium cursor-pointer"
        >
          <option value="" disabled>-- Select {label} --</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
          <option value="OTHER_CUSTOM">✏️ Other (Type custom value...)</option>
        </select>

        {isCustomMode && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || `Enter custom ${label.toLowerCase()}...`}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gold-400 bg-gold-50/40 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
            autoFocus
          />
        )}
      </div>
    </div>
  );
}
