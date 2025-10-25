'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dealAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, getDealTypeLabel } from '@/lib/utils';

export default function FeaturedOpportunitiesPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await dealAPI.list({});
      setDeals(response.data.data);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopDeals = () => deals.slice(0, 5).sort((a, b) => (b.expected_roi || 0) - (a.expected_roi || 0));
  const getTrendingDeals = () => deals.filter(d => d.investor_count > 10).slice(0, 4);
  const getClosingSoon = () => deals.filter(d => d.status === 'funding' || d.status === 'open').slice(0, 3);
  const getHighPerformers = () => deals.filter(d => (d.expected_roi || 0) > 25).slice(0, 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const topDeals = getTopDeals();
  const trendingDeals = getTrendingDeals();
  const closingSoonDeals = getClosingSoon();
  const highPerformers = getHighPerformers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-2xl p-12 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-4">
            🔥 Featured Opportunities
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Discover Your Next
            <br />
            Investment Opportunity
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Hand-picked deals with exceptional returns, verified by our team of experts
          </p>
          <div className="flex space-x-4">
            <Link href="/deals">
              <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition">
                Browse All Deals
              </button>
            </Link>
            <Link href="/calculator">
              <button className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition border border-white/30">
                ROI Calculator
              </button>
            </Link>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-8 right-8 grid grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{deals.length}</div>
            <div className="text-sm text-white/80">Active Deals</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">
              {deals.reduce((sum, d) => sum + (d.investor_count || 0), 0)}
            </div>
            <div className="text-sm text-white/80">Investors</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">
              {formatPercentage(deals.reduce((sum, d) => sum + (d.expected_roi || 0), 0) / deals.length)}
            </div>
            <div className="text-sm text-white/80">Avg. ROI</div>
          </div>
        </div>
      </div>

      {/* Closing Soon - Urgency Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ⏰ Closing Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Don't miss out on these limited-time opportunities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {closingSoonDeals.map((deal) => (
            <Link key={deal.id} href={`/deals/${deal.id}`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-red-200 dark:border-red-900 relative overflow-hidden">
                {/* Urgency Banner */}
                <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                  CLOSING SOON
                </div>

                <div className="p-6">
                  <div className="text-xs text-primary-600 font-semibold mb-2">{getDealTypeLabel(deal.type)}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{deal.title}</h3>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-600">{formatPercentage(deal.expected_roi || 0)}</span>
                      <span className="text-sm text-gray-500">ROI</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Min. Investment:</span>
                      <span className="font-bold">{formatCurrency(deal.min_ticket)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Investors:</span>
                      <span className="font-bold">{deal.investor_count}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 btn-primary">
                    View Deal
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🏆 High Performers
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Deals with exceptional ROI potential</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highPerformers.map((deal, index) => (
            <Link key={deal.id} href={`/deals/${deal.id}`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
                {/* Rank Badge */}
                {index === 0 && (
                  <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg z-10">
                    <span className="text-white font-bold text-lg">#{index + 1}</span>
                  </div>
                )}

                <div className={`p-6 ${index === 0 ? 'pt-20' : ''}`}>
                  <div className="text-xs text-primary-600 font-semibold mb-2">{getDealTypeLabel(deal.type)}</div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">{deal.title}</h3>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-600">{formatPercentage(deal.expected_roi || 0)}</span>
                    </div>
                    <div className="text-xs text-gray-500">Expected ROI</div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Min. Investment:</span>
                      <span className="font-bold">{formatCurrency(deal.min_ticket)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Now */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📈 Trending Now
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Most popular deals among investors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingDeals.map((deal) => (
            <Link key={deal.id} href={`/deals/${deal.id}`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer">
                <div className="p-6">
                  {/* Trending Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full">
                      🔥 TRENDING
                    </span>
                  </div>

                  <div className="text-xs text-primary-600 font-semibold mb-2">{getDealTypeLabel(deal.type)}</div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">{deal.title}</h3>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-green-600">{formatPercentage(deal.expected_roi || 0)}</span>
                      <span className="text-sm text-gray-500">ROI</span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    {deal.investor_count} investors joined
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Investing?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of investors building wealth through fractional ownership
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/deals">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
              Explore All Deals
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition border border-white/30">
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
