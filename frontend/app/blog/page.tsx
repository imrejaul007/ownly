'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Calendar, User, TrendingUp, Clock, Tag } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Real Estate Market Outlook 2025: Key Trends to Watch',
    excerpt: 'Discover the major trends shaping real estate investment in 2025, from market dynamics to emerging opportunities.',
    author: 'Michael Chen',
    date: 'December 15, 2024',
    category: 'Market Insights',
    readTime: '8 min',
    image: '/blog/market-2025.jpg',
    featured: true,
    tags: ['Market Analysis', 'Trends', '2025']
  },
  {
    id: 2,
    title: 'Beginner's Guide to Fractional Real Estate Investing',
    excerpt: 'Everything you need to know about getting started with fractional property ownership and building your portfolio.',
    author: 'Sarah Rodriguez',
    date: 'December 12, 2024',
    category: 'Guides',
    readTime: '10 min',
    image: '/blog/beginners-guide.jpg',
    featured: false,
    tags: ['Beginner', 'How To', 'Education']
  },
  {
    id: 3,
    title: 'Tax Benefits of Real Estate Investment: 2024 Guide',
    excerpt: 'Maximize your returns by understanding the tax advantages available to real estate investors.',
    author: 'David Kim',
    date: 'December 10, 2024',
    category: 'Guides',
    readTime: '12 min',
    image: '/blog/tax-benefits.jpg',
    featured: false,
    tags: ['Taxes', 'Finance', 'Strategy']
  },
  {
    id: 4,
    title: 'Multi-Family vs Single-Family: Which is Better?',
    excerpt: 'Compare the pros and cons of different property types to make informed investment decisions.',
    author: 'Jennifer Martinez',
    date: 'December 8, 2024',
    category: 'Market Insights',
    readTime: '7 min',
    image: '/blog/property-comparison.jpg',
    featured: false,
    tags: ['Property Types', 'Comparison', 'Strategy']
  },
  {
    id: 5,
    title: 'OWNLY Surpasses $150M in Total Platform Investment',
    excerpt: 'Major milestone achieved as investor community continues to grow and thrive.',
    author: 'Emily Watson',
    date: 'December 5, 2024',
    category: 'News',
    readTime: '4 min',
    image: '/blog/milestone.jpg',
    featured: true,
    tags: ['Company News', 'Milestone', 'Achievement']
  },
  {
    id: 6,
    title: 'Understanding Cap Rates and Real Estate Valuation',
    excerpt: 'Learn how to evaluate property investments using capitalization rates and other key metrics.',
    author: 'Robert Taylor',
    date: 'December 3, 2024',
    category: 'Guides',
    readTime: '9 min',
    image: '/blog/cap-rates.jpg',
    featured: false,
    tags: ['Metrics', 'Valuation', 'Education']
  },
  {
    id: 7,
    title: 'Rising Interest Rates: Impact on Real Estate Investment',
    excerpt: 'Analysis of how changing interest rates affect property values and investment returns.',
    author: 'Michael Chen',
    date: 'November 28, 2024',
    category: 'Market Insights',
    readTime: '11 min',
    image: '/blog/interest-rates.jpg',
    featured: false,
    tags: ['Interest Rates', 'Market Analysis', 'Economy']
  },
  {
    id: 8,
    title: 'Portfolio Diversification Strategies for Real Estate',
    excerpt: 'Expert tips on building a balanced real estate portfolio across property types and locations.',
    author: 'David Kim',
    date: 'November 25, 2024',
    category: 'Guides',
    readTime: '8 min',
    image: '/blog/diversification.jpg',
    featured: false,
    tags: ['Diversification', 'Portfolio', 'Strategy']
  },
  {
    id: 9,
    title: 'Secondary Market Launch: What You Need to Know',
    excerpt: 'Introducing liquidity through peer-to-peer trading of property shares.',
    author: 'Emily Watson',
    date: 'November 20, 2024',
    category: 'News',
    readTime: '6 min',
    image: '/blog/secondary-market.jpg',
    featured: false,
    tags: ['Product', 'Liquidity', 'Trading']
  },
  {
    id: 10,
    title: 'Commercial Real Estate: Opportunities in 2025',
    excerpt: 'Why commercial properties remain attractive despite market changes.',
    author: 'Jennifer Martinez',
    date: 'November 18, 2024',
    category: 'Market Insights',
    readTime: '10 min',
    image: '/blog/commercial-2025.jpg',
    featured: false,
    tags: ['Commercial', 'Opportunities', '2025']
  },
  {
    id: 11,
    title: 'How to Read Property Financial Statements',
    excerpt: 'Demystifying NOI, cash flow, and other critical real estate metrics.',
    author: 'Sarah Rodriguez',
    date: 'November 15, 2024',
    category: 'Guides',
    readTime: '9 min',
    image: '/blog/financials.jpg',
    featured: false,
    tags: ['Finance', 'Education', 'Metrics']
  },
  {
    id: 12,
    title: 'Top 10 Real Estate Markets for 2025',
    excerpt: 'Data-driven analysis of the most promising investment markets in the coming year.',
    author: 'Michael Chen',
    date: 'November 12, 2024',
    category: 'Market Insights',
    readTime: '13 min',
    image: '/blog/top-markets.jpg',
    featured: true,
    tags: ['Markets', 'Rankings', '2025']
  }
];

const categories = ['All', 'Market Insights', 'Guides', 'News'];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = regularArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(regularArticles.length / articlesPerPage);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="mx-auto mb-6" size={80} />
          <h1 className="text-5xl font-bold mb-6">OWNLY Blog</h1>
          <p className="text-2xl text-green-50 max-w-3xl mx-auto mb-8">
            Expert insights, market analysis, and investing guides
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && currentPage === 1 && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <TrendingUp className="text-green-600" size={32} />
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-green-200 to-emerald-200 flex items-center justify-center relative">
                    <BookOpen className="text-green-600" size={64} />
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Clock size={14} />
                        {article.readTime}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {article.date}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/blog/${article.id}`}
                      className="block text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                    >
                      Read Article
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
          </h2>
          {currentArticles.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200">
                    <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                      <BookOpen className="text-green-600" size={48} />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {article.category}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Clock size={12} />
                          {article.readTime}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          {article.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {article.date}
                        </div>
                      </div>
                      <Link
                        href={`/blog/${article.id}`}
                        className="block text-center bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === idx + 1
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="mt-4 text-green-600 hover:text-green-700 font-semibold"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the latest market insights and investment tips delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Investing?</h2>
          <p className="text-xl mb-8 text-green-50">
            Put your knowledge into action with real estate investments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-shadow"
            >
              Create Free Account
            </Link>
            <Link
              href="/deals"
              className="bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-800 transition-colors border-2 border-white"
            >
              Browse Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
