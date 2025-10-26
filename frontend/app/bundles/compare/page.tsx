'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Shield, PieChart, Clock, DollarSign, Users, X, Plus } from 'lucide-react';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  slug: string;
  type: string;
  expected_roi: string;
  BundleDeal?: {
    allocation_percentage: string;
    is_core: boolean;
  };
}

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
  risk_level: string;
  diversification_score: number;
  deals?: Deal[];
}

export default function BundleComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [availableBundles, setAvailableBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    try {
      // Get bundle IDs from URL params
      const bundleIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];

      // Fetch all bundles for the add modal
      const allResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bundles`);
      const allData = await allResponse.json();

      if (allData.success) {
        setAvailableBundles(allData.data);

        // Filter selected bundles
        if (bundleIds.length > 0) {
          const selectedBundles = allData.data.filter((b: Bundle) =>
            bundleIds.includes(b.id)
          );
          setBundles(selectedBundles);
        }
      }
    } catch (error) {
      console.error('Error fetching bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBundle = (bundleId: string) => {
    const currentIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    if (!currentIds.includes(bundleId)) {
      currentIds.push(bundleId);
      router.push(`/bundles/compare?ids=${currentIds.join(',')}`);
    }
    setShowAddModal(false);
  };

  const removeBundle = (bundleId: string) => {
    const currentIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    const newIds = currentIds.filter(id => id !== bundleId);
    if (newIds.length > 0) {
      router.push(`/bundles/compare?ids=${newIds.join(',')}`);
    } else {
      router.push('/bundles');
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'category_based': return 'text-blue-400';
      case 'roi_based': return 'text-purple-400';
      case 'thematic': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading comparison...</div>
      </div>
    );
  }

  if (bundles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/bundles" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8">
            <ArrowLeft size={20} />
            Back to Bundles
          </Link>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <PieChart className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Bundles Selected</h2>
            <p className="text-gray-400 mb-6">Select at least 2 bundles to compare their features and benefits.</p>
            <Link
              href="/bundles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-all"
            >
              Browse Bundles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/bundles" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4">
              <ArrowLeft size={20} />
              Back to Bundles
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">Compare Investment Bundles</h1>
            <p className="text-gray-400">Side-by-side comparison of {bundles.length} bundles</p>
          </div>

          {bundles.length < 4 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
            >
              <Plus size={20} />
              Add Bundle
            </button>
          )}
        </div>

        {/* Comparison Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-6 text-left text-white font-semibold sticky left-0 bg-slate-900/80 backdrop-blur-xl">
                    Features
                  </th>
                  {bundles.map((bundle) => (
                    <th key={bundle.id} className="p-6 text-center min-w-[300px] relative">
                      <button
                        onClick={() => removeBundle(bundle.id)}
                        className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-all"
                      >
                        <X size={16} />
                      </button>
                      <div className="text-white font-bold text-lg mb-2">{bundle.name}</div>
                      <div className={`text-sm ${getTypeColor(bundle.bundle_type)} mb-2`}>
                        {bundle.bundle_type.replace('_', ' ').toUpperCase()}
                      </div>
                      <Link
                        href={`/bundles/${bundle.slug}`}
                        className="text-sm text-purple-400 hover:text-purple-300"
                      >
                        View Details →
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Description */}
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-400 font-semibold sticky left-0 bg-slate-900/80 backdrop-blur-xl">
                    Description
                  </td>
                  {bundles.map((bundle) => (
                    <td key={bundle.id} className="p-6 text-gray-300 text-sm">
                      {bundle.description}
                    </td>
                  ))}
                </tr>

                {/* Minimum Investment */}
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-400 font-semibold flex items-center gap-2 sticky left-0 bg-slate-900/80 backdrop-blur-xl">
                    <DollarSign size={18} className="text-green-400" />
                    Minimum Investment
                  </td>
                  {bundles.map((bundle) => (
                    <td key={bundle.id} className="p-6 text-center">
                      <div className="text-2xl font-bold text-white">
                        AED {(parseFloat(bundle.min_investment) / 1000).toFixed(0)}K
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Expected ROI */}
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-400 font-semibold flex items-center gap-2 sticky left-0 bg-slate-900/80 backdrop-blur-xl">
                    <TrendingUp size={18} className="text-purple-400" />
                    Expected ROI
                  </td>
                  {bundles.map((bundle) => (
                    <td key={bundle.id} className="p-6 text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {bundle.expected_roi_min}% - {bundle.expected_roi_max}%
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Holding Period */}
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-400 font-semibold flex items-center gap-2 sticky left-0 bg-slate-900/80 backdrop-blur-xl">
                    <Clock size={18} className="text-blue-400" />
                    Holding Period
                  </td>
                  {bundles.map((bundle) => (
                    <td key={bundle.id} className="p-6 text-center">
                      <div className="text-xl font-semibold text-white">
                        {bundle.holding_period_months} months
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Risk Level */}
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-400 font-semibold flex items-center gap-2 sticky left-0 bg-slate-900/80 backdrop-blur-xl">
                    <Shield size={18} className="text-orange-400" />
                    Risk Level
                  </td>
                  {bundles.map((bundle) => (
                    <td key={bundle.id} className="p-6 text-center">
                      <span className={`inline-block px-4 py-2 rounded-xl border font-semibold uppercase ${getRiskColor(bundle.risk_level)}`}>
                        {bundle.risk_level}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Diversification Score */}
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-400 font-semibold flex items-center gap-2 sticky left-0 bg-slate-900/80 backdrop-blur-xl">
                    <PieChart size={18} className="text-pink-400" />
                    Diversification
                  </td>
                  {bundles.map((bundle) => (
                    <td key={bundle.id} className="p-6 text-center">
                      <div className="text-2xl font-bold text-white mb-2">{bundle.diversification_score}/100</div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${bundle.diversification_score}%` }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Number of Deals */}
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-400 font-semibold sticky left-0 bg-slate-900/80 backdrop-blur-xl">
                    Number of Deals
                  </td>
                  {bundles.map((bundle) => (
                    <td key={bundle.id} className="p-6 text-center">
                      <div className="text-xl font-semibold text-white">
                        {bundle.deals?.length || 0} deals
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Current Investors */}
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-400 font-semibold flex items-center gap-2 sticky left-0 bg-slate-900/80 backdrop-blur-xl">
                    <Users size={18} className="text-blue-400" />
                    Current Investors
                  </td>
                  {bundles.map((bundle) => (
                    <td key={bundle.id} className="p-6 text-center">
                      <div className="text-xl font-semibold text-white">
                        {bundle.investor_count}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Funding Progress */}
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-400 font-semibold sticky left-0 bg-slate-900/80 backdrop-blur-xl">
                    Funding Progress
                  </td>
                  {bundles.map((bundle) => {
                    const progress = (parseFloat(bundle.raised_amount) / parseFloat(bundle.target_amount)) * 100;
                    return (
                      <td key={bundle.id} className="p-6">
                        <div className="text-center mb-2">
                          <span className="text-lg font-semibold text-white">{progress.toFixed(1)}%</span>
                          <span className="text-sm text-gray-400 ml-2">
                            (AED {(parseFloat(bundle.raised_amount) / 1000000).toFixed(1)}M / {(parseFloat(bundle.target_amount) / 1000000).toFixed(1)}M)
                          </span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Category */}
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-400 font-semibold sticky left-0 bg-slate-900/80 backdrop-blur-xl">
                    Primary Category
                  </td>
                  {bundles.map((bundle) => (
                    <td key={bundle.id} className="p-6 text-center">
                      <span className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 font-semibold">
                        {bundle.category}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Status */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-400 font-semibold sticky left-0 bg-slate-900/80 backdrop-blur-xl">
                    Status
                  </td>
                  {bundles.map((bundle) => (
                    <td key={bundle.id} className="p-6 text-center">
                      <span className={`inline-block px-4 py-2 rounded-xl border font-semibold uppercase ${
                        bundle.status === 'open' ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-gray-400 bg-gray-500/20 border-gray-500/30'
                      }`}>
                        {bundle.status}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          {bundles.map((bundle) => (
            <Link
              key={bundle.id}
              href={`/bundles/${bundle.slug}`}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-purple-500/50"
            >
              Invest in {bundle.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Add Bundle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add Bundle to Comparison</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {availableBundles
                .filter(b => !bundles.find(selected => selected.id === b.id))
                .map((bundle) => (
                  <button
                    key={bundle.id}
                    onClick={() => addBundle(bundle.id)}
                    className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {bundle.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">{bundle.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-purple-400">ROI: {bundle.expected_roi_min}%-{bundle.expected_roi_max}%</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className={`text-sm ${getRiskColor(bundle.risk_level)}`}>{bundle.risk_level} Risk</span>
                        </div>
                      </div>
                      <Plus className="text-purple-400 group-hover:scale-110 transition-transform" size={24} />
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
