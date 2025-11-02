'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { secondaryMarketAPI } from '@/lib/api';
import { formatCurrency, formatDate, getDealTypeLabel } from '@/lib/utils';
import {
  TrendingUp, DollarSign, Users, ArrowRight, Filter, X, ShoppingCart,
  Briefcase, Home, Building, Rocket, Gem, Calendar, MapPin, Award,
  CheckCircle, Clock, AlertCircle, Flame, Target, BarChart3, Package,
  Eye, Tag, Zap, Shield, ArrowUpRight, ArrowDownRight, Share2, Plus,
  Heart, Download, SlidersHorizontal, ArrowUpDown, Check, Bell,
  Activity, TrendingDown, Percent, Star, ChevronRight, Sparkles,
  GitCompare, MinusCircle, PlayCircle, CheckCircle2, XCircle
} from 'lucide-react';

export default function SecondaryMarketPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-listings' | 'my-purchases' | 'my-offers'>('browse');
  const [listings, setListings] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  // Filter states
  const [filters, setFilters] = useState({
    dealType: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    minROI: '',
    maxROI: '',
    location: '',
  });

  // Advanced features
  const [sortBy, setSortBy] = useState('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [favoriteListingIds, setFavoriteListingIds] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [itemsPerPage] = useState(12);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);

  // Comparison feature
  const [compareMode, setCompareMode] = useState(false);
  const [compareListings, setCompareListings] = useState<any[]>([]);

  // Saved searches
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [searchName, setSearchName] = useState('');
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
  const [showSavedSearchDropdown, setShowSavedSearchDropdown] = useState(false);

  // Live activity simulation
  const [liveActivity, setLiveActivity] = useState<any[]>([]);

  // Market trends
  const [marketTrends, setMarketTrends] = useState({
    hottestListing: null as any,
    biggestDiscount: null as any,
    highestROI: null as any,
  });

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load favorites and saved searches from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('ownly_favorite_secondary_listings');
    if (storedFavorites) {
      setFavoriteListingIds(JSON.parse(storedFavorites));
    }

    const storedSearches = localStorage.getItem('ownly_saved_secondary_searches');
    if (storedSearches) {
      setSavedSearches(JSON.parse(storedSearches));
    }

    // Generate live activity
    generateLiveActivity();

    // Refresh live activity every 30 seconds
    const interval = setInterval(generateLiveActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setItemsToShow(itemsPerPage);
  }, [filters, sortBy, showFavoritesOnly, itemsPerPage]);

  useEffect(() => {
    fetchListings();
  }, [activeTab, filters]);

  // Apply favorites filter, sorting, and set filtered listings
  useEffect(() => {
    let result = [...listings];

    // Apply favorites filter
    if (showFavoritesOnly) {
      result = result.filter(listing => favoriteListingIds.includes(listing.id));
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => parseFloat(a.total_price || 0) - parseFloat(b.total_price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => parseFloat(b.total_price || 0) - parseFloat(a.total_price || 0));
        break;
      case 'roi-high':
        result.sort((a, b) => {
          const roiA = a.investment?.deal?.expected_roi || 0;
          const roiB = b.investment?.deal?.expected_roi || 0;
          return roiB - roiA;
        });
        break;
    }

    setFilteredListings(result);

    // Update market trends
    if (result.length > 0) {
      updateMarketTrends(result);
    }
  }, [listings, showFavoritesOnly, sortBy, favoriteListingIds]);

  const generateLiveActivity = () => {
    const activities = [
      { type: 'listing', user: 'Ahmed K.', action: 'listed', deal: 'Downtown Dubai Apartment', time: '2 min ago', icon: Tag },
      { type: 'sale', user: 'Sarah M.', action: 'purchased', deal: 'Tech Startup Shares', time: '5 min ago', icon: ShoppingCart },
      { type: 'offer', user: 'Mohammed A.', action: 'made an offer on', deal: 'Marina View Property', time: '12 min ago', icon: DollarSign },
      { type: 'listing', user: 'Fatima H.', action: 'listed', deal: 'Franchise Investment', time: '18 min ago', icon: Tag },
      { type: 'sale', user: 'Omar S.', action: 'sold', deal: 'Business District Office', time: '25 min ago', icon: CheckCircle },
    ];
    setLiveActivity(activities);
  };

  const updateMarketTrends = (listingsData: any[]) => {
    // Find hottest listing (most potential return)
    const hottestListing = [...listingsData].sort((a, b) => {
      const returnA = parseFloat(a.total_price || 0) * ((a.investment?.deal?.expected_roi || 0) / 100);
      const returnB = parseFloat(b.total_price || 0) * ((b.investment?.deal?.expected_roi || 0) / 100);
      return returnB - returnA;
    })[0];

    // Find biggest discount
    const biggestDiscount = [...listingsData]
      .map(listing => {
        const originalValue = listing.investment?.amount ?
          (parseFloat(listing.investment.amount) / (listing.investment.shares_issued || 1)) * listing.shares_for_sale :
          parseFloat(listing.total_price || 0);
        const discount = ((originalValue - parseFloat(listing.total_price || 0)) / originalValue) * 100;
        return { ...listing, discount };
      })
      .sort((a, b) => b.discount - a.discount)[0];

    // Find highest ROI
    const highestROI = [...listingsData].sort((a, b) => {
      const roiA = a.investment?.deal?.expected_roi || 0;
      const roiB = b.investment?.deal?.expected_roi || 0;
      return roiB - roiA;
    })[0];

    setMarketTrends({
      hottestListing: hottestListing || null,
      biggestDiscount: biggestDiscount && biggestDiscount.discount > 0 ? biggestDiscount : null,
      highestROI: highestROI || null,
    });
  };

  // Comparison functions
  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (compareMode) {
      setCompareListings([]);
    }
  };

  const toggleCompare = (listing: any) => {
    if (compareListings.find(l => l.id === listing.id)) {
      setCompareListings(compareListings.filter(l => l.id !== listing.id));
    } else if (compareListings.length < 3) {
      setCompareListings([...compareListings, listing]);
    } else {
      alert('You can compare up to 3 listings at a time');
    }
  };

  const clearComparison = () => {
    setCompareListings([]);
  };

  // Saved search functions
  const saveCurrentSearch = () => {
    if (!searchName.trim()) {
      alert('Please enter a name for this search');
      return;
    }

    const newSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters,
      sortBy,
      showFavoritesOnly,
      createdAt: new Date().toISOString()
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem('ownly_saved_secondary_searches', JSON.stringify(updated));
    setSearchName('');
    setShowSaveSearchModal(false);
    alert(`Search "${searchName}" saved successfully!`);
  };

  const loadSavedSearch = (search: any) => {
    setFilters(search.filters);
    setSortBy(search.sortBy);
    setShowFavoritesOnly(search.showFavoritesOnly);
    setShowSavedSearchDropdown(false);
  };

  const deleteSavedSearch = (searchId: string) => {
    const updated = savedSearches.filter(s => s.id !== searchId);
    setSavedSearches(updated);
    localStorage.setItem('ownly_saved_secondary_searches', JSON.stringify(updated));
  };

  // Favorite functions
  const toggleFavorite = (listingId: string) => {
    const updated = favoriteListingIds.includes(listingId)
      ? favoriteListingIds.filter(id => id !== listingId)
      : [...favoriteListingIds, listingId];
    setFavoriteListingIds(updated);
    localStorage.setItem('ownly_favorite_secondary_listings', JSON.stringify(updated));
  };

  // Pagination functions
  const loadMoreListings = () => {
    setItemsToShow(prev => prev + itemsPerPage);
  };

  const showAllListings = () => {
    setItemsToShow(filteredListings.length);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Deal Title', 'Type', 'Seller', 'Shares', 'Price Per Share', 'Total Price', 'Expected ROI', 'Created Date'];
    const csvRows = [headers.join(',')];

    filteredListings.slice(0, itemsToShow).forEach(listing => {
      const deal = listing.investment?.deal;
      const row = [
        `"${deal?.title || 'N/A'}"`,
        `"${deal ? getDealTypeLabel(deal.type) : 'N/A'}"`,
        `"${listing.seller?.name || 'N/A'}"`,
        listing.shares_for_sale || 0,
        parseFloat(listing.price_per_share || 0).toFixed(2),
        parseFloat(listing.total_price || 0).toFixed(2),
        `"${deal?.expected_roi || 0}%"`,
        `"${formatDate(listing.created_at)}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `secondary-market-listings-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Share filters
  const shareFilters = () => {
    const params = new URLSearchParams();
    if (filters.dealType) params.set('dealType', filters.dealType);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.search) params.set('search', filters.search);
    if (sortBy) params.set('sortBy', sortBy);
    if (showFavoritesOnly) params.set('favorites', 'true');

    const shareUrl = `${window.location.origin}/secondary-market?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setShowCopiedNotification(true);
    setTimeout(() => setShowCopiedNotification(false), 3000);
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      if (activeTab === 'browse') {
        const params: any = {};
        if (filters.dealType) params.dealType = filters.dealType;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;

        const response = await secondaryMarketAPI.getActiveListings(params);
        let filteredListings = response.data.data.listings;

        // Client-side search filter for deal title
        if (filters.search) {
          filteredListings = filteredListings.filter((listing: any) =>
            listing.investment?.deal?.title?.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        setListings(filteredListings);
      } else {
        const response = await secondaryMarketAPI.getMyListings();
        setMyListings(response.data.data.listings);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      dealType: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      minROI: '',
      maxROI: '',
      location: '',
    });
  };

  const handleMakeOffer = async (listingId: string, offerPrice: number) => {
    try {
      await secondaryMarketAPI.makeOffer(listingId, { offerPrice });
      setShowOfferModal(false);
      fetchListings();
      alert('Offer submitted successfully!');
    } catch (error: any) {
      console.error('Error making offer:', error);
      alert(error.response?.data?.message || 'Failed to make offer');
    }
  };

  const handleRespondToOffer = async (listingId: string, action: 'accept' | 'reject') => {
    try {
      await secondaryMarketAPI.respondToOffer(listingId, { action });
      fetchListings();
      alert(`Offer ${action}ed successfully!`);
    } catch (error: any) {
      console.error('Error responding to offer:', error);
      alert(error.response?.data?.message || `Failed to ${action} offer`);
    }
  };

  const handleCancelListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to cancel this listing?')) return;

    try {
      await secondaryMarketAPI.cancelListing(listingId);
      fetchListings();
      alert('Listing cancelled successfully!');
    } catch (error: any) {
      console.error('Error cancelling listing:', error);
      alert(error.response?.data?.message || 'Failed to cancel listing');
    }
  };

  const getAssetIcon = (type: string) => {
    const icons: any = {
      real_estate: Home,
      franchise: Building,
      startup: Rocket,
      asset: Gem,
    };
    return icons[type] || Briefcase;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-purple-200 text-xl font-semibold">Loading marketplace...</p>
          <p className="text-purple-400 text-sm mt-2">Fetching latest listings</p>
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

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header with Live Ticker */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-indigo-600/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-500/30">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                    Secondary Market
                  </h1>
                  <p className="text-purple-200 mt-1">
                    Buy and sell investment shares • Access immediate liquidity
                  </p>
                </div>
              </div>
            </div>

            {/* Market Statistics */}
            {activeTab === 'browse' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform" />
                    <div className="text-purple-200 text-xs">Active Listings</div>
                  </div>
                  <div className="text-3xl font-bold text-white">{listings.length}</div>
                  <div className="text-xs text-purple-300 mt-1">Available now</div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform" />
                    <div className="text-purple-200 text-xs">Total Market Value</div>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {formatCurrency(listings.reduce((sum, l) => sum + parseFloat(l.total_price || 0), 0))}
                  </div>
                  <div className="text-xs text-purple-300 mt-1">In listings</div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:shadow-lg hover:shadow-pink-500/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform" />
                    <div className="text-purple-200 text-xs">Avg Investment</div>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {formatCurrency(listings.length > 0 ? listings.reduce((sum, l) => sum + parseFloat(l.total_price || 0), 0) / listings.length : 0)}
                  </div>
                  <div className="text-xs text-purple-300 mt-1">Per listing</div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform" />
                    <div className="text-purple-200 text-xs">Total Shares</div>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {listings.reduce((sum, l) => sum + parseInt(l.shares_for_sale || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-purple-300 mt-1">For sale</div>
                </div>
              </div>
            )}
          </div>

          {/* Live Activity Ticker */}
          {activeTab === 'browse' && liveActivity.length > 0 && (
            <div className="relative bg-white/5 backdrop-blur-xl border-t border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
                <Activity className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold text-white">LIVE ACTIVITY</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex animate-scroll" style={{ animation: 'scroll 40s linear infinite' }}>
                {[...liveActivity, ...liveActivity].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={`activity-${index}`}
                      className="flex items-center gap-3 px-6 py-3 border-r border-white/10 whitespace-nowrap hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'sale' ? 'bg-green-500/20 text-green-400' :
                        activity.type === 'listing' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm text-white">
                          <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                          <span className="font-semibold">{activity.deal}</span>
                        </div>
                        <div className="text-xs text-purple-300">{activity.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Market Trends Highlight */}
        {activeTab === 'browse' && (marketTrends.hottestListing || marketTrends.biggestDiscount || marketTrends.highestROI) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Hottest Listing */}
            {marketTrends.hottestListing && (
              <div
                onClick={() => router.push(`/secondary-market/${marketTrends.hottestListing.id}`)}
                className="relative bg-white/5 backdrop-blur-xl rounded-xl p-5 overflow-hidden border border-orange-500/30 shadow-2xl shadow-orange-500/20 hover:scale-105 hover:shadow-orange-500/30 transition-all cursor-pointer group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-orange-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-orange-500/30">
                      <Flame className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-orange-300 uppercase tracking-wide">Hottest</div>
                      <div className="text-lg font-bold text-white">Biggest Return</div>
                    </div>
                  </div>
                  <div className="text-sm text-white font-semibold mb-2 line-clamp-2">
                    {marketTrends.hottestListing.investment?.deal?.title}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(parseFloat(marketTrends.hottestListing.total_price || 0) * ((marketTrends.hottestListing.investment?.deal?.expected_roi || 0) / 100))}/yr
                  </div>
                  <div className="text-xs text-orange-300 mt-1">
                    {marketTrends.hottestListing.investment?.deal?.expected_roi}% annual ROI
                  </div>
                </div>
                <div className="absolute bottom-2 right-2">
                  <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            )}

            {/* Biggest Discount */}
            {marketTrends.biggestDiscount && (
              <div
                onClick={() => router.push(`/secondary-market/${marketTrends.biggestDiscount.id}`)}
                className="relative bg-white/5 backdrop-blur-xl rounded-xl p-5 overflow-hidden border border-green-500/30 shadow-2xl shadow-green-500/20 hover:scale-105 hover:shadow-green-500/30 transition-all cursor-pointer group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-500/30">
                      <Tag className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-green-300 uppercase tracking-wide">Best Deal</div>
                      <div className="text-lg font-bold text-white">Biggest Discount</div>
                    </div>
                  </div>
                  <div className="text-sm text-white font-semibold mb-2 line-clamp-2">
                    {marketTrends.biggestDiscount.investment?.deal?.title}
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {marketTrends.biggestDiscount.discount.toFixed(0)}% OFF
                  </div>
                  <div className="text-xs text-green-300 mt-1">
                    Save {formatCurrency((parseFloat(marketTrends.biggestDiscount.investment?.amount || 0) / (marketTrends.biggestDiscount.investment?.shares_issued || 1) * marketTrends.biggestDiscount.shares_for_sale) - parseFloat(marketTrends.biggestDiscount.total_price || 0))}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2">
                  <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            )}

            {/* Highest ROI */}
            {marketTrends.highestROI && (
              <div
                onClick={() => router.push(`/secondary-market/${marketTrends.highestROI.id}`)}
                className="relative bg-white/5 backdrop-blur-xl rounded-xl p-5 overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/20 hover:scale-105 hover:shadow-purple-500/30 transition-all cursor-pointer group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-500/30">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-purple-300 uppercase tracking-wide">Premium</div>
                      <div className="text-lg font-bold text-white">Highest ROI</div>
                    </div>
                  </div>
                  <div className="text-sm text-white font-semibold mb-2 line-clamp-2">
                    {marketTrends.highestROI.investment?.deal?.title}
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {marketTrends.highestROI.investment?.deal?.expected_roi}%
                  </div>
                  <div className="text-xs text-purple-300 mt-1">
                    Annual return on investment
                  </div>
                </div>
                <div className="absolute bottom-2 right-2">
                  <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-2 inline-flex gap-2 shadow-2xl">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'browse'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-purple-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-4 h-4" />
              Browse Listings
              {listings.length > 0 && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {listings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('my-listings')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'my-listings'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-purple-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tag className="w-4 h-4" />
              My Listings
            </button>
            <button
              onClick={() => setActiveTab('my-purchases')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'my-purchases'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-purple-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              My Purchases
            </button>
            <button
              onClick={() => setActiveTab('my-offers')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'my-offers'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-purple-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Target className="w-4 h-4" />
              My Offers
            </button>
          </div>
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Advanced Controls Toolbar */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl">
              <div className="flex flex-wrap items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer hover:bg-white/10 transition-all"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="roi-high">ROI: High to Low</option>
                  </select>
                  <ArrowUpDown className="w-4 h-4 text-purple-300 absolute left-3 top-3 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      viewMode === 'grid'
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      viewMode === 'list'
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    List
                  </button>
                </div>

                {/* Compare Mode Toggle */}
                <button
                  onClick={toggleCompareMode}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${
                    compareMode
                      ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-300'
                      : 'bg-white/5 border border-white/10 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <GitCompare className="w-4 h-4" />
                  <span className="hidden sm:inline">Compare</span>
                  {compareListings.length > 0 && (
                    <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {compareListings.length}
                    </span>
                  )}
                </button>

                {/* Save Search Button */}
                <button
                  onClick={() => setShowSaveSearchModal(true)}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-purple-200 hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Save Search</span>
                  <span className="sm:hidden">Save</span>
                </button>

                {/* Saved Searches Dropdown */}
                {savedSearches.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowSavedSearchDropdown(!showSavedSearchDropdown)}
                      className="px-4 py-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-600/30 transition-all flex items-center gap-2 text-sm font-medium"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      <span className="hidden sm:inline">Saved</span>
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {savedSearches.length}
                      </span>
                    </button>

                    {showSavedSearchDropdown && (
                      <div className="absolute top-full mt-2 left-0 w-72 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                        <div className="p-3 border-b border-white/10">
                          <h3 className="text-sm font-semibold text-white">Saved Searches</h3>
                        </div>
                        {savedSearches.map((search) => (
                          <div
                            key={search.id}
                            className="p-3 border-b border-white/10 hover:bg-white/5 transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <button
                                onClick={() => loadSavedSearch(search)}
                                className="flex-1 text-left"
                              >
                                <div className="font-medium text-white text-sm mb-1">{search.name}</div>
                                <div className="text-xs text-purple-300">
                                  {new Date(search.createdAt).toLocaleDateString()}
                                </div>
                              </button>
                              <button
                                onClick={() => deleteSavedSearch(search.id)}
                                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Favorites Filter Toggle */}
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${
                    showFavoritesOnly
                      ? 'bg-pink-600/30 border border-pink-500/50 text-pink-300'
                      : 'bg-white/5 border border-white/10 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">Favorites</span>
                  {favoriteListingIds.length > 0 && (
                    <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {favoriteListingIds.length}
                    </span>
                  )}
                </button>

                <div className="flex-1"></div>

                {/* Export CSV */}
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2.5 bg-green-600/20 border border-green-500/30 rounded-xl text-green-300 hover:bg-green-600/30 transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">Export</span>
                </button>

                {/* Share Filters */}
                <button
                  onClick={shareFilters}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-purple-200 hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              {/* Active Filters Summary */}
              {(filters.dealType || filters.minPrice || filters.maxPrice || filters.search || showFavoritesOnly) && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-purple-300">Active filters:</span>
                    {filters.dealType && (
                      <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-xs">
                        Type: {filters.dealType}
                      </span>
                    )}
                    {filters.search && (
                      <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-xs">
                        Search: "{filters.search}"
                      </span>
                    )}
                    {(filters.minPrice || filters.maxPrice) && (
                      <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-xs">
                        Price: {filters.minPrice && `AED ${filters.minPrice}`}{filters.minPrice && filters.maxPrice && ' - '}{filters.maxPrice && `AED ${filters.maxPrice}`}
                      </span>
                    )}
                    {showFavoritesOnly && (
                      <span className="px-2 py-1 bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-lg text-xs flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-current" />
                        Favorites Only
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-purple-300" />
                <h3 className="text-lg font-semibold text-white">Filter Listings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Search by Deal
                  </label>
                  <input
                    type="text"
                    placeholder="Search deals..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Deal Type
                  </label>
                  <select
                    value={filters.dealType}
                    onChange={(e) => setFilters({ ...filters, dealType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Types</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="startup">Startup</option>
                    <option value="franchise">Franchise</option>
                    <option value="asset">Asset</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Min Price (AED)
                  </label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Max Price (AED)
                  </label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-purple-200 hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Results count */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-purple-200">
                  Showing <span className="font-bold text-white">{Math.min(itemsToShow, filteredListings.length)}</span> of{' '}
                  <span className="font-bold text-white">{filteredListings.length}</span> listing{filteredListings.length !== 1 ? 's' : ''}
                  {showFavoritesOnly && <span className="text-pink-300"> (favorites only)</span>}
                </div>
                {compareMode && compareListings.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-300 text-sm">
                      {compareListings.length} selected for comparison
                    </span>
                    <button
                      onClick={clearComparison}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-purple-200 hover:bg-white/10 transition-all text-sm"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Listings */}
            {filteredListings.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <Package className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
                <p className="text-purple-200 text-lg">
                  {showFavoritesOnly ? 'No favorite listings found' : 'No active listings available'}
                </p>
                {showFavoritesOnly && (
                  <button
                    onClick={() => setShowFavoritesOnly(false)}
                    className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-purple-200 hover:bg-white/10 transition-all"
                  >
                    Show All Listings
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
                  {filteredListings.slice(0, itemsToShow).map((listing) => {
                    // Calculate potential and earnings metrics
                    const deal = listing.investment?.deal;
                    const expectedAnnualROI = deal?.expected_roi || 12;
                    const pricePerShare = parseFloat(listing.price_per_share || 0);
                    const sharesForSale = parseInt(listing.shares_for_sale || 0);
                    const totalPrice = parseFloat(listing.total_price || 0);

                    // Calculate monthly revenue per share
                    const monthlyRevenuePerShare = (pricePerShare * (expectedAnnualROI / 100)) / 12;
                    const totalMonthlyRevenue = monthlyRevenuePerShare * sharesForSale;

                    // Calculate annual potential return
                    const annualReturn = totalPrice * (expectedAnnualROI / 100);

                    // Check if there's a discount (if we have original investment data)
                    const originalValue = listing.investment?.amount ?
                      (parseFloat(listing.investment.amount) / (listing.investment.shares_issued || 1)) * sharesForSale :
                      totalPrice;
                    const discountPercentage = ((originalValue - totalPrice) / originalValue) * 100;
                    const hasDiscount = discountPercentage > 5;
                    const hasPremium = discountPercentage < -5;

                    const Icon = getAssetIcon(deal?.type);

                    const isSelected = compareListings.find(l => l.id === listing.id);

                    return (
                      <div
                        key={listing.id}
                        className={`group bg-white/5 backdrop-blur-xl rounded-2xl border transition-all duration-300 overflow-hidden shadow-2xl hover:scale-[1.01] hover:shadow-purple-500/20 ${
                          isSelected ? 'border-indigo-500/50 ring-2 ring-indigo-500/30 shadow-indigo-500/30' : 'border-white/10 hover:border-purple-500/30'
                        }`}
                      >
                        {/* Top indicator bar */}
                        <div className={`h-2 ${
                          hasDiscount ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                          expectedAnnualROI > 15 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                          'bg-gradient-to-r from-purple-400 to-pink-500'
                        }`}></div>

                        <div className="p-6">
                          {/* Header with badges */}
                          <div className="flex items-start gap-4 mb-6">
                            <div className={`w-16 h-16 bg-gradient-to-br ${
                              deal?.type === 'real_estate' ? 'from-blue-600 to-blue-500' :
                              deal?.type === 'startup' ? 'from-purple-600 to-purple-500' :
                              deal?.type === 'franchise' ? 'from-green-600 to-green-500' :
                              'from-pink-600 to-pink-500'
                            } rounded-xl flex items-center justify-center shadow-lg shrink-0`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3
                                  onClick={() => router.push(`/secondary-market/${listing.id}`)}
                                  className="text-2xl font-bold text-white hover:text-purple-300 transition-colors cursor-pointer line-clamp-2"
                                >
                                  {listing.investment?.deal?.title}
                                </h3>
                                <div className="flex items-center gap-2 shrink-0">
                                  {compareMode && (
                                    <button
                                      onClick={() => toggleCompare(listing)}
                                      className={`p-2 rounded-xl transition-all ${
                                        isSelected
                                          ? 'bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/40'
                                          : 'bg-white/5 text-purple-300 hover:bg-white/10'
                                      }`}
                                    >
                                      <GitCompare className="w-5 h-5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => toggleFavorite(listing.id)}
                                    className={`p-2 rounded-xl transition-all ${
                                      favoriteListingIds.includes(listing.id)
                                        ? 'bg-pink-600/30 text-pink-300 hover:bg-pink-600/40'
                                        : 'bg-white/5 text-purple-300 hover:bg-white/10'
                                    }`}
                                  >
                                    <Heart
                                      className={`w-5 h-5 ${favoriteListingIds.includes(listing.id) ? 'fill-current' : ''}`}
                                    />
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-xs font-semibold">
                                  {listing.investment?.deal ? getDealTypeLabel(listing.investment.deal.type) : 'N/A'}
                                </span>
                                {hasDiscount && (
                                  <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <Flame className="w-3 h-3" />
                                    {Math.abs(discountPercentage).toFixed(0)}% Discount
                                  </span>
                                )}
                                {hasPremium && (
                                  <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-300 rounded-full text-xs font-semibold">
                                    Premium Listing
                                  </span>
                                )}
                                {expectedAnnualROI > 15 && (
                                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    High Yield
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-purple-300">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  Listed by: <span className="font-semibold text-white">{listing.seller?.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(listing.created_at)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Investment Potential Banner */}
                          <div className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-xl p-5 mb-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                  <TrendingUp className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                  <div className="text-xs text-indigo-300 font-semibold mb-1">
                                    Investment Potential
                                  </div>
                                  <div className="text-2xl font-bold text-white">
                                    {formatCurrency(annualReturn)}/year
                                  </div>
                                  <div className="text-xs text-indigo-300">
                                    Based on {expectedAnnualROI}% expected annual return
                                  </div>
                                </div>
                              </div>
                              <div className="text-left md:text-right">
                                <div className="text-xs text-indigo-300 mb-1">Monthly Passive Income</div>
                                <div className="text-3xl font-bold text-white">
                                  {formatCurrency(totalMonthlyRevenue)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Metrics Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {/* Shares Available */}
                            <div className="bg-blue-600/10 rounded-xl p-4 border border-blue-500/20">
                              <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-4 h-4 text-blue-400" />
                                <div className="text-xs text-blue-400 font-semibold">Shares Available</div>
                              </div>
                              <div className="text-2xl font-bold text-blue-300">
                                {sharesForSale.toLocaleString()}
                              </div>
                            </div>

                            {/* Price per Share */}
                            <div className="bg-purple-600/10 rounded-xl p-4 border border-purple-500/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Tag className="w-4 h-4 text-purple-400" />
                                <div className="text-xs text-purple-400 font-semibold">Per Share</div>
                              </div>
                              <div className="text-2xl font-bold text-purple-300">
                                {formatCurrency(pricePerShare)}
                              </div>
                            </div>

                            {/* Monthly Revenue Per Share */}
                            <div className="bg-teal-600/10 rounded-xl p-4 border border-teal-500/20">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-teal-400" />
                                <div className="text-xs text-teal-400 font-semibold">Monthly/Share</div>
                              </div>
                              <div className="text-2xl font-bold text-teal-300">
                                {formatCurrency(monthlyRevenuePerShare)}
                              </div>
                              <div className="text-xs text-teal-400 mt-1">
                                ~{expectedAnnualROI}% APY
                              </div>
                            </div>

                            {/* Total Investment with Platform Fee */}
                            <div className="bg-amber-600/10 rounded-xl p-4 border border-amber-500/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-amber-400" />
                                <div className="text-xs text-amber-400 font-semibold">Total Price</div>
                              </div>
                              <div className="text-2xl font-bold text-amber-300">
                                {formatCurrency(totalPrice)}
                              </div>
                              <div className="text-xs text-amber-400/60 mt-1">
                                +2% platform fee
                              </div>
                            </div>
                          </div>

                          {/* Additional Value Indicators */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                            {/* Expected ROI */}
                            <div className="flex items-center p-3 bg-green-600/10 border border-green-500/20 rounded-xl">
                              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3 shrink-0">
                                <TrendingUp className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="text-xs text-green-400">Expected ROI</div>
                                <div className="text-lg font-bold text-green-300">
                                  {expectedAnnualROI}% APY
                                </div>
                              </div>
                            </div>

                            {/* Deal Location */}
                            {deal?.location && (
                              <div className="flex items-center p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3 shrink-0">
                                  <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-blue-400">Location</div>
                                  <div className="text-sm font-bold text-blue-300 truncate">
                                    {deal.location}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Payback Period */}
                            <div className="flex items-center p-3 bg-purple-600/10 border border-purple-500/20 rounded-xl">
                              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-3 shrink-0">
                                <Clock className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="text-xs text-purple-400">Est. Payback</div>
                                <div className="text-lg font-bold text-purple-300">
                                  {Math.ceil(100 / expectedAnnualROI)} years
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 pt-5 border-t border-white/10">
                            <button
                              onClick={() => {
                                setSelectedListing(listing);
                                setShowOfferModal(true);
                              }}
                              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 font-semibold hover:scale-105"
                            >
                              <ShoppingCart className="w-5 h-5" />
                              Make Offer
                            </button>
                            <Link href={`/secondary-market/${listing.id}`}>
                              <button className="px-6 py-3 bg-white/5 border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 transition-all font-semibold flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                View Details
                              </button>
                            </Link>
                            {deal && (
                              <Link href={`/deals/${deal.id}`}>
                                <button className="px-6 py-3 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-xl hover:bg-blue-600/30 transition-all font-semibold flex items-center gap-2">
                                  <Briefcase className="w-5 h-5" />
                                  Deal Info
                                </button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {filteredListings.length > itemsToShow && (
                  <div className="mt-8 flex justify-center gap-4">
                    <button
                      onClick={loadMoreListings}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2"
                    >
                      Load More
                      <ArrowDownRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={showAllListings}
                      className="px-6 py-3 bg-white/5 border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 transition-all font-semibold"
                    >
                      Show All ({filteredListings.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* My Listings Tab */}
        {activeTab === 'my-listings' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <Link href="/portfolio">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 hover:scale-105">
                  <Plus className="w-5 h-5" />
                  Create Listing
                </button>
              </Link>
            </div>

            {myListings.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
                <Tag className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
                <p className="text-purple-200 text-lg mb-4">You haven't created any listings yet</p>
                <Link href="/portfolio">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 mx-auto">
                    Go to Portfolio
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            ) : (
              myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl hover:border-purple-500/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {listing.investment?.deal?.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          listing.status === 'active'
                            ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                            : listing.status === 'sold'
                            ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                            : 'bg-gray-500/20 border border-gray-500/30 text-gray-300'
                        } capitalize`}>
                          {listing.status}
                        </span>
                        {listing.buyer && (
                          <span className="text-sm text-purple-300">
                            Buyer: {listing.buyer.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-xs text-purple-300 mb-1">Shares</p>
                      <p className="font-semibold text-white">{listing.shares_for_sale.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-xs text-purple-300 mb-1">Asking Price</p>
                      <p className="font-semibold text-white">{formatCurrency(listing.total_price)}</p>
                      <div className="mt-1 pt-1 border-t border-white/10">
                        <p className="text-xs text-green-400">You receive: {formatCurrency(parseFloat(listing.total_price) * 0.98)}</p>
                        <p className="text-xs text-purple-400">Platform fee (2%): {formatCurrency(parseFloat(listing.total_price) * 0.02)}</p>
                      </div>
                    </div>
                    {listing.offer_price && (
                      <div className="bg-green-600/10 rounded-xl p-3 border border-green-500/20">
                        <p className="text-xs text-green-400 mb-1">Offer Price</p>
                        <p className="font-semibold text-green-300">
                          {formatCurrency(listing.offer_price)}
                        </p>
                      </div>
                    )}
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-xs text-purple-300 mb-1">
                        {listing.status === 'sold' ? 'Sold On' : 'Listed On'}
                      </p>
                      <p className="font-semibold text-white">
                        {formatDate(listing.sold_at || listing.created_at)}
                      </p>
                    </div>
                  </div>

                  {listing.status === 'pending_acceptance' && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleRespondToOffer(listing.id, 'accept')}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Accept Offer
                      </button>
                      <button
                        onClick={() => handleRespondToOffer(listing.id, 'reject')}
                        className="px-6 py-3 bg-white/5 border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 transition-all font-semibold flex items-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Reject Offer
                      </button>
                    </div>
                  )}

                  {listing.status === 'active' && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleCancelListing(listing.id)}
                        className="px-4 py-2 bg-white/5 border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 transition-all text-sm flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel Listing
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* My Purchases Tab */}
        {activeTab === 'my-purchases' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-blue-500/30 rounded-xl p-5 mb-6 shadow-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-blue-300">
                  Track your investments acquired through the secondary market. These shares were purchased from other investors.
                </p>
              </div>
            </div>
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
              <ShoppingCart className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
              <p className="text-purple-200 text-lg mb-4">Your secondary market purchases will appear here</p>
              <Link href="/investments">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 mx-auto">
                  View All Investments
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* My Offers Tab */}
        {activeTab === 'my-offers' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-blue-500/30 rounded-xl p-5 mb-6 shadow-lg">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-blue-300">
                  Track all offers you've made on other investors' listings. See pending, accepted, and rejected offers.
                </p>
              </div>
            </div>
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
              <Target className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
              <p className="text-purple-200 text-lg mb-4">Your offers will appear here</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 mx-auto"
              >
                Browse Listings
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Save Search Modal */}
        {showSaveSearchModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Save Search</h2>
                <button
                  onClick={() => {
                    setShowSaveSearchModal(false);
                    setSearchName('');
                  }}
                  className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-purple-300" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Search Name
                </label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g., High ROI Listings"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && saveCurrentSearch()}
                />
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 mb-6">
                <p className="text-sm text-purple-300 mb-2">Current filters:</p>
                <ul className="text-xs text-purple-200 space-y-1">
                  {filters.dealType && <li>• Type: {filters.dealType}</li>}
                  {filters.search && <li>• Search: "{filters.search}"</li>}
                  {(filters.minPrice || filters.maxPrice) && (
                    <li>
                      • Price: {filters.minPrice && `AED ${filters.minPrice}`}
                      {filters.minPrice && filters.maxPrice && ' - '}
                      {filters.maxPrice && `AED ${filters.maxPrice}`}
                    </li>
                  )}
                  {sortBy !== 'newest' && <li>• Sort: {sortBy}</li>}
                  {showFavoritesOnly && <li>• Favorites only</li>}
                  {!filters.dealType && !filters.search && !filters.minPrice && !filters.maxPrice && !showFavoritesOnly && sortBy === 'newest' && (
                    <li className="text-purple-300">No filters applied</li>
                  )}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveCurrentSearch}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Save Search
                </button>
                <button
                  onClick={() => {
                    setShowSaveSearchModal(false);
                    setSearchName('');
                  }}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Floating Bar */}
        {compareMode && compareListings.length > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-indigo-500/30 shadow-2xl shadow-indigo-500/30 p-4 flex items-center gap-4">
              <div className="text-white font-semibold">
                {compareListings.length} listing{compareListings.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-2">
                {compareListings.length >= 2 && (
                  <button
                    onClick={() => {
                      // Navigate to comparison view with selected listings
                      const ids = compareListings.map(l => l.id).join(',');
                      router.push(`/secondary-market/compare?ids=${ids}`);
                    }}
                    className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center gap-2"
                  >
                    <GitCompare className="w-4 h-4" />
                    Compare Now
                  </button>
                )}
                <button
                  onClick={clearComparison}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Toast */}
        {showCopiedNotification && (
          <div className="fixed bottom-8 right-8 bg-white/5 backdrop-blur-xl border border-green-500/30 text-white px-6 py-4 rounded-xl shadow-2xl shadow-green-500/30 z-50 flex items-center gap-3 animate-slide-up">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="font-semibold">Link Copied!</div>
              <div className="text-sm text-green-300">Share this filter configuration with others</div>
            </div>
          </div>
        )}

        {/* Make Offer Modal */}
        {showOfferModal && selectedListing && (
          <OfferModal
            listing={selectedListing}
            onClose={() => {
              setShowOfferModal(false);
              setSelectedListing(null);
            }}
            onSubmit={(offerPrice) => handleMakeOffer(selectedListing.id, offerPrice)}
          />
        )}
      </div>
    </div>
  );
}

function OfferModal({
  listing,
  onClose,
  onSubmit,
}: {
  listing: any;
  onClose: () => void;
  onSubmit: (offerPrice: number) => void;
}) {
  const [offerPrice, setOfferPrice] = useState(listing.total_price);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Make an Offer</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-purple-300" />
          </button>
        </div>

        <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-sm text-purple-300 mb-1">Deal</p>
          <p className="font-semibold text-white">{listing.investment?.deal?.title}</p>
        </div>

        <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-sm text-purple-300 mb-1">Asking Price</p>
          <p className="font-semibold text-2xl text-white">{formatCurrency(listing.total_price)}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-purple-300 mb-2">Your Offer (AED)</label>
          <input
            type="number"
            value={offerPrice}
            onChange={(e) => setOfferPrice(parseFloat(e.target.value))}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            step="0.01"
            min="0"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSubmit(offerPrice)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Submit Offer
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 transition-all font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
