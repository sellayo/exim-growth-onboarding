import React, { useState, useEffect } from 'react';
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
  Upload, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Save, 
  Image as ImageIcon, 
  Sparkles, 
  X, 
  Plus, 
  ShieldCheck,
  Anchor,
  FileCheck,
  Maximize2
} from 'lucide-react';
import { getLoggedInMember } from '../../lib/memberAuth';
import { saveMemberProfile, fetchMemberProfile, generateCompanySlug } from '../../lib/supabase';

// CLIENT-SIDE IMAGE COMPRESSION ALGORITHM (Max width 800px, JPEG Quality 0.75)
function compressImageFile(file, maxWidth = 800, maxHeight = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale proportionally within boundaries
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF'; // White background fill for transparent PNGs
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Calculate compression stats
        const originalKB = Math.round(file.size / 1024);
        const compressedKB = Math.round((compressedDataUrl.length * 0.75) / 1024);
        
        resolve({
          dataUrl: compressedDataUrl,
          originalKB,
          compressedKB,
          reductionPercent: Math.round(((originalKB - compressedKB) / originalKB) * 100)
        });
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function MemberProfileView() {
  const [member, setMember] = useState(getLoggedInMember());
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [previewImageModal, setPreviewImageModal] = useState(null);

  // Form State
  const [companyName, setCompanyName] = useState(member?.companyName || '');
  const [contactName, setContactName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || 'exporter'); // 'exporter' | 'importer' | 'manufacturer' | 'logistics' | 'consultant'
  const [designation, setDesignation] = useState(member?.designation || 'Managing Director');
  const [phone, setPhone] = useState(member?.phone || '');
  const [email, setEmail] = useState(member?.email || '');
  const [website, setWebsite] = useState(member?.website || '');
  const [linkedin, setLinkedin] = useState(member?.linkedin || '');
  const [operatingPorts, setOperatingPorts] = useState(member?.operatingPorts || 'Cochin Port, Jebel Ali Port');
  const [iecOrGst, setIecOrGst] = useState(member?.iecOrGst || '');
  const [commodities, setCommodities] = useState(member?.commodities || 'Spices, Black Pepper, Cardamom, Cashew, Coffee');
  const [bio, setBio] = useState(member?.bio || 'Leading global EXIM trade enterprise specializing in premium agricultural export and international trade logistics.');

  // 6 Gallery Image Slots (Store Objects: { dataUrl, compressedKB, reductionPercent })
  const [galleryImages, setGalleryImages] = useState(Array(6).fill(null));

  useEffect(() => {
    async function loadProfile() {
      if (member?.id) {
        const saved = await fetchMemberProfile(member.id);
        if (saved) {
          setCompanyName(saved.company_name || companyName);
          setContactName(saved.contact_name || contactName);
          setRole(saved.role || role);
          setDesignation(saved.designation || designation);
          setPhone(saved.phone || phone);
          setEmail(saved.email || email);
          setWebsite(saved.website || website);
          setLinkedin(saved.linkedin || linkedin);
          setOperatingPorts(saved.operating_ports || operatingPorts);
          setIecOrGst(saved.iec_or_gst || iecOrGst);
          setCommodities(saved.commodities || commodities);
          setBio(saved.bio || bio);
          if (Array.isArray(saved.gallery_images)) {
            // Fill array up to 6 items
            const imgs = [...saved.gallery_images];
            while (imgs.length < 6) imgs.push(null);
            setGalleryImages(imgs.slice(0, 6));
          }
        }
      }
    }
    loadProfile();
  }, [member]);

  // Handle Image Upload & Compression for Slot Index
  const handleImageUpload = async (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const res = await compressImageFile(file, 800, 800, 0.75);
      setGalleryImages(prev => {
        const updated = [...prev];
        updated[index] = res;
        return updated;
      });
    } catch (err) {
      console.error('Image compression error:', err);
    }
  };

  const handleRemoveImage = (index) => {
    setGalleryImages(prev => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMsg('');

    const payload = {
      user_id: member?.id || `mem-${Date.now()}`,
      company_name: companyName,
      contact_name: contactName,
      role,
      designation,
      phone,
      email,
      website,
      linkedin,
      operating_ports: operatingPorts,
      iec_or_gst: iecOrGst,
      commodities,
      bio,
      gallery_images: galleryImages,
      updated_at: new Date().toISOString()
    };

    try {
      await saveMemberProfile(payload);
      setSaveMsg('✅ Business profile updated and published successfully!');
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setSaveMsg('⚠️ Failed to save profile updates. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-4 space-y-4 sm:space-y-6 font-sans">
      {/* Top Header Card */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-ocean-950 text-white border border-ocean-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gold-400 text-ocean-950 flex items-center justify-center font-black shadow-lg shrink-0">
            <Building className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white leading-snug">
              EXIM Business Profile & Gallery
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed break-words">
              Create your EXIM profile, commodities, contacts, and photo gallery.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-ocean-800/80">
          <a
            href={`/profile/${generateCompanySlug(companyName, member?.id)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-gold-400 border border-gold-400/30 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View Public Page</span>
          </a>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all shrink-0"
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-ocean-950 border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving...' : 'Save & Publish Profile'}</span>
          </button>
        </div>
      </div>

      {saveMsg && (
        <div className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-xs font-bold shadow-sm border ${
          saveMsg.includes('✅') ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-red-50 text-red-900 border-red-300'
        }`}>
          {saveMsg}
        </div>
      )}

      {/* Main Profile Form Layout */}
      <div className="space-y-4 sm:space-y-6">
        {/* Company & Role Form Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5">
            <h2 className="text-sm font-black text-ocean-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-4 h-4 text-gold-500" />
              <span>Enterprise & Role Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. EXIM Global Spice Exports Pvt Ltd"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Primary Business Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none font-bold text-ocean-950 bg-slate-50 cursor-pointer"
                >
                  <option value="exporter">🚢 Exporter</option>
                  <option value="importer">📦 Importer</option>
                  <option value="manufacturer">🏭 Manufacturer / Producer</option>
                  <option value="logistics">🚚 Logistics & Cargo Provider</option>
                  <option value="consultant">💼 EXIM Consultant / Agent</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Founder & Managing Director"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Operating Ports & Hubs</label>
                <input
                  type="text"
                  value={operatingPorts}
                  onChange={(e) => setOperatingPorts(e.target.value)}
                  placeholder="e.g. Cochin Port, Jebel Ali, Rotterdam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">IEC Code / GSTIN Registration</label>
                <input
                  type="text"
                  value={iecOrGst}
                  onChange={(e) => setIecOrGst(e.target.value)}
                  placeholder="e.g. IEC: 0512984521 / GSTIN: 32ABC..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Key Commodities & Products *</label>
              <input
                type="text"
                required
                value={commodities}
                onChange={(e) => setCommodities(e.target.value)}
                placeholder="e.g. Black Pepper, Cardamom, Cashew Nuts, Coffee Beans, Coir Pith"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Company Bio & Business Overview</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your company background, export capacity, quality certifications (FSSAI, ISO 22000), and target markets..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium resize-none"
              />
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-black text-ocean-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Contact Channels & Verification</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exporter@eximgrowth.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Company Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.eximglobaltrade.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">LinkedIn Company / Founder Profile</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/exim-founder"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* 6-IMAGE PRODUCT & BUSINESS GALLERY (WITH AUTOMATIC CLIENT-SIDE CANVAS COMPRESSION) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div>
                <h2 className="text-sm font-black text-ocean-950 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <span>6-Image Product & Factory Gallery</span>
                </h2>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Upload product photos, factory/warehouse shots, and ISO/FSSAI certificates.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-indigo-50 text-indigo-900 border border-indigo-200">
                ⚡ Auto Canvas Compressed (~100KB)
              </span>
            </div>

            {/* 6 Image Grid Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {galleryImages.map((imgObj, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Slot {idx + 1}
                  </span>

                  {imgObj ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-900 aspect-square shadow-sm">
                      <img
                        src={imgObj.dataUrl}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Image Action Overlay */}
                      <div className="absolute inset-0 bg-ocean-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        <button
                          type="button"
                          onClick={() => setPreviewImageModal(imgObj.dataUrl)}
                          className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                          title="Preview full image"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-2 rounded-xl bg-red-500/30 hover:bg-red-500/50 text-red-200 transition-colors cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Compressed Size Badge */}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/75 text-white font-mono text-[9px] px-2 py-0.5 rounded-lg flex items-center justify-between">
                        <span>{imgObj.compressedKB || '90'} KB</span>
                        <span className="text-emerald-400 font-bold">-{imgObj.reductionPercent || '85'}%</span>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-200 hover:border-ocean-900 rounded-2xl aspect-square flex flex-col items-center justify-center p-3 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-100/80 transition-all group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(idx, e)}
                        className="hidden"
                      />
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-ocean-950 flex items-center justify-center font-bold mb-1.5 shadow-sm transition-all">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 group-hover:text-ocean-950">Add Photo</span>
                      <span className="text-[9px] text-slate-400 font-semibold mt-0.5">JPG / PNG</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* FULLSCREEN IMAGE PREVIEW MODAL */}
      {previewImageModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full text-center space-y-4">
            <button
              type="button"
              onClick={() => setPreviewImageModal(null)}
              className="absolute -top-12 right-0 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={previewImageModal}
              alt="Full Preview"
              className="max-h-[80vh] mx-auto rounded-2xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
