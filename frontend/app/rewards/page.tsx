'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Gift, Award, Star, TrendingUp, Users, Zap, Crown, Target, CheckCircle,
  Copy, ShoppingBag, Percent, CreditCard, Coffee, Utensils, Tag, Sparkles
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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
  const [totalCommissionEarned] = useState(2640);
  const [totalGiftCardValue] = useState(700);
  const [monthlyPassiveIncome] = useState(880);

  const totalCopiers = copyTradingEarnings.reduce((sum, item) => sum + item.copiedBy, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-green-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-purple-300">Earn While You Invest</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              Rewards & Earnings
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Earn commissions from copy trading and get gift cards with every investment
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Total Commission */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Copy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Copy Trading Commission</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalCommissionEarned)}</div>
                </div>
              </div>
              <div className="text-sm text-green-400 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>+{formatCurrency(monthlyPassiveIncome)}/month passive income</span>
              </div>
            </div>

            {/* Gift Cards */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Gift Cards Earned</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalGiftCardValue)}</div>
                </div>
              </div>
              <div className="text-sm text-purple-400">
                From {companyGiftCards.length} companies
              </div>
            </div>

            {/* Active Copiers */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Active Copiers</div>
                  <div className="text-2xl font-bold">{totalCopiers}</div>
                </div>
              </div>
              <div className="text-sm text-blue-400">
                Earning you commissions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copy Trading Commission */}
      <section className="py-16">
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
