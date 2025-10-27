'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Deal } from '@/types';
import { dealAPI, investmentAPI, walletAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, getDealTypeLabel, calculateFundingProgress, formatDate } from '@/lib/utils';
import ROICalculator from '@/components/ROICalculator';
import DealSocialProof from '@/components/DealSocialProof';
import {
  ArrowLeft, Building, TrendingUp, Clock, Shield, DollarSign, Users,
  CheckCircle, Download, FileText, BarChart3, AlertTriangle, Target,
  Package, Sparkles, Info, ChevronRight, Wallet, Award, Lock, Star,
  Share2, RefreshCw, Calendar, Zap, Activity, TrendingDown, Eye,
  MessageCircle, BookmarkPlus, ExternalLink, Plus, ArrowUpRight, ArrowRight
} from 'lucide-react';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [investAmount, setInvestAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [similarDeals, setSimilarDeals] = useState<Deal[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchDeal(params.id as string);
      // Load watchlist state from localStorage
      const watchlist = localStorage.getItem('ownly_deal_watchlist');
      if (watchlist) {
        const watchlistArray = JSON.parse(watchlist);
        setIsWatchlisted(watchlistArray.includes(params.id));
      }
    }
    fetchWalletBalance();
  }, [params.id]);

  useEffect(() => {
    if (deal) {
      fetchSimilarDeals(deal);
      // Mock recent activity
      setRecentActivity([
        { user: 'Ahmed K.', action: 'invested', amount: 5000, time: '2 mins ago' },
        { user: 'Sarah M.', action: 'invested', amount: 10000, time: '15 mins ago' },
        { user: 'Omar R.', action: 'viewed', time: '23 mins ago' },
        { user: 'Fatima A.', action: 'invested', amount: 7500, time: '1 hour ago' },
      ]);
    }
  }, [deal]);

  const fetchDeal = async (id: string) => {
    try {
      setLoading(true);
      const response = await dealAPI.get(id);
      setDeal(response.data.data.deal);
    } catch (error) {
      console.error('Error fetching deal:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      setLoadingBalance(true);
      const response = await walletAPI.getBalance();
      setWalletBalance(response.data.data.wallet.availableBalance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      setLoadingBalance(false);
    }
  };

  const fetchSimilarDeals = async (currentDeal: Deal) => {
    try {
      const response = await dealAPI.list({});
      const allDeals = response.data.data;
      // Filter similar deals by type, excluding current deal
      const similar = allDeals
        .filter((d: Deal) => d.type === currentDeal.type && d.id !== currentDeal.id)
        .slice(0, 3);
      setSimilarDeals(similar);
    } catch (error) {
      console.error('Error fetching similar deals:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDeal(params.id as string);
    await fetchWalletBalance();
    setLastUpdate(new Date());
    setTimeout(() => setRefreshing(false), 500);
  };

  const toggleWatchlist = () => {
    const newState = !isWatchlisted;
    setIsWatchlisted(newState);

    // Persist to localStorage
    const dealId = params.id as string;
    const watchlist = localStorage.getItem('ownly_deal_watchlist');
    let watchlistArray: string[] = watchlist ? JSON.parse(watchlist) : [];

    if (newState) {
      // Add to watchlist
      if (!watchlistArray.includes(dealId)) {
        watchlistArray.push(dealId);
      }
    } else {
      // Remove from watchlist
      watchlistArray = watchlistArray.filter(id => id !== dealId);
    }

    localStorage.setItem('ownly_deal_watchlist', JSON.stringify(watchlistArray));
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this investment opportunity: ${deal?.title}`;

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

  const setQuickInvestAmount = (multiplier: number) => {
    if (deal) {
      const amount = deal.min_ticket * multiplier;
      setInvestAmount(amount.toString());
    }
  };

  const handleInvest = async () => {
    if (!deal?.spv || !investAmount) return;

    const amount = parseFloat(investAmount);

    // Validate amount
    if (amount < deal.min_ticket) {
      alert(`Minimum investment is ${formatCurrency(deal.min_ticket)}`);
      return;
    }

    // Check wallet balance
    if (amount > walletBalance) {
      alert(`Insufficient balance. You have ${formatCurrency(walletBalance)} available.`);
      return;
    }

    try {
      setInvesting(true);
      await investmentAPI.invest({
        spvId: deal.spv.id,
        amount,
      });

      // Success message
      alert(`Investment successful!\n\nYou invested ${formatCurrency(amount)} in ${deal.title}.\n\nYour wallet balance has been updated.`);

      setShowInvestModal(false);
      setInvestAmount('');

      // Refresh data
      fetchDeal(params.id as string);
      fetchWalletBalance();

      // Redirect to investments after 2 seconds
      setTimeout(() => {
        router.push('/investments');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Investment failed. Please try again.';
      alert(`${errorMessage}`);
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Deal not found</h1>
          <Link href="/deals" className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-2 mt-4">
            <ArrowLeft className="w-4 h-4" />
            Back to All Deals
          </Link>
        </div>
      </div>
    );
  }

  const fundingProgress = calculateFundingProgress(deal.raised_amount, deal.target_amount);

  const getTypeColor = (type: string) => {
    const colors: any = {
      'franchise': 'from-blue-500 to-indigo-600',
      'real_estate': 'from-emerald-500 to-green-600',
      'luxury_asset': 'from-purple-500 to-pink-600',
      'tech_venture': 'from-cyan-500 to-blue-600',
      'rental_yield': 'from-yellow-500 to-orange-600',
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (status: string) => {
    if (status === 'open' || status === 'funding') return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (status === 'funded') return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          href="/deals"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Deals
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${getTypeColor(deal.type)} text-white shadow-lg`}>
                {getDealTypeLabel(deal.type)}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border capitalize ${getStatusColor(deal.status)}`}>
                {deal.status}
              </span>
              {deal.investor_count > 20 && (
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse shadow-lg">
                  🔥 Hot Deal
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Refresh */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2 text-purple-200 hover:text-white"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Watchlist */}
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

              {/* Share */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-purple-200 hover:text-white"
                  title="Share deal"
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

              {/* View Count */}
              <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-300" />
                <span className="text-sm font-semibold text-white">{Math.floor(Math.random() * 500) + 100}</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-3">
            {deal.title}
          </h1>
          <p className="text-purple-200 flex items-center gap-2">
            <Building className="w-4 h-4" />
            {deal.location}
          </p>

          {/* Last Updated */}
          <p className="text-xs text-purple-300 mt-2 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>

        {/* Key Metrics at a Glance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 hover:scale-105 transition-all shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-xs text-green-200 uppercase tracking-wider font-semibold">Expected ROI</div>
                <div className="text-3xl font-bold text-white">{deal.expected_roi ? formatPercentage(deal.expected_roi) : 'N/A'}</div>
              </div>
            </div>
            {deal.expected_roi && deal.holding_period_months && (
              <div className="text-xs text-green-100 mt-2">
                ~{formatCurrency((deal.min_ticket * deal.expected_roi) / 100 / 12)} / month on min. investment
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 hover:scale-105 transition-all shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Min. Investment</div>
                <div className="text-3xl font-bold text-white">{formatCurrency(deal.min_ticket)}</div>
              </div>
            </div>
            <div className="text-xs text-blue-100 mt-2">
              Start investing from as low as {formatCurrency(deal.min_ticket)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 hover:scale-105 transition-all shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-xs text-purple-200 uppercase tracking-wider font-semibold">Duration</div>
                <div className="text-3xl font-bold text-white">{deal.holding_period_months}mo</div>
              </div>
            </div>
            <div className="text-xs text-purple-100 mt-2">
              {((deal.holding_period_months || 0) / 12).toFixed(1)} years holding period
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30 hover:scale-105 transition-all shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-xs text-orange-200 uppercase tracking-wider font-semibold">Investors</div>
                <div className="text-3xl font-bold text-white">{deal.investor_count}</div>
              </div>
            </div>
            <div className="text-xs text-orange-100 mt-2">
              Join {deal.investor_count} other investors
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {deal.images && deal.images.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="relative">
                  <img
                    src={deal.images[0]}
                    alt={deal.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">About This Opportunity</h2>
              </div>
              <p className="text-purple-200 whitespace-pre-wrap leading-relaxed">
                {deal.description}
              </p>
            </div>

            {/* Key Details */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Key Details</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    Expected ROI
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {deal.expected_roi ? formatPercentage(deal.expected_roi) : 'N/A'}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                    <BarChart3 className="w-4 h-4" />
                    Expected IRR
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {deal.expected_irr ? formatPercentage(deal.expected_irr) : 'N/A'}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                    <Clock className="w-4 h-4" />
                    Holding Period
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {deal.holding_period_months} months
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                    <Shield className="w-4 h-4" />
                    Jurisdiction
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {deal.jurisdiction || 'UAE'}
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Calculator - Removed for now as it's designed for bundles with min/max ROI */}

            {/* OWNLY Shield - 7-Layer Trust Architecture */}
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-500/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">OWNLY Shield</h2>
                    <p className="text-sm text-green-200">7-Layer Trust Architecture</p>
                  </div>
                </div>
                <span className="px-4 py-1.5 bg-green-500 text-white text-sm font-bold rounded-full flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Verified
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: Building,
                    title: 'SPV-Based Legal Ownership',
                    description: 'Licensed entity with transparent shareholding structure'
                  },
                  {
                    icon: Lock,
                    title: 'Escrow-Protected Capital',
                    description: 'Funds held securely until deployment conditions are met'
                  },
                  {
                    icon: CheckCircle,
                    title: 'Third-Party Verification',
                    description: 'Independent due diligence and asset validation'
                  },
                  {
                    icon: Shield,
                    title: 'Asset Insurance Coverage',
                    description: 'Physical assets insured against loss or damage'
                  },
                  {
                    icon: FileText,
                    title: 'Audited Financials & Payouts',
                    description: 'Monthly reporting with independent financial audit trail'
                  },
                  {
                    icon: Users,
                    title: 'Investor KYC & AML Compliance',
                    description: 'Full regulatory compliance and identity verification'
                  },
                  {
                    icon: BarChart3,
                    title: 'Live Performance Dashboard',
                    description: 'Real-time tracking of asset performance and returns'
                  }
                ].map((layer, idx) => (
                  <div key={idx} className="flex items-start bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <layer.icon className="w-5 h-5 text-green-300" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white mb-1">{layer.title}</div>
                      <div className="text-sm text-green-100">{layer.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-100">
                    <strong className="text-white">Why OWNLY Shield matters:</strong> Unlike informal agreements or court-stamped MoUs, OWNLY uses the same SPV structure as hedge funds and REITs - giving you real legal ownership, not just promises.
                  </p>
                </div>
              </div>
            </div>

            {/* SPV Info */}
            {deal.spv && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">SPV Legal Information</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-purple-200">SPV Legal Name</span>
                    <span className="font-bold text-white">{deal.spv.spv_name}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-purple-200">License Number</span>
                    <span className="font-bold text-white font-mono">DMCC-{Math.floor(Math.random() * 900000 + 100000)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-purple-200">Total Shares</span>
                    <span className="font-bold text-white">{deal.spv.total_shares.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-purple-200">Issued Shares</span>
                    <span className="font-bold text-white">{deal.spv.issued_shares.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-purple-200">Share Price</span>
                    <span className="font-bold text-green-400 text-xl">{formatCurrency(deal.spv.share_price)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-purple-200">Available Shares</span>
                    <span className="font-bold text-green-400">{(deal.spv.total_shares - deal.spv.issued_shares).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all font-semibold flex items-center justify-center gap-2 border border-blue-500/30">
                    <Download className="w-5 h-5" />
                    Download Legal Documents (MOA, AOA, SHA)
                  </button>
                  <button className="w-full px-4 py-3 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-all font-semibold flex items-center justify-center gap-2 border border-purple-500/30">
                    <FileText className="w-5 h-5" />
                    View Insurance Certificate
                  </button>
                  <button className="w-full px-4 py-3 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-all font-semibold flex items-center justify-center gap-2 border border-green-500/30">
                    <BarChart3 className="w-5 h-5" />
                    View Audit Reports
                  </button>
                </div>
              </div>
            )}

            {/* Risk Assessment */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Risk Assessment</h2>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-white">Overall Risk Score</span>
                  <span className="text-3xl font-bold text-green-400">7.8/10</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden border border-white/10">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500" style={{ width: '78%' }}></div>
                </div>
                <p className="text-sm text-purple-200 mt-2">Low to Moderate Risk</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Market Risk', level: 'Low', percentage: 30, color: 'green' },
                  { label: 'Liquidity Risk', level: 'Medium', percentage: 45, color: 'yellow' },
                  { label: 'Operational Risk', level: 'Low', percentage: 25, color: 'green' },
                  { label: 'Regulatory Risk', level: 'Low', percentage: 20, color: 'green' }
                ].map((risk, idx) => (
                  <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-200">{risk.label}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        risk.color === 'green'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        {risk.level}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          risk.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${risk.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <h3 className="font-bold mb-3 text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  Key Risk Factors:
                </h3>
                <ul className="space-y-2 text-sm text-purple-200">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Market conditions may affect actual returns vs projected ROI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Exit liquidity depends on secondary market demand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Asset performance subject to management execution</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sticky top-4 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Investment Summary</h3>
              </div>

              <div className="space-y-6 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-purple-300 mb-2">Target Raise</div>
                  <div className="text-3xl font-bold text-white">
                    {formatCurrency(deal.target_amount)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-purple-300 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    Funding Progress
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-4 mb-3 overflow-hidden border border-white/10">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">
                      {formatCurrency(deal.raised_amount)} raised
                    </span>
                    <span className="font-bold text-white">{fundingProgress.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Min. Investment
                    </span>
                    <span className="font-bold text-white">{formatCurrency(deal.min_ticket)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-300 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Investors
                    </span>
                    <span className="font-bold text-white">{deal.investor_count}</span>
                  </div>
                </div>
              </div>

              {deal.status === 'open' || deal.status === 'funding' ? (
                <button
                  onClick={() => setShowInvestModal(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 hover:scale-105"
                >
                  <Wallet className="w-5 h-5" />
                  Invest Now
                </button>
              ) : (
                <button disabled className="w-full bg-gray-600/20 text-gray-400 py-4 rounded-xl font-bold border border-gray-600/30 cursor-not-allowed">
                  Not Available
                </button>
              )}

              <p className="text-xs text-purple-300 text-center mt-4 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" />
                Sandbox environment - No real money transferred
              </p>
            </div>

            {/* Social Proof */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-6 shadow-2xl">
              <DealSocialProof
                dealId={deal.id}
                investorCount={deal.investor_count}
                targetAmount={deal.target_amount}
                raisedAmount={deal.raised_amount}
                showTrending={true}
                compact={false}
              />
            </div>

            {/* Live Activity Feed */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Live Activity</h3>
                <span className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>

              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.action === 'invested'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {activity.action === 'invested' ? (
                        <DollarSign className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-semibold">{activity.user}</p>
                      <p className="text-xs text-purple-200">
                        {activity.action === 'invested' ? (
                          <>Invested <span className="font-bold text-green-400">{formatCurrency(activity.amount)}</span></>
                        ) : (
                          'Viewed this deal'
                        )}
                      </p>
                      <p className="text-xs text-purple-300 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Deals */}
        {similarDeals.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl font-bold text-white">
                    Similar Opportunities
                  </h2>
                </div>
                <p className="text-purple-200">
                  Other {getDealTypeLabel(deal.type).toLowerCase()} deals you might be interested in
                </p>
              </div>
              <Link
                href={`/deals?type=${deal.type}`}
                className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 transition-colors"
              >
                View All
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarDeals.map((similarDeal) => (
                <Link key={similarDeal.id} href={`/deals/${similarDeal.id}`}>
                  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer overflow-hidden hover:scale-105 duration-300 shadow-lg">
                    <div className={`bg-gradient-to-r ${getTypeColor(similarDeal.type)} p-6 text-white relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="relative">
                        <div className="text-xs font-semibold mb-2 opacity-90 uppercase tracking-wider">
                          {getDealTypeLabel(similarDeal.type)}
                        </div>
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{similarDeal.title}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">
                            {similarDeal.expected_roi ? formatPercentage(similarDeal.expected_roi) : 'N/A'}
                          </span>
                          <span className="text-sm opacity-90">ROI</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-300">Min. Investment:</span>
                          <span className="font-bold text-white">{formatCurrency(similarDeal.min_ticket)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-300">Duration:</span>
                          <span className="font-bold text-white">{similarDeal.holding_period_months} months</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-300">Investors:</span>
                          <span className="font-bold text-white">{similarDeal.investor_count}</span>
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Investment Bundles */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-8 h-8 text-purple-400" />
                <h2 className="text-3xl font-bold text-white">
                  Diversify with Investment Bundles
                </h2>
              </div>
              <p className="text-purple-200">
                Get instant exposure to multiple deals like this one with pre-curated bundles
              </p>
            </div>
            <Link
              href="/bundles"
              className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 transition-colors"
            >
              View All Bundles
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Smart Starter Bundle */}
            <Link href="/bundles/BUN001">
              <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-green-500/30 transition-all cursor-pointer overflow-hidden hover:scale-105 duration-300">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <div className="text-xs font-semibold mb-2 opacity-90 uppercase tracking-wider">Balanced Income</div>
                    <h3 className="text-xl font-bold mb-2">Smart Starter Bundle</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">18%</span>
                      <span className="text-sm opacity-90">Annual ROI</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Min. Investment:</span>
                      <span className="font-bold text-white">{formatCurrency(1000)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Duration:</span>
                      <span className="font-bold text-white">12 months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Deals Included:</span>
                      <span className="font-bold text-white">3 deals</span>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-3 space-y-2">
                    <div className="text-xs text-purple-200 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Perfect for new investors
                    </div>
                    <div className="text-xs text-purple-200 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Auto-diversified portfolio
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Growth Mix Bundle */}
            <Link href="/bundles/BUN002">
              <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer overflow-hidden hover:scale-105 duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <div className="text-xs font-semibold mb-2 opacity-90 uppercase tracking-wider">Moderate Growth</div>
                    <h3 className="text-xl font-bold mb-2">Growth Mix Bundle</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">28%</span>
                      <span className="text-sm opacity-90">Annual ROI</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Min. Investment:</span>
                      <span className="font-bold text-white">{formatCurrency(5000)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Duration:</span>
                      <span className="font-bold text-white">24 months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Deals Included:</span>
                      <span className="font-bold text-white">4 deals</span>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-3 space-y-2">
                    <div className="text-xs text-purple-200 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Stable & growth-focused
                    </div>
                    <div className="text-xs text-purple-200 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Quarterly distributions
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Global Diversified Bundle */}
            <Link href="/bundles/BUN006">
              <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer overflow-hidden hover:scale-105 duration-300">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <div className="text-xs font-semibold mb-2 opacity-90 uppercase tracking-wider">Multi-Sector</div>
                    <h3 className="text-xl font-bold mb-2">Global Diversified Bundle</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">35%</span>
                      <span className="text-sm opacity-90">Annual ROI</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Min. Investment:</span>
                      <span className="font-bold text-white">{formatCurrency(10000)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Duration:</span>
                      <span className="font-bold text-white">36 months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Deals Included:</span>
                      <span className="font-bold text-white">5 deals</span>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-3 space-y-2">
                    <div className="text-xs text-purple-200 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Multiple revenue channels
                    </div>
                    <div className="text-xs text-purple-200 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Geo-diversified for stability
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-blue-300" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2 text-white">Why Choose Bundles?</h3>
                <p className="text-purple-200 text-sm mb-4">
                  Investment bundles provide instant diversification, professional curation, and simplified management.
                  Instead of researching individual deals, get exposure to multiple vetted opportunities with a single investment.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-purple-200">Lower risk through diversification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-purple-200">Professionally balanced portfolios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-purple-200">One-click investing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Wallet className="w-8 h-8 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Invest in {deal.title}</h3>
            </div>

            {/* Wallet Balance */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-200">Available Balance:</span>
                <span className="text-xl font-bold text-green-300">{formatCurrency(walletBalance)}</span>
              </div>
            </div>

            {/* Quick Investment Buttons */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-3 text-purple-200">
                Quick Investment Amounts
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setQuickInvestAmount(1)}
                  className="px-3 py-2 bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/50 rounded-lg text-xs font-semibold text-white transition-all"
                >
                  Min
                </button>
                <button
                  onClick={() => setQuickInvestAmount(2)}
                  className="px-3 py-2 bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/50 rounded-lg text-xs font-semibold text-white transition-all"
                >
                  2x
                </button>
                <button
                  onClick={() => setQuickInvestAmount(5)}
                  className="px-3 py-2 bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/50 rounded-lg text-xs font-semibold text-white transition-all"
                >
                  5x
                </button>
                <button
                  onClick={() => setQuickInvestAmount(10)}
                  className="px-3 py-2 bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/50 rounded-lg text-xs font-semibold text-white transition-all"
                >
                  10x
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-purple-200">
                Investment Amount (Min: {formatCurrency(deal.min_ticket)})
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  placeholder={`Min ${deal.min_ticket}`}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {investAmount && parseFloat(investAmount) > walletBalance && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Insufficient balance
                </p>
              )}
              {investAmount && parseFloat(investAmount) < deal.min_ticket && (
                <p className="text-yellow-400 text-sm mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Below minimum investment amount
                </p>
              )}
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">You will receive:</span>
                  <span className="font-bold text-white">
                    {investAmount && deal.spv
                      ? Math.floor(parseFloat(investAmount) / deal.spv.share_price).toLocaleString()
                      : '0'}{' '}
                    shares
                  </span>
                </div>
                {investAmount && deal.expected_roi && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Expected returns:</span>
                      <span className="font-bold text-green-400">
                        {formatCurrency((parseFloat(investAmount) * deal.expected_roi) / 100)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Total payout:</span>
                      <span className="font-bold text-white">
                        {formatCurrency(parseFloat(investAmount) + (parseFloat(investAmount) * deal.expected_roi) / 100)}
                      </span>
                    </div>
                    {deal.holding_period_months && (
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-300">~Monthly income:</span>
                        <span className="font-semibold text-blue-400">
                          {formatCurrency((parseFloat(investAmount) * deal.expected_roi) / 100 / deal.holding_period_months)}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {investAmount && (
                  <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                    <span className="text-purple-300">Remaining balance:</span>
                    <span className="font-semibold text-white">
                      {formatCurrency(Math.max(0, walletBalance - parseFloat(investAmount)))}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInvestModal(false)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                disabled={investing}
              >
                Cancel
              </button>
              <button
                onClick={handleInvest}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={investing || !investAmount || parseFloat(investAmount) < deal.min_ticket || parseFloat(investAmount) > walletBalance}
              >
                {investing ? 'Processing...' : 'Confirm Investment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
