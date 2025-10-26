'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalCommissionEarned: number;
  pendingCommission: number;
  lifetimeTrailEarning: number;
  volumeThisMonth: number;
}

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'active' | 'invested';
  investmentAmount: number;
  commission: number;
  joinedDate: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  referrals: number;
  totalVolume: number;
  badge: string;
}

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'leaderboard'>('overview');

  // Mock user's referral code (in production, fetch from API)
  const referralCode = 'OWNLY-REF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const referralLink = `https://ownly.ae/join/${referralCode}`;

  // Mock stats (in production, fetch from API)
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 12,
    activeReferrals: 8,
    totalCommissionEarned: 4850,
    pendingCommission: 320,
    lifetimeTrailEarning: 1240,
    volumeThisMonth: 85000,
  });

  // Mock referrals data
  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: '1',
      name: 'Ahmed Al Mansoori',
      email: 'ahmed.***@gmail.com',
      status: 'invested',
      investmentAmount: 15000,
      commission: 150,
      joinedDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Fatima Al Hashimi',
      email: 'fatima.***@yahoo.com',
      status: 'invested',
      investmentAmount: 25000,
      commission: 250,
      joinedDate: '2024-01-20',
    },
    {
      id: '3',
      name: 'Mohammed Al Zaabi',
      email: 'mohammed.***@outlook.com',
      status: 'active',
      investmentAmount: 0,
      commission: 0,
      joinedDate: '2024-02-01',
    },
    {
      id: '4',
      name: 'Sara Al Suwaidi',
      email: 'sara.***@gmail.com',
      status: 'pending',
      investmentAmount: 0,
      commission: 0,
      joinedDate: '2024-02-10',
    },
  ]);

  // Mock leaderboard data
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Khalid Al Majid', referrals: 45, totalVolume: 1250000, badge: '👑' },
    { rank: 2, name: 'Aisha Al Shamsi', referrals: 38, totalVolume: 980000, badge: '🥈' },
    { rank: 3, name: 'Omar Al Falasi', referrals: 32, totalVolume: 750000, badge: '🥉' },
    { rank: 4, name: 'Noor Al Kaabi', referrals: 28, totalVolume: 620000, badge: '⭐' },
    { rank: 5, name: 'Rashid Al Dhaheri', referrals: 24, totalVolume: 540000, badge: '⭐' },
    { rank: 6, name: 'You', referrals: 12, totalVolume: 85000, badge: '🎯' },
  ]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `Join OWNLY and start earning passive income from real estate investments! Use my referral link: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareOnSocial = () => {
    const message = encodeURIComponent(
      `Join OWNLY and start earning passive income from real estate investments! ${referralLink}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="text-5xl mr-4">💰</div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Earn with OWNLY
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Become an RM (Relationship Manager) and earn lifetime commissions
            </p>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">Turn Your Network into Income</h2>
            <p className="text-green-100 mb-6 text-lg">
              Earn <strong>1% upfront</strong> + <strong>0.5% lifetime trail commission</strong> on every investment your referrals make.
              No limits. No caps. Just pure passive income.
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
              <div className="text-3xl font-bold mb-2">AED 15,000+</div>
              <div className="text-sm text-green-100">Average monthly earnings for top RMs</div>
            </div>
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition font-bold text-lg">
              Become an RM Now
            </button>
          </div>
          <div className="hidden md:block text-center">
            <div className="text-9xl">🚀</div>
          </div>
        </div>
      </div>

      {/* Commission Structure */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          How You Earn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="text-5xl mb-4">💵</div>
            <h3 className="text-2xl font-bold text-blue-600 mb-2">1%</h3>
            <p className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Upfront Commission</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Earn 1% instantly when your referral invests
            </p>
            <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">Example:</p>
              <p className="text-lg font-bold text-blue-600">AED 5,000 investment = AED 50</p>
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
            <div className="text-5xl mb-4">♾️</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">0.5%</h3>
            <p className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Lifetime Trail</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Earn 0.5% every time they invest again
            </p>
            <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">Example:</p>
              <p className="text-lg font-bold text-green-600">AED 10,000 2nd investment = AED 50</p>
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-purple-600 mb-2">4%</h3>
            <p className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Volume Bonus</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bring AED 500K+ and earn up to 4%
            </p>
            <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">Example:</p>
              <p className="text-lg font-bold text-purple-600">AED 500K = AED 20,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Referral Link */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl shadow-md p-8 mb-8 border-2 border-indigo-200 dark:border-indigo-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Your Personal Referral Link
        </h2>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <code className="text-primary-600 font-mono text-sm flex-1 overflow-x-auto">
                {referralLink}
              </code>
              <button
                onClick={copyToClipboard}
                className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            Share this link with friends, family, or your network
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={shareOnWhatsApp}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Share on WhatsApp
            </button>
            <button
              onClick={shareOnSocial}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Share on Social
            </button>
          </div>
        </div>
      </div>

      {/* Performance Stats Dashboard */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Referrals */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">👥</div>
              <div className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                +3 this month
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {stats.totalReferrals}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Referrals</div>
            <div className="text-xs text-green-600 mt-2">
              {stats.activeReferrals} active • {stats.totalReferrals - stats.activeReferrals} pending
            </div>
          </div>

          {/* Commission Earned */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">💰</div>
              <div className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                All time
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {formatCurrency(stats.totalCommissionEarned)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Earned</div>
            <div className="text-xs text-blue-600 mt-2">
              {formatCurrency(stats.pendingCommission)} pending payout
            </div>
          </div>

          {/* Volume This Month */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📊</div>
              <div className="text-sm font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                This month
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {formatCurrency(stats.volumeThisMonth)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Investment Volume</div>
            <div className="text-xs text-orange-600 mt-2">
              {formatCurrency(500000 - stats.volumeThisMonth)} to next tier
            </div>
          </div>
        </div>

        {/* Lifetime Trail Income */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6 border-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-4xl mr-4">♾️</div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.lifetimeTrailEarning)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Lifetime Trail Commission Earned</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded">
                Passive Income
              </div>
              <div className="text-xs text-gray-500 mt-1">Earning even when you sleep</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 px-8 pt-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'referrals'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Referrals ({referrals.length})
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'leaderboard'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leaderboard
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                How the Referral Program Works
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="text-2xl mr-4">1️⃣</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Share your unique link</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Copy and share your referral link via WhatsApp, email, or social media
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-2xl mr-4">2️⃣</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Your friend signs up and invests</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      When they make their first investment, you earn 1% upfront commission
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-2xl mr-4">3️⃣</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Earn lifetime trail commission</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Every time they invest again, you earn 0.5% - forever!
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-2xl mr-4">4️⃣</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Volume bonuses unlock higher tiers</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Bring in AED 500K+ in total volume and earn up to 4% commission
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings Calculator */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border-2 border-indigo-200 dark:border-indigo-800">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Earnings Calculator
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">If you refer 10 friends</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Each invests AED 5,000/month</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">For 12 months</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Your potential earnings:</div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {formatCurrency(10 * 5000 * 0.01 + 10 * 5000 * 11 * 0.005)}
                    </div>
                    <div className="text-xs text-gray-500">
                      = AED 500 (upfront) + AED 2,750 (trail)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Your Referrals
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Investment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Your Commission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {referrals.map((referral) => (
                      <tr key={referral.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {referral.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {referral.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              referral.status === 'invested'
                                ? 'bg-green-100 text-green-800'
                                : referral.status === 'active'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {referral.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {referral.investmentAmount > 0
                            ? formatCurrency(referral.investmentAmount)
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          {referral.commission > 0
                            ? formatCurrency(referral.commission)
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(referral.joinedDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Top Referrers
              </h3>
              <div className="space-y-4">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                      entry.name === 'You'
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-700'
                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl font-bold text-gray-400 w-12 text-center">
                        #{entry.rank}
                      </div>
                      <div className="text-3xl">{entry.badge}</div>
                      <div>
                        <div className={`text-lg font-bold ${entry.name === 'You' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                          {entry.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {entry.referrals} referrals • {formatCurrency(entry.totalVolume)} volume
                        </div>
                      </div>
                    </div>
                    {entry.rank <= 3 && entry.name !== 'You' && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-primary-600">
                          Top Performer
                        </div>
                      </div>
                    )}
                    {entry.name === 'You' && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">
                          Your Rank
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Terms & Conditions
        </h2>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>1. Eligibility:</strong> All OWNLY registered users in good standing are eligible to participate in the referral program.
          </p>
          <p>
            <strong>2. Commission Structure:</strong> Earn 1% upfront commission on first investment + 0.5% lifetime trail commission on all subsequent investments.
          </p>
          <p>
            <strong>3. Volume Bonuses:</strong> Achieve AED 500K+ in total referral volume to unlock 4% commission tiers.
          </p>
          <p>
            <strong>4. Payout Terms:</strong> Commissions are paid monthly within 15 days of month-end, subject to minimum payout threshold of AED 100.
          </p>
          <p>
            <strong>5. Prohibited Activities:</strong> Spam, fraud, or misrepresentation will result in immediate disqualification and forfeiture of commissions.
          </p>
          <p>
            <strong>6. Program Changes:</strong> OWNLY reserves the right to modify or terminate the referral program at any time with 30 days notice.
          </p>
        </div>
      </div>
    </div>
  );
}
