'use client';

import { useState, useEffect } from 'react';
import {
  Trophy, Star, Target, CheckCircle, Clock, Lock, TrendingUp,
  Gift, Zap, Award, Crown, DollarSign, PieChart, Shield
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Milestone types
interface Milestone {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'locked';
  icon: typeof CheckCircle;
  completedDate?: string;
  progress?: {
    current: number;
    target: number;
  };
  requirement?: string;
}

// Badge types
interface Badge {
  id: number;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export default function ProgressPage() {
  const [overallProgress, setOverallProgress] = useState(66); // 4 out of 6 milestones
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    // Animate progress bar on load
    setTimeout(() => setAnimateProgress(true), 300);
  }, []);

  // Journey Milestones
  const milestones: Milestone[] = [
    {
      id: 1,
      title: 'Account Created',
      description: 'Welcome to OWNLY',
      status: 'completed',
      icon: CheckCircle,
      completedDate: 'January 15, 2025'
    },
    {
      id: 2,
      title: 'First Investment',
      description: 'AED 5,000 invested',
      status: 'completed',
      icon: CheckCircle,
      completedDate: 'January 20, 2025'
    },
    {
      id: 3,
      title: 'First Payout Received',
      description: 'AED 208 earned',
      status: 'completed',
      icon: CheckCircle,
      completedDate: 'February 1, 2025'
    },
    {
      id: 4,
      title: 'Portfolio Milestone',
      description: 'Reach AED 25,000 total invested',
      status: 'in-progress',
      icon: Clock,
      progress: {
        current: 20000,
        target: 25000
      }
    },
    {
      id: 5,
      title: 'Diversification Master',
      description: 'Invest in 5+ different deals',
      status: 'locked',
      icon: Lock,
      requirement: 'Currently: 3/5 deals'
    },
    {
      id: 6,
      title: 'Golden Investor',
      description: 'Reach AED 100,000 portfolio value',
      status: 'locked',
      icon: Lock,
      requirement: 'Unlock previous milestones first'
    }
  ];

  // Achievement Badges
  const badges: Badge[] = [
    {
      id: 1,
      title: 'Early Adopter',
      description: 'Joined in first 1000 investors',
      icon: '🏆',
      earned: true,
      earnedDate: 'January 15, 2025'
    },
    {
      id: 2,
      title: 'First Investment',
      description: 'Made your first investment',
      icon: '💰',
      earned: true,
      earnedDate: 'January 20, 2025'
    },
    {
      id: 3,
      title: 'Regular Earner',
      description: 'Received 3+ monthly payouts',
      icon: '💸',
      earned: true,
      earnedDate: 'March 1, 2025'
    },
    {
      id: 4,
      title: 'Diversification Pro',
      description: 'Invest in 10+ deals',
      icon: '🌟',
      earned: false
    },
    {
      id: 5,
      title: 'ROI Master',
      description: 'Achieve 20%+ average ROI',
      icon: '📈',
      earned: false
    },
    {
      id: 6,
      title: 'Target Hitter',
      description: 'Reach AED 50K invested',
      icon: '🎯',
      earned: false
    },
    {
      id: 7,
      title: 'Premium Investor',
      description: 'Invest in premium deals',
      icon: '💎',
      earned: false
    },
    {
      id: 8,
      title: 'Reinvestor',
      description: 'Reinvest payouts 5+ times',
      icon: '🔄',
      earned: false
    },
    {
      id: 9,
      title: 'Elite Status',
      description: 'Reach AED 500K portfolio',
      icon: '👑',
      earned: false
    }
  ];

  // Stats
  const stats = [
    {
      title: 'Total Invested',
      value: 'AED 20,000',
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400'
    },
    {
      title: 'Total Earned',
      value: 'AED 2,496',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400'
    },
    {
      title: 'Active Deals',
      value: '3',
      icon: PieChart,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400'
    },
    {
      title: 'Next Milestone',
      value: '80%',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-green-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            {/* Trophy Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-full px-6 py-3 mb-6">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-300">Achievement Tracker</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              Your Investment Journey
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Track your progress and unlock achievement badges
            </p>

            {/* Overall Progress Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Overall Progress</span>
                <span className="text-sm font-bold text-purple-400">{overallProgress}% Complete</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-xl border border-white/20">
                <div
                  className={`h-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out ${animateProgress ? 'opacity-100' : 'opacity-0'}`}
                  style={{ width: animateProgress ? `${overallProgress}%` : '0%' }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Complete 4 more milestones to reach 100%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">{stat.title}</div>
                      <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Your Journey</h2>
            <p className="text-gray-400">Complete milestones to unlock rewards and achievements</p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, idx) => {
              const Icon = milestone.icon;
              const isLast = idx === milestones.length - 1;

              return (
                <div key={milestone.id} className="relative">
                  {/* Connecting Line */}
                  {!isLast && (
                    <div className="absolute left-7 top-16 w-0.5 h-12 bg-gradient-to-b from-white/20 to-transparent" />
                  )}

                  {/* Milestone Card */}
                  <div
                    className={`
                      relative bg-white/5 backdrop-blur-xl border rounded-2xl p-6
                      ${milestone.status === 'completed' ? 'border-green-500/30 bg-green-500/5' : ''}
                      ${milestone.status === 'in-progress' ? 'border-blue-500/30 bg-blue-500/5' : ''}
                      ${milestone.status === 'locked' ? 'border-white/10' : ''}
                      hover:bg-white/10 transition-all
                    `}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`
                          flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center
                          ${milestone.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-500' : ''}
                          ${milestone.status === 'in-progress' ? 'bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse' : ''}
                          ${milestone.status === 'locked' ? 'bg-white/10' : ''}
                        `}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{milestone.title}</h3>
                            <p className="text-gray-400">{milestone.description}</p>
                          </div>

                          {/* Status Badge */}
                          {milestone.status === 'completed' && (
                            <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-semibold text-green-400">
                              ✓ Completed
                            </span>
                          )}
                          {milestone.status === 'in-progress' && (
                            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-400">
                              🔄 In Progress
                            </span>
                          )}
                          {milestone.status === 'locked' && (
                            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-gray-400">
                              🔒 Locked
                            </span>
                          )}
                        </div>

                        {/* Completed Date */}
                        {milestone.completedDate && (
                          <p className="text-sm text-green-400 mt-2">
                            Achieved on {milestone.completedDate}
                          </p>
                        )}

                        {/* Progress Bar */}
                        {milestone.progress && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-400">Progress</span>
                              <span className="text-sm font-bold text-blue-400">
                                {formatCurrency(milestone.progress.current)} / {formatCurrency(milestone.progress.target)}
                              </span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                                style={{ width: `${(milestone.progress.current / milestone.progress.target) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {Math.round((milestone.progress.current / milestone.progress.target) * 100)}% complete - {formatCurrency(milestone.progress.target - milestone.progress.current)} to go
                            </p>
                          </div>
                        )}

                        {/* Requirements */}
                        {milestone.requirement && (
                          <p className="text-sm text-gray-400 mt-3 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            {milestone.requirement}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievement Badges */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Achievement Badges</h2>
            <p className="text-gray-400">Collect badges as you reach new milestones</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`
                  bg-white/5 backdrop-blur-xl border rounded-2xl p-6 text-center
                  transition-all group
                  ${badge.earned
                    ? 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 cursor-pointer'
                    : 'border-white/10 opacity-50 grayscale hover:grayscale-0 hover:opacity-75'
                  }
                `}
              >
                {/* Badge Icon */}
                <div className={`
                  text-6xl mb-4 transition-transform group-hover:scale-110
                  ${!badge.earned && 'filter grayscale'}
                `}>
                  {badge.icon}
                </div>

                {/* Badge Title */}
                <h3 className="text-xl font-bold mb-2">{badge.title}</h3>

                {/* Badge Description */}
                <p className="text-sm text-gray-400 mb-4">{badge.description}</p>

                {/* Badge Status */}
                {badge.earned ? (
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-semibold text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Earned
                    </div>
                    {badge.earnedDate && (
                      <p className="text-xs text-gray-500 mt-2">{badge.earnedDate}</p>
                    )}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-gray-400">
                    <Lock className="w-4 h-4" />
                    Locked
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-green-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mb-6">
              <Gift className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl font-bold mb-4">Reach Your Next Milestone!</h2>
            <p className="text-gray-300 mb-8">Complete "Portfolio Milestone" to unlock exclusive rewards</p>

            {/* Rewards List */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="w-14 h-14 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-7 h-7 text-yellow-400" />
                </div>
                <h3 className="font-bold mb-2">500 Bonus Points</h3>
                <p className="text-sm text-gray-400">Redeem for rewards</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="font-bold mb-2">Exclusive Deal Access</h3>
                <p className="text-sm text-gray-400">Premium opportunities</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-bold mb-2">Priority Support</h3>
                <p className="text-sm text-gray-400">VIP assistance</p>
              </div>
            </div>

            {/* Progress to Next Reward */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold">Progress to Rewards</span>
                <span className="text-sm font-bold text-purple-400">AED 5,000 to go</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full"
                  style={{ width: '80%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-green-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Keep Growing Your Portfolio</h2>
          <p className="text-xl text-gray-300 mb-8">
            Explore new investment opportunities and unlock more achievements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/deals"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Browse Deals
            </a>
            <a
              href="/portfolio"
              className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
            >
              View Portfolio
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
