'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import {
  Package, TrendingUp, Shield, Clock, Users, Target,
  Zap, CheckCircle, ArrowRight, Filter, Sparkles, GitCompare,
  Heart, Download, Share2, Check, ChevronDown, SlidersHorizontal,
  BarChart3, DollarSign, X, ArrowUpDown, Save, Bookmark, Tag
} from 'lucide-react';

interface Bundle {
  id: string;
  name: string;
  slug: string;
  bundle_type: string;
  category: string;
  description: string;
  min_investment: string;
  target_amount: string;
  raised_amount: string;
  investor_count: number;
  expected_roi_min: string;
  expected_roi_max: string;
  holding_period_months: number;
  status: string;
  images: string[];
  features: string[];
  risk_level: string;
  diversification_score: number;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function BundlesPage() {
  const router = useRouter();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [filteredBundles, setFilteredBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);

  // Advanced filtering & sorting
  const [sortBy, setSortBy] = useState('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [favoriteBundleIds, setFavoriteBundleIds] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(9);
  const [itemsPerPage] = useState(9);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    minROI: '',
    maxROI: '',
    minInvestment: '',
    maxInvestment: '',
    riskLevel: '',
    minDiversification: '',
  });

  // Saved searches
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [searchName, setSearchName] = useState('');
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
  const [showSavedSearchDropdown, setShowSavedSearchDropdown] = useState(false);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bundles`);
        const data = await response.json();

        if (data.success) {
          setBundles(data.data);
        } else {
          setError('Failed to load bundles');
        }
      } catch (err) {
        console.error('Error fetching bundles:', err);
        setError('Failed to load bundles');
      } finally {
        setLoading(false);
      }
    };

    fetchBundles();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ownly_favorite_bundles');
    if (saved) {
      setFavoriteBundleIds(JSON.parse(saved));
    }
  }, []);

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ownly_saved_bundle_searches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    applyFiltersAndSort();
  }, [bundles, filter, filters, sortBy, showFavoritesOnly, favoriteBundleIds]);

  // Reset pagination when filters change
  useEffect(() => {
    setItemsToShow(itemsPerPage);
  }, [filter, filters, sortBy, showFavoritesOnly]);

  const applyFiltersAndSort = () => {
    let filtered = [...bundles];

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(bundle => favoriteBundleIds.includes(bundle.id));
    }

    // Apply bundle type filter
    if (filter) {
      filtered = filtered.filter(b => b.bundle_type === filter);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(bundle =>
        bundle.name?.toLowerCase().includes(searchLower) ||
        bundle.description?.toLowerCase().includes(searchLower) ||
        bundle.category?.toLowerCase().includes(searchLower)
      );
    }

    // Apply ROI filters
    if (filters.minROI) {
      filtered = filtered.filter(bundle => {
        const avgROI = (parseFloat(bundle.expected_roi_min) + parseFloat(bundle.expected_roi_max)) / 2;
        return avgROI >= parseFloat(filters.minROI);
      });
    }
    if (filters.maxROI) {
      filtered = filtered.filter(bundle => {
        const avgROI = (parseFloat(bundle.expected_roi_min) + parseFloat(bundle.expected_roi_max)) / 2;
        return avgROI <= parseFloat(filters.maxROI);
      });
    }

    // Apply investment amount filters
    if (filters.minInvestment) {
      filtered = filtered.filter(bundle => parseFloat(bundle.min_investment) >= parseFloat(filters.minInvestment));
    }
    if (filters.maxInvestment) {
      filtered = filtered.filter(bundle => parseFloat(bundle.min_investment) <= parseFloat(filters.maxInvestment));
    }

    // Apply risk level filter
    if (filters.riskLevel) {
      filtered = filtered.filter(bundle => bundle.risk_level === filters.riskLevel);
    }

    // Apply diversification filter
    if (filters.minDiversification) {
      filtered = filtered.filter(bundle => bundle.diversification_score >= parseFloat(filters.minDiversification));
    }

    // Apply sorting
    switch (sortBy) {
      case 'roi-high':
        filtered.sort((a, b) => {
          const avgA = (parseFloat(a.expected_roi_min) + parseFloat(a.expected_roi_max)) / 2;
          const avgB = (parseFloat(b.expected_roi_min) + parseFloat(b.expected_roi_max)) / 2;
          return avgB - avgA;
        });
        break;
      case 'roi-low':
        filtered.sort((a, b) => {
          const avgA = (parseFloat(a.expected_roi_min) + parseFloat(a.expected_roi_max)) / 2;
          const avgB = (parseFloat(b.expected_roi_min) + parseFloat(b.expected_roi_max)) / 2;
          return avgA - avgB;
        });
        break;
      case 'investment-low':
        filtered.sort((a, b) => parseFloat(a.min_investment) - parseFloat(b.min_investment));
        break;
      case 'investment-high':
        filtered.sort((a, b) => parseFloat(b.min_investment) - parseFloat(a.min_investment));
        break;
      case 'diversification':
        filtered.sort((a, b) => b.diversification_score - a.diversification_score);
        break;
      case 'newest':
      default:
        // Keep original order (assumed newest first from API)
        break;
    }

    setFilteredBundles(filtered);
  };

  const toggleFavorite = (bundleId: string) => {
    const updated = favoriteBundleIds.includes(bundleId)
      ? favoriteBundleIds.filter(id => id !== bundleId)
      : [...favoriteBundleIds, bundleId];
    setFavoriteBundleIds(updated);
    localStorage.setItem('ownly_favorite_bundles', JSON.stringify(updated));
  };

  const loadMoreBundles = () => {
    setItemsToShow(prev => prev + itemsPerPage);
  };

  const showAllBundles = () => {
    setItemsToShow(filteredBundles.length);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Type', 'Avg ROI', 'Min Investment', 'Duration (Months)', 'Risk Level', 'Diversification Score', 'Status'];
    const csvRows = [headers.join(',')];

    filteredBundles.forEach(bundle => {
      const avgROI = ((parseFloat(bundle.expected_roi_min) + parseFloat(bundle.expected_roi_max)) / 2).toFixed(1);
      const row = [
        `"${bundle.name || ''}"`,
        `"${bundle.bundle_type.replace('_', ' ')}"`,
        `${avgROI}%`,
        bundle.min_investment,
        bundle.holding_period_months,
        `"${bundle.risk_level}"`,
        bundle.diversification_score,
        `"${bundle.status}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ownly-bundles-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const shareFilters = () => {
    const params = new URLSearchParams();
    if (filter) params.set('type', filter);
    if (filters.search) params.set('search', filters.search);
    if (filters.minROI) params.set('minROI', filters.minROI);
    if (filters.maxROI) params.set('maxROI', filters.maxROI);
    if (filters.minInvestment) params.set('minInvestment', filters.minInvestment);
    if (filters.maxInvestment) params.set('maxInvestment', filters.maxInvestment);
    if (filters.riskLevel) params.set('riskLevel', filters.riskLevel);
    if (filters.minDiversification) params.set('minDiversification', filters.minDiversification);
    if (sortBy !== 'newest') params.set('sort', sortBy);

    const shareUrl = `${window.location.origin}/bundles?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setShowCopiedNotification(true);
    setTimeout(() => setShowCopiedNotification(false), 3000);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minROI: '',
      maxROI: '',
      minInvestment: '',
      maxInvestment: '',
      riskLevel: '',
      minDiversification: '',
    });
    setFilter('');
    setSortBy('newest');
    setShowFavoritesOnly(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filter) count++;
    if (filters.search) count++;
    if (filters.minROI || filters.maxROI) count++;
    if (filters.minInvestment || filters.maxInvestment) count++;
    if (filters.riskLevel) count++;
    if (filters.minDiversification) count++;
    if (showFavoritesOnly) count++;
    return count;
  };

  const saveCurrentSearch = () => {
    if (!searchName.trim()) return;

    const newSearch = {
      id: Date.now().toString(),
      name: searchName,
      filter,
      filters,
      sortBy,
      showFavoritesOnly,
      createdAt: new Date().toISOString()
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem('ownly_saved_bundle_searches', JSON.stringify(updated));
    setSearchName('');
    setShowSaveSearchModal(false);
  };

  const loadSavedSearch = (search: any) => {
    setFilter(search.filter);
    setFilters(search.filters);
    setSortBy(search.sortBy);
    setShowFavoritesOnly(search.showFavoritesOnly);
    setShowSavedSearchDropdown(false);
  };

  const deleteSavedSearch = (searchId: string) => {
    const updated = savedSearches.filter(s => s.id !== searchId);
    setSavedSearches(updated);
    localStorage.setItem('ownly_saved_bundle_searches', JSON.stringify(updated));
  };

  const bundleTypes = ['category_based', 'roi_based', 'thematic', 'community', 'custom'];

  const toggleBundleSelection = (bundleId: string) => {
    setSelectedBundles(prev =>
      prev.includes(bundleId)
        ? prev.filter(id => id !== bundleId)
        : [...prev, bundleId]
    );
  };

  const handleCompare = () => {
    if (selectedBundles.length >= 2) {
      router.push(`/bundles/compare?ids=${selectedBundles.join(',')}`);
    }
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    setSelectedBundles([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading bundles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
            ← Return Home
          </Link>
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

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Marketplace
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                Investment Bundles
              </h1>
            </div>
          </div>

          <p className="text-xl text-purple-200 max-w-3xl">
            Pre-curated investment portfolios for instant diversification
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <h2 className="text-2xl font-bold text-white">Why Choose Investment Bundles?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Instant Diversification</h3>
                <p className="text-blue-100 text-sm">Spread risk across multiple deals automatically</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Professional Curation</h3>
                <p className="text-blue-100 text-sm">Expert-selected deals optimized for returns</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">One-Click Investing</h3>
                <p className="text-blue-100 text-sm">Start building wealth in seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Enhanced Filters Bar */}
        <div className="mb-8">
          {/* Top Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            {/* Left Side - Action Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {/* Save Search Button */}
              <button
                onClick={() => setShowSaveSearchModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10 transition-all"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save Search</span>
                <span className="sm:hidden">Save</span>
              </button>

              {/* Saved Searches Dropdown */}
              {savedSearches.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowSavedSearchDropdown(!showSavedSearchDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10 transition-all"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span className="hidden sm:inline">Saved</span>
                    <ChevronDown className="w-4 h-4" />
                    <span className="ml-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {savedSearches.length}
                    </span>
                  </button>

                  {showSavedSearchDropdown && (
                    <div className="absolute top-full mt-2 left-0 w-72 max-w-[calc(100vw-2rem)] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                      <div className="p-4">
                        <div className="text-sm font-semibold text-white mb-3">Saved Searches</div>
                        <div className="space-y-2">
                          {savedSearches.map((search) => (
                            <div key={search.id} className="group flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                              <button
                                onClick={() => loadSavedSearch(search)}
                                className="flex-1 text-left"
                              >
                                <div className="text-sm font-medium text-white">{search.name}</div>
                                <div className="text-xs text-purple-300 mt-1">
                                  {new Date(search.createdAt).toLocaleDateString()}
                                </div>
                              </button>
                              <button
                                onClick={() => deleteSavedSearch(search.id)}
                                className="ml-2 p-1.5 rounded-lg hover:bg-red-500/20 text-purple-300 hover:text-red-400 transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  showAdvancedFilters
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Advanced Filters</span>
                <span className="sm:hidden">Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  showFavoritesOnly
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">Favorites</span>
                <span className="sm:hidden">Fav</span>
                {favoriteBundleIds.length > 0 && (
                  <span className="ml-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {favoriteBundleIds.length}
                  </span>
                )}
              </button>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 rounded-xl text-sm font-medium hover:bg-white/10 transition-all whitespace-nowrap flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </button>

              <button
                onClick={shareFilters}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 rounded-xl text-sm font-medium hover:bg-white/10 transition-all whitespace-nowrap flex-shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-all whitespace-nowrap flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                </button>
              )}
            </div>

            {/* Right Side - Sort & Compare */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <ArrowUpDown className="w-4 h-4 text-purple-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 rounded-xl text-sm font-medium hover:bg-white/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="roi-high">Highest ROI</option>
                  <option value="roi-low">Lowest ROI</option>
                  <option value="investment-low">Min Investment: Low to High</option>
                  <option value="investment-high">Min Investment: High to Low</option>
                  <option value="diversification">Best Diversification</option>
                </select>
              </div>

              <button
                onClick={toggleCompareMode}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                  compareMode
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 border border-white/10 text-purple-300 hover:bg-white/10'
                }`}
              >
                <GitCompare className="w-4 h-4" />
                <span className="hidden sm:inline">{compareMode ? 'Exit Compare' : 'Compare'}</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search bundles..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Min ROI */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Min ROI (%)</label>
                  <input
                    type="number"
                    placeholder="e.g., 20"
                    value={filters.minROI}
                    onChange={(e) => setFilters({ ...filters, minROI: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Max ROI */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Max ROI (%)</label>
                  <input
                    type="number"
                    placeholder="e.g., 60"
                    value={filters.maxROI}
                    onChange={(e) => setFilters({ ...filters, maxROI: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Min Investment */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Min Investment (AED)</label>
                  <input
                    type="number"
                    placeholder="e.g., 5000"
                    value={filters.minInvestment}
                    onChange={(e) => setFilters({ ...filters, minInvestment: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Max Investment */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Max Investment (AED)</label>
                  <input
                    type="number"
                    placeholder="e.g., 50000"
                    value={filters.maxInvestment}
                    onChange={(e) => setFilters({ ...filters, maxInvestment: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Risk Level */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Risk Level</label>
                  <select
                    value={filters.riskLevel}
                    onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="">All Risk Levels</option>
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>

                {/* Min Diversification */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Min Diversification Score</label>
                  <input
                    type="number"
                    placeholder="e.g., 70"
                    value={filters.minDiversification}
                    onChange={(e) => setFilters({ ...filters, minDiversification: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bundle Type Filter Tabs */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">Filter by Type</h3>
            </div>
            <div className="text-sm text-purple-300">
              Showing <span className="font-bold text-white">{filteredBundles.length}</span> of <span className="font-bold text-white">{bundles.length}</span> bundles
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilter('')}
              className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                filter === ''
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              All Bundles
            </button>
            {bundleTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all capitalize ${
                  filter === type
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-purple-200">
            Showing <span className="font-semibold text-white">{Math.min(itemsToShow, filteredBundles.length)}</span> of <span className="font-semibold text-white">{filteredBundles.length}</span> bundles
            {filteredBundles.length !== bundles.length && (
              <span className="text-purple-300 ml-2">({bundles.length} total)</span>
            )}
            {sortBy !== 'newest' && (
              <span className="text-purple-300 ml-2">• Sorted by: {sortBy.replace('-', ' ')}</span>
            )}
          </p>
        </div>

        {/* Bundles Grid */}
        {filteredBundles.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
            <p className="text-purple-200 text-lg mb-2">No bundles found matching your criteria</p>
            <p className="text-purple-300 text-sm mb-4">Try adjusting your filters or browse all available bundles</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBundles.slice(0, itemsToShow).map(bundle => (
                <BundleCard
                  key={bundle.id}
                  bundle={bundle}
                  compareMode={compareMode}
                  isSelected={selectedBundles.includes(bundle.id)}
                  onToggleSelect={() => toggleBundleSelection(bundle.id)}
                  isFavorite={favoriteBundleIds.includes(bundle.id)}
                  onToggleFavorite={() => toggleFavorite(bundle.id)}
                />
              ))}
            </div>

            {/* Load More / Show All Section */}
            {itemsToShow < filteredBundles.length && (
              <div className="mt-12 text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={loadMoreBundles}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    <ChevronDown className="w-5 h-5" />
                    Load More ({Math.min(itemsPerPage, filteredBundles.length - itemsToShow)} more)
                  </button>
                  <button
                    onClick={showAllBundles}
                    className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 px-6 py-4 rounded-xl font-medium hover:bg-white/10 transition-all"
                  >
                    Show All ({filteredBundles.length - itemsToShow} remaining)
                  </button>
                </div>
                <p className="text-purple-300 text-sm mt-4">
                  Viewing {itemsToShow} of {filteredBundles.length} bundles
                </p>
              </div>
            )}

            {itemsToShow >= filteredBundles.length && filteredBundles.length > itemsPerPage && (
              <div className="mt-12 text-center">
                <p className="text-purple-300 text-sm">
                  Showing all {filteredBundles.length} bundles
                </p>
              </div>
            )}
          </>
        )}

        {/* Floating Compare Button */}
        {compareMode && selectedBundles.length >= 2 && (
          <div className="fixed bottom-4 right-4 left-4 sm:left-1/2 sm:right-auto sm:bottom-8 sm:transform sm:-translate-x-1/2 z-50">
            <button
              onClick={handleCompare}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-bold shadow-2xl shadow-purple-500/50 transition-all flex items-center justify-center gap-3 hover:scale-105"
            >
              <GitCompare className="w-6 h-6" />
              Compare {selectedBundles.length} Bundles
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Notification Toast */}
        {showCopiedNotification && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:bottom-8 z-50 animate-fade-in">
            <div className="bg-green-500/90 backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-400/20 max-w-md mx-auto">
              <Check className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">Filter link copied to clipboard!</span>
            </div>
          </div>
        )}

        {/* Save Search Modal */}
        {showSaveSearchModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Save Current Search</h2>
                <button
                  onClick={() => setShowSaveSearchModal(false)}
                  className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-purple-300" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-purple-300 mb-2">Search Name</label>
                <input
                  type="text"
                  placeholder="e.g., High ROI Bundles"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveCurrentSearch()}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>

              <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-purple-300 mb-2">Current Filters:</p>
                <div className="space-y-1 text-sm text-white">
                  {filter && <p>• Type: {filter.replace('_', ' ')}</p>}
                  {filters.search && <p>• Search: {filters.search}</p>}
                  {(filters.minROI || filters.maxROI) && <p>• ROI Range: {filters.minROI || '0'}% - {filters.maxROI || '∞'}%</p>}
                  {filters.riskLevel && <p>• Risk: {filters.riskLevel}</p>}
                  {sortBy !== 'newest' && <p>• Sort: {sortBy.replace('-', ' ')}</p>}
                  {!filter && !filters.search && !filters.minROI && !filters.maxROI && !filters.riskLevel && sortBy === 'newest' && (
                    <p className="text-purple-400 italic">No filters applied</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveCurrentSearch}
                  disabled={!searchName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Search
                </button>
                <button
                  onClick={() => setShowSaveSearchModal(false)}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

interface BundleCardProps {
  bundle: Bundle;
  compareMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

function BundleCard({
  bundle,
  compareMode = false,
  isSelected = false,
  onToggleSelect,
  isFavorite = false,
  onToggleFavorite
}: BundleCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (compareMode && onToggleSelect) {
      e.preventDefault();
      onToggleSelect();
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  const getTypeColor = (type: string) => {
    const colors: any = {
      'category_based': 'from-green-500 to-emerald-600',
      'roi_based': 'from-blue-500 to-cyan-600',
      'thematic': 'from-purple-500 to-pink-600',
      'community': 'from-yellow-500 to-orange-600',
      'custom': 'from-gray-600 to-slate-700',
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getTypeIcon = (type: string) => {
    const icons: any = {
      'category_based': Target,
      'roi_based': TrendingUp,
      'thematic': Sparkles,
      'community': Users,
      'custom': Package,
    };
    return icons[type] || Package;
  };

  const getRiskColor = (risk: string) => {
    const colors: any = {
      'low': 'text-green-400 bg-green-500/10 border-green-500/20',
      'medium': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      'high': 'text-red-400 bg-red-500/10 border-red-500/20',
    };
    return colors[risk] || 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  const avgROI = (parseFloat(bundle.expected_roi_min) + parseFloat(bundle.expected_roi_max)) / 2;
  const fundingProgress = (parseFloat(bundle.raised_amount) / parseFloat(bundle.target_amount)) * 100;
  const TypeIcon = getTypeIcon(bundle.bundle_type);

  // Count total deals in bundle (mock for now - could come from API)
  const dealCount = bundle.features?.length || 0;

  const cardContent = (
    <div
      className={`group bg-white/5 backdrop-blur-xl rounded-2xl border transition-all cursor-pointer overflow-hidden h-full flex flex-col duration-300 relative ${
        compareMode
          ? isSelected
            ? 'border-purple-500 scale-105 shadow-lg shadow-purple-500/30'
            : 'border-white/10 hover:border-purple-500/30'
          : 'border-white/10 hover:border-purple-500/30 hover:scale-105'
      }`}
      onClick={handleClick}
    >
      {/* Favorite & Checkbox Overlay */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Favorite Button */}
        {!compareMode && onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`w-10 h-10 rounded-xl backdrop-blur-sm border-2 flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-pink-600 border-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-500/30'
                : 'bg-white/10 border-white/30 hover:border-pink-400 hover:bg-pink-500/20'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current text-white' : 'text-white'}`} />
          </button>
        )}

        {/* Checkbox in Compare Mode */}
        {compareMode && (
          <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-purple-500 border-purple-500'
              : 'bg-white/10 border-white/30 group-hover:border-purple-400'
          }`}>
            {isSelected && (
              <CheckCircle className="w-6 h-6 text-white" />
            )}
          </div>
        )}
      </div>

      {/* Deal Count Badge */}
      {dealCount > 0 && !compareMode && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-blue-600/90 backdrop-blur-sm border border-blue-400/30 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
            <Package className="w-3 h-3" />
            {dealCount} Deals
          </div>
        </div>
      )}

      {/* Header with Gradient */}
      <div className={`bg-gradient-to-r ${getTypeColor(bundle.bundle_type)} p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}></div>
        </div>

        <div className="relative">
          {/* Type Badge */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <TypeIcon className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-semibold opacity-90 uppercase tracking-wider">
              {bundle.bundle_type.replace('_', ' ')}
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4 line-clamp-2">{bundle.name}</h3>

          {/* ROI Display */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold">{avgROI.toFixed(1)}%</span>
            <span className="text-sm opacity-90">Expected ROI</span>
          </div>
          <div className="text-xs opacity-75">
            Range: {bundle.expected_roi_min}% - {bundle.expected_roi_max}%
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Category Badge */}
        {bundle.category && (
          <div className="mb-4">
            <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium">
              <Tag className="w-3 h-3" />
              {bundle.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </span>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-xs text-purple-300 mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Min. Investment
            </div>
            <div className="font-bold text-white text-sm">{formatCurrency(parseFloat(bundle.min_investment))}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-xs text-purple-300 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Duration
            </div>
            <div className="font-bold text-white text-sm">{bundle.holding_period_months}mo</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-xs text-purple-300 mb-1 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Risk Level
            </div>
            <div className={`font-semibold text-xs capitalize px-2 py-1 rounded-lg border inline-block ${getRiskColor(bundle.risk_level)}`}>
              {bundle.risk_level}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-xs text-purple-300 mb-1 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Diversity
            </div>
            <div className="font-semibold text-white text-sm">{bundle.diversification_score}/100</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-purple-200 line-clamp-2">
            {bundle.description}
          </p>
        </div>

        {/* Funding Progress */}
        {parseFloat(bundle.raised_amount) > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-purple-300 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Funding Progress
              </span>
              <span className="font-semibold text-white">{fundingProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/10">
              <div
                className={`bg-gradient-to-r ${getTypeColor(bundle.bundle_type)} h-full transition-all duration-500`}
                style={{ width: `${Math.min(fundingProgress, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-purple-300 mt-2">
              <span>{formatCurrency(parseFloat(bundle.raised_amount))}</span>
              <span>{formatCurrency(parseFloat(bundle.target_amount))}</span>
            </div>
          </div>
        )}

        {/* Features/Highlights */}
        {bundle.features && bundle.features.length > 0 && (
          <div className="mt-auto mb-4">
            <div className="text-xs font-semibold text-purple-200 mb-2">Key Features</div>
            <ul className="space-y-1.5">
              {bundle.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="text-xs text-purple-300 flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        {!compareMode && (
          <button className="mt-auto w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
            View Bundle Details
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        {compareMode && (
          <div className="mt-auto w-full bg-white/10 border border-white/20 text-purple-200 py-3 rounded-xl font-semibold text-center text-sm">
            {isSelected ? 'Selected for Comparison' : 'Click to Select'}
          </div>
        )}
      </div>
    </div>
  );

  // Wrap with Link only if not in compare mode
  if (compareMode) {
    return cardContent;
  }

  return (
    <Link href={`/bundles/${bundle.id}`}>
      {cardContent}
    </Link>
  );
}
