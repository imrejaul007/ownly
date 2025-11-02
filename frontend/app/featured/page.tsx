'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dealAPI } from '@/lib/api';
import { formatPercentage, getDealTypeLabel } from '@/lib/utils';
import { usePreferences } from '@/context/PreferencesContext';
import {
  Sparkles, Clock, TrendingUp, Users, Award, ChevronRight,
  Flame, Target, BarChart3, ArrowRight, Zap, Calendar, DollarSign, Tag
} from 'lucide-react';

export default function FeaturedOpportunitiesPage() {
  const { formatCurrency } = usePreferences();
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
      {/* Animated Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6 border border-white/30 shadow-lg">
              <Flame className="w-4 h-4" />
              Featured Opportunities
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent mb-6 leading-tight">
              Discover Your Next
              <br />
              Investment Opportunity
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Hand-picked deals with exceptional returns, verified by our team of experts
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/deals">
                <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-2xl hover:scale-105 hover:shadow-white/30">
                  <BarChart3 className="w-5 h-5" />
                  Browse All Deals
                </button>
              </Link>
              <Link href="/calculator">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all border-2 border-white/30 flex items-center gap-2 hover:scale-105 shadow-lg">
                  <Target className="w-5 h-5" />
                  ROI Calculator
                </button>
              </Link>
            </div>
          </div>

          {/* Floating Stats with Glassmorphism */}
          <div className="absolute bottom-8 right-8 hidden lg:grid grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-5 text-center border border-white/30 shadow-2xl hover:bg-white/30 transition-all hover:scale-105">
              <div className="text-3xl font-bold text-white">{deals.length}</div>
              <div className="text-sm text-white/90 font-medium mt-1">Active Deals</div>
            </div>
            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-5 text-center border border-white/30 shadow-2xl hover:bg-white/30 transition-all hover:scale-105">
              <div className="text-3xl font-bold text-white">
                {deals.reduce((sum, d) => sum + (d.investor_count || 0), 0)}
              </div>
              <div className="text-sm text-white/90 font-medium mt-1">Investors</div>
            </div>
            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-5 text-center border border-white/30 shadow-2xl hover:bg-white/30 transition-all hover:scale-105">
              <div className="text-3xl font-bold text-white">
                {formatPercentage(deals.reduce((sum, d) => sum + (d.expected_roi || 0), 0) / deals.length)}
              </div>
              <div className="text-sm text-white/90 font-medium mt-1">Avg. ROI</div>
            </div>
          </div>
        </div>

        {/* Closing Soon - Urgency Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-red-100 to-orange-100 bg-clip-text text-transparent">
                  Closing Soon
                </h2>
              </div>
              <p className="text-purple-200 text-lg">Don't miss out on these limited-time opportunities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {closingSoonDeals.length === 0 ? (
              <div className="col-span-3 text-center py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <Clock className="w-16 h-16 text-red-300 mx-auto mb-4 opacity-50" />
                <p className="text-purple-200 text-lg mb-2">No deals closing soon</p>
                <p className="text-purple-300 text-sm mb-6">Check back later for time-sensitive opportunities</p>
                <Link href="/deals">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105">
                    Browse All Deals
                  </button>
                </Link>
              </div>
            ) : (
              closingSoonDeals.map((deal) => (
                <Link key={deal.id} href={`/deals/${deal.id}`}>
                  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-red-500/30 hover:border-red-500/50 transition-all cursor-pointer relative overflow-hidden shadow-2xl hover:scale-[1.03] hover:shadow-red-500/20 duration-300">
                  {/* Urgency Banner */}
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1.5 text-xs font-bold rounded-bl-xl flex items-center gap-1 shadow-lg">
                    <Calendar className="w-3 h-3" />
                    CLOSING SOON
                  </div>

                  <div className="p-6 pt-10">
                    <div className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">{getDealTypeLabel(deal.type)}</div>

                    {/* Category & Subcategory Badges */}
                    {(deal.category || deal.subcategory) && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {deal.category && (
                          <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                            <Tag className="w-3 h-3" />
                            {deal.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        )}
                        {deal.subcategory && (
                          <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                            {deal.subcategory.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        )}
                      </div>
                    )}

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

                    <button className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-xl font-bold hover:shadow-2xl hover:shadow-red-500/40 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                      View Deal
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Link>
              ))
            )}
          </div>
        </div>

        {/* High Performers */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent">
                  High Performers
                </h2>
              </div>
              <p className="text-purple-200 text-lg">Deals with exceptional ROI potential</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highPerformers.length === 0 ? (
              <div className="col-span-4 text-center py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <Award className="w-16 h-16 text-yellow-300 mx-auto mb-4 opacity-50" />
                <p className="text-purple-200 text-lg mb-2">No high performers available</p>
                <p className="text-purple-300 text-sm mb-6">Deals with exceptional ROI will appear here</p>
                <Link href="/deals">
                  <button className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all hover:scale-105">
                    Explore All Deals
                  </button>
                </Link>
              </div>
            ) : (
              highPerformers.map((deal, index) => (
                <Link key={deal.id} href={`/deals/${deal.id}`}>
                  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-yellow-500/50 transition-all cursor-pointer relative overflow-hidden shadow-2xl hover:scale-[1.03] hover:shadow-yellow-500/20 duration-300">
                  {/* Rank Badge */}
                  {index === 0 && (
                    <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 z-10">
                      <span className="text-white font-bold text-lg">#{index + 1}</span>
                    </div>
                  )}

                  <div className={`p-6 ${index === 0 ? 'pt-20' : ''}`}>
                    <div className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">{getDealTypeLabel(deal.type)}</div>

                    {/* Category & Subcategory Badges */}
                    {(deal.category || deal.subcategory) && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {deal.category && (
                          <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                            <Tag className="w-3 h-3" />
                            {deal.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        )}
                        {deal.subcategory && (
                          <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                            {deal.subcategory.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        )}
                      </div>
                    )}

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
              ))
            )}
          </div>
        </div>

        {/* Trending Now */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent">
                  Trending Now
                </h2>
              </div>
              <p className="text-purple-200 text-lg">Most popular deals among investors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDeals.length === 0 ? (
              <div className="col-span-4 text-center py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <TrendingUp className="w-16 h-16 text-pink-300 mx-auto mb-4 opacity-50" />
                <p className="text-purple-200 text-lg mb-2">No trending deals right now</p>
                <p className="text-purple-300 text-sm mb-6">Popular deals among investors will appear here</p>
                <Link href="/deals">
                  <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-105">
                    View All Deals
                  </button>
                </Link>
              </div>
            ) : (
              trendingDeals.map((deal) => (
                <Link key={deal.id} href={`/deals/${deal.id}`}>
                  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer shadow-2xl hover:scale-[1.03] hover:shadow-pink-500/20 duration-300">
                  <div className="p-6">
                    {/* Trending Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        TRENDING
                      </span>
                    </div>

                    <div className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">{getDealTypeLabel(deal.type)}</div>

                    {/* Category & Subcategory Badges */}
                    {(deal.category || deal.subcategory) && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {deal.category && (
                          <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                            <Tag className="w-3 h-3" />
                            {deal.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        )}
                        {deal.subcategory && (
                          <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                            {deal.subcategory.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        )}
                      </div>
                    )}

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
              ))
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 md:p-16 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent mb-4">
              Ready to Start Investing?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
              Join thousands of investors building wealth through fractional ownership
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/deals">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-2xl hover:scale-105 hover:shadow-white/30">
                  <Zap className="w-5 h-5" />
                  Explore All Deals
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-xl text-white rounded-xl font-bold hover:bg-white/30 transition-all border-2 border-white/30 flex items-center gap-2 hover:scale-105 shadow-lg">
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
