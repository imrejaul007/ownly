'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

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

  useEffect(() => {
    const bundleData = BUNDLES.find(b => b.bundle_id === params.id);
    setBundle(bundleData || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Bundle Not Found</h2>
          <Link href="/bundles" className="btn-primary inline-block">
            Back to Bundles
          </Link>
        </div>
      </div>
    );
  }

  const projectedReturns = (bundle.investment_required * bundle.expected_roi_annual) / 100;
  const totalReturn = bundle.investment_required + projectedReturns;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/bundles" className="text-primary-600 hover:text-primary-800">
          ← Back to Bundles
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-800 mb-3">
              {bundle.type}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {bundle.name}
            </h1>
            <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-green-600">{bundle.expected_roi_annual}%</span>
                <span className="ml-2">Annual ROI</span>
              </div>
              <div>•</div>
              <div>{bundle.duration_months} month duration</div>
              <div>•</div>
              <div>{bundle.distribution_frequency} distributions</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Investment Calculator */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Investment Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm opacity-90 mb-2">You Invest</div>
                <div className="text-3xl font-bold">{formatCurrency(bundle.investment_required)}</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-2">Projected Returns ({bundle.duration_months} months)</div>
                <div className="text-3xl font-bold">+{formatCurrency(projectedReturns)}</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-2">Total Value</div>
                <div className="text-3xl font-bold">{formatCurrency(totalReturn)}</div>
              </div>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Asset Allocation</h2>
            <div className="space-y-4">
              {Object.entries(bundle.composition).map(([asset, percentage]) => (
                <div key={asset}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{asset}</span>
                    <span className="text-gray-600 dark:text-gray-400">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formatCurrency((bundle.investment_required * percentage) / 100)} allocated
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Highlights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Key Highlights</h2>
            <ul className="space-y-3">
              {bundle.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Included Deals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Included Deals</h2>
            <div className="space-y-2">
              {bundle.included_deals.map(dealId => (
                <div key={dealId} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                  <span className="font-mono text-sm">{dealId}</span>
                  <Link href={`/deals/${dealId}`} className="text-primary-600 hover:text-primary-800 text-sm">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-4">
            <h3 className="text-xl font-bold mb-4">Start Investing</h3>

            <div className="mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Minimum Investment</div>
              <div className="text-3xl font-bold text-primary-600">
                {formatCurrency(bundle.investment_required)}
              </div>
            </div>

            <button
              onClick={() => setShowInvestModal(true)}
              className="btn-primary w-full mb-4"
            >
              Invest in This Bundle
            </button>

            <div className="text-xs text-gray-500 text-center mb-4">
              By investing, you agree to OWNLY's terms and conditions
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Distribution</span>
                <span className="font-semibold">{bundle.distribution_frequency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Duration</span>
                <span className="font-semibold">{bundle.duration_months} months</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Assets Included</span>
                <span className="font-semibold">{bundle.included_deals.length} deals</span>
              </div>
            </div>
          </div>

          {/* Why This Bundle */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <h3 className="font-bold mb-3">Why This Bundle?</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This curated bundle offers instant portfolio diversification with professional asset allocation,
              saving you time while maximizing returns through strategic sector exposure.
            </p>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Invest in {bundle.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Minimum investment: {formatCurrency(bundle.investment_required)}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  alert(`Investment feature coming soon! You would invest ${formatCurrency(bundle.investment_required)} in ${bundle.name}`);
                  setShowInvestModal(false);
                }}
                className="btn-primary w-full"
              >
                Confirm Investment
              </button>
              <button
                onClick={() => setShowInvestModal(false)}
                className="btn-secondary w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
