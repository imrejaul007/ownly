'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, TrendingUp, Clock, User, MessageCircle, ThumbsUp, Eye, Search, Plus } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Topics', count: 284, icon: MessageSquare },
  { id: 'general', name: 'General Discussion', count: 98, icon: MessageCircle },
  { id: 'strategy', name: 'Investment Strategy', count: 67, icon: TrendingUp },
  { id: 'properties', name: 'Property Analysis', count: 54, icon: Eye },
  { id: 'qa', name: 'Q&A', count: 42, icon: MessageSquare },
  { id: 'success', name: 'Success Stories', count: 23, icon: ThumbsUp }
];

const discussions = [
  {
    id: 1,
    category: 'strategy',
    title: 'Best diversification strategy for $50k portfolio?',
    author: 'Michael R.',
    authorLevel: 'Expert Investor',
    createdAt: '2 hours ago',
    replies: 24,
    views: 342,
    likes: 18,
    trending: true,
    excerpt: 'Looking for advice on how to best allocate $50k across different property types and locations. Currently have 60% residential, 40% commercial...'
  },
  {
    id: 2,
    category: 'properties',
    title: 'Thoughts on the new Austin multi-family property?',
    author: 'Sarah L.',
    authorLevel: 'Intermediate Investor',
    createdAt: '4 hours ago',
    replies: 31,
    views: 589,
    likes: 27,
    trending: true,
    excerpt: 'The new Austin property looks promising with 8.2% projected returns. Has anyone done detailed analysis on the market fundamentals?'
  },
  {
    id: 3,
    category: 'qa',
    title: 'How are K-1 tax forms handled?',
    author: 'David K.',
    authorLevel: 'First-time Investor',
    createdAt: '6 hours ago',
    replies: 15,
    views: 234,
    likes: 12,
    trending: false,
    excerpt: 'First year investing and want to understand the tax documentation process. When do K-1s get issued and what should I expect?'
  },
  {
    id: 4,
    category: 'success',
    title: 'One year update: 12.4% return on my portfolio!',
    author: 'Jennifer M.',
    authorLevel: 'Experienced Investor',
    createdAt: '8 hours ago',
    replies: 42,
    views: 891,
    likes: 64,
    trending: true,
    excerpt: 'Started with OWNLY exactly one year ago with $10k. Portfolio now worth $11,240 after distributions. Here\'s my strategy...'
  },
  {
    id: 5,
    category: 'general',
    title: 'Secondary marketplace liquidity - your experiences?',
    author: 'Robert T.',
    authorLevel: 'Expert Investor',
    createdAt: '10 hours ago',
    replies: 19,
    views: 456,
    likes: 15,
    trending: false,
    excerpt: 'Curious about others\' experiences selling shares on the secondary market. How long did it take to find buyers?'
  },
  {
    id: 6,
    category: 'strategy',
    title: 'Commercial vs Residential in 2025',
    author: 'Emily W.',
    authorLevel: 'Intermediate Investor',
    createdAt: '12 hours ago',
    replies: 28,
    views: 567,
    likes: 22,
    trending: true,
    excerpt: 'With rising interest rates, what are your thoughts on allocating more to commercial vs residential properties for the coming year?'
  },
  {
    id: 7,
    category: 'properties',
    title: 'Miami beachfront condos - overpriced or opportunity?',
    author: 'Christopher B.',
    authorLevel: 'Expert Investor',
    createdAt: '14 hours ago',
    replies: 37,
    views: 723,
    likes: 31,
    trending: true,
    excerpt: 'The Miami beachfront property seems expensive compared to cap rates in other markets. Anyone else analyzing this one?'
  },
  {
    id: 8,
    category: 'qa',
    title: 'What happens if a property underperforms?',
    author: 'Lisa P.',
    authorLevel: 'First-time Investor',
    createdAt: '16 hours ago',
    replies: 21,
    views: 389,
    likes: 14,
    trending: false,
    excerpt: 'New to real estate investing. What protection do investors have if a property doesn\'t meet projected returns?'
  },
  {
    id: 9,
    category: 'general',
    title: 'Dividend reinvestment strategies',
    author: 'Daniel G.',
    authorLevel: 'Intermediate Investor',
    createdAt: '18 hours ago',
    replies: 16,
    views: 298,
    likes: 11,
    trending: false,
    excerpt: 'Do you reinvest your quarterly distributions or withdraw them? Looking for different perspectives on long-term growth.'
  },
  {
    id: 10,
    category: 'success',
    title: 'From $500 to $25k portfolio in 2 years',
    author: 'Michelle L.',
    authorLevel: 'Experienced Investor',
    createdAt: '1 day ago',
    replies: 56,
    views: 1234,
    likes: 89,
    trending: true,
    excerpt: 'My journey from skeptical first-time investor to building a substantial real estate portfolio. Here\'s what I learned...'
  },
  {
    id: 11,
    category: 'strategy',
    title: 'Geographic diversification - how much is enough?',
    author: 'James W.',
    authorLevel: 'Expert Investor',
    createdAt: '1 day ago',
    replies: 24,
    views: 412,
    likes: 19,
    trending: false,
    excerpt: 'Currently invested in 12 properties across 8 states. Is this sufficient geographic diversification or should I expand further?'
  },
  {
    id: 12,
    category: 'properties',
    title: 'Deep dive: Seattle Green Apartments analysis',
    author: 'Amanda R.',
    authorLevel: 'Expert Investor',
    createdAt: '1 day ago',
    replies: 29,
    views: 645,
    likes: 33,
    trending: false,
    excerpt: 'Detailed financial analysis of the Seattle property including comparable sales, rent comps, and market trends. Thoughts?'
  }
];

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('trending');

  let filteredDiscussions = discussions.filter(d => {
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'trending') {
    filteredDiscussions = [...filteredDiscussions].sort((a, b) => b.likes - a.likes);
  } else if (sortBy === 'recent') {
    filteredDiscussions = filteredDiscussions;
  } else if (sortBy === 'popular') {
    filteredDiscussions = [...filteredDiscussions].sort((a, b) => b.views - a.views);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageSquare className="mx-auto mb-6" size={80} />
          <h1 className="text-5xl font-bold mb-6">Investor Forum</h1>
          <p className="text-2xl text-green-50 max-w-3xl mx-auto mb-8">
            Connect with fellow investors, share strategies, and learn from the community
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">284</div>
              <div className="text-gray-600 text-sm">Total Discussions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">1,247</div>
              <div className="text-gray-600 text-sm">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">4,892</div>
              <div className="text-gray-600 text-sm">Total Posts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">92%</div>
              <div className="text-gray-600 text-sm">Response Rate</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Categories</h2>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-2 rounded-lg hover:shadow-lg transition-shadow">
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-white bg-opacity-20'
                          : 'bg-gray-200'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h3 className="font-bold text-gray-900 mb-2">Forum Guidelines</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Be respectful and helpful</li>
                  <li>• No financial advice</li>
                  <li>• Share your experiences</li>
                  <li>• Stay on topic</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content - Discussions */}
          <main className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="trending">Trending</option>
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center gap-2">
                  <Plus size={20} />
                  New Discussion
                </button>
              </div>
            </div>

            {/* Discussions List */}
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <div key={discussion.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {discussion.author.charAt(0)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {discussion.trending && (
                              <TrendingUp className="text-orange-500" size={16} />
                            )}
                            <h3 className="text-xl font-bold text-gray-900 hover:text-green-600 cursor-pointer">
                              {discussion.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                            <span className="font-medium">{discussion.author}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {discussion.authorLevel}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {discussion.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{discussion.excerpt}</p>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MessageCircle size={16} />
                          <span>{discussion.replies} replies</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye size={16} />
                          <span>{discussion.views} views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsUp size={16} />
                          <span>{discussion.likes} likes</span>
                        </div>
                        <button className="ml-auto text-green-600 hover:text-green-700 font-semibold">
                          Join Discussion →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDiscussions.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <MessageSquare className="mx-auto mb-4 text-gray-400" size={64} />
                <p className="text-gray-500 text-lg mb-4">No discussions found</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Conversation</h2>
          <p className="text-xl mb-8 text-green-50">
            Create an account to participate in discussions and connect with investors
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
