'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { secondaryMarketAPI } from '@/lib/api';
import { formatCurrency, formatDate, getDealTypeLabel } from '@/lib/utils';
import {
  TrendingUp, DollarSign, Users, ArrowRight, Filter, X, ShoppingCart,
  Briefcase, Home, Building, Rocket, Gem, Calendar, MapPin, Award,
  CheckCircle, Clock, AlertCircle, Flame, Target, BarChart3, Package,
  Eye, Tag, Zap, Shield, ArrowUpRight, ArrowDownRight, Share2, Plus
} from 'lucide-react';

export default function SecondaryMarketPage() {
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
  });

  useEffect(() => {
    fetchListings();
  }, [activeTab, filters]);

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
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    Secondary Market
                  </h1>
                  <p className="text-purple-100 mt-1">
                    Buy and sell investment shares • Access immediate liquidity
                  </p>
                </div>
              </div>
            </div>

            {/* Market Statistics */}
            {activeTab === 'browse' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-purple-200" />
                    <div className="text-purple-100 text-xs">Active Listings</div>
                  </div>
                  <div className="text-3xl font-bold text-white">{listings.length}</div>
                  <div className="text-xs text-purple-200 mt-1">Available now</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-purple-200" />
                    <div className="text-purple-100 text-xs">Total Market Value</div>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {formatCurrency(listings.reduce((sum, l) => sum + parseFloat(l.total_price || 0), 0))}
                  </div>
                  <div className="text-xs text-purple-200 mt-1">In listings</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-200" />
                    <div className="text-purple-100 text-xs">Avg Investment</div>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {formatCurrency(listings.length > 0 ? listings.reduce((sum, l) => sum + parseFloat(l.total_price || 0), 0) / listings.length : 0)}
                  </div>
                  <div className="text-xs text-purple-200 mt-1">Per listing</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-200" />
                    <div className="text-purple-100 text-xs">Total Shares</div>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {listings.reduce((sum, l) => sum + parseInt(l.shares_for_sale || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-purple-200 mt-1">For sale</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Market Opportunity Banner */}
        {activeTab === 'browse' && listings.length > 0 && (
          <div className="relative bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-xl rounded-xl p-6 mb-8 overflow-hidden border border-green-500/30 shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Investment Opportunities Available
                  </h3>
                  <p className="text-sm text-green-100">
                    {listings.length} pre-vetted investments ready for immediate purchase • Average {
                      (listings.reduce((sum, l) => {
                        const roi = l.investment?.deal?.expected_roi || 12;
                        return sum + roi;
                      }, 0) / listings.length).toFixed(1)
                    }% expected annual return
                  </p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-sm text-green-100 mb-1">Potential Monthly Income</div>
                <div className="text-3xl font-bold text-white">
                  {formatCurrency(
                    listings.reduce((sum, l) => {
                      const price = parseFloat(l.total_price || 0);
                      const roi = l.investment?.deal?.expected_roi || 12;
                      return sum + ((price * (roi / 100)) / 12);
                    }, 0)
                  )}
                </div>
              </div>
            </div>
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

            {/* Listings */}
            {listings.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <Package className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
                <p className="text-purple-200 text-lg">No active listings available</p>
              </div>
            ) : (
              <div className="space-y-6">
                {listings.map((listing) => {
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

                  return (
                    <div
                      key={listing.id}
                      className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 overflow-hidden shadow-2xl hover:scale-[1.01]"
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
                          } rounded-xl flex items-center justify-center shadow-lg`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {listing.investment?.deal?.title}
                            </h3>
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

                          {/* Total Investment */}
                          <div className="bg-amber-600/10 rounded-xl p-4 border border-amber-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-4 h-4 text-amber-400" />
                              <div className="text-xs text-amber-400 font-semibold">Total Price</div>
                            </div>
                            <div className="text-2xl font-bold text-amber-300">
                              {formatCurrency(totalPrice)}
                            </div>
                          </div>
                        </div>

                        {/* Additional Value Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                          {/* Expected ROI */}
                          <div className="flex items-center p-3 bg-green-600/10 border border-green-500/20 rounded-xl">
                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3">
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
                              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
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
                            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-3">
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
            )}
          </div>
        )}

        {/* My Listings Tab */}
        {activeTab === 'my-listings' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <Link href="/portfolio">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Listing
                </button>
              </Link>
            </div>

            {myListings.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
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
                  className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl"
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
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-blue-300">
                  Track your investments acquired through the secondary market. These shares were purchased from other investors.
                </p>
              </div>
            </div>
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
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
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-blue-300">
                  Track all offers you've made on other investors' listings. See pending, accepted, and rejected offers.
                </p>
              </div>
            </div>
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
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
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
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
