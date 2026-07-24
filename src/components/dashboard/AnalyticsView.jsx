import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Share2, 
  CheckCircle2, 
  ShoppingBag, 
  Store, 
  Truck, 
  Briefcase, 
  HelpCircle, 
  Filter, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles,
  ArrowUpRight,
  Clock,
  Globe
} from 'lucide-react';
import { fetchAllTradePosts } from '../../lib/supabase';
import { getLoggedInMember, isPostOwner } from '../../lib/memberAuth';

export default function AnalyticsView({ onInspectPost, onNavigateToGenerator }) {
  const [member, setMember] = useState(getLoggedInMember());
  const [tradePosts, setTradePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scopeFilter, setScopeFilter] = useState('mine'); // 'mine' | 'all'
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const posts = await fetchAllTradePosts();
      setTradePosts(posts);
    } catch (err) {
      console.error('Failed to load trade posts for analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Filter posts: Only include logged-in member's BUY requirements & SUPPLY offers
  const myPosts = tradePosts.filter(p => isPostOwner(p, member));
  const activePosts = (scopeFilter === 'mine' ? myPosts : tradePosts)
    .filter(p => p.template_type === 'buyer' || p.template_type === 'supplier');

  const filteredPosts = activePosts.filter(p => {
    if (typeFilter !== 'all' && p.template_type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const prod = (p.product_or_service || p.raw_details?.product || '').toLowerCase();
      const comp = (p.company_name || '').toLowerCase();
      return prod.includes(q) || comp.includes(q);
    }
    return true;
  });

  // Calculate Metrics
  const totalLeads = activePosts.length;
  const totalViews = activePosts.reduce((sum, p) => sum + (Number(p.views_count) || 0), 0);
  const totalClicks = activePosts.reduce((sum, p) => sum + (Number(p.clicks_count) || 0), 0);
  const avgCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

  // Find Top Performing Lead
  const topLead = activePosts.length > 0 
    ? [...activePosts].sort((a, b) => (Number(b.clicks_count || 0) + Number(b.views_count || 0)) - (Number(a.clicks_count || 0) + Number(a.views_count || 0)))[0] 
    : null;

  // Tracked Trade Categories (Buy Requirements & Supply Offers ONLY)
  const categories = [
    { id: 'buyer', label: 'Buy Requirements', icon: ShoppingBag, color: 'emerald' },
    { id: 'supplier', label: 'Supply Offers', icon: Store, color: 'amber' }
  ];

  const handleCopyLink = (id) => {
    const link = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-4 space-y-4 sm:space-y-6 font-sans">
      {/* Top Page Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-ocean-950 text-white border border-ocean-800 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gold-400 text-ocean-950 flex items-center justify-center font-black shadow-lg shrink-0">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white leading-snug">
              Lead Performance Analytics
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed break-words">
              Track impressions, WhatsApp inquiry clicks, and conversion rates.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider">Total Active Leads</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-ocean-50 text-ocean-950 flex items-center justify-center font-bold">
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-ocean-950 mt-2 sm:mt-3">{totalLeads}</div>
          <span className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1 truncate">Shared Requirements</span>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-indigo-50/80 border border-indigo-200 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-indigo-800">
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider">Link Impressions</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-950 mt-2 sm:mt-3">{totalViews}</div>
          <span className="text-[11px] sm:text-xs font-bold text-indigo-700 mt-1 truncate">Public Views</span>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-emerald-50/80 border border-emerald-200 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider">WhatsApp Clicks</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-2 sm:mt-3">{totalClicks}</div>
          <span className="text-[11px] sm:text-xs font-bold text-emerald-700 mt-1 truncate">Direct Inquiries</span>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-amber-50/80 border border-amber-200 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider">Avg CTR</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-950 mt-3">{avgCTR}%</div>
          <span className="text-xs font-bold text-amber-800 mt-1">Overall Click-Through (CTR)</span>
        </motion.div>
      </div>

      {/* Top Performing Trade Lead Highlight Banner */}
      {topLead && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 text-white border border-ocean-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-gold-400 text-ocean-950">
                🔥 TOP PERFORMING LEAD
              </span>
              <span className="text-xs text-slate-300 font-semibold uppercase">{topLead.template_type}</span>
            </div>
            <h3 className="text-base font-black text-white">
              {topLead.product_or_service || topLead.raw_details?.product || 'EXIM Requirement'}
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              {topLead.origin_or_location || topLead.destination || 'Global Trade'} • {topLead.raw_details?.price || 'Best Price'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/15 self-stretch sm:self-auto justify-between">
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-300 uppercase block font-bold">Views</span>
              <span className="text-lg font-black text-indigo-300">{topLead.views_count || 0}</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-300 uppercase block font-bold">Clicks</span>
              <span className="text-lg font-black text-emerald-400">{topLead.clicks_count || 0}</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-300 uppercase block font-bold">CTR</span>
              <span className="text-lg font-black text-gold-400">
                {Number(topLead.views_count || 0) > 0 
                  ? `${(((Number(topLead.clicks_count || 0)) / (Number(topLead.views_count || 0))) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Category Performance Breakdown Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-ocean-950 uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold-500" />
          <span>Category Performance Breakdown</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(cat => {
            const catPosts = activePosts.filter(p => p.template_type === cat.id);
            const catViews = catPosts.reduce((s, p) => s + (Number(p.views_count) || 0), 0);
            const catClicks = catPosts.reduce((s, p) => s + (Number(p.clicks_count) || 0), 0);
            const Icon = cat.icon;

            return (
              <div key={cat.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-ocean-950">{cat.label}</span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-ocean-900 flex items-center justify-center font-bold">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl font-black text-ocean-950">{catPosts.length} <span className="text-xs text-slate-400 font-semibold">Leads</span></div>
                <div className="flex items-center justify-between text-[11px] font-bold border-t border-slate-100 pt-2 text-slate-600">
                  <span>👁️ {catViews} Views</span>
                  <span>💬 {catClicks} Clicks</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Lead Analytics Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-5 space-y-4">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by product or company..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-ocean-950 outline-none text-xs font-medium bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Filter:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-ocean-950 outline-none cursor-pointer"
            >
              <option value="all">All Trade Leads (Buy & Sell)</option>
              <option value="buyer">🛒 BUY Requirements</option>
              <option value="supplier">🏪 SELL Offers</option>
            </select>
          </div>
        </div>

        {/* Lead Table / List */}
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <BarChart3 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-sm text-slate-600">No trade post metrics found matching your filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map(post => {
              const views = Number(post.views_count || 0);
              const clicks = Number(post.clicks_count || 0);
              const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';
              const isHighDemand = Number(ctr) >= 15;

              return (
                <div 
                  key={post.id} 
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-ocean-950 text-gold-400">
                        {post.template_type}
                      </span>
                      {isHighDemand && (
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 rounded-full flex items-center gap-1">
                          🔥 High Intent ({ctr}% CTR)
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-slate-400">
                        Created {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-ocean-950 truncate">
                      {post.product_or_service || post.raw_details?.product || 'EXIM Requirement'}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                      {post.company_name && <span>🏢 {post.company_name}</span>}
                      {post.origin_or_location && <span>📍 {post.origin_or_location}</span>}
                      {post.raw_details?.price && <span className="font-bold text-emerald-700">💰 {post.raw_details.price}</span>}
                    </div>
                  </div>

                  {/* Metrics Badge Bar */}
                  <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs">
                      <span className="font-extrabold text-indigo-900 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{views} Views</span>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                        <span>{clicks} Clicks</span>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="font-extrabold text-amber-950 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                        <span>{ctr}% CTR</span>
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(post.id)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy Live Verification URL"
                      >
                        {copiedId === post.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === post.id ? 'Copied' : 'Link'}</span>
                      </button>

                      {onInspectPost && (
                        <button
                          type="button"
                          onClick={() => onInspectPost(post.id)}
                          className="px-3 py-2 rounded-xl bg-ocean-950 text-gold-400 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      )}
                    </div>
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
