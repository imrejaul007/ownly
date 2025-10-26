'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { secondaryMarketAPI } from '@/lib/api';
import { formatCurrency, formatDate, getDealTypeLabel } from '@/lib/utils';
import {
  ArrowLeft, Building, TrendingUp, TrendingDown, Clock, Shield, DollarSign, Users,
  CheckCircle, Package, AlertTriangle, Target, Star, Share2, RefreshCw, Calendar,
  Zap, Activity, Eye, MessageCircle, BookmarkPlus, ExternalLink, ArrowUpRight,
  ArrowDownRight, Award, BadgePercent, Timer, Tag, Handshake, FileText, ChevronRight,
  ArrowRight, BarChart3, Info
} from 'lucide-react';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [similarListings, setSimilarListings] = useState<any[]>([]);
  const [offerHistory, setOfferHistory] = useState<any[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  useEffect(() => {
    if (listing) {
      fetchSimilarListings();
      // Mock offer history
      setOfferHistory([
        { user: 'Buyer #1234', amount: listing.total_price * 0.95, time: '2 hours ago', status: 'rejected' },
        { user: 'Buyer #5678', amount: listing.total_price * 0.92, time: '1 day ago', status: 'rejected' },
        { user: 'Buyer #9012', amount: listing.total_price * 0.88, time: '2 days ago', status: 'rejected' },
      ]);
    }
  }, [listing]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await secondaryMarketAPI.getListingDetails(params.id as string);
      setListing(response.data.data.listing);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarListings = async () => {
    try {
      const response = await secondaryMarketAPI.getListings({});
      const allListings = response.data.data.listings || [];
      // Filter similar listings
      const similar = allListings
        .filter((l: any) => l.id !== listing.id && l.status === 'active')
        .slice(0, 3);
      setSimilarListings(similar);
    } catch (error) {
      console.error('Error fetching similar listings:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchListing();
    setLastUpdate(new Date());
    setTimeout(() => setRefreshing(false), 500);
  };

  const toggleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this secondary market listing: ${listing?.investment?.deal?.title}`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
    }
    setShowShareMenu(false);
  };

  const handleMakeOffer = async (offerPrice: number) => {
    try {
      await secondaryMarketAPI.makeOffer(params.id as string, { offerPrice });
      setShowOfferModal(false);
      fetchListing();
      alert('Offer submitted successfully! The seller will review your offer.');
    } catch (error: any) {
      console.error('Error making offer:', error);
      alert(error.response?.data?.message || 'Failed to make offer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Listing not found</h1>
          <Link href="/secondary-market" className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-2 mt-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Secondary Market
          </Link>
        </div>
      </div>
    );
  }

  const deal = listing.investment?.deal;
  const spv = listing.investment?.spv;
  const seller = listing.seller;
  const buyer = listing.buyer;

  // Calculate metrics
  const originalPrice = listing.metadata?.original_investment_amount || 0;
  const currentPrice = listing.total_price;
  const priceChange = currentPrice - originalPrice;
  const priceChangePercent = originalPrice > 0 ? ((priceChange / originalPrice) * 100) : 0;
  const isDiscount = priceChange < 0;
  const isPremium = priceChange > 0;

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (status === 'sold') return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (status === 'pending_acceptance') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          href="/secondary-market"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Secondary Market
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border capitalize ${getStatusColor(listing.status)}`}>
                {listing.status.replace('_', ' ')}
              </span>
              {deal && (
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg">
                  {getDealTypeLabel(deal.type)}
                </span>
              )}
              {isDiscount && (
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse shadow-lg">
                  💰 Discounted
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-purple-200 hover:text-white"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={toggleWatchlist}
                className={`p-2.5 border rounded-xl transition-all ${
                  isWatchlisted
                    ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-purple-200 hover:text-white'
                }`}
                title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-yellow-400' : ''}`} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-purple-200 hover:text-white"
                  title="Share listing"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-all flex items-center gap-3"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-all flex items-center gap-3"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Share on LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-all flex items-center gap-3"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Share on WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-all flex items-center gap-3 border-t border-white/10"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      Copy Link
                    </button>
                  </div>
                )}
              </div>

              <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-300" />
                <span className="text-sm font-semibold text-white">{Math.floor(Math.random() * 200) + 50}</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-3">
            {deal?.title || 'Secondary Market Listing'}
          </h1>
          <div className="flex items-center gap-4 text-purple-200">
            {deal?.location && (
              <span className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {deal.location}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Activity className="w-3 h-3" />
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Key Metrics at a Glance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 hover:scale-105 transition-all shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-xs text-purple-200 uppercase tracking-wider font-semibold">Asking Price</div>
                <div className="text-3xl font-bold text-white">{formatCurrency(listing.total_price)}</div>
              </div>
            </div>
            <div className="text-xs text-purple-100 mt-2">
              {formatCurrency(listing.price_per_share)} per share
            </div>
          </div>

          <div className={`bg-gradient-to-br backdrop-blur-xl rounded-2xl p-6 border hover:scale-105 transition-all shadow-lg ${
            isDiscount
              ? 'from-green-600/20 to-emerald-600/20 border-green-500/30'
              : 'from-red-600/20 to-orange-600/20 border-red-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDiscount ? 'bg-green-500/30' : 'bg-red-500/30'
              }`}>
                {isDiscount ? (
                  <TrendingDown className="w-6 h-6 text-green-400" />
                ) : (
                  <TrendingUp className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div>
                <div className={`text-xs uppercase tracking-wider font-semibold ${
                  isDiscount ? 'text-green-200' : 'text-red-200'
                }`}>
                  {isDiscount ? 'Discount' : 'Premium'}
                </div>
                <div className={`text-3xl font-bold ${
                  isDiscount ? 'text-green-400' : 'text-red-400'
                }`}>
                  {priceChangePercent.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className={`text-xs mt-2 ${
              isDiscount ? 'text-green-100' : 'text-red-100'
            }`}>
              {isDiscount ? 'Save' : 'Above'} {formatCurrency(Math.abs(priceChange))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 hover:scale-105 transition-all shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Shares</div>
                <div className="text-3xl font-bold text-white">{listing.shares_for_sale.toLocaleString()}</div>
              </div>
            </div>
            <div className="text-xs text-blue-100 mt-2">
              Available for purchase
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30 hover:scale-105 transition-all shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-xs text-orange-200 uppercase tracking-wider font-semibold">Listed</div>
                <div className="text-lg font-bold text-white">{formatDate(listing.created_at)}</div>
              </div>
            </div>
            {listing.listing_expires_at && (
              <div className="text-xs text-orange-100 mt-2">
                Expires {formatDate(listing.listing_expires_at)}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Listing Details */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Handshake className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Listing Details</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                    <Package className="w-4 h-4" />
                    Shares for Sale
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {listing.shares_for_sale.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                    <Tag className="w-4 h-4" />
                    Price per Share
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(listing.price_per_share)}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                    <DollarSign className="w-4 h-4" />
                    Total Price
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {formatCurrency(listing.total_price)}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                    <Calendar className="w-4 h-4" />
                    Listed Date
                  </div>
                  <div className="font-semibold text-white">
                    {formatDate(listing.created_at)}
                  </div>
                </div>
              </div>

              {listing.offer_price && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgePercent className="w-5 h-5 text-green-400" />
                    <p className="text-sm font-medium text-green-200 uppercase tracking-wider">Current Offer</p>
                  </div>
                  <p className="text-3xl font-bold text-green-400">
                    {formatCurrency(listing.offer_price)}
                  </p>
                  {buyer && (
                    <p className="text-sm text-green-100 mt-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Buyer: {buyer.name}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Price Comparison */}
            {listing.metadata && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Price Comparison</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-sm text-purple-300">Original Investment</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(listing.metadata.original_investment_amount || 0)}
                      </p>
                      <p className="text-xs text-purple-200 mt-1">
                        {formatCurrency(listing.metadata.original_price_per_share || 0)} per share
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-purple-300">Current Asking</p>
                      <p className="text-2xl font-bold text-green-400">
                        {formatCurrency(listing.total_price)}
                      </p>
                      <p className="text-xs text-purple-200 mt-1">
                        {formatCurrency(listing.price_per_share)} per share
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border ${
                    isDiscount
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isDiscount ? (
                          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-green-400" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-red-400" />
                          </div>
                        )}
                        <div>
                          <p className={`text-sm font-semibold ${
                            isDiscount ? 'text-green-300' : 'text-red-300'
                          }`}>
                            {isDiscount ? 'Discounted Price' : 'Premium Price'}
                          </p>
                          <p className={`text-xs ${
                            isDiscount ? 'text-green-200' : 'text-red-200'
                          }`}>
                            {isDiscount ? 'Save' : 'Pay'} {formatCurrency(Math.abs(priceChange))} vs original
                          </p>
                        </div>
                      </div>
                      <div className={`text-3xl font-bold ${
                        isDiscount ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isDiscount ? '-' : '+'}{Math.abs(priceChangePercent).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Deal Information */}
            {deal && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">About the Deal</h2>
                </div>
                <p className="text-purple-200 whitespace-pre-wrap leading-relaxed mb-6">
                  {deal.description}
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      Expected ROI
                    </div>
                    <div className="text-2xl font-bold text-green-400">{deal.expected_roi}%</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                      <Clock className="w-4 h-4" />
                      Duration
                    </div>
                    <div className="text-2xl font-bold text-white">{deal.holding_period_months}mo</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                      <Target className="w-4 h-4" />
                      Target
                    </div>
                    <div className="text-lg font-bold text-white">{formatCurrency(deal.target_amount)}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href={`/deals/${deal.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    <FileText className="w-5 h-5" />
                    View Full Deal Details
                  </Link>
                </div>
              </div>
            )}

            {/* SPV Information */}
            {spv && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">SPV Information</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm text-purple-300 mb-1">SPV Name</p>
                    <p className="font-bold text-white text-lg">{spv.spv_name}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm text-purple-300 mb-1">Status</p>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${
                      spv.status === 'operating'
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {spv.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Seller Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Seller Information</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">
                    {seller?.name?.charAt(0) || 'S'}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-white">{seller?.name}</p>
                  <p className="text-sm text-purple-300">{seller?.email}</p>
                </div>
              </div>
            </div>

            {/* Action Card */}
            {listing.status === 'active' && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6 shadow-2xl sticky top-4">
                <div className="flex items-center gap-3 mb-4">
                  <Handshake className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">Make an Offer</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                    <p className="text-sm text-purple-200 mb-1">Asking Price</p>
                    <p className="text-4xl font-bold text-white">
                      {formatCurrency(listing.total_price)}
                    </p>
                    <p className="text-xs text-purple-300 mt-2">
                      {formatCurrency(listing.price_per_share)} per share
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOfferModal(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <DollarSign className="w-5 h-5" />
                    Make an Offer
                  </button>
                  <p className="text-xs text-purple-300 text-center flex items-center justify-center gap-1">
                    <Info className="w-3 h-3" />
                    You can offer a different price
                  </p>
                </div>
              </div>
            )}

            {listing.status === 'sold' && buyer && (
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 mb-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-bold text-green-300">Sold</h3>
                </div>
                <p className="text-sm text-green-100">
                  This listing has been sold to {buyer.name} on {formatDate(listing.sold_at)}
                </p>
              </div>
            )}

            {listing.status === 'cancelled' && (
              <div className="bg-gradient-to-br from-gray-600/20 to-slate-600/20 backdrop-blur-xl border border-gray-500/30 rounded-2xl p-6 mb-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-6 h-6 text-gray-400" />
                  <h3 className="text-lg font-bold text-gray-300">Cancelled</h3>
                </div>
                <p className="text-sm text-gray-200">
                  This listing has been cancelled by the seller.
                </p>
              </div>
            )}

            {listing.status === 'pending_acceptance' && (
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 mb-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-bold text-yellow-300">Offer Pending</h3>
                </div>
                <p className="text-sm text-yellow-100">
                  An offer has been made on this listing and is awaiting seller's response.
                </p>
              </div>
            )}

            {/* Offer History */}
            {offerHistory.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">Offer History</h3>
                </div>
                <div className="space-y-3">
                  {offerHistory.map((offer, idx) => (
                    <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-white">{offer.user}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          offer.status === 'rejected'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {offer.status}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-green-400">{formatCurrency(offer.amount)}</p>
                      <p className="text-xs text-purple-300 mt-1">{offer.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl font-bold text-white">
                    Similar Listings
                  </h2>
                </div>
                <p className="text-purple-200">
                  Other active listings you might be interested in
                </p>
              </div>
              <Link
                href="/secondary-market"
                className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 transition-colors"
              >
                View All
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarListings.map((similarListing) => {
                const similarDeal = similarListing.investment?.deal;
                const similarOriginal = similarListing.metadata?.original_investment_amount || 0;
                const similarCurrent = similarListing.total_price;
                const similarDiscount = similarOriginal > 0 ? (((similarCurrent - similarOriginal) / similarOriginal) * 100) : 0;
                const isSimilarDiscount = similarDiscount < 0;

                return (
                  <Link key={similarListing.id} href={`/secondary-market/${similarListing.id}`}>
                    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer overflow-hidden hover:scale-105 duration-300 shadow-lg">
                      <div className={`bg-gradient-to-r p-6 text-white relative overflow-hidden ${
                        isSimilarDiscount
                          ? 'from-green-500 to-emerald-600'
                          : 'from-blue-500 to-cyan-600'
                      }`}>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative">
                          <div className="text-xs font-semibold mb-2 opacity-90 uppercase tracking-wider">
                            {similarDeal ? getDealTypeLabel(similarDeal.type) : 'Deal'}
                          </div>
                          <h3 className="text-xl font-bold mb-2 line-clamp-2">
                            {similarDeal?.title || 'Secondary Market Listing'}
                          </h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">
                              {formatCurrency(similarListing.total_price)}
                            </span>
                          </div>
                          {isSimilarDiscount && (
                            <div className="text-xs mt-2 bg-white/20 inline-block px-2 py-1 rounded-full">
                              {Math.abs(similarDiscount).toFixed(1)}% discount
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Shares:</span>
                            <span className="font-bold text-white">{similarListing.shares_for_sale.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Per Share:</span>
                            <span className="font-bold text-white">{formatCurrency(similarListing.price_per_share)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Listed:</span>
                            <span className="font-bold text-white">{formatDate(similarListing.created_at)}</span>
                          </div>
                        </div>
                        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
                          View Listing
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <OfferModal
          listing={listing}
          onClose={() => setShowOfferModal(false)}
          onSubmit={handleMakeOffer}
        />
      )}
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
  const [submitting, setSubmitting] = useState(false);

  const setQuickOffer = (percentage: number) => {
    setOfferPrice(Math.floor(listing.total_price * percentage));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit(offerPrice);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Handshake className="w-8 h-8 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Make an Offer</h2>
        </div>

        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-sm text-purple-300 mb-1">Deal</p>
          <p className="font-bold text-white">{listing.investment?.deal?.title}</p>
        </div>

        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-sm text-purple-300 mb-1">Shares</p>
          <p className="font-bold text-white">{listing.shares_for_sale.toLocaleString()} shares</p>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
          <p className="text-sm text-purple-200 mb-1">Asking Price</p>
          <p className="font-bold text-white text-2xl">{formatCurrency(listing.total_price)}</p>
        </div>

        {/* Quick Offer Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-3 text-purple-200">
            Quick Offers
          </label>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setQuickOffer(0.85)}
              className="px-3 py-2 bg-white/5 hover:bg-green-600/30 border border-white/10 hover:border-green-500/50 rounded-lg text-xs font-semibold text-white transition-all"
            >
              -15%
            </button>
            <button
              onClick={() => setQuickOffer(0.90)}
              className="px-3 py-2 bg-white/5 hover:bg-green-600/30 border border-white/10 hover:border-green-500/50 rounded-lg text-xs font-semibold text-white transition-all"
            >
              -10%
            </button>
            <button
              onClick={() => setQuickOffer(0.95)}
              className="px-3 py-2 bg-white/5 hover:bg-yellow-600/30 border border-white/10 hover:border-yellow-500/50 rounded-lg text-xs font-semibold text-white transition-all"
            >
              -5%
            </button>
            <button
              onClick={() => setQuickOffer(1.00)}
              className="px-3 py-2 bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/50 rounded-lg text-xs font-semibold text-white transition-all"
            >
              Full
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-purple-200">
            Your Offer (AED)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(parseFloat(e.target.value))}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              step="0.01"
              min="0"
            />
          </div>
          {offerPrice < listing.total_price && (
            <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              Your offer is {formatCurrency(listing.total_price - offerPrice)} below asking price ({((1 - offerPrice / listing.total_price) * 100).toFixed(1)}% discount)
            </p>
          )}
          {offerPrice > listing.total_price && (
            <p className="text-sm text-yellow-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Your offer is {formatCurrency(offerPrice - listing.total_price)} above asking price
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting || !offerPrice || offerPrice <= 0}
          >
            {submitting ? 'Submitting...' : 'Submit Offer'}
          </button>
        </div>
      </div>
    </div>
  );
}
