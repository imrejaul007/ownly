'use client';

import { useState } from 'react';
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

export default function BundlesPage() {
  const [filter, setFilter] = useState<string>('');

  const filteredBundles = filter
    ? BUNDLES.filter(b => b.type === filter)
    : BUNDLES;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-primary-600 hover:text-primary-800 mb-4 inline-block">
          ← Back to Marketplace
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Investment Bundles
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Pre-curated investment portfolios for instant diversification
        </p>
      </div>

      {/* Benefits Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Why Choose Investment Bundles?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start">
            <div className="text-3xl mr-4">🎯</div>
            <div>
              <h3 className="font-bold mb-1">Instant Diversification</h3>
              <p className="text-blue-100 text-sm">Spread risk across multiple deals automatically</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <h3 className="font-bold mb-1">Professional Curation</h3>
              <p className="text-blue-100 text-sm">Expert-selected deals optimized for returns</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-3xl mr-4">⚡</div>
            <div>
              <h3 className="font-bold mb-1">One-Click Investing</h3>
              <p className="text-blue-100 text-sm">Start building wealth in seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('')}
          className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
            filter === ''
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
          }`}
        >
          All Bundles
        </button>
        {['Balanced Income', 'Moderate Growth', 'High Growth', 'Luxury Lifestyle', 'Long-Term Real Assets', 'Multi-Sector'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
              filter === type
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBundles.map(bundle => (
          <BundleCard key={bundle.bundle_id} bundle={bundle} />
        ))}
      </div>
    </div>
  );
}

function BundleCard({ bundle }: { bundle: Bundle }) {
  const getTypeColor = (type: string) => {
    const colors: any = {
      'Balanced Income': 'from-green-500 to-emerald-600',
      'Moderate Growth': 'from-blue-500 to-cyan-600',
      'High Growth': 'from-purple-500 to-pink-600',
      'Luxury Lifestyle': 'from-yellow-500 to-orange-600',
      'Long-Term Real Assets': 'from-gray-600 to-slate-700',
      'Multi-Sector': 'from-indigo-500 to-purple-600',
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  return (
    <Link href={`/bundles/${bundle.bundle_id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden h-full flex flex-col">
        {/* Header with Gradient */}
        <div className={`bg-gradient-to-r ${getTypeColor(bundle.type)} p-6 text-white`}>
          <div className="text-sm font-semibold mb-2 opacity-90">{bundle.type}</div>
          <h3 className="text-2xl font-bold mb-2">{bundle.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{bundle.expected_roi_annual}%</span>
            <span className="text-sm opacity-90">Annual ROI</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Min. Investment</div>
              <div className="font-bold text-lg">{formatCurrency(bundle.investment_required)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</div>
              <div className="font-bold text-lg">{bundle.duration_months} months</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Distributions</div>
              <div className="font-semibold text-sm">{bundle.distribution_frequency}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Deals Included</div>
              <div className="font-semibold text-sm">{bundle.included_deals.length} deals</div>
            </div>
          </div>

          {/* Composition */}
          <div className="mb-6">
            <div className="text-sm font-semibold mb-3">Asset Allocation</div>
            <div className="space-y-2">
              {Object.entries(bundle.composition).map(([asset, percentage]) => (
                <div key={asset}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{asset}</span>
                    <span className="font-semibold">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-primary-600 h-1.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-auto">
            <div className="text-sm font-semibold mb-2">Key Highlights</div>
            <ul className="space-y-1">
              {bundle.highlights.slice(0, 2).map((highlight, idx) => (
                <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <button className="mt-6 w-full btn-primary">
            View Bundle Details
          </button>
        </div>
      </div>
    </Link>
  );
}
