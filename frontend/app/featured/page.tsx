'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dealAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, getDealTypeLabel } from '@/lib/utils';
import {
  Sparkles, Clock, TrendingUp, Users, Award, ChevronRight,
  Flame, Target, BarChart3, ArrowRight, Zap, Calendar, DollarSign
} from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading featured opportunities...</p>
        </div>
      </div>
    );
  }

  const topDeals = getTopDeals();
  const trendingDeals = getTrendingDeals();
  const closingSoonDeals = getClosingSoon();
  const highPerformers = getHighPerformers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-2xl p-12 mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-4 border border-white/30">
              <Flame className="w-4 h-4" />
              Featured Opportunities
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Discover Your Next
              <br />
              Investment Opportunity
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Hand-picked deals with exceptional returns, verified by our team of experts
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/deals">
                <button className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg hover:scale-105">
                  <BarChart3 className="w-5 h-5" />
                  Browse All Deals
                </button>
              </Link>
              <Link href="/calculator">
                <button className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30 flex items-center gap-2 hover:scale-105">
                  <Target className="w-5 h-5" />
                  ROI Calculator
                </button>
              </Link>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="absolute bottom-8 right-8 hidden lg:grid grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
              <div className="text-3xl font-bold text-white">{deals.length}</div>
              <div className="text-sm text-white/80">Active Deals</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
              <div className="text-3xl font-bold text-white">
                {deals.reduce((sum, d) => sum + (d.investor_count || 0), 0)}
              </div>
              <div className="text-sm text-white/80">Investors</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
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
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-8 h-8 text-red-400" />
                <h2 className="text-3xl font-bold text-white">
                  Closing Soon
                </h2>
              </div>
              <p className="text-purple-200">Don't miss out on these limited-time opportunities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {closingSoonDeals.map((deal) => (
              <Link key={deal.id} href={`/deals/${deal.id}`}>
                <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-red-500/30 hover:border-red-500/50 transition-all cursor-pointer relative overflow-hidden shadow-2xl hover:scale-105 duration-300">
                  {/* Urgency Banner */}
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1.5 text-xs font-bold rounded-bl-xl flex items-center gap-1 shadow-lg">
                    <Calendar className="w-3 h-3" />
                    CLOSING SOON
                  </div>

                  <div className="p-6 pt-10">
                    <div className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">{getDealTypeLabel(deal.type)}</div>
                    <h3 className="text-xl font-bold mb-4 text-white line-clamp-2">{deal.title}</h3>

                    <div className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-green-400">{formatPercentage(deal.expected_roi || 0)}</span>
                        <span className="text-sm text-green-200">ROI</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Min. Investment:
                        </span>
                        <span className="font-bold text-white">{formatCurrency(deal.min_ticket)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Investors:
                        </span>
                        <span className="font-bold text-white">{deal.investor_count}</span>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                      View Deal
                      <ArrowRight className="w-5 h-5" />
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
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold text-white">
                  High Performers
                </h2>
              </div>
              <p className="text-purple-200">Deals with exceptional ROI potential</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highPerformers.map((deal, index) => (
              <Link key={deal.id} href={`/deals/${deal.id}`}>
                <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all cursor-pointer relative overflow-hidden shadow-2xl hover:scale-105 duration-300">
                  {/* Rank Badge */}
                  {index === 0 && (
                    <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 z-10">
                      <span className="text-white font-bold text-lg">#{index + 1}</span>
                    </div>
                  )}

                  <div className={`p-6 ${index === 0 ? 'pt-20' : ''}`}>
                    <div className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">{getDealTypeLabel(deal.type)}</div>
                    <h3 className="text-lg font-bold mb-4 text-white line-clamp-2">{deal.title}</h3>

                    <div className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-green-400">{formatPercentage(deal.expected_roi || 0)}</span>
                      </div>
                      <div className="text-xs text-green-200 mt-1">Expected ROI</div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300">Min. Investment:</span>
                        <span className="font-bold text-white">{formatCurrency(deal.min_ticket)}</span>
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
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-pink-400" />
                <h2 className="text-3xl font-bold text-white">
                  Trending Now
                </h2>
              </div>
              <p className="text-purple-200">Most popular deals among investors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDeals.map((deal) => (
              <Link key={deal.id} href={`/deals/${deal.id}`}>
                <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-pink-500/30 transition-all cursor-pointer shadow-2xl hover:scale-105 duration-300">
                  <div className="p-6">
                    {/* Trending Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        TRENDING
                      </span>
                    </div>

                    <div className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">{getDealTypeLabel(deal.type)}</div>
                    <h3 className="text-lg font-bold mb-4 text-white line-clamp-2">{deal.title}</h3>

                    <div className="mb-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-3 border border-green-500/30">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-green-400">{formatPercentage(deal.expected_roi || 0)}</span>
                        <span className="text-sm text-green-200">ROI</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-purple-200 mb-3">
                      <Users className="w-4 h-4 mr-2" />
                      {deal.investor_count} investors joined
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-yellow-300" />
              <h2 className="text-4xl font-bold text-white">Ready to Start Investing?</h2>
            </div>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of investors building wealth through fractional ownership
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/deals">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg hover:scale-105">
                  <Zap className="w-5 h-5" />
                  Explore All Deals
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all border-2 border-white/30 flex items-center gap-2 hover:scale-105">
                  Create Account
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
