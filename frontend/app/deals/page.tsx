'use client';

import { useState, useEffect } from 'react';
import { dealAPI } from '@/lib/api';
import { usePreferences } from '@/context/PreferencesContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CategoryShowcase from '@/components/CategoryShowcase';
import {
  Building, Briefcase, Rocket, Gem, TrendingUp, MapPin,
  Clock, DollarSign, BarChart3, Shield, Search, Filter as FilterIcon,
  X, CheckCircle, Home, Zap, AlertCircle, ArrowUpDown, ChevronDown,
  Bookmark, Tag, SlidersHorizontal, Save, Heart, Trash2, Loader2,
  Download, Share2, Link2, Check
} from 'lucide-react';

export default function DealsPage() {
  const router = useRouter();
  const { formatCurrency } = usePreferences();
  const [deals, setDeals] = useState<any[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [favoriteDealIds, setFavoriteDealIds] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(1000); // Show all deals by default
  const [itemsPerPage] = useState(24);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    minRoi: '',
    maxRoi: '',
    search: '',
    minFundingPercent: '',
    maxFundingPercent: '',
    minHoldingPeriod: '',
    maxHoldingPeriod: '',
    minTicket: '',
    maxTicket: '',
    category: '',
    subcategory: '',
  });

  useEffect(() => {
    fetchDeals();
  }, [filters]);

  // Load saved searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ownly_saved_searches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ownly_favorite_deals');
    if (saved) {
      setFavoriteDealIds(JSON.parse(saved));
    }
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.minRoi) params.minRoi = filters.minRoi;
      if (filters.maxRoi) params.maxRoi = filters.maxRoi;
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.subcategory) params.subcategory = filters.subcategory;

      const response = await dealAPI.list(params);
      setDeals(response.data.data || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filters and sorting
  useEffect(() => {
    applyFiltersAndSort();
  }, [deals, filters, sortBy, showFavoritesOnly, favoriteDealIds]);

  const applyFiltersAndSort = () => {
    let filtered = [...deals];

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(deal => favoriteDealIds.includes(deal.id));
    }

    // Apply search filter (client-side enhancement)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(deal =>
        deal.title?.toLowerCase().includes(searchLower) ||
        deal.location?.toLowerCase().includes(searchLower) ||
        deal.jurisdiction?.toLowerCase().includes(searchLower)
      );
    }

    // Apply funding percentage filters
    if (filters.minFundingPercent) {
      filtered = filtered.filter(deal => {
        const fundingPercent = (parseFloat(deal.raised_amount || '0') / parseFloat(deal.target_amount || '1')) * 100;
        return fundingPercent >= parseFloat(filters.minFundingPercent);
      });
    }
    if (filters.maxFundingPercent) {
      filtered = filtered.filter(deal => {
        const fundingPercent = (parseFloat(deal.raised_amount || '0') / parseFloat(deal.target_amount || '1')) * 100;
        return fundingPercent <= parseFloat(filters.maxFundingPercent);
      });
    }

    // Apply holding period filters
    if (filters.minHoldingPeriod) {
      filtered = filtered.filter(deal => parseFloat(deal.holding_period_months || '0') >= parseFloat(filters.minHoldingPeriod));
    }
    if (filters.maxHoldingPeriod) {
      filtered = filtered.filter(deal => parseFloat(deal.holding_period_months || '0') <= parseFloat(filters.maxHoldingPeriod));
    }

    // Apply ticket size filters
    if (filters.minTicket) {
      filtered = filtered.filter(deal => parseFloat(deal.min_ticket || '0') >= parseFloat(filters.minTicket));
    }
    if (filters.maxTicket) {
      filtered = filtered.filter(deal => parseFloat(deal.min_ticket || '0') <= parseFloat(filters.maxTicket));
    }

    // Apply sorting
    switch (sortBy) {
      case 'roi-high':
        filtered.sort((a, b) => parseFloat(b.expected_roi || '0') - parseFloat(a.expected_roi || '0'));
        break;
      case 'roi-low':
        filtered.sort((a, b) => parseFloat(a.expected_roi || '0') - parseFloat(b.expected_roi || '0'));
        break;
      case 'funding-high':
        filtered.sort((a, b) => {
          const aPercent = (parseFloat(a.raised_amount || '0') / parseFloat(a.target_amount || '1')) * 100;
          const bPercent = (parseFloat(b.raised_amount || '0') / parseFloat(b.target_amount || '1')) * 100;
          return bPercent - aPercent;
        });
        break;
      case 'funding-low':
        filtered.sort((a, b) => {
          const aPercent = (parseFloat(a.raised_amount || '0') / parseFloat(a.target_amount || '1')) * 100;
          const bPercent = (parseFloat(b.raised_amount || '0') / parseFloat(b.target_amount || '1')) * 100;
          return aPercent - bPercent;
        });
        break;
      case 'holding-short':
        filtered.sort((a, b) => parseFloat(a.holding_period_months || '0') - parseFloat(b.holding_period_months || '0'));
        break;
      case 'holding-long':
        filtered.sort((a, b) => parseFloat(b.holding_period_months || '0') - parseFloat(a.holding_period_months || '0'));
        break;
      case 'ticket-low':
        filtered.sort((a, b) => parseFloat(a.min_ticket || '0') - parseFloat(b.min_ticket || '0'));
        break;
      case 'ticket-high':
        filtered.sort((a, b) => parseFloat(b.min_ticket || '0') - parseFloat(a.min_ticket || '0'));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
    }

    setFilteredDeals(filtered);
  };

  const getRiskBadgeColor = (level: string) => {
    const colors: any = {
      'Low Risk': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Medium Risk': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'High Risk': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'Very High Risk': 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return colors[level] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getTypeConfig = (type: string) => {
    const configs: any = {
      real_estate: { label: 'Real Estate', icon: Building, color: 'from-blue-500 to-cyan-500' },
      franchise: { label: 'Franchise', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
      startup: { label: 'Startup', icon: Rocket, color: 'from-green-500 to-emerald-500' },
      asset: { label: 'Asset', icon: Gem, color: 'from-yellow-500 to-orange-500' },
    };
    return configs[type] || { label: type, icon: Building, color: 'from-gray-500 to-gray-600' };
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      open: 'bg-green-500/10 text-green-400 border-green-500/20',
      funded: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      failed: 'bg-red-500/10 text-red-400 border-red-500/20',
      closed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      minRoi: '',
      maxRoi: '',
      search: '',
      minFundingPercent: '',
      maxFundingPercent: '',
      minHoldingPeriod: '',
      maxHoldingPeriod: '',
      minTicket: '',
      maxTicket: '',
      category: '',
      subcategory: '',
    });
    setSortBy('newest');
  };

  const applyPreset = (preset: string) => {
    clearFilters();
    setTimeout(() => {
      switch (preset) {
        case 'closing-soon':
          setFilters(prev => ({ ...prev, minFundingPercent: '75', status: 'open' }));
          setSortBy('funding-high');
          break;
        case 'high-roi':
          setFilters(prev => ({ ...prev, minRoi: '20' }));
          setSortBy('roi-high');
          break;
        case 'low-entry':
          setFilters(prev => ({ ...prev, maxTicket: '50000' }));
          setSortBy('ticket-low');
          break;
        case 'short-term':
          setFilters(prev => ({ ...prev, maxHoldingPeriod: '24' }));
          setSortBy('holding-short');
          break;
      }
    }, 0);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.type) count++;
    if (filters.status) count++;
    if (filters.minRoi) count++;
    if (filters.maxRoi) count++;
    if (filters.minFundingPercent) count++;
    if (filters.maxFundingPercent) count++;
    if (filters.minHoldingPeriod) count++;
    if (filters.maxHoldingPeriod) count++;
    if (filters.minTicket) count++;
    if (filters.maxTicket) count++;
    if (filters.category) count++;
    if (filters.subcategory) count++;
    if (sortBy !== 'newest') count++;
    return count;
  };

  const removeFilter = (filterKey: string) => {
    if (filterKey === 'sortBy') {
      setSortBy('newest');
    } else {
      setFilters(prev => ({ ...prev, [filterKey]: '' }));
    }
  };

  const saveCurrentSearch = () => {
    if (!searchName.trim()) return;

    const newSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: { ...filters },
      sortBy,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem('ownly_saved_searches', JSON.stringify(updated));
    setSearchName('');
    setShowSaveSearchModal(false);
  };

  const loadSavedSearch = (search: any) => {
    setFilters(search.filters);
    setSortBy(search.sortBy);
  };

  const deleteSavedSearch = (searchId: string) => {
    const updated = savedSearches.filter(s => s.id !== searchId);
    setSavedSearches(updated);
    localStorage.setItem('ownly_saved_searches', JSON.stringify(updated));
  };

  const toggleFavorite = (dealId: string) => {
    const updated = favoriteDealIds.includes(dealId)
      ? favoriteDealIds.filter(id => id !== dealId)
      : [...favoriteDealIds, dealId];

    setFavoriteDealIds(updated);
    localStorage.setItem('ownly_favorite_deals', JSON.stringify(updated));
  };

  const loadMoreDeals = () => {
    setItemsToShow(prev => prev + itemsPerPage);
  };

  const showAllDeals = () => {
    setItemsToShow(filteredDeals.length);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setItemsToShow(itemsPerPage);
  }, [filters, sortBy, showFavoritesOnly]);

  const toggleDealSelection = (dealId: string) => {
    setSelectedDeals(prev =>
      prev.includes(dealId)
        ? prev.filter(id => id !== dealId)
        : prev.length < 4
          ? [...prev, dealId]
          : prev
    );
  };

  const handleCompareDeals = () => {
    if (selectedDeals.length >= 2) {
      router.push(`/deals/compare?ids=${selectedDeals.join(',')}`);
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Title', 'Type', 'Location', 'Expected ROI', 'Min Investment', 'Holding Period', 'Status', 'Funding Progress'];
    const csvRows = [headers.join(',')];

    filteredDeals.forEach(deal => {
      const row = [
        `"${deal.title || ''}"`,
        `"${getDealTypeLabel(deal.type)}"`,
        `"${deal.location || ''}"`,
        `${deal.expected_roi || 0}%`,
        `${deal.min_ticket || 0}`,
        `${deal.holding_period_months || 0} months`,
        `"${deal.status || ''}"`,
        `${Math.round((parseFloat(deal.raised_amount || '0') / parseFloat(deal.target_amount || '1')) * 100)}%`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ownly-deals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getDealTypeLabel = (type: string) => {
    const labels: any = {
      real_estate: 'Real Estate',
      franchise: 'Franchise',
      startup: 'Startup',
      asset: 'Asset',
    };
    return labels[type] || type;
  };

  const shareFilters = () => {
    const params = new URLSearchParams();

    if (filters.type) params.set('type', filters.type);
    if (filters.status) params.set('status', filters.status);
    if (filters.minRoi) params.set('minRoi', filters.minRoi);
    if (filters.maxRoi) params.set('maxRoi', filters.maxRoi);
    if (filters.search) params.set('search', filters.search);
    if (filters.minFundingPercent) params.set('minFunding', filters.minFundingPercent);
    if (filters.maxFundingPercent) params.set('maxFunding', filters.maxFundingPercent);
    if (filters.minHoldingPeriod) params.set('minHolding', filters.minHoldingPeriod);
    if (filters.maxHoldingPeriod) params.set('maxHolding', filters.maxHoldingPeriod);
    if (filters.minTicket) params.set('minTicket', filters.minTicket);
    if (filters.maxTicket) params.set('maxTicket', filters.maxTicket);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (showFavoritesOnly) params.set('favoritesOnly', 'true');

    const shareUrl = `${window.location.origin}/deals${params.toString() ? '?' + params.toString() : ''}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 3000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
                Investment Opportunities
              </h1>
              <p className="text-xl text-purple-200 max-w-3xl">
                Discover fractional ownership opportunities across multiple asset classes
              </p>
            </div>
            <Link href="/deals/compare">
              <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                <BarChart3 className="w-5 h-5" />
                Compare Deals
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Sort and Filter Presets Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 -mt-8">
          {/* Sort and Filter Controls - Mobile Optimized */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="relative flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-white text-sm font-medium focus:outline-none focus:border-purple-500/50 hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
              >
                <option value="newest">Newest First</option>
                <option value="roi-high">Highest ROI</option>
                <option value="roi-low">Lowest ROI</option>
                <option value="funding-high">Most Funded</option>
                <option value="funding-low">Least Funded</option>
                <option value="holding-short">Shortest Term</option>
                <option value="holding-long">Longest Term</option>
                <option value="ticket-low">Lowest Entry</option>
                <option value="ticket-high">Highest Entry</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300 pointer-events-none" />
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                showAdvancedFilters
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Advanced
              {getActiveFilterCount() > 0 && (
                <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>

            {getActiveFilterCount() > 0 && (
              <button
                onClick={() => setShowSaveSearchModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 hover:bg-white/10 transition-all whitespace-nowrap flex-shrink-0"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save Search</span>
                <span className="sm:hidden">Save</span>
              </button>
            )}

            {savedSearches.length > 0 && (
              <div className="relative group flex-shrink-0">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 hover:bg-white/10 transition-all whitespace-nowrap">
                  <Bookmark className="w-4 h-4" />
                  Saved ({savedSearches.length})
                  <ChevronDown className="w-4 h-4" />
                </button>

                <div className="absolute top-full left-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-slate-900 border border-purple-500/30 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    {savedSearches.map((search) => (
                      <div
                        key={search.id}
                        className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg group/item"
                      >
                        <button
                          onClick={() => loadSavedSearch(search)}
                          className="flex-1 text-left"
                        >
                          <div className="text-sm font-medium text-white">{search.name}</div>
                          <div className="text-xs text-purple-300">
                            {new Date(search.createdAt).toLocaleDateString()}
                          </div>
                        </button>
                        <button
                          onClick={() => deleteSavedSearch(search.id)}
                          className="opacity-0 group-hover/item:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {favoriteDealIds.length > 0 && (
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  showFavoritesOnly
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
                    : 'bg-white/5 backdrop-blur-xl border border-white/10 text-pink-200 hover:bg-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">Favorites ({favoriteDealIds.length})</span>
                <span className="sm:hidden">({favoriteDealIds.length})</span>
              </button>
            )}

            {filteredDeals.length > 0 && (
              <>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 backdrop-blur-xl border border-white/10 text-green-200 hover:bg-white/10 transition-all whitespace-nowrap flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">Export</span>
                </button>
                <button
                  onClick={shareFilters}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 backdrop-blur-xl border border-white/10 text-blue-200 hover:bg-white/10 transition-all whitespace-nowrap flex-shrink-0"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                  <span className="sm:hidden inline">Share</span>
                </button>
              </>
            )}
          </div>

          {/* Filter Presets - Mobile Optimized */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <button
              onClick={() => applyPreset('closing-soon')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-orange-300 px-4 py-2 rounded-xl text-sm font-medium hover:from-orange-500/20 hover:to-red-500/20 transition-all whitespace-nowrap flex-shrink-0"
            >
              <Clock className="w-4 h-4" />
              Closing Soon
            </button>
            <button
              onClick={() => applyPreset('high-roi')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-green-300 px-4 py-2 rounded-xl text-sm font-medium hover:from-green-500/20 hover:to-emerald-500/20 transition-all whitespace-nowrap flex-shrink-0"
            >
              <TrendingUp className="w-4 h-4" />
              High ROI
            </button>
            <button
              onClick={() => applyPreset('low-entry')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-300 px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-500/20 hover:to-cyan-500/20 transition-all whitespace-nowrap flex-shrink-0"
            >
              <DollarSign className="w-4 h-4" />
              Low Entry
            </button>
            <button
              onClick={() => applyPreset('short-term')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-300 px-4 py-2 rounded-xl text-sm font-medium hover:from-purple-500/20 hover:to-pink-500/20 transition-all whitespace-nowrap flex-shrink-0"
            >
              <Zap className="w-4 h-4" />
              Short Term
            </button>
          </div>
        </div>

        {/* Active Filters Tags */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 -mt-2">
            <span className="text-sm text-purple-300 font-medium">Active filters:</span>
            {filters.type && (
              <button
                onClick={() => removeFilter('type')}
                className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-500/20 transition-all"
              >
                <Tag className="w-3 h-3" />
                Type: {filters.type}
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.status && (
              <button
                onClick={() => removeFilter('status')}
                className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-500/20 transition-all"
              >
                <Tag className="w-3 h-3" />
                Status: {filters.status}
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.minRoi && (
              <button
                onClick={() => removeFilter('minRoi')}
                className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-500/20 transition-all"
              >
                <Tag className="w-3 h-3" />
                Min ROI: {filters.minRoi}%
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.maxRoi && (
              <button
                onClick={() => removeFilter('maxRoi')}
                className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-500/20 transition-all"
              >
                <Tag className="w-3 h-3" />
                Max ROI: {filters.maxRoi}%
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.minFundingPercent && (
              <button
                onClick={() => removeFilter('minFundingPercent')}
                className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-500/20 transition-all"
              >
                <Tag className="w-3 h-3" />
                Min Funding: {filters.minFundingPercent}%
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.maxFundingPercent && (
              <button
                onClick={() => removeFilter('maxFundingPercent')}
                className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-500/20 transition-all"
              >
                <Tag className="w-3 h-3" />
                Max Funding: {filters.maxFundingPercent}%
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.minHoldingPeriod && (
              <button
                onClick={() => removeFilter('minHoldingPeriod')}
                className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-500/20 transition-all"
              >
                <Tag className="w-3 h-3" />
                Min Hold: {filters.minHoldingPeriod}mo
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.maxHoldingPeriod && (
              <button
                onClick={() => removeFilter('maxHoldingPeriod')}
                className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-500/20 transition-all"
              >
                <Tag className="w-3 h-3" />
                Max Hold: {filters.maxHoldingPeriod}mo
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.minTicket && (
              <button
                onClick={() => removeFilter('minTicket')}
                className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-500/20 transition-all"
              >
                <Tag className="w-3 h-3" />
                Min Ticket: {formatCurrency(filters.minTicket)}
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.maxTicket && (
              <button
                onClick={() => removeFilter('maxTicket')}
                className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-500/20 transition-all"
              >
                <Tag className="w-3 h-3" />
                Max Ticket: {formatCurrency(filters.maxTicket)}
                <X className="w-3 h-3" />
              </button>
            )}
            {sortBy !== 'newest' && (
              <button
                onClick={() => removeFilter('sortBy')}
                className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-500/20 transition-all"
              >
                <ArrowUpDown className="w-3 h-3" />
                Sort: {sortBy}
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1.5 rounded-lg text-sm hover:bg-red-500/20 transition-all font-medium"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Category Showcase - Premium Display of All 20 Master Categories */}
        <div className="mb-12 -mt-8">
          <CategoryShowcase
            selectedCategory={filters.category || undefined}
            onCategorySelect={(categoryKey) => {
              if (filters.category === categoryKey) {
                // Deselect if clicking the same category
                setFilters({ ...filters, category: '', subcategory: '' });
              } else {
                // Select new category
                setFilters({ ...filters, category: categoryKey, subcategory: '' });
              }
            }}
          />
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 animate-fadeIn">
            <div className="flex items-center gap-2 mb-4">
              <FilterIcon className="w-5 h-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
            </div>

            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Search deals..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Asset Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="">All Types</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="franchise">Franchise</option>
                  <option value="startup">Startup</option>
                  <option value="asset">Asset</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="funded">Funded</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Min ROI %</label>
                <input
                  type="number"
                  value={filters.minRoi}
                  onChange={(e) => setFilters({ ...filters, minRoi: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Max ROI %</label>
                <input
                  type="number"
                  value={filters.maxRoi}
                  onChange={(e) => setFilters({ ...filters, maxRoi: e.target.value })}
                  placeholder="100"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            {/* Second Row - Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Min Funding %</label>
                <input
                  type="number"
                  value={filters.minFundingPercent}
                  onChange={(e) => setFilters({ ...filters, minFundingPercent: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Max Funding %</label>
                <input
                  type="number"
                  value={filters.maxFundingPercent}
                  onChange={(e) => setFilters({ ...filters, maxFundingPercent: e.target.value })}
                  placeholder="100"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Min Holding (mo)</label>
                <input
                  type="number"
                  value={filters.minHoldingPeriod}
                  onChange={(e) => setFilters({ ...filters, minHoldingPeriod: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Max Holding (mo)</label>
                <input
                  type="number"
                  value={filters.maxHoldingPeriod}
                  onChange={(e) => setFilters({ ...filters, maxHoldingPeriod: e.target.value })}
                  placeholder="120"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Min Ticket (AED)</label>
                <input
                  type="number"
                  value={filters.minTicket}
                  onChange={(e) => setFilters({ ...filters, minTicket: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Max Ticket (AED)</label>
                <input
                  type="number"
                  value={filters.maxTicket}
                  onChange={(e) => setFilters({ ...filters, maxTicket: e.target.value })}
                  placeholder="1000000"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-purple-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-purple-200">
            Showing <span className="font-semibold text-white">{Math.min(itemsToShow, filteredDeals.length)}</span> of <span className="font-semibold text-white">{filteredDeals.length}</span> deals
            {filteredDeals.length !== deals.length && (
              <span className="text-purple-300 ml-2">({deals.length} total)</span>
            )}
            {sortBy !== 'newest' && (
              <span className="text-purple-300 ml-2">• Sorted by: {sortBy.replace('-', ' ')}</span>
            )}
          </p>
        </div>

        {/* Deals Grid */}
        {filteredDeals.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
            <p className="text-purple-200 text-lg">No deals found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.slice(0, itemsToShow).map((deal) => {
              const minInvestment = parseFloat(deal.min_ticket?.toString() || '0');
              const targetAmount = parseFloat(deal.target_amount?.toString() || '0');
              const expectedROI = parseFloat(deal.expected_roi?.toString() || '0');
              const monthlyIncome = (minInvestment * (expectedROI / 100)) / 12;
              const dealTotalMonthlyEarning = (targetAmount * (expectedROI / 100)) / 12;
              const isSelected = selectedDeals.includes(deal.id);
              const isFavorited = favoriteDealIds.includes(deal.id);
              const typeConfig = getTypeConfig(deal.type);
              const TypeIcon = typeConfig.icon;

              return (
                <div
                  key={deal.id}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:scale-105"
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-20">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDealSelection(deal.id);
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-white/10 backdrop-blur-sm hover:bg-purple-600/50 text-white border border-white/20'
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <div className="w-3 h-3 border-2 border-white rounded"></div>
                      )}
                    </button>
                  </div>

                  {/* Favorite Button */}
                  <div className="absolute top-3 right-3 z-20">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(deal.id);
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isFavorited
                          ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
                          : 'bg-white/10 backdrop-blur-sm hover:bg-pink-600/50 text-white border border-white/20'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <Link href={`/deals/${deal.id}`}>
                    {/* Deal Image */}
                    <div className={`relative h-56 bg-gradient-to-br ${typeConfig.color}`}>
                      {deal.images && deal.images[0] && (
                        <img
                          src={deal.images[0]}
                          alt={deal.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                      {/* Status Badge */}
                      <div className="absolute top-14 right-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm border ${getStatusColor(deal.status)}`}>
                          {deal.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Monthly Income Banner */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-lg">
                          <div className="mb-2 pb-2 border-b border-gray-200">
                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              Deal Generates Monthly
                            </div>
                            <div className="text-sm font-bold text-indigo-600">
                              {formatCurrency(dealTotalMonthlyEarning)}/mo
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                Your Potential (min)
                              </div>
                              <div className="text-lg font-bold text-green-600">
                                {formatCurrency(monthlyIncome)}/mo
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-600 mb-1">Expected ROI</div>
                              <div className="text-xl font-bold text-purple-600">
                                {expectedROI}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Type Badge */}
                      <div className="mb-3">
                        <span className={`inline-flex items-center gap-1 bg-gradient-to-r ${typeConfig.color} bg-clip-text text-transparent px-3 py-1 rounded-lg text-xs font-semibold border border-white/20 bg-white/5`}>
                          <TypeIcon className="w-3 h-3" />
                          {typeConfig.label}
                        </span>
                      </div>

                      {/* Category & Subcategory Badges */}
                      {(deal.category || deal.subcategory) && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {deal.category && (
                            <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                              <Tag className="w-3 h-3" />
                              {deal.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </span>
                          )}
                          {deal.subcategory && (
                            <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                              {deal.subcategory.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 text-white">{deal.title}</h3>

                      {/* Location */}
                      <p className="text-sm text-purple-200 mb-4 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {deal.location} • {deal.jurisdiction}
                      </p>

                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="text-xs text-blue-300 flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" />
                            Holding Period
                          </div>
                          <div className="text-lg font-bold text-blue-400">{deal.holding_period_months}mo</div>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="text-xs text-purple-300 flex items-center gap-1 mb-1">
                            <DollarSign className="w-3 h-3" />
                            Min. Investment
                          </div>
                          <div className="text-sm font-bold text-purple-400">{formatCurrency(deal.min_ticket)}</div>
                        </div>
                      </div>

                      {/* Funding Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-purple-200">Funding Progress</span>
                          <span className="font-semibold text-white">
                            {Math.round((parseFloat(deal.raised_amount || '0') / parseFloat(deal.target_amount || '1')) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/10">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, (parseFloat(deal.raised_amount || '0') / parseFloat(deal.target_amount || '1')) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1 text-purple-300">
                          <span>{formatCurrency(deal.raised_amount || 0)}</span>
                          <span>{formatCurrency(deal.target_amount)}</span>
                        </div>
                      </div>

                      {/* Risk Badge */}
                      {deal.risk_badge && (
                        <div className="mb-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border ${getRiskBadgeColor(deal.risk_badge.level)}`}>
                            <Shield className="w-3 h-3" />
                            {deal.risk_badge.level}
                          </span>
                        </div>
                      )}

                      {/* CTA Button */}
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                        View Details
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>
                </div>
              );
            })}
            </div>

            {/* Load More / Show All Section */}
            {itemsToShow < filteredDeals.length && (
              <div className="mt-12 text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={loadMoreDeals}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    <ChevronDown className="w-5 h-5" />
                    Load More ({Math.min(itemsPerPage, filteredDeals.length - itemsToShow)} more)
                  </button>
                  <button
                    onClick={showAllDeals}
                    className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 px-6 py-4 rounded-xl font-medium hover:bg-white/10 transition-all"
                  >
                    Show All ({filteredDeals.length - itemsToShow} remaining)
                  </button>
                </div>
                <p className="text-purple-300 text-sm mt-4">
                  Viewing {itemsToShow} of {filteredDeals.length} deals
                </p>
              </div>
            )}
          </>
        )}

        {/* Floating Compare Button - Mobile Optimized */}
        {selectedDeals.length > 0 && (
          <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-8 sm:right-8 z-50">
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 p-4 sm:min-w-[280px] backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-white">
                    {selectedDeals.length} deal{selectedDeals.length > 1 ? 's' : ''} selected
                  </div>
                  <div className="text-xs text-purple-300">
                    {selectedDeals.length < 2 ? 'Select at least 2 to compare' : 'Ready to compare!'}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDeals([])}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleCompareDeals}
                disabled={selectedDeals.length < 2}
                className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedDeals.length >= 2
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                    : 'bg-white/5 text-purple-400 cursor-not-allowed border border-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Compare Deals
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save Search Modal */}
      {showSaveSearchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Save className="w-5 h-5 text-purple-400" />
                Save Search
              </h3>
              <button
                onClick={() => setShowSaveSearchModal(false)}
                className="text-purple-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Search Name
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && saveCurrentSearch()}
                placeholder="e.g., High ROI Real Estate"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveSearchModal(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-purple-200 hover:bg-white/10 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentSearch}
                disabled={!searchName.trim()}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  searchName.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                    : 'bg-white/5 text-purple-400 cursor-not-allowed border border-white/10'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copied Notification Toast - Mobile Optimized */}
      {showCopiedNotification && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:bottom-8 z-50 animate-fade-in">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl shadow-green-500/30 flex items-center gap-3 backdrop-blur-xl border border-green-400/30">
            <Check className="w-5 h-5" />
            <div>
              <div className="font-semibold">Link Copied!</div>
              <div className="text-sm text-green-100">Share this link with others to show them your filtered deals</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
