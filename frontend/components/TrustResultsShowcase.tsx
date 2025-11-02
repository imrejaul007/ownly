'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield, Award, TrendingUp, Users, DollarSign, CheckCircle,
  Star, BadgeCheck, Globe, Target, Zap, ArrowRight, Sparkles,
  Building2, Timer, TrendingDown, Eye
} from 'lucide-react';

interface TrustResultsShowcaseProps {
  stats?: {
    totalInvestment: number;
    activeInvestors: number;
    avgROI: number;
    successfulDeals: number;
    totalPayouts: number;
  };
}

export default function TrustResultsShowcase({ stats }: TrustResultsShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'trust' | 'results' | 'opportunities'>('trust');
  const [viewingCount, setViewingCount] = useState(147);

  // Simulate viewing count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewingCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const trustIndicators = [
    {
      icon: Shield,
      title: 'DFSA Regulated',
      description: 'Licensed by Dubai Financial Services Authority',
      badge: 'Verified',
      color: 'blue'
    },
    {
      icon: BadgeCheck,
      title: '100% Shariah Compliant',
      description: 'All investments certified Halal by Islamic scholars',
      badge: 'Certified',
      color: 'green'
    },
    {
      icon: Globe,
      title: 'UAE Central Bank Approved',
      description: 'Operating under UAE financial regulations',
      badge: 'Licensed',
      color: 'purple'
    },
    {
      icon: Award,
      title: 'ISO 27001 Certified',
      description: 'International security & data protection standards',
      badge: 'Secure',
      color: 'orange'
    }
  ];

  const successStories = [
    {
      investor: 'Ahmed Al-Mansouri',
      role: 'HNI Investor',
      investment: 500000,
      returns: 735000,
      roi: 47,
      period: '18 months',
      deals: 12,
      quote: 'OWNLY transformed my passive income. I now earn AED 28,500/month consistently.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
      verified: true
    },
    {
      investor: 'Fatima Al-Hashimi',
      role: 'Retail Investor',
      investment: 125000,
      returns: 168750,
      roi: 35,
      period: '12 months',
      deals: 8,
      quote: 'Started small with AED 5,000. Now my portfolio generates more than my salary!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
      verified: true
    },
    {
      investor: 'Mohammed Al-Qasimi',
      role: 'Business Owner',
      investment: 1200000,
      returns: 1872000,
      roi: 56,
      period: '24 months',
      deals: 18,
      quote: 'Best decision for diversifying wealth. Returns beat traditional investments.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed',
      verified: true
    }
  ];

  const hotOpportunities = [
    {
      title: 'Dubai Marina Premium Apartments',
      category: 'Real Estate',
      roi: 42,
      minInvestment: 5000,
      funded: 94,
      investors: 167,
      monthlyIncome: 3500,
      closingIn: '2 days',
      badge: 'Almost Funded',
      badgeColor: 'red',
      trend: '+18% this week'
    },
    {
      title: 'UAE Food Delivery Fleet Bundle',
      category: 'Mobility & Transport',
      roi: 38,
      minInvestment: 2000,
      funded: 87,
      investors: 234,
      monthlyIncome: 1900,
      closingIn: '5 days',
      badge: 'Hot Deal',
      badgeColor: 'orange',
      trend: '+23% this week'
    },
    {
      title: 'Smart Halal Restaurant Chain',
      category: 'Food & Beverage',
      roi: 51,
      minInvestment: 10000,
      funded: 76,
      investors: 89,
      monthlyIncome: 5400,
      closingIn: '1 week',
      badge: 'High Returns',
      badgeColor: 'green',
      trend: '+31% this week'
    }
  ];

  return (
    <div className="relative py-20 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Trusted by {stats?.activeInvestors.toLocaleString() || '15,000+'}  Investors
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent mb-4">
            Why Investors Choose OWNLY
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Regulated platform, proven results, and exclusive opportunities
          </p>

          {/* Live Viewers */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Eye className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">
              {viewingCount} investors viewing deals right now
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('trust')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'trust'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Trust & Security
            </div>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'results'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Proven Results
            </div>
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'opportunities'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Hot Opportunities
            </div>
          </button>
        </div>

        {/* Trust Tab */}
        {activeTab === 'trust' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                >
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={
                      indicator.color === 'blue' ? 'bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold text-blue-300' :
                      indicator.color === 'green' ? 'bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold text-green-300' :
                      indicator.color === 'purple' ? 'bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold text-purple-300' :
                      'bg-orange-500/20 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold text-orange-300'
                    }>
                      {indicator.badge}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={
                    indicator.color === 'blue' ? 'mb-4 inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20' :
                    indicator.color === 'green' ? 'mb-4 inline-flex p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20' :
                    indicator.color === 'purple' ? 'mb-4 inline-flex p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20' :
                    'mb-4 inline-flex p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20'
                  }>
                    <Icon className={
                      indicator.color === 'blue' ? 'w-8 h-8 text-blue-400' :
                      indicator.color === 'green' ? 'w-8 h-8 text-green-400' :
                      indicator.color === 'purple' ? 'w-8 h-8 text-purple-400' :
                      'w-8 h-8 text-orange-400'
                    } />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">{indicator.title}</h3>
                  <p className="text-sm text-purple-200">{indicator.description}</p>

                  {/* Verified Checkmark */}
                  <div className="mt-4 flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Verified & Active</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6 animate-fadeIn">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Investor Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={story.avatar}
                      alt={story.investor}
                      className="w-16 h-16 rounded-full border-2 border-purple-500"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white">{story.investor}</h3>
                        {story.verified && <BadgeCheck className="w-5 h-5 text-blue-400" />}
                      </div>
                      <p className="text-sm text-purple-300 mb-2">{story.role}</p>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-xs text-purple-300 mb-1">Investment</p>
                      <p className="text-lg font-bold text-white">
                        AED {(story.investment / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <p className="text-xs text-green-300 mb-1">Total Returns</p>
                      <p className="text-lg font-bold text-green-400">
                        AED {(story.returns / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <p className="text-xs text-blue-300 mb-1">ROI Achieved</p>
                      <p className="text-lg font-bold text-blue-400">+{story.roi}%</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                      <p className="text-xs text-purple-300 mb-1">Active Deals</p>
                      <p className="text-lg font-bold text-purple-400">{story.deals} deals</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="flex flex-col justify-center">
                    <div className="relative">
                      <div className="text-4xl text-purple-500/30 absolute -top-2 -left-2">"</div>
                      <p className="text-white italic pl-6">{story.quote}</p>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm text-purple-300">
                      <Timer className="w-4 h-4" />
                      Investing for {story.period}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Overall Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 text-center">
                <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">
                  AED {((stats?.totalInvestment || 0) / 1000000).toFixed(1)}M+
                </p>
                <p className="text-sm text-blue-200">Total Invested</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">{stats?.avgROI || 0}%</p>
                <p className="text-sm text-green-200">Average ROI</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">
                  {(stats?.activeInvestors || 0).toLocaleString()}+
                </p>
                <p className="text-sm text-purple-200">Active Investors</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6 text-center">
                <Target className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">{stats?.successfulDeals || 0}</p>
                <p className="text-sm text-orange-200">Successful Deals</p>
              </div>
            </div>
          </div>
        )}

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {hotOpportunities.map((opp, index) => (
              <Link
                key={index}
                href="/deals"
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <div className={
                    opp.badgeColor === 'red' ? 'bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold text-red-300 flex items-center gap-1' :
                    opp.badgeColor === 'orange' ? 'bg-orange-500/20 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold text-orange-300 flex items-center gap-1' :
                    'bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold text-green-300 flex items-center gap-1'
                  }>
                    <Sparkles className="w-3 h-3" />
                    {opp.badge}
                  </div>
                </div>

                {/* Category */}
                <div className="text-xs text-purple-300 mb-2">{opp.category}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-4 pr-20">{opp.title}</h3>

                {/* ROI Highlight */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-300 mb-1">Expected ROI</p>
                      <p className="text-3xl font-bold text-green-400">{opp.roi}%</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-green-400 opacity-50" />
                  </div>
                </div>

                {/* Monthly Income */}
                <div className="bg-white/5 rounded-xl p-3 mb-4">
                  <p className="text-xs text-purple-300 mb-1">Est. Monthly Income</p>
                  <p className="text-lg font-bold text-white">AED {opp.monthlyIncome.toLocaleString()}/mo</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-purple-300 mb-1">Min. Investment</p>
                    <p className="text-sm font-bold text-white">AED {opp.minInvestment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-300 mb-1">Investors</p>
                    <p className="text-sm font-bold text-white">{opp.investors}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-purple-300">Funded</span>
                    <span className="font-bold text-white">{opp.funded}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={
                        opp.badgeColor === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500' :
                        opp.badgeColor === 'orange' ? 'bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500' :
                        'bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500'
                      }
                      style={{ width: `${opp.funded}%` }}
                    ></div>
                  </div>
                </div>

                {/* Closing Soon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-orange-400">
                    <Timer className="w-4 h-4" />
                    Closing in {opp.closingIn}
                  </div>
                  <div className="text-xs text-green-400 font-medium">{opp.trend}</div>
                </div>

                {/* CTA */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-semibold text-white">View Deal</span>
                  <ArrowRight className="w-5 h-5 text-purple-400" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Link
            href="/deals"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
          >
            Explore All Opportunities
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
