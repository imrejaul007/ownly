'use client';

import { useState, useEffect } from 'react';
import { dealAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building, Briefcase, Rocket, Gem, TrendingUp, MapPin,
  Clock, DollarSign, BarChart3, Shield, Search, Filter as FilterIcon,
  X, CheckCircle, Home, Zap, AlertCircle
} from 'lucide-react';

export default function DealsPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    minRoi: '',
    maxRoi: '',
    search: '',
  });

  useEffect(() => {
    fetchDeals();
  }, [filters]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.minRoi) params.minRoi = filters.minRoi;
      if (filters.maxRoi) params.maxRoi = filters.maxRoi;
      if (filters.search) params.search = filters.search;

      const response = await dealAPI.list(params);
      setDeals(response.data.data || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (level: string) => {
    const colors: any = {
      'Low Risk': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Medium Risk': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'High Risk': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'Very High Risk': 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return colors[level] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getTypeConfig = (type: string) => {
    const configs: any = {
      real_estate: { label: 'Real Estate', icon: Building, color: 'from-blue-500 to-cyan-500' },
      franchise: { label: 'Franchise', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
      startup: { label: 'Startup', icon: Rocket, color: 'from-green-500 to-emerald-500' },
      asset: { label: 'Asset', icon: Gem, color: 'from-yellow-500 to-orange-500' },
    };
    return configs[type] || { label: type, icon: Building, color: 'from-gray-500 to-gray-600' };
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      open: 'bg-green-500/10 text-green-400 border-green-500/20',
      funded: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      failed: 'bg-red-500/10 text-red-400 border-red-500/20',
      closed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      minRoi: '',
      maxRoi: '',
      search: '',
    });
  };

  const toggleDealSelection = (dealId: string) => {
    setSelectedDeals(prev =>
      prev.includes(dealId)
        ? prev.filter(id => id !== dealId)
        : prev.length < 4
          ? [...prev, dealId]
          : prev
    );
  };

  const handleCompareDeals = () => {
    if (selectedDeals.length >= 2) {
      router.push(`/deals/compare?ids=${selectedDeals.join(',')}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
                Investment Opportunities
              </h1>
              <p className="text-xl text-purple-200 max-w-3xl">
                Discover fractional ownership opportunities across multiple asset classes
              </p>
            </div>
            <Link href="/deals/compare">
              <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                <BarChart3 className="w-5 h-5" />
                Compare Deals
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Asset Categories - Quick Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8 -mt-8">
          <button
            onClick={() => setFilters({ ...filters, type: 'franchise' })}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:border-purple-500/30 transition-all ${
              filters.type === 'franchise' ? 'ring-2 ring-purple-500 bg-purple-500/10' : ''
            }`}
          >
            <Briefcase className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">Franchise</div>
          </button>
          <button
            onClick={() => setFilters({ ...filters, type: 'real_estate' })}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:border-blue-500/30 transition-all ${
              filters.type === 'real_estate' ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
            }`}
          >
            <Building className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">Real Estate</div>
          </button>
          <button
            onClick={() => setFilters({ ...filters, type: 'asset' })}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:border-yellow-500/30 transition-all ${
              filters.type === 'asset' ? 'ring-2 ring-yellow-500 bg-yellow-500/10' : ''
            }`}
          >
            <Gem className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">Luxury Assets</div>
          </button>
          <button
            onClick={() => setFilters({ ...filters, type: 'startup' })}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:border-green-500/30 transition-all ${
              filters.type === 'startup' ? 'ring-2 ring-green-500 bg-green-500/10' : ''
            }`}
          >
            <Rocket className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">Tech Ventures</div>
          </button>
          <button
            onClick={() => setFilters({ ...filters, minRoi: '10' })}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:border-pink-500/30 transition-all ${
              filters.minRoi === '10' ? 'ring-2 ring-pink-500 bg-pink-500/10' : ''
            }`}
          >
            <Home className="w-6 h-6 text-pink-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">Rental Yield</div>
          </button>
          <button
            onClick={() => setFilters({ ...filters, status: 'open' })}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:border-orange-500/30 transition-all ${
              filters.status === 'open' ? 'ring-2 ring-orange-500 bg-orange-500/10' : ''
            }`}
          >
            <Zap className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">Open Now</div>
          </button>
          <button
            onClick={() => setFilters({ ...filters, minRoi: '15' })}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:border-indigo-500/30 transition-all ${
              filters.minRoi === '15' ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : ''
            }`}
          >
            <TrendingUp className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">High Yield</div>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FilterIcon className="w-5 h-5 text-purple-300" />
            <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search deals..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Asset Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="">All Types</option>
                <option value="real_estate">Real Estate</option>
                <option value="franchise">Franchise</option>
                <option value="startup">Startup</option>
                <option value="asset">Asset</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="funded">Funded</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Min ROI %</label>
              <input
                type="number"
                value={filters.minRoi}
                onChange={(e) => setFilters({ ...filters, minRoi: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Max ROI %</label>
              <input
                type="number"
                value={filters.maxRoi}
                onChange={(e) => setFilters({ ...filters, maxRoi: e.target.value })}
                placeholder="100"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm text-purple-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-purple-200">
            Showing <span className="font-semibold text-white">{deals.length}</span> investment opportunities
          </p>
        </div>

        {/* Deals Grid */}
        {deals.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
            <p className="text-purple-200 text-lg">No deals found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => {
              const minInvestment = parseFloat(deal.min_ticket?.toString() || '0');
              const targetAmount = parseFloat(deal.target_amount?.toString() || '0');
              const expectedROI = parseFloat(deal.expected_roi?.toString() || '0');
              const monthlyIncome = (minInvestment * (expectedROI / 100)) / 12;
              const dealTotalMonthlyEarning = (targetAmount * (expectedROI / 100)) / 12;
              const isSelected = selectedDeals.includes(deal.id);
              const typeConfig = getTypeConfig(deal.type);
              const TypeIcon = typeConfig.icon;

              return (
                <div
                  key={deal.id}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:scale-105"
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-20">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDealSelection(deal.id);
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-white/10 backdrop-blur-sm hover:bg-purple-600/50 text-white border border-white/20'
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <div className="w-3 h-3 border-2 border-white rounded"></div>
                      )}
                    </button>
                  </div>

                  <Link href={`/deals/${deal.id}`}>
                    {/* Deal Image */}
                    <div className={`relative h-56 bg-gradient-to-br ${typeConfig.color}`}>
                      {deal.images && deal.images[0] && (
                        <img
                          src={deal.images[0]}
                          alt={deal.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm border ${getStatusColor(deal.status)}`}>
                          {deal.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Monthly Income Banner */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-lg">
                          <div className="mb-2 pb-2 border-b border-gray-200">
                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              Deal Generates Monthly
                            </div>
                            <div className="text-sm font-bold text-indigo-600">
                              {formatCurrency(dealTotalMonthlyEarning)}/mo
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                Your Potential (min)
                              </div>
                              <div className="text-lg font-bold text-green-600">
                                {formatCurrency(monthlyIncome)}/mo
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-600 mb-1">Expected ROI</div>
                              <div className="text-xl font-bold text-purple-600">
                                {expectedROI}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Type Badge */}
                      <div className="mb-3">
                        <span className={`inline-flex items-center gap-1 bg-gradient-to-r ${typeConfig.color} bg-clip-text text-transparent px-3 py-1 rounded-lg text-xs font-semibold border border-white/20 bg-white/5`}>
                          <TypeIcon className="w-3 h-3" />
                          {typeConfig.label}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 text-white">{deal.title}</h3>

                      {/* Location */}
                      <p className="text-sm text-purple-200 mb-4 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {deal.location} • {deal.jurisdiction}
                      </p>

                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="text-xs text-blue-300 flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" />
                            Holding Period
                          </div>
                          <div className="text-lg font-bold text-blue-400">{deal.holding_period_months}mo</div>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="text-xs text-purple-300 flex items-center gap-1 mb-1">
                            <DollarSign className="w-3 h-3" />
                            Min. Investment
                          </div>
                          <div className="text-sm font-bold text-purple-400">{formatCurrency(deal.min_ticket)}</div>
                        </div>
                      </div>

                      {/* Funding Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-purple-200">Funding Progress</span>
                          <span className="font-semibold text-white">
                            {Math.round((parseFloat(deal.raised_amount || '0') / parseFloat(deal.target_amount || '1')) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/10">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, (parseFloat(deal.raised_amount || '0') / parseFloat(deal.target_amount || '1')) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1 text-purple-300">
                          <span>{formatCurrency(deal.raised_amount || 0)}</span>
                          <span>{formatCurrency(deal.target_amount)}</span>
                        </div>
                      </div>

                      {/* Risk Badge */}
                      {deal.risk_badge && (
                        <div className="mb-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border ${getRiskBadgeColor(deal.risk_badge.level)}`}>
                            <Shield className="w-3 h-3" />
                            {deal.risk_badge.level}
                          </span>
                        </div>
                      )}

                      {/* CTA Button */}
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                        View Details
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Compare Button */}
        {selectedDeals.length > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 p-4 min-w-[280px] backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-white">
                    {selectedDeals.length} deal{selectedDeals.length > 1 ? 's' : ''} selected
                  </div>
                  <div className="text-xs text-purple-300">
                    {selectedDeals.length < 2 ? 'Select at least 2 to compare' : 'Ready to compare!'}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDeals([])}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleCompareDeals}
                disabled={selectedDeals.length < 2}
                className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedDeals.length >= 2
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                    : 'bg-white/5 text-purple-400 cursor-not-allowed border border-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Compare Deals
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
