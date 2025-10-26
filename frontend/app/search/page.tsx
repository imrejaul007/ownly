'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercentage, getDealTypeLabel } from '@/lib/utils';
import {
  Search, Filter, SlidersHorizontal, TrendingUp, Building, Store, Rocket,
  MapPin, DollarSign, Calendar, Users, Star, History, Bookmark, X,
  ArrowUpDown, ChevronDown, Zap, Target, Flame, Clock, Eye, ArrowRight
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  dealType: string;
  expectedROI: number;
  minInvestment: number;
  maxInvestment: number;
  location: string;
  investorCount: number;
  fundingProgress: number;
  daysLeft: number;
  trending: boolean;
  featured: boolean;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [roiRange, setRoiRange] = useState<[number, number]>([0, 100]);
  const [investmentRange, setInvestmentRange] = useState<[number, number]>([0, 500000]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'roi' | 'popularity' | 'closing' | 'newest'>('popularity');
  const [fundingStatus, setFundingStatus] = useState<string>('all');

  useEffect(() => {
    // Load demo deals
    const demoDeals: Deal[] = [
      {
        id: '1',
        title: 'Dubai Marina Luxury Tower',
        dealType: 'real_estate',
        expectedROI: 28.5,
        minInvestment: 50000,
        maxInvestment: 500000,
        location: 'Dubai Marina',
        investorCount: 142,
        fundingProgress: 78,
        daysLeft: 12,
        trending: true,
        featured: true,
      },
      {
        id: '2',
        title: 'Coffee Shop Franchise Chain',
        dealType: 'franchise',
        expectedROI: 35.2,
        minInvestment: 25000,
        maxInvestment: 200000,
        location: 'Abu Dhabi',
        investorCount: 89,
        fundingProgress: 92,
        daysLeft: 5,
        trending: true,
        featured: false,
      },
      {
        id: '3',
        title: 'AI Tech Startup Fund',
        dealType: 'startup',
        expectedROI: 45.0,
        minInvestment: 10000,
        maxInvestment: 100000,
        location: 'Dubai',
        investorCount: 234,
        fundingProgress: 65,
        daysLeft: 18,
        trending: false,
        featured: true,
      },
      {
        id: '4',
        title: 'Shopping Mall Retail Space',
        dealType: 'real_estate',
        expectedROI: 22.8,
        minInvestment: 75000,
        maxInvestment: 300000,
        location: 'Sharjah',
        investorCount: 67,
        fundingProgress: 45,
        daysLeft: 25,
        trending: false,
        featured: false,
      },
      {
        id: '5',
        title: 'Fast Food Franchise',
        dealType: 'franchise',
        expectedROI: 31.5,
        minInvestment: 30000,
        maxInvestment: 150000,
        location: 'Dubai',
        investorCount: 156,
        fundingProgress: 88,
        daysLeft: 8,
        trending: true,
        featured: true,
      },
      {
        id: '6',
        title: 'FinTech Startup',
        dealType: 'startup',
        expectedROI: 52.0,
        minInvestment: 15000,
        maxInvestment: 120000,
        location: 'Abu Dhabi',
        investorCount: 198,
        fundingProgress: 71,
        daysLeft: 14,
        trending: false,
        featured: false,
      },
    ];
    setDeals(demoDeals);
    setFilteredDeals(demoDeals);

    // Load recent searches from localStorage
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }

    const storedSaved = localStorage.getItem('savedSearches');
    if (storedSaved) {
      setSavedSearches(JSON.parse(storedSaved));
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedTypes, roiRange, investmentRange, selectedLocations, sortBy, fundingStatus, deals]);

  const applyFilters = () => {
    let filtered = [...deals];

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getDealTypeLabel(deal.dealType).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Deal types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(deal => selectedTypes.includes(deal.dealType));
    }

    // ROI range
    filtered = filtered.filter(deal =>
      deal.expectedROI >= roiRange[0] && deal.expectedROI <= roiRange[1]
    );

    // Investment range
    filtered = filtered.filter(deal =>
      deal.minInvestment >= investmentRange[0] && deal.minInvestment <= investmentRange[1]
    );

    // Locations
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(deal => selectedLocations.includes(deal.location));
    }

    // Funding status
    if (fundingStatus === 'closing_soon') {
      filtered = filtered.filter(deal => deal.daysLeft <= 7);
    } else if (fundingStatus === 'almost_funded') {
      filtered = filtered.filter(deal => deal.fundingProgress >= 80);
    } else if (fundingStatus === 'trending') {
      filtered = filtered.filter(deal => deal.trending);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'roi') return b.expectedROI - a.expectedROI;
      if (sortBy === 'popularity') return b.investorCount - a.investorCount;
      if (sortBy === 'closing') return a.daysLeft - b.daysLeft;
      return 0; // newest
    });

    setFilteredDeals(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const saveCurrentSearch = () => {
    const searchTerm = searchQuery || 'Custom Filter';
    if (!savedSearches.includes(searchTerm)) {
      const updated = [searchTerm, ...savedSearches].slice(0, 10);
      setSavedSearches(updated);
      localStorage.setItem('savedSearches', JSON.stringify(updated));
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setRoiRange([0, 100]);
    setInvestmentRange([0, 500000]);
    setSelectedLocations([]);
    setFundingStatus('all');
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };

  const quickFilters = [
    { label: 'High ROI (30%+)', action: () => setRoiRange([30, 100]) },
    { label: 'Low Entry (<20K)', action: () => setInvestmentRange([0, 20000]) },
    { label: 'Closing Soon', action: () => setFundingStatus('closing_soon') },
    { label: 'Almost Funded', action: () => setFundingStatus('almost_funded') },
  ];

  const dealTypes = [
    { id: 'real_estate', label: 'Real Estate', icon: Building, color: 'blue' },
    { id: 'franchise', label: 'Franchises', icon: Store, color: 'green' },
    { id: 'startup', label: 'Startups', icon: Rocket, color: 'orange' },
  ];

  const locations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Dubai Marina'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20 lg:pb-8">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                Search & Discovery
              </h1>
              <p className="text-purple-300">Find your perfect investment opportunity</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search deals, locations, or categories..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-32 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  showFilters
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-purple-300 hover:bg-white/10'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchQuery && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <History className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400">Recent:</span>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
                  className="px-3 py-1 bg-white/5 rounded-full text-sm text-purple-200 hover:bg-white/10 transition-all"
                >
                  {search}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {quickFilters.map((filter, index) => (
            <button
              key={index}
              onClick={filter.action}
              className="px-4 py-2 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 text-purple-200 hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Advanced Filters
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={saveCurrentSearch}
                  className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4" />
                  Save Search
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Deal Types */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">Deal Type</label>
                <div className="space-y-2">
                  {dealTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => toggleType(type.id)}
                        className={`w-full px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                          selectedTypes.includes(type.id)
                            ? `bg-${type.color}-500/20 border-${type.color}-500/50 text-${type.color}-300`
                            : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ROI Range */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">
                  Expected ROI: {roiRange[0]}% - {roiRange[1]}%
                </label>
                <div className="space-y-4">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={roiRange[0]}
                      onChange={(e) => setRoiRange([parseInt(e.target.value), roiRange[1]])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-purple-400 mt-1">
                      <span>Min: {roiRange[0]}%</span>
                    </div>
                  </div>
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={roiRange[1]}
                      onChange={(e) => setRoiRange([roiRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-purple-400 mt-1">
                      <span>Max: {roiRange[1]}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investment Range */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">
                  Investment Amount: {formatCurrency(investmentRange[0])} - {formatCurrency(investmentRange[1])}
                </label>
                <div className="space-y-4">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="5000"
                      value={investmentRange[0]}
                      onChange={(e) => setInvestmentRange([parseInt(e.target.value), investmentRange[1]])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-purple-400 mt-1">
                      <span>Min: {formatCurrency(investmentRange[0])}</span>
                    </div>
                  </div>
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="5000"
                      value={investmentRange[1]}
                      onChange={(e) => setInvestmentRange([investmentRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-purple-400 mt-1">
                      <span>Max: {formatCurrency(investmentRange[1])}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">Location</label>
                <div className="space-y-2">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => toggleLocation(location)}
                      className={`w-full px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                        selectedLocations.includes(location)
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                          : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/10'
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                      <span className="font-medium">{location}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Funding Status */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">Status</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Deals', icon: Target },
                    { value: 'closing_soon', label: 'Closing Soon', icon: Clock },
                    { value: 'almost_funded', label: 'Almost Funded', icon: Flame },
                    { value: 'trending', label: 'Trending', icon: TrendingUp },
                  ].map((status) => {
                    const Icon = status.icon;
                    return (
                      <button
                        key={status.value}
                        onClick={() => setFundingStatus(status.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
                          fundingStatus === status.value
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                            : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{status.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="roi">Highest ROI</option>
                  <option value="closing">Closing Soon</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-white">
            <span className="text-2xl font-bold">{filteredDeals.length}</span>
            <span className="text-purple-300 ml-2">deals found</span>
          </div>
          <button
            onClick={() => setSortBy(sortBy === 'roi' ? 'popularity' : 'roi')}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-purple-200 hover:bg-white/10 transition-all"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort: {sortBy === 'roi' ? 'ROI' : sortBy === 'popularity' ? 'Popular' : sortBy === 'closing' ? 'Closing' : 'Newest'}
          </button>
        </div>

        {/* Results Grid */}
        {filteredDeals.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
            <Search className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
            <p className="text-purple-200 text-lg mb-4">No deals match your criteria</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-purple-500/30 transition-all overflow-hidden">
                <div className="p-6">
                  {/* Header Badges */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-semibold border border-blue-500/30">
                      {getDealTypeLabel(deal.dealType)}
                    </span>
                    <div className="flex gap-2">
                      {deal.trending && (
                        <div className="px-2 py-1 bg-orange-500/20 rounded-full">
                          <Flame className="w-4 h-4 text-orange-400" />
                        </div>
                      )}
                      {deal.featured && (
                        <div className="px-2 py-1 bg-yellow-500/20 rounded-full">
                          <Star className="w-4 h-4 text-yellow-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {deal.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-purple-300 mb-4">
                    <MapPin className="w-4 h-4" />
                    {deal.location}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                      <div className="text-xs text-green-400 mb-1">Expected ROI</div>
                      <div className="text-2xl font-bold text-green-400">{deal.expectedROI}%</div>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
                      <div className="text-xs text-blue-400 mb-1">Min. Investment</div>
                      <div className="text-lg font-bold text-blue-400">{formatCurrency(deal.minInvestment)}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-purple-300">{deal.fundingProgress}% funded</span>
                      <span className="text-purple-300">{deal.daysLeft} days left</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
                        style={{ width: `${deal.fundingProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-purple-200 text-sm">
                      <Users className="w-4 h-4" />
                      {deal.investorCount} investors
                    </div>
                    <Link href={`/deals/${deal.id}`}>
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-all flex items-center gap-2">
                        View
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-blue-400" />
              Saved Searches
            </h3>
            <div className="flex flex-wrap gap-3">
              {savedSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
                  className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all flex items-center gap-2"
                >
                  {search}
                  <X
                    className="w-4 h-4 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = savedSearches.filter((_, i) => i !== index);
                      setSavedSearches(updated);
                      localStorage.setItem('savedSearches', JSON.stringify(updated));
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
