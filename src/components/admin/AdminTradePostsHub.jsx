import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, 
  ShoppingBag, 
  Store, 
  Truck, 
  Briefcase, 
  HelpCircle, 
  Search, 
  Download, 
  RefreshCw, 
  Eye, 
  Check, 
  Copy, 
  X, 
  Building, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Layers,
  Filter
} from 'lucide-react';

export default function AdminTradePostsHub({ tradePosts = [], onRefresh }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingPost, setInspectingPost] = useState(null);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // 2x2 Overview Stat Calculations
  const stats = useMemo(() => {
    const total = tradePosts.length;
    const buyCount = tradePosts.filter(p => p.template_type === 'buyer').length;
    const sellCount = tradePosts.filter(p => p.template_type === 'supplier').length;
    const logisticsCount = tradePosts.filter(p => p.template_type === 'logistics').length;
    const serviceCount = tradePosts.filter(p => p.template_type === 'exim_service').length;
    const questionCount = tradePosts.filter(p => p.template_type === 'question').length;
    const otherCount = logisticsCount + serviceCount + questionCount;

    return { total, buyCount, sellCount, otherCount, logisticsCount, serviceCount, questionCount };
  }, [tradePosts]);

  // Filtering Logic
  const filteredPosts = useMemo(() => {
    return tradePosts.filter((post) => {
      // Category Filter
      if (selectedCategory !== 'all' && post.template_type !== selectedCategory) {
        return false;
      }

      // Free-text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const productMatch = (post.product_or_service || '').toLowerCase().includes(q);
        const companyMatch = (post.company_name || '').toLowerCase().includes(q);
        const contactMatch = (post.contact_name || '').toLowerCase().includes(q);
        const phoneMatch = (post.contact_phone || '').toLowerCase().includes(q);
        const emailMatch = (post.contact_email || '').toLowerCase().includes(q);
        const locationMatch = (post.origin_or_location || '').toLowerCase().includes(q) || (post.destination || '').toLowerCase().includes(q);

        return productMatch || companyMatch || contactMatch || phoneMatch || emailMatch || locationMatch;
      }

      return true;
    });
  }, [tradePosts, selectedCategory, searchQuery]);

  // CSV Export Handler
  const handleExportCSV = () => {
    if (filteredPosts.length === 0) {
      alert('No trade posts available to export.');
      return;
    }

    const headers = [
      'ID',
      'Post Type',
      'Product / Service',
      'Price / Rate',
      'Quantity / MOQ',
      'Origin / Location',
      'Destination',
      'Timeline',
      'Requirements / Certifications',
      'Company Name',
      'Contact Person',
      'Phone / WhatsApp',
      'Email',
      'Website',
      'Created At'
    ];

    const csvRows = filteredPosts.map(p => {
      const details = p.raw_details || {};
      return [
        `"${p.id || ''}"`,
        `"${p.template_type || ''}"`,
        `"${(p.product_or_service || '').replace(/"/g, '""')}"`,
        `"${(details.price || '').replace(/"/g, '""')}"`,
        `"${(p.quantity_or_moq || '').replace(/"/g, '""')}"`,
        `"${(p.origin_or_location || '').replace(/"/g, '""')}"`,
        `"${(p.destination || '').replace(/"/g, '""')}"`,
        `"${(p.timeline || '').replace(/"/g, '""')}"`,
        `"${(p.requirements_or_certifications || '').replace(/"/g, '""')}"`,
        `"${(p.company_name || '').replace(/"/g, '""')}"`,
        `"${(p.contact_name || '').replace(/"/g, '""')}"`,
        `"${(p.contact_phone || '').replace(/"/g, '""')}"`,
        `"${(p.contact_email || '').replace(/"/g, '""')}"`,
        `"${(p.contact_website || '').replace(/"/g, '""')}"`,
        `"${p.created_at ? new Date(p.created_at).toLocaleString() : ''}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EXIM_Trade_Posts_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'buyer':
        return { label: 'BUY Requirement', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'supplier':
        return { label: 'SELL Offer', bg: 'bg-red-100 text-red-800 border-red-300' };
      case 'logistics':
        return { label: 'Logistics', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'exim_service':
        return { label: 'Exim Service', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'question':
        return { label: 'Question', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      default:
        return { label: type, bg: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-ocean-950 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-500" />
            <span>Trade Posts & Lead Hub</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            View, filter, analyze & export user-generated trade requirements, supply offers, logistics, and service requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          )}

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>Export as CSV</span>
          </button>
        </div>
      </div>

      {/* 2x2 OVERVIEW STAT CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Posts */}
        <div 
          onClick={() => setSelectedCategory('all')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-ocean-950 text-white border-ocean-900 shadow-md ring-2 ring-gold-400/50'
              : 'bg-white text-ocean-950 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
              Total Trade Posts
            </span>
            <div className="w-9 h-9 rounded-xl bg-gold-400/20 text-gold-400 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black mt-2">{stats.total}</div>
          <p className="text-[11px] opacity-75 mt-0.5">Across all 5 categories</p>
        </div>

        {/* Card 2: BUY Requirements */}
        <div 
          onClick={() => setSelectedCategory('buyer')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'buyer'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/50'
              : 'bg-emerald-50/60 text-emerald-950 border-emerald-200 hover:bg-emerald-100/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
              BUY Requirements
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-200/50 text-emerald-900 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black mt-2">{stats.buyCount}</div>
          <p className="text-[11px] opacity-80 mt-0.5">Buyer leads & requirements</p>
        </div>

        {/* Card 3: SELL Offers */}
        <div 
          onClick={() => setSelectedCategory('supplier')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'supplier'
              ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-400/50'
              : 'bg-red-50/60 text-red-950 border-red-200 hover:bg-red-100/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
              SELL Supply Offers
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-200/50 text-red-900 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black mt-2">{stats.sellCount}</div>
          <p className="text-[11px] opacity-80 mt-0.5">Supplier offers & MOQs</p>
        </div>

        {/* Card 4: Logistics & Services */}
        <div 
          onClick={() => setSelectedCategory('logistics')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedCategory === 'logistics' || selectedCategory === 'exim_service' || selectedCategory === 'question'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/50'
              : 'bg-blue-50/60 text-blue-950 border-blue-200 hover:bg-blue-100/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
              Logistics & Services
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-200/50 text-blue-900 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black mt-2">{stats.otherCount}</div>
          <p className="text-[11px] opacity-80 mt-0.5">Freight, CHA & Questions</p>
        </div>
      </div>

      {/* FILTER CONTROLS & SEARCH BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            {[
              { id: 'all', label: 'All Posts', count: stats.total },
              { id: 'buyer', label: 'BUY', count: stats.buyCount },
              { id: 'supplier', label: 'SELL', count: stats.sellCount },
              { id: 'logistics', label: 'Logistics', count: stats.logisticsCount },
              { id: 'exim_service', label: 'Services', count: stats.serviceCount },
              { id: 'question', label: 'Questions', count: stats.questionCount }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-ocean-950 text-gold-400 border-ocean-950 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1.5 text-[10px] opacity-80 bg-black/10 px-1.5 py-0.2 rounded-full">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product, company, phone..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-ocean-950 outline-none"
            />
          </div>
        </div>
      </div>

      {/* TRADE POSTS DATA TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
            Showing {filteredPosts.length} of {tradePosts.length} Posts
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Share2 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-sm text-slate-600">No trade posts match your filter criteria.</p>
            <p className="text-xs">Try selecting 'All Posts' or clearing your search phrase.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Post Type</th>
                  <th className="py-3.5 px-4">Product / Details</th>
                  <th className="py-3.5 px-4">Price & Quantity</th>
                  <th className="py-3.5 px-4">Location / Port</th>
                  <th className="py-3.5 px-4">Poster & Contact</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredPosts.map((post, idx) => {
                  const badge = getBadgeStyle(post.template_type);
                  const details = post.raw_details || {};

                  return (
                    <tr key={post.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      {/* Post Type Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Product / Service */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-ocean-950 max-w-xs truncate">
                          {post.product_or_service || details.product || details.serviceType || details.problem || 'N/A'}
                        </div>
                        {post.requirements_or_certifications && (
                          <div className="text-[10px] text-slate-400 max-w-xs truncate mt-0.5">
                            {post.requirements_or_certifications}
                          </div>
                        )}
                      </td>

                      {/* Price & Quantity */}
                      <td className="py-3.5 px-4">
                        {details.price && (
                          <div className="font-extrabold text-emerald-700">
                            💰 {details.price}
                          </div>
                        )}
                        <div className="text-slate-600 font-semibold">
                          ⚖️ {post.quantity_or_moq || 'N/A'}
                        </div>
                      </td>

                      {/* Location / Destination */}
                      <td className="py-3.5 px-4">
                        {post.origin_or_location && (
                          <div className="text-slate-700">📍 {post.origin_or_location}</div>
                        )}
                        {post.destination && (
                          <div className="text-slate-500 text-[11px]">🏁 {post.destination}</div>
                        )}
                      </td>

                      {/* Poster Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{post.contact_name || 'N/A'}</div>
                        {post.company_name && (
                          <div className="text-[11px] text-slate-500 truncate">{post.company_name}</div>
                        )}
                        {post.contact_phone && (
                          <div className="text-[11px] text-emerald-700 font-bold">{post.contact_phone}</div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setInspectingPost(post)}
                          className="px-3 py-1.5 rounded-lg bg-ocean-950 hover:bg-ocean-900 text-white font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 text-gold-400" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INSPECTION MODAL */}
      {inspectingPost && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(inspectingPost.template_type).bg}`}>
                  {getBadgeStyle(inspectingPost.template_type).label}
                </span>
                <h3 className="font-extrabold text-base text-ocean-950">
                  Trade Post Detail #{(inspectingPost.id || '').slice(0, 8)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingPost(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Post Specs Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="font-extrabold text-slate-400 uppercase text-[10px] block">📦 Product / Requirement</span>
                <div className="font-bold text-slate-900 text-sm">
                  {inspectingPost.product_or_service || 'N/A'}
                </div>
                {inspectingPost.raw_details?.price && (
                  <div className="text-emerald-700 font-extrabold">💰 Price: {inspectingPost.raw_details.price}</div>
                )}
                {inspectingPost.quantity_or_moq && (
                  <div className="text-slate-700">⚖️ Quantity/MOQ: {inspectingPost.quantity_or_moq}</div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="font-extrabold text-slate-400 uppercase text-[10px] block">📍 Shipping & Timeline</span>
                {inspectingPost.origin_or_location && <div>Origin/Location: <strong>{inspectingPost.origin_or_location}</strong></div>}
                {inspectingPost.destination && <div>Destination: <strong>{inspectingPost.destination}</strong></div>}
                {inspectingPost.timeline && <div>Timeline: <strong>{inspectingPost.timeline}</strong></div>}
              </div>
            </div>

            {/* Quality & Requirements */}
            {inspectingPost.requirements_or_certifications && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                <span className="font-extrabold text-slate-400 uppercase text-[10px] block">📜 Requirements & Compliance</span>
                <div className="font-medium text-slate-800 leading-relaxed">
                  {inspectingPost.requirements_or_certifications}
                </div>
              </div>
            )}

            {/* Poster & Contact Card */}
            <div className="p-4 rounded-2xl bg-ocean-950 text-white space-y-2 text-xs">
              <span className="font-bold uppercase text-[10px] text-gold-400 tracking-wider block">👤 Poster Contact Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>🏢 Company: <strong>{inspectingPost.company_name || 'N/A'}</strong></div>
                <div>👤 Contact Person: <strong>{inspectingPost.contact_name || 'N/A'}</strong></div>
                <div>📞 Phone: <strong>{inspectingPost.contact_phone || 'N/A'}</strong></div>
                <div>✉️ Email: <strong>{inspectingPost.contact_email || 'N/A'}</strong></div>
                {inspectingPost.contact_website && (
                  <div>🌐 Website: <strong>{inspectingPost.contact_website}</strong></div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectingPost(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
