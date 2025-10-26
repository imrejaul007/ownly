'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import {
  Package, TrendingUp, Shield, Clock, Users, Target,
  Zap, CheckCircle, ArrowRight, Filter, Sparkles
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
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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

  const filteredBundles = filter
    ? bundles.filter(b => b.bundle_type === filter)
    : bundles;

  const bundleTypes = ['category_based', 'roi_based', 'thematic', 'community', 'custom'];

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
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-purple-300" />
            <h3 className="text-lg font-semibold text-white">Filter by Type</h3>
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

        {/* Bundles Grid */}
        {filteredBundles.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
            <p className="text-purple-200 text-lg">No bundles found.</p>
            <button
              onClick={() => setFilter('')}
              className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBundles.map(bundle => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
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

function BundleCard({ bundle }: { bundle: Bundle }) {
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

  return (
    <Link href={`/bundles/${bundle.id}`}>
      <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer overflow-hidden h-full flex flex-col hover:scale-105 duration-300">
        {/* Header with Gradient */}
        <div className={`bg-gradient-to-r ${getTypeColor(bundle.bundle_type)} p-6 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="text-xs font-semibold mb-2 opacity-90 uppercase tracking-wider">
              {bundle.bundle_type.replace('_', ' ')}
            </div>
            <h3 className="text-2xl font-bold mb-3 line-clamp-2">{bundle.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{avgROI.toFixed(1)}%</span>
              <span className="text-sm opacity-90">Avg ROI</span>
            </div>
            <div className="text-xs opacity-75 mt-1">
              {bundle.expected_roi_min}% - {bundle.expected_roi_max}% range
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-xs text-purple-300 mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Min. Investment
              </div>
              <div className="font-bold text-white">{formatCurrency(parseFloat(bundle.min_investment))}</div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-xs text-purple-300 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Duration
              </div>
              <div className="font-bold text-white">{bundle.holding_period_months} months</div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-xs text-purple-300 mb-1 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Risk Level
              </div>
              <div className={`font-semibold text-sm capitalize px-2 py-1 rounded-lg border ${getRiskColor(bundle.risk_level)}`}>
                {bundle.risk_level}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-xs text-purple-300 mb-1 flex items-center gap-1">
                <Target className="w-3 h-3" />
                Diversification
              </div>
              <div className="font-semibold text-white">{bundle.diversification_score}/100</div>
            </div>
          </div>

          {/* Funding Progress */}
          {parseFloat(bundle.raised_amount) > 0 && (
            <div className="mb-6">
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
              <div className="text-xs text-purple-300 mt-2">
                {formatCurrency(parseFloat(bundle.raised_amount))} of {formatCurrency(parseFloat(bundle.target_amount))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <p className="text-sm text-purple-200 line-clamp-3">
              {bundle.description}
            </p>
          </div>

          {/* Features/Highlights */}
          <div className="mt-auto">
            <div className="text-sm font-semibold text-white mb-3">Key Features</div>
            <ul className="space-y-2">
              {bundle.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="text-xs text-purple-200 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <button className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
            View Bundle Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
