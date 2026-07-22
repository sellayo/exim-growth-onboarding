import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PostCardCanvas from './PostCardCanvas';
import { EXIM_COMMODITY_CATALOG, getStockImageUrl } from '../../lib/stockImages';
import { 
  ShoppingBag, 
  Store, 
  Truck, 
  HelpCircle, 
  Search, 
  Upload, 
  Copy, 
  Check, 
  Share2, 
  MessageSquare, 
  Sparkles,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';

export default function PostTemplatePortal({ onExit }) {
  const [templateType, setTemplateType] = useState('buyer');

  const [formData, setFormData] = useState({
    product: 'Basmati Rice (1121 Steam)',
    quantity: '50 Metric Tons (2x 40ft Containers)',
    destination: 'Jebel Ali Port, Dubai (UAE)',
    timeline: 'Immediate / Next 15 Days',
    requirements: 'FSSAI, ISO 22000, SGS Quality Certificate required',

    moq: '100 Units / 5 Metric Tons',
    location: 'Gujarat, India',
    certifications: 'ISO 9001, CE Certified, Export Grade',

    origin: 'Mundra Port, India',
    container: '40ft High Cube Container (FCL)',

    problem: 'DGFT Export License & COO Process',
    context: 'We are starting exports of organic spices to Europe and need guidance on Certificate of Origin.',
    question: 'What is the fastest way to issue e-COO via DGFT portal for EU shipments?'
  });

  // Local text input state for typing (default: sugar)
  const [searchInputText, setSearchInputText] = useState('Sugar');
  
  // Selected Image URL (Default: Sugar photo)
  const [selectedImageUrl, setSelectedImageUrl] = useState(EXIM_COMMODITY_CATALOG[0].url);
  const [copiedText, setCopiedText] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Search ONLY executes when Enter is pressed or Search button is clicked
  const triggerImageSearch = (query) => {
    const cleanQuery = (query || searchInputText).trim();
    if (!cleanQuery) return;

    const matchedUrl = getStockImageUrl(cleanQuery);
    setSelectedImageUrl(matchedUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedImageUrl(uploadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateWhatsAppText = () => {
    if (templateType === 'buyer') {
      return `📢 *EXIM GROWTH NETWORK - BUYER REQUIREMENT*
─────────────────────────────
📦 *Product:* ${formData.product || 'N/A'}
⚖️ *Quantity:* ${formData.quantity || 'N/A'}
📍 *Destination:* ${formData.destination || 'N/A'}
⏱️ *Timeline:* ${formData.timeline || 'Immediate'}
📝 *Requirements:* ${formData.requirements || 'Standard Quality'}
─────────────────────────────
💬 *DM for more details or reply in EXIM Growth Network*`;
    } else if (templateType === 'supplier') {
      return `📢 *EXIM GROWTH NETWORK - SUPPLIER REQUEST / OFFER*
─────────────────────────────
📦 *Product:* ${formData.product || 'N/A'}
🔢 *MOQ:* ${formData.moq || 'N/A'}
🏭 *Location:* ${formData.location || 'N/A'}
🏆 *Certifications:* ${formData.certifications || 'ISO Certified'}
─────────────────────────────
💬 *DM for more details or reply in EXIM Growth Network*`;
    } else if (templateType === 'logistics') {
      return `📢 *EXIM GROWTH NETWORK - LOGISTICS HELP*
─────────────────────────────
🛫 *Origin:* ${formData.origin || 'N/A'}
𛬬 *Destination:* ${formData.destination || 'N/A'}
🚢 *Container/Cargo:* ${formData.container || 'FCL/LCL'}
⏱️ *Timeline:* ${formData.timeline || 'Immediate'}
─────────────────────────────
💬 *DM for more details or reply in EXIM Growth Network*`;
    } else {
      return `📢 *EXIM GROWTH NETWORK - COMMUNITY QUESTION*
─────────────────────────────
❓ *Topic:* ${formData.problem || 'N/A'}
📌 *Context:* ${formData.context || 'N/A'}
💡 *Question:* ${formData.question || 'N/A'}
─────────────────────────────
💬 *DM for more details or reply in EXIM Growth Network*`;
    }
  };

  const handleCopyText = () => {
    const text = generateWhatsAppText();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppText();
    const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waShareUrl, '_blank');
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-6 space-y-4 sm:space-y-6">
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
              <h2 className="font-extrabold text-base sm:text-lg text-ocean-950 tracking-tight leading-none font-sans">
                WhatsApp Trade Post Generator
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-gold-50 text-gold-700 border border-gold-300 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-500" /> High Visibility
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              Standardized trade posts & visual image banners for community groups.
            </p>
          </div>
        </div>

        {onExit && (
          <button
            onClick={onExit}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main</span>
          </button>
        )}
      </div>

      {/* Template Selection Tabs (Mobile Responsive 2x2 Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => setTemplateType('buyer')}
          className={`p-3 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
            templateType === 'buyer'
              ? 'bg-ocean-950 text-white border-ocean-950 shadow-md ring-2 ring-gold-400/40'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${templateType === 'buyer' ? 'bg-gold-500 text-ocean-950' : 'bg-slate-100 text-ocean-900'}`}>
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs truncate">Buyer Requirement</h3>
            <p className={`text-[10px] truncate ${templateType === 'buyer' ? 'text-slate-300' : 'text-slate-400'}`}>Post buying leads</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setTemplateType('supplier')}
          className={`p-3 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
            templateType === 'supplier'
              ? 'bg-ocean-950 text-white border-ocean-950 shadow-md ring-2 ring-gold-400/40'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${templateType === 'supplier' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-ocean-900'}`}>
            <Store className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs truncate">Supplier Request</h3>
            <p className={`text-[10px] truncate ${templateType === 'supplier' ? 'text-slate-300' : 'text-slate-400'}`}>Post supply offers</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setTemplateType('logistics')}
          className={`p-3 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
            templateType === 'logistics'
              ? 'bg-ocean-950 text-white border-ocean-950 shadow-md ring-2 ring-gold-400/40'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${templateType === 'logistics' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-ocean-900'}`}>
            <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs truncate">Logistics Help</h3>
            <p className={`text-[10px] truncate ${templateType === 'logistics' ? 'text-slate-300' : 'text-slate-400'}`}>Freight & ports</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setTemplateType('question')}
          className={`p-3 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
            templateType === 'question'
              ? 'bg-ocean-950 text-white border-ocean-950 shadow-md ring-2 ring-gold-400/40'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${templateType === 'question' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-ocean-900'}`}>
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs truncate">Question / Inquiry</h3>
            <p className={`text-[10px] truncate ${templateType === 'question' ? 'text-slate-300' : 'text-slate-400'}`}>Ask trade experts</p>
          </div>
        </button>
      </div>

      {/* Main Generator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Form & Image Controls (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-ocean-950 border-b pb-2">
              Fill Trade Details
            </h3>

            {/* Template Specific Form Fields */}
            <div className="space-y-3.5 mt-4 text-xs font-medium">
              {templateType === 'buyer' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Product Name *</label>
                    <input
                      type="text"
                      value={formData.product}
                      onChange={(e) => handleFieldChange('product', e.target.value)}
                      placeholder="e.g. Sugar, Black Pepper, Mangoes, Rice, Tiles"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Quantity *</label>
                      <input
                        type="text"
                        value={formData.quantity}
                        onChange={(e) => handleFieldChange('quantity', e.target.value)}
                        placeholder="e.g. 50 Metric Tons / 2 Containers"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Destination *</label>
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => handleFieldChange('destination', e.target.value)}
                        placeholder="e.g. Jebel Ali Port, UAE"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Timeline *</label>
                      <input
                        type="text"
                        value={formData.timeline}
                        onChange={(e) => handleFieldChange('timeline', e.target.value)}
                        placeholder="e.g. Immediate / Next 15 Days"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Requirements</label>
                      <input
                        type="text"
                        value={formData.requirements}
                        onChange={(e) => handleFieldChange('requirements', e.target.value)}
                        placeholder="e.g. ISO 22000, SGS Inspection report"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                      />
                    </div>
                  </div>
                </>
              )}

              {templateType === 'supplier' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Product Name *</label>
                    <input
                      type="text"
                      value={formData.product}
                      onChange={(e) => handleFieldChange('product', e.target.value)}
                      placeholder="e.g. Sugar, Fresh Mangoes, Black Pepper"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● MOQ *</label>
                      <input
                        type="text"
                        value={formData.moq}
                        onChange={(e) => handleFieldChange('moq', e.target.value)}
                        placeholder="e.g. 5 Tons / 100 Units"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Location / Origin *</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleFieldChange('location', e.target.value)}
                        placeholder="e.g. Gujarat, India"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Certifications</label>
                      <input
                        type="text"
                        value={formData.certifications}
                        onChange={(e) => handleFieldChange('certifications', e.target.value)}
                        placeholder="e.g. ISO 9001, CE, Organic"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                      />
                    </div>
                  </div>
                </>
              )}

              {templateType === 'logistics' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Origin *</label>
                      <input
                        type="text"
                        value={formData.origin}
                        onChange={(e) => handleFieldChange('origin', e.target.value)}
                        placeholder="e.g. Mundra Port, Gujarat"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Destination *</label>
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => handleFieldChange('destination', e.target.value)}
                        placeholder="e.g. Felixstowe, UK"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Container / Cargo *</label>
                      <input
                        type="text"
                        value={formData.container}
                        onChange={(e) => handleFieldChange('container', e.target.value)}
                        placeholder="e.g. 40ft High Cube Container (FCL)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">● Timeline *</label>
                      <input
                        type="text"
                        value={formData.timeline}
                        onChange={(e) => handleFieldChange('timeline', e.target.value)}
                        placeholder="e.g. Next Vessel / Immediate"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-ocean-950 outline-none text-xs font-medium"
                      />
                    </div>
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
            </div>
          </div>

          {/* Stock Image Search & Upload Section */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-extrabold text-ocean-950 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-gold-600" />
              <span>Product Image (Stock Search & Device Upload)</span>
            </h4>

            {/* Search Input & Action Buttons (Triggers search ONLY on Enter or Search Click) */}
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
                  placeholder="Type commodity name (e.g. Sugar, Mango, Black Pepper) & press Enter..."
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

            {/* Quick EXIM Commodity Preset Badges */}
            <div className="flex flex-wrap gap-1.5">
              {EXIM_COMMODITY_CATALOG.map((imgItem, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchInputText(imgItem.title);
                    setSelectedImageUrl(imgItem.url);
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
        </div>

        {/* Right Column: Live Visual Banner & WhatsApp Text (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Banner Card Preview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-ocean-950 flex items-center justify-between border-b pb-2">
              <span>Live Post Banner Preview</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                800x800 PNG
              </span>
            </h3>

            <PostCardCanvas
              templateType={templateType}
              data={formData}
              imageUrl={selectedImageUrl}
            />
          </div>

          {/* Formatted Text Box & Share Controls */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ocean-950 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Formatted Text</span>
              </h4>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono whitespace-pre-wrap max-h-44 overflow-y-auto leading-relaxed border border-slate-800">
              {generateWhatsAppText()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyText}
                className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  copiedText
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Text Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-ocean-900" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share to WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
