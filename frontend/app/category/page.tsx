'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dealAPI } from '@/lib/api';
import {
  Building2, Car, Compass, Utensils, Heart, Store, GraduationCap,
  Film, Laptop, Home, Calendar, Leaf, ShoppingCart, Truck, Factory,
  Briefcase, TrendingUp, Users, BarChart3, Sparkles, Target,
  TrendingDown, ChevronRight, Search, Filter, Grid3x3, List
} from 'lucide-react';

// Category data
const CATEGORIES = [
  { key: 'real_estate', label: 'Real Estate & Property', icon: Building2, description: 'Property investments including residential, commercial, and hospitality', gradient: 'from-blue-500 via-blue-600 to-cyan-600' },
  { key: 'mobility_transport', label: 'Mobility & Transport', icon: Car, description: 'Vehicle rental, fleet management, and transport services', gradient: 'from-purple-500 via-purple-600 to-pink-600' },
  { key: 'hospitality_tourism', label: 'Hospitality & Tourism', icon: Compass, description: 'Travel, tourism, and hospitality businesses', gradient: 'from-green-500 via-green-600 to-emerald-600' },
  { key: 'food_beverage', label: 'Food & Beverage', icon: Utensils, description: 'Halal-only food and beverage businesses', gradient: 'from-orange-500 via-orange-600 to-red-600' },
  { key: 'health_wellness', label: 'Health, Beauty & Wellness', icon: Heart, description: 'Healthcare, beauty, and wellness services', gradient: 'from-indigo-500 via-indigo-600 to-purple-600' },
  { key: 'retail_franchises', label: 'Retail & Franchises', icon: Store, description: 'Retail stores and franchise opportunities', gradient: 'from-pink-500 via-pink-600 to-rose-600' },
  { key: 'education_training', label: 'Education & Training', icon: GraduationCap, description: 'Educational institutions and training centers', gradient: 'from-yellow-500 via-yellow-600 to-orange-600' },
  { key: 'media_entertainment', label: 'Media, Marketing & Entertainment', icon: Film, description: 'Media production, marketing, and family entertainment', gradient: 'from-teal-500 via-teal-600 to-cyan-600' },
  { key: 'technology_innovation', label: 'Technology & Innovation', icon: Laptop, description: 'Tech startups and innovative solutions', gradient: 'from-red-500 via-red-600 to-pink-600' },
  { key: 'home_services', label: 'Home Services & Lifestyle', icon: Home, description: 'Home maintenance and lifestyle services', gradient: 'from-cyan-500 via-cyan-600 to-blue-600' },
  { key: 'events_experiences', label: 'Events, Experiences & Entertainment', icon: Calendar, description: 'Event management and experiential entertainment', gradient: 'from-blue-500 via-blue-600 to-cyan-600' },
  { key: 'agriculture_sustainable', label: 'Agriculture & Sustainable Projects', icon: Leaf, description: 'Agricultural and sustainability-focused investments', gradient: 'from-purple-500 via-purple-600 to-pink-600' },
  { key: 'ecommerce_digital', label: 'E-commerce & Digital Ventures', icon: ShoppingCart, description: 'Online retail and digital business models', gradient: 'from-green-500 via-green-600 to-emerald-600' },
  { key: 'logistics_supply_chain', label: 'Logistics & Supply Chain', icon: Truck, description: 'Logistics, warehousing, and supply chain management', gradient: 'from-orange-500 via-orange-600 to-red-600' },
  { key: 'manufacturing_production', label: 'Manufacturing & Production', icon: Factory, description: 'Manufacturing and production facilities', gradient: 'from-indigo-500 via-indigo-600 to-purple-600' },
  { key: 'micro_investment_baskets', label: 'Smart Micro-Investment Baskets', icon: Briefcase, description: 'Diversified investment baskets and SIP plans', gradient: 'from-pink-500 via-pink-600 to-rose-600' },
  { key: 'secondary_market', label: 'Secondary Market Deals', icon: TrendingUp, description: 'Resale and trading of existing investments', gradient: 'from-yellow-500 via-yellow-600 to-orange-600' },
  { key: 'bundles_thematic', label: 'Bundles & Thematic Funds', icon: Briefcase, description: 'Curated investment bundles with specific themes', gradient: 'from-teal-500 via-teal-600 to-cyan-600' },
  { key: 'community_impact', label: 'Community & Impact Projects', icon: Users, description: 'Social enterprises and community-focused investments', gradient: 'from-red-500 via-red-600 to-pink-600' },
  { key: 'ownly_exchange', label: 'OWNLY Exchange & Secondary Assets', icon: BarChart3, description: 'Marketplace for trading certified investment assets', gradient: 'from-cyan-500 via-cyan-600 to-blue-600' },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryStats, setCategoryStats] = useState<Record<string, { count: number; totalFunding: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch deals to calculate category stats
    const loadStats = async () => {
      try {
        const response = await dealAPI.list();
        const deals = response.data.data || response.data;

        // Calculate stats for each category
        const stats: Record<string, { count: number; totalFunding: number }> = {};

        deals.forEach((deal: any) => {
          const categoryKey = deal.category || deal.type;
          if (!stats[categoryKey]) {
            stats[categoryKey] = { count: 0, totalFunding: 0 };
          }
          stats[categoryKey].count++;
          stats[categoryKey].totalFunding += deal.raised_amount || 0;
        });

        setCategoryStats(stats);
      } catch (error) {
        console.error('Error loading category stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Filter categories based on search
  const filteredCategories = CATEGORIES.filter(category =>
    category.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total stats
  const totalCategories = CATEGORIES.length;
  const totalDeals = Object.values(categoryStats).reduce((sum, stat) => sum + stat.count, 0);
  const totalFunding = Object.values(categoryStats).reduce((sum, stat) => sum + stat.totalFunding, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-gray-900 to-black">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Grid3x3 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                Investment Categories
              </h1>
            </div>
            <p className="text-purple-300 text-xl max-w-3xl mx-auto">
              Explore diverse Shariah-compliant investment opportunities across {totalCategories} specialized sectors
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="group relative bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent backdrop-blur-xl rounded-3xl border border-blue-500/20 p-8 shadow-2xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-blue-500/0 to-transparent group-hover:from-blue-600/10 group-hover:via-blue-500/5 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-500">
                    <Grid3x3 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-blue-300 text-sm font-medium mb-2">Total Categories</div>
                <div className="text-4xl font-bold text-white group-hover:text-blue-100 transition-colors">{totalCategories}</div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-purple-600/10 via-purple-500/5 to-transparent backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8 shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-purple-500/0 to-transparent group-hover:from-purple-600/10 group-hover:via-purple-500/5 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-500">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-purple-300 text-sm font-medium mb-2">Active Deals</div>
                <div className="text-4xl font-bold text-white group-hover:text-purple-100 transition-colors">{loading ? '...' : totalDeals}</div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-green-600/10 via-green-500/5 to-transparent backdrop-blur-xl rounded-3xl border border-green-500/20 p-8 shadow-2xl hover:shadow-green-500/20 hover:scale-105 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 via-green-500/0 to-transparent group-hover:from-green-600/10 group-hover:via-green-500/5 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-green-300 text-sm font-medium mb-2">Total Funding</div>
                <div className="text-4xl font-bold text-white group-hover:text-green-100 transition-colors">
                  {loading ? '...' : `AED ${(totalFunding / 1000000).toFixed(1)}M`}
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-500 ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-purple-300 hover:bg-white/10'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-500 ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-purple-300 hover:bg-white/10'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid/List */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-2xl mx-auto">
              <Search className="w-20 h-20 text-purple-400 mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-bold text-white mb-3">
                No Categories Found
              </h3>
              <p className="text-purple-200 mb-6">
                Try adjusting your search terms to find what you're looking for.
              </p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              const stats = categoryStats[category.key] || { count: 0, totalFunding: 0 };

              return (
                <Link
                  key={category.key}
                  href={`/category/${category.key}`}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/50 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  {/* Gradient Header */}
                  <div className={`relative h-32 bg-gradient-to-br ${category.gradient} overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      backgroundSize: '30px 30px'
                    }}></div>
                    <div className="relative flex items-center justify-center h-full">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    {/* Shariah Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                        <Sparkles className="w-3 h-3 text-white" />
                        <span className="text-xs font-bold text-white">Halal</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                      {category.label}
                    </h3>
                    <p className="text-sm text-purple-200 mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                        <div className="text-xs text-purple-300 mb-1">Deals</div>
                        <div className="text-lg font-bold text-white">
                          {loading ? '...' : stats.count}
                        </div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                        <div className="text-xs text-purple-300 mb-1">Funded</div>
                        <div className="text-lg font-bold text-white">
                          {loading ? '...' : `${(stats.totalFunding / 1000).toFixed(0)}K`}
                        </div>
                      </div>
                    </div>

                    {/* Explore Button */}
                    <div className="flex items-center justify-between text-sm text-purple-300 group-hover:text-purple-200 transition-colors">
                      <span>Explore Category</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              const stats = categoryStats[category.key] || { count: 0, totalFunding: 0 };

              return (
                <Link
                  key={category.key}
                  href={`/category/${category.key}`}
                  className="group block bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/50 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="flex items-center gap-6 p-6">
                    {/* Icon */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 flex-shrink-0`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          {category.label}
                        </h3>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 flex-shrink-0">
                          <Sparkles className="w-3 h-3 text-green-400" />
                          <span className="text-xs font-bold text-green-300">Shariah</span>
                        </div>
                      </div>
                      <p className="text-purple-200 mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                          <Target className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-white font-semibold">
                            {loading ? '...' : stats.count} {stats.count === 1 ? 'Deal' : 'Deals'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-white font-semibold">
                            {loading ? '...' : `AED ${(stats.totalFunding / 1000).toFixed(0)}K Funded`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-8 h-8 text-purple-300 group-hover:text-white group-hover:translate-x-2 transition-all flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-3">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-purple-200 mb-6 max-w-2xl">
              Explore all available deals or contact our investment team for personalized recommendations.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-500"
              >
                View All Deals
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 border border-white/10 transition-all duration-500"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
