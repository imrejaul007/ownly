'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Gift, Award, Star, TrendingUp, Users, Zap, Crown, Target, CheckCircle,
  Copy, ShoppingBag, Percent, CreditCard, Coffee, Utensils, Tag, Sparkles
} from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';

const referralEarnings = [
  {
    name: 'Omar Al Dhaheri',
    joined: '2 months ago',
    invested: 85000,
    yourBonus: 850, // 1% of their investment
    tier: 'Direct Referral',
    status: 'Active',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Layla Al Maktoum',
    joined: '1 month ago',
    invested: 52000,
    yourBonus: 520,
    tier: 'Direct Referral',
    status: 'Active',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Khalid Al Shamsi',
    joined: '3 weeks ago',
    invested: 35000,
    yourBonus: 350,
    tier: 'Direct Referral',
    status: 'Active',
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Reem Al Nuaimi',
    joined: '2 weeks ago',
    invested: 18000,
    yourBonus: 90, // 0.5% second tier
    tier: '2nd Tier Referral',
    status: 'Active',
    color: 'from-orange-500 to-red-500'
  }
];

const copyTradingEarnings = [
  {
    trader: 'Ahmed Al Mansoori',
    copiedBy: 12,
    totalCopied: 45000,
    yourCommission: 1350, // 3% commission
    monthlyEarning: 450,
    trend: 'up'
  },
  {
    trader: 'Sara Al Hashimi',
    copiedBy: 8,
    totalCopied: 28000,
    yourCommission: 840,
    monthlyEarning: 280,
    trend: 'up'
  },
  {
    trader: 'Mohamed Al Zaabi',
    copiedBy: 5,
    totalCopied: 15000,
    yourCommission: 450,
    monthlyEarning: 150,
    trend: 'stable'
  }
];

const companyGiftCards = [
  {
    id: 1,
    company: 'Emaar Properties',
    logo: '🏢',
    category: 'Real Estate',
    earned: 250,
    available: 250,
    expiryDays: 90,
    description: 'Use at Emaar malls, restaurants & entertainment',
    color: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 2,
    company: 'Dubai Parks & Resorts',
    logo: '🎢',
    category: 'Entertainment',
    earned: 150,
    available: 150,
    expiryDays: 60,
    description: 'Theme park tickets & F&B vouchers',
    color: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 3,
    company: 'Careem',
    logo: '🚗',
    category: 'Transportation',
    earned: 100,
    available: 75,
    expiryDays: 120,
    description: 'Ride credits & food delivery',
    color: 'from-green-500/20 to-green-600/20',
    borderColor: 'border-green-500/30'
  },
  {
    id: 4,
    company: 'Majid Al Futtaim',
    logo: '🛍️',
    category: 'Retail',
    earned: 200,
    available: 120,
    expiryDays: 45,
    description: 'Shopping & dining vouchers',
    color: 'from-orange-500/20 to-orange-600/20',
    borderColor: 'border-orange-500/30'
  }
];

const rewardTiers = [
  {
    name: 'Starter',
    icon: Award,
    color: 'from-slate-400 to-slate-600',
    investmentMin: 0,
    copyCommission: '2%',
    giftCardBonus: '0.5%',
    benefits: ['Basic rewards on investments', 'Copy trading 2% commission', '0.5% gift card bonus']
  },
  {
    name: 'Pro',
    icon: Star,
    color: 'from-blue-400 to-blue-600',
    investmentMin: 25000,
    copyCommission: '3%',
    giftCardBonus: '1%',
    benefits: ['Enhanced rewards', 'Copy trading 3% commission', '1% gift card bonus', 'Priority support']
  },
  {
    name: 'Elite',
    icon: Crown,
    color: 'from-purple-400 to-purple-600',
    investmentMin: 100000,
    copyCommission: '5%',
    giftCardBonus: '2%',
    benefits: ['Premium rewards', 'Copy trading 5% commission', '2% gift card bonus', 'Dedicated manager', 'Exclusive deals']
  }
];

export default function RewardsPage() {
  const { formatCurrency } = usePreferences();
  const [totalCommissionEarned] = useState(2640);
  const [totalGiftCardValue] = useState(700);
  const [monthlyPassiveIncome] = useState(880);
  const [totalReferralEarnings] = useState(1810);
  const [totalReferrals] = useState(4);
  const [referralCode] = useState('OWNLY-FAT123');

  const totalCopiers = copyTradingEarnings.reduce((sum, item) => sum + item.copiedBy, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-gray-900 to-black text-white">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-green-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-green-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-6 shadow-lg">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-sm font-semibold text-purple-300">Earn While You Invest</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              Rewards & Earnings
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Earn commissions from copy trading and get gift cards with every investment
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Total Commission */}
            <div className="group relative bg-gradient-to-br from-green-600/10 via-emerald-500/5 to-transparent backdrop-blur-xl border border-green-500/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-green-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 via-emerald-500/0 to-transparent group-hover:from-green-600/10 group-hover:via-emerald-500/5 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform duration-500">
                    <Copy className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-green-300 text-sm font-medium mb-2">Copy Trading Commission</div>
                <div className="text-4xl font-bold text-white group-hover:text-green-100 transition-colors mb-3">{formatCurrency(totalCommissionEarned)}</div>
                <div className="text-sm text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{formatCurrency(monthlyPassiveIncome)}/month passive income</span>
                </div>
              </div>
            </div>

            {/* Gift Cards */}
            <div className="group relative bg-gradient-to-br from-purple-600/10 via-pink-500/5 to-transparent backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-500/0 to-transparent group-hover:from-purple-600/10 group-hover:via-pink-500/5 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-500">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-purple-300 text-sm font-medium mb-2">Gift Cards Earned</div>
                <div className="text-4xl font-bold text-white group-hover:text-purple-100 transition-colors mb-3">{formatCurrency(totalGiftCardValue)}</div>
                <div className="text-sm text-purple-400">
                  From {companyGiftCards.length} partner companies
                </div>
              </div>
            </div>

            {/* Active Copiers */}
            <div className="group relative bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-transparent backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-cyan-500/0 to-transparent group-hover:from-blue-600/10 group-hover:via-cyan-500/5 transition-all duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-500">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-blue-300 text-sm font-medium mb-2">Active Copiers</div>
                <div className="text-4xl font-bold text-white group-hover:text-blue-100 transition-colors mb-3">{totalCopiers}</div>
                <div className="text-sm text-blue-400">
                  Earning you commissions
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Program */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-500/30 rounded-full px-6 py-3 mb-6">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">Refer & Earn</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Referral Earnings Program
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Earn up to 1% on direct referrals and 0.5% on 2nd tier referrals. Build passive income by inviting friends!
            </p>
          </div>

          {/* Referral Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="group relative bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 shadow-2xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-blue-500/0 to-transparent group-hover:from-blue-600/10 group-hover:via-blue-500/5 transition-all duration-500"></div>
              <div className="relative">
                <div className="text-blue-300 text-sm font-medium mb-2">Your Referral Code</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-white">{referralCode}</div>
                  <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all">
                    <Copy className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-purple-600/10 via-purple-500/5 to-transparent backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-purple-500/0 to-transparent group-hover:from-purple-600/10 group-hover:via-purple-500/5 transition-all duration-500"></div>
              <div className="relative">
                <div className="text-purple-300 text-sm font-medium mb-2">Total Referrals</div>
                <div className="text-3xl font-bold text-white">{totalReferrals}</div>
                <div className="text-xs text-purple-400 mt-1">Active investors</div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-green-600/10 via-green-500/5 to-transparent backdrop-blur-xl border border-green-500/20 rounded-3xl p-6 shadow-2xl hover:shadow-green-500/20 hover:scale-105 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 via-green-500/0 to-transparent group-hover:from-green-600/10 group-hover:via-green-500/5 transition-all duration-500"></div>
              <div className="relative">
                <div className="text-green-300 text-sm font-medium mb-2">Total Earned</div>
                <div className="text-3xl font-bold text-white">{formatCurrency(totalReferralEarnings)}</div>
                <div className="text-xs text-green-400 mt-1">Lifetime earnings</div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-orange-600/10 via-orange-500/5 to-transparent backdrop-blur-xl border border-orange-500/20 rounded-3xl p-6 shadow-2xl hover:shadow-orange-500/20 hover:scale-105 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 via-orange-500/0 to-transparent group-hover:from-orange-600/10 group-hover:via-orange-500/5 transition-all duration-500"></div>
              <div className="relative">
                <div className="text-orange-300 text-sm font-medium mb-2">This Month</div>
                <div className="text-3xl font-bold text-white">+{formatCurrency(520)}</div>
                <div className="text-xs text-orange-400 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +25% vs last month
                </div>
              </div>
            </div>
          </div>

          {/* How Referrals Work */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Share Your Code</h3>
              <p className="text-sm text-gray-400">Share your unique referral code with friends and family</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. They Invest</h3>
              <p className="text-sm text-gray-400">When they sign up and invest using your code</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. You Earn Bonus</h3>
              <p className="text-sm text-gray-400">Get 1% of their investment + 0.5% from their referrals</p>
            </div>
          </div>

          {/* Referral Tiers */}
          <div className="bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-12">
            <h3 className="text-2xl font-bold mb-6 text-center">Multi-Tier Bonus Structure</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-lg">Direct Referral</div>
                    <div className="text-sm text-gray-400">People you refer directly</div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">1.0%</div>
                <div className="text-sm text-gray-400">of their investment amount</div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-lg">2nd Tier Referral</div>
                    <div className="text-sm text-gray-400">People they refer</div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-2">0.5%</div>
                <div className="text-sm text-gray-400">of their investment amount</div>
              </div>
            </div>
          </div>

          {/* Your Referrals */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Your Active Referrals</h3>
            <div className="space-y-4">
              {referralEarnings.map((referral, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-500">
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${referral.color} rounded-full flex items-center justify-center font-bold shadow-lg`}>
                          {referral.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold">{referral.name}</div>
                          <div className="text-sm text-gray-400">{referral.joined}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Invested</div>
                      <div className="font-semibold">{formatCurrency(referral.invested)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Your Bonus</div>
                      <div className="font-bold text-green-400">{formatCurrency(referral.yourBonus)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Tier</div>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        referral.tier === 'Direct Referral'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {referral.tier}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Share & Start Earning</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Invite your friends to join OWNLY and earn bonus on every investment they make!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl">
                <span className="font-mono font-bold">{referralCode}</span>
                <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all">
                  <Copy className="w-4 h-4 text-blue-400" />
                </button>
              </div>
              <Link
                href="/referrals"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                View Referral Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Copy Trading Commission */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Copy Trading Commissions</h2>
              <p className="text-gray-400">Earn passive income when others copy your successful trades</p>
            </div>
            <Link
              href="/copy-trading"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Become a Trader
            </Link>
          </div>

          {/* How It Works */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold mb-2">1. Build Your Portfolio</h3>
              <p className="text-sm text-gray-400">Make successful investments and build a track record</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Copy className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold mb-2">2. Others Copy You</h3>
              <p className="text-sm text-gray-400">Investors copy your trades automatically</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Percent className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-bold mb-2">3. Earn Commission</h3>
              <p className="text-sm text-gray-400">Get 2-5% commission on their investments</p>
            </div>
          </div>

          {/* Your Copy Trading Earnings */}
          <div className="space-y-4">
            {copyTradingEarnings.map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <div className="grid md:grid-cols-5 gap-4 items-center">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold">
                        {item.trader.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold">{item.trader}</div>
                        <div className="text-sm text-gray-400">{item.copiedBy} copiers</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Total Copied</div>
                    <div className="font-semibold">{formatCurrency(item.totalCopied)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Your Commission</div>
                    <div className="font-bold text-green-400">{formatCurrency(item.yourCommission)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Monthly Earning</div>
                    <div className="font-bold text-blue-400">+{formatCurrency(item.monthlyEarning)}/mo</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Gift Cards */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Company Gift Cards</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Earn gift cards from the companies you invest in. Use them for shopping, dining, entertainment & more!
            </p>
          </div>

          {/* How Gift Cards Work */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="font-bold mb-2">Invest</h3>
              <p className="text-sm text-gray-400">Buy shares in companies</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="font-bold mb-2">Earn Cards</h3>
              <p className="text-sm text-gray-400">Get 0.5-2% in gift cards</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="font-bold mb-2">Redeem</h3>
              <p className="text-sm text-gray-400">Use at partner locations</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="font-bold mb-2">Enjoy</h3>
              <p className="text-sm text-gray-400">Shop, dine & more</p>
            </div>
          </div>

          {/* Available Gift Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {companyGiftCards.map((card) => (
              <div key={card.id} className={`bg-gradient-to-br ${card.color} backdrop-blur-xl border ${card.borderColor} rounded-2xl p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{card.logo}</div>
                    <div>
                      <h3 className="font-bold text-xl">{card.company}</h3>
                      <div className="text-sm text-gray-400">{card.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Available</div>
                    <div className="text-2xl font-bold text-green-400">{formatCurrency(card.available)}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4">{card.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-xs text-gray-400">Total Earned</div>
                      <div className="font-semibold">{formatCurrency(card.earned)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Expires In</div>
                      <div className="font-semibold">{card.expiryDays} days</div>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all">
                    Use Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward Tiers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Reward Tiers</h2>
            <p className="text-gray-400">Higher investment = Higher rewards</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {rewardTiers.map((tier, idx) => {
              const Icon = tier.icon;
              return (
                <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-center mb-2">{tier.name}</h3>
                  <div className="text-center text-gray-400 mb-6">
                    Min. {formatCurrency(tier.investmentMin)}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400">Copy Commission</div>
                      <div className="text-2xl font-bold text-green-400">{tier.copyCommission}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400">Gift Card Bonus</div>
                      <div className="text-2xl font-bold text-purple-400">{tier.giftCardBonus}</div>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-green-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Earning Today</h2>
          <p className="text-xl text-gray-300 mb-8">
            Invest smart, earn commissions, and get rewarded with gift cards
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/deals"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Start Investing
            </Link>
            <Link
              href="/copy-trading"
              className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Become a Trader
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
