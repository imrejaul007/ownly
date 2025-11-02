'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2, Car, Compass, Utensils, Heart, Store, GraduationCap,
  Film, Laptop, Home, Calendar, Leaf, ShoppingCart, Truck, Factory,
  Briefcase, TrendingUp, Users, BarChart3, Search, Sparkles, ChevronRight
} from 'lucide-react';

interface CategoryShowcaseProps {
  onCategorySelect?: (categoryKey: string) => void;
  selectedCategory?: string;
  useNavigation?: boolean; // If true, navigate to category pages instead of filtering
}

// Static categories - all 20 master categories
const CATEGORIES = [
  { key: 'real_estate', label: 'Real Estate & Property', icon: Building2, description: 'Property investments including residential, commercial, and hospitality' },
  { key: 'mobility_transport', label: 'Mobility & Transport', icon: Car, description: 'Vehicle rental, fleet management, and transport services' },
  { key: 'hospitality_tourism', label: 'Hospitality & Tourism', icon: Compass, description: 'Travel, tourism, and hospitality businesses' },
  { key: 'food_beverage', label: 'Food & Beverage', icon: Utensils, description: 'Halal-only food and beverage businesses' },
  { key: 'health_wellness', label: 'Health, Beauty & Wellness', icon: Heart, description: 'Healthcare, beauty, and wellness services' },
  { key: 'retail_franchises', label: 'Retail & Franchises', icon: Store, description: 'Retail stores and franchise opportunities' },
  { key: 'education_training', label: 'Education & Training', icon: GraduationCap, description: 'Educational institutions and training centers' },
  { key: 'media_entertainment', label: 'Media, Marketing & Entertainment', icon: Film, description: 'Media production, marketing, and family entertainment' },
  { key: 'technology_innovation', label: 'Technology & Innovation', icon: Laptop, description: 'Tech startups and innovative solutions' },
  { key: 'home_services', label: 'Home Services & Lifestyle', icon: Home, description: 'Home maintenance and lifestyle services' },
  { key: 'events_experiences', label: 'Events, Experiences & Entertainment', icon: Calendar, description: 'Event management and experiential entertainment' },
  { key: 'agriculture_sustainable', label: 'Agriculture & Sustainable Projects', icon: Leaf, description: 'Agricultural and sustainability-focused investments' },
  { key: 'ecommerce_digital', label: 'E-commerce & Digital Ventures', icon: ShoppingCart, description: 'Online retail and digital business models' },
  { key: 'logistics_supply_chain', label: 'Logistics & Supply Chain', icon: Truck, description: 'Logistics, warehousing, and supply chain management' },
  { key: 'manufacturing_production', label: 'Manufacturing & Production', icon: Factory, description: 'Manufacturing and production facilities' },
  { key: 'micro_investment_baskets', label: 'Smart Micro-Investment Baskets', icon: Briefcase, description: 'Diversified investment baskets and SIP plans' },
  { key: 'secondary_market', label: 'Secondary Market Deals', icon: TrendingUp, description: 'Resale and trading of existing investments' },
  { key: 'bundles_thematic', label: 'Bundles & Thematic Funds', icon: Briefcase, description: 'Curated investment bundles with specific themes' },
  { key: 'community_impact', label: 'Community & Impact Projects', icon: Users, description: 'Social enterprises and community-focused investments' },
  { key: 'ownly_exchange', label: 'OWNLY Exchange & Secondary Assets', icon: BarChart3, description: 'Marketplace for trading certified investment assets' },
];

const getCategoryGradient = (index: number) => {
  const gradients = [
    'from-blue-500 via-blue-600 to-cyan-600',
    'from-purple-500 via-purple-600 to-pink-600',
    'from-green-500 via-green-600 to-emerald-600',
    'from-orange-500 via-orange-600 to-red-600',
    'from-indigo-500 via-indigo-600 to-purple-600',
    'from-pink-500 via-pink-600 to-rose-600',
    'from-yellow-500 via-yellow-600 to-orange-600',
    'from-teal-500 via-teal-600 to-cyan-600',
    'from-red-500 via-red-600 to-pink-600',
    'from-cyan-500 via-cyan-600 to-blue-600',
  ];
  return gradients[index % gradients.length];
};

export default function CategoryShowcase({ onCategorySelect, selectedCategory, useNavigation = false }: CategoryShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedCategories = showAll ? filteredCategories : filteredCategories.slice(0, 12);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent mb-2">
            Explore Investment Categories
          </h2>
          <p className="text-purple-200">
            All investments are 100% Shariah-compliant across {CATEGORIES.length} master categories
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50 transition-all"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedCategories.map((category, index) => {
          const IconComponent = category.icon;
          const gradient = getCategoryGradient(index);
          const isSelected = selectedCategory === category.key;

          const content = (
            <>
              {/* Background Gradient Orb */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`}></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`mb-4 inline-flex p-3 rounded-xl ${
                  isSelected
                    ? 'bg-white/20'
                    : 'bg-gradient-to-br ' + gradient + ' bg-opacity-10'
                }`}>
                  <IconComponent className={`w-6 h-6 ${
                    isSelected ? 'text-white' : 'text-white/90'
                  }`} />
                </div>

                {/* Label */}
                <h3 className={`text-lg font-bold mb-2 ${
                  isSelected ? 'text-white' : 'text-white group-hover:text-purple-100'
                }`}>
                  {category.label}
                </h3>

                {/* Description */}
                <p className={`text-sm mb-3 line-clamp-2 ${
                  isSelected ? 'text-white/80' : 'text-purple-200'
                }`}>
                  {category.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    isSelected ? 'text-white/90' : 'text-green-400'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    Shariah ✓
                  </div>

                  <div className={`flex items-center gap-1 text-xs font-semibold ${
                    isSelected ? 'text-white' : 'text-purple-300 group-hover:text-purple-100'
                  }`}>
                    Explore
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="bg-white/30 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-white border border-white/30">
                    ACTIVE
                  </div>
                </div>
              )}
            </>
          );

          return useNavigation ? (
            <Link
              key={category.key}
              href={`/category/${category.key}`}
              className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 block ${
                isSelected
                  ? 'bg-gradient-to-br ' + gradient + ' shadow-2xl ring-2 ring-white/50'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10'
              }`}
            >
              {content}
            </Link>
          ) : (
            <button
              key={category.key}
              onClick={() => onCategorySelect && onCategorySelect(category.key)}
              className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 ${
                isSelected
                  ? 'bg-gradient-to-br ' + gradient + ' shadow-2xl ring-2 ring-white/50'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10'
              }`}
            >
              {content}
            </button>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {filteredCategories.length > 12 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2"
          >
            {showAll ? 'Show Less' : `Show All ${filteredCategories.length} Categories`}
            <ChevronRight className={`w-5 h-5 transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </button>
        </div>
      )}

      {/* No Results */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
          <p className="text-purple-200 text-lg">No categories found matching "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
