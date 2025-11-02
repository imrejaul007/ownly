'use client';

import { useState, useEffect } from 'react';
import { categoriesAPI } from '@/lib/api';

interface Category {
  key: string;
  label: string;
  icon: string;
  description: string;
  shariah_compliant: boolean;
}

interface Subcategory {
  key: string;
  label: string;
}

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

interface CategoryFilterProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  onCategoryChange: (categoryKey: string | null) => void;
  onSubcategoryChange: (subcategoryKey: string | null) => void;
  compact?: boolean;
  showSearch?: boolean;
}

export default function CategoryFilter({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  compact = false,
  showSearch = true
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getTree();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategories = async (categoryKey: string) => {
    try {
      const response = await categoriesAPI.getSubcategories(categoryKey);
      setSubcategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to load subcategories:', error);
    }
  };

  const handleCategorySelect = (categoryKey: string) => {
    if (selectedCategory === categoryKey) {
      onCategoryChange(null);
      onSubcategoryChange(null);
    } else {
      onCategoryChange(categoryKey);
      onSubcategoryChange(null);
    }
  };

  const handleSubcategorySelect = (subcategoryKey: string) => {
    if (selectedSubcategory === subcategoryKey) {
      onSubcategoryChange(null);
    } else {
      onSubcategoryChange(subcategoryKey);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-white/10 transition-all"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter by Category
              {selectedCategory && <span className="ml-2 px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">{subcategories.length > 0 ? '1' : selectedSubcategory ? '2' : '1'}</span>}
            </span>
          </button>

          {selectedCategory && (
            <button
              onClick={() => {
                onCategoryChange(null);
                onSubcategoryChange(null);
              }}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              Clear filters
            </button>
          )}
        </div>

        {isExpanded && (
          <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg space-y-4">
            {showSearch && (
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {filteredCategories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategorySelect(category.key)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === category.key
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 text-gray-900 dark:text-white hover:bg-white/10'
                  }`}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>

            {subcategories.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-white/10">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Subcategories:</p>
                <div className="flex flex-wrap gap-2">
                  {subcategories.map((sub) => (
                    <button
                      key={sub.key}
                      onClick={() => handleSubcategorySelect(sub.key)}
                      className={`px-2 py-1 rounded-full text-xs transition-all ${
                        selectedSubcategory === sub.key
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      {showSearch && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}

      {/* Active Filters */}
      {(selectedCategory || selectedSubcategory) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-full">
              {categories.find(c => c.key === selectedCategory)?.label}
              <button
                onClick={() => {
                  onCategoryChange(null);
                  onSubcategoryChange(null);
                }}
                className="ml-2 hover:text-gray-200"
              >
                ×
              </button>
            </span>
          )}
          {selectedSubcategory && (
            <span className="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
              {subcategories.find(s => s.key === selectedSubcategory)?.label}
              <button
                onClick={() => onSubcategoryChange(null)}
                className="ml-2 hover:text-gray-200"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={() => {
              onCategoryChange(null);
              onSubcategoryChange(null);
            }}
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredCategories.map((category) => (
          <button
            key={category.key}
            onClick={() => handleCategorySelect(category.key)}
            className={`group relative p-4 rounded-lg border transition-all ${
              selectedCategory === category.key
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-500 shadow-lg shadow-purple-500/50 text-white'
                : 'bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-purple-500/50 text-gray-900 dark:text-white'
            }`}
            title={category.description}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <span className="text-2xl">{category.icon}</span>
              <span className="text-sm font-medium leading-tight">
                {category.label}
              </span>
              {category.shariah_compliant && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === category.key
                    ? 'bg-white/20 text-white'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                }`}>
                  Shariah ✓
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {categories.find(c => c.key === selectedCategory)?.label} - Subcategories
          </h3>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <button
                key={sub.key}
                onClick={() => handleSubcategorySelect(sub.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSubcategory === sub.key
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white/10 text-gray-900 dark:text-white hover:bg-white/20'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
