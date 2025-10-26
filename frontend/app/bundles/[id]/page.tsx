'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { bundleAPI } from '@/lib/api';
import {
  Package, TrendingUp, Shield, Clock, Users, Target, CheckCircle,
  ArrowLeft, Zap, DollarSign, Calendar, BarChart3, AlertCircle
} from 'lucide-react';

interface Bundle {
  bundle_id: string;
  name: string;
  type: string;
  investment_required: number;
  duration_months: number;
  expected_roi_annual: number;
  distribution_frequency: string;
  composition: { [key: string]: number };
  included_deals: string[];
  highlights: string[];
}

const BUNDLES: Bundle[] = [
  {
    bundle_id: "BUN001",
    name: "Smart Starter Bundle",
    type: "Balanced Income",
    investment_required: 1000,
    duration_months: 12,
    expected_roi_annual: 18,
    distribution_frequency: "Monthly",
    composition: {
      "Fixed Yield": 40,
      "Real Estate SPV": 30,
      "Franchise SPV": 30
    },
    included_deals: ["FIX001", "REA001", "BUS001"],
    highlights: [
      "Perfect entry-level bundle for new investors",
      "Auto-diversified and reinvested monthly",
      "Capital protection through low-risk assets"
    ]
  },
  {
    bundle_id: "BUN002",
    name: "Growth Mix Bundle",
    type: "Moderate Growth",
    investment_required: 5000,
    duration_months: 24,
    expected_roi_annual: 28,
    distribution_frequency: "Quarterly",
    composition: {
      "Real Estate SPV": 30,
      "Business SPV": 30,
      "Luxury Asset": 20,
      "Fixed Yield": 20
    },
    included_deals: ["REA002", "BUS002", "LUX002", "FIX002"],
    highlights: [
      "Blend of stable and growth-focused assets",
      "Quarterly distribution of returns",
      "Ideal for mid-tier investors"
    ]
  },
  {
    bundle_id: "BUN003",
    name: "Alpha Investor Bundle",
    type: "High Growth",
    investment_required: 10000,
    duration_months: 36,
    expected_roi_annual: 45,
    distribution_frequency: "Annual",
    composition: {
      "Tech Ventures": 40,
      "Real Estate Development": 30,
      "Luxury Assets": 20,
      "Fixed Yield": 10
    },
    included_deals: ["DIG002", "REA002", "LUX001", "FIX001"],
    highlights: [
      "Designed for investors seeking long-term wealth creation",
      "Equity-based upside potential",
      "Reinvest auto-option available"
    ]
  },
  {
    bundle_id: "BUN004",
    name: "Luxe Experience Bundle",
    type: "Luxury Lifestyle",
    investment_required: 20000,
    duration_months: 30,
    expected_roi_annual: 38,
    distribution_frequency: "Quarterly",
    composition: {
      "Luxury Assets": 50,
      "Retail and Wellness": 25,
      "Real Estate": 15,
      "Fixed Yield": 10
    },
    included_deals: ["LUX001", "BUS001", "REA001", "FIX002"],
    highlights: [
      "Luxury-driven yield and lifestyle access",
      "Partial investment in yacht and car ownership",
      "Quarterly returns from multiple income sources"
    ]
  },
  {
    bundle_id: "BUN005",
    name: "Infrastructure Growth Bundle",
    type: "Long-Term Real Assets",
    investment_required: 50000,
    duration_months: 48,
    expected_roi_annual: 32,
    distribution_frequency: "Annual",
    composition: {
      "Industrial Real Estate": 60,
      "Business SPVs": 25,
      "Fixed Yield": 15
    },
    included_deals: ["INF001", "BUS002", "FIX001"],
    highlights: [
      "Focus on tangible, asset-backed projects",
      "High-value long-term development exposure",
      "Ideal for serious wealth builders"
    ]
  },
  {
    bundle_id: "BUN006",
    name: "Global Diversified Bundle",
    type: "Multi-Sector",
    investment_required: 10000,
    duration_months: 36,
    expected_roi_annual: 35,
    distribution_frequency: "Quarterly",
    composition: {
      "Tech": 25,
      "Real Estate": 25,
      "Franchise": 20,
      "Mobility": 15,
      "Fixed Yield": 15
    },
    included_deals: ["DIG001", "REA001", "BUS002", "REN001", "FIX002"],
    highlights: [
      "Exposure to multiple revenue channels",
      "Geo-diversified for stability",
      "Ideal for experienced investors"
    ]
  }
];

export default function BundleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investing, setInvesting] = useState(false);
  const [investmentError, setInvestmentError] = useState<string | null>(null);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);

  useEffect(() => {
    const bundleData = BUNDLES.find(b => b.bundle_id === params.id);
    setBundle(bundleData || null);
    setLoading(false);
  }, [params.id]);

  const handleInvest = async () => {
    if (!bundle) return;

    setInvesting(true);
    setInvestmentError(null);

    try {
      const response = await bundleAPI.invest(bundle.bundle_id, {
        amount: bundle.investment_required
      });

      if (response.data.success) {
        setInvestmentSuccess(true);
        setTimeout(() => {
          router.push('/portfolio');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Investment error:', error);
      setInvestmentError(
        error.response?.data?.message ||
        error.message ||
        'Failed to process investment. Please try again.'
      );
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading bundle...</p>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-4">Bundle Not Found</h2>
          <Link href="/bundles" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Bundles
          </Link>
        </div>
      </div>
    );
  }

  const projectedReturns = (bundle.investment_required * bundle.expected_roi_annual) / 100;
  const totalReturn = bundle.investment_required + projectedReturns;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/bundles"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bundles
          </Link>

          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1.5 mb-4">
                <Package className="w-4 h-4 text-purple-300" />
                <span className="text-purple-200 text-sm font-semibold">{bundle.type}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-4">
                {bundle.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-purple-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-3xl font-bold text-green-400">{bundle.expected_roi_annual}%</span>
                  <span className="text-sm">Annual ROI</span>
                </div>
                <div className="w-px h-6 bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{bundle.duration_months} months duration</span>
                </div>
                <div className="w-px h-6 bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{bundle.distribution_frequency} distributions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Investment Calculator */}
            <div className="bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-yellow-300" />
                <h2 className="text-2xl font-bold text-white">Investment Calculator</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-sm text-green-100 mb-2">You Invest</div>
                  <div className="text-3xl font-bold text-white">{formatCurrency(bundle.investment_required)}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-sm text-green-100 mb-2">Projected Returns ({bundle.duration_months} months)</div>
                  <div className="text-3xl font-bold text-white">+{formatCurrency(projectedReturns)}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-sm text-green-100 mb-2">Total Value</div>
                  <div className="text-3xl font-bold text-white">{formatCurrency(totalReturn)}</div>
                </div>
              </div>
            </div>

            {/* Asset Allocation */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Asset Allocation</h2>
              </div>

              <div className="space-y-4">
                {Object.entries(bundle.composition).map(([asset, percentage]) => (
                  <div key={asset}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-white">{asset}</span>
                      <span className="text-purple-200">{percentage}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-purple-300 mt-1">
                      {formatCurrency((bundle.investment_required * percentage) / 100)} allocated
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Highlights */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Key Highlights</h2>
              </div>

              <ul className="space-y-3">
                {bundle.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-purple-100">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Included Deals */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Included Deals</h2>
              </div>

              <div className="space-y-3">
                {bundle.included_deals.map(dealId => (
                  <div key={dealId} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-purple-500/30 transition-all">
                    <span className="font-mono text-sm text-purple-200">{dealId}</span>
                    <Link
                      href={`/deals/${dealId}`}
                      className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors"
                    >
                      View Deal →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sticky top-4">
              <h3 className="text-xl font-bold text-white mb-4">Start Investing</h3>

              <div className="mb-6">
                <div className="text-sm text-purple-300 mb-2">Minimum Investment</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {formatCurrency(bundle.investment_required)}
                </div>
              </div>

              <button
                onClick={() => setShowInvestModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all mb-4"
              >
                Invest in This Bundle
              </button>

              <div className="text-xs text-purple-300 text-center mb-4">
                By investing, you agree to OWNLY's terms and conditions
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">Distribution</span>
                  <span className="font-semibold text-white">{bundle.distribution_frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">Duration</span>
                  <span className="font-semibold text-white">{bundle.duration_months} months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">Assets Included</span>
                  <span className="font-semibold text-white">{bundle.included_deals.length} deals</span>
                </div>
              </div>
            </div>

            {/* Why This Bundle */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white">Why This Bundle?</h3>
              </div>
              <p className="text-sm text-purple-100">
                This curated bundle offers instant portfolio diversification with professional asset allocation,
                saving you time while maximizing returns through strategic sector exposure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Invest in {bundle.name}</h2>

            {investmentSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Investment Successful!</h3>
                <p className="text-purple-200">
                  Redirecting to your portfolio...
                </p>
              </div>
            ) : (
              <>
                <p className="text-purple-200 mb-6">
                  You are about to invest {formatCurrency(bundle.investment_required)} in this bundle.
                </p>

                {investmentError && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{investmentError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={handleInvest}
                    disabled={investing}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {investing ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        Processing...
                      </span>
                    ) : (
                      'Confirm Investment'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowInvestModal(false);
                      setInvestmentError(null);
                    }}
                    disabled={investing}
                    className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-semibold hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
