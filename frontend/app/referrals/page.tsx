'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'OWNLY-REF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const referralLink = `https://ownly.ae/join/${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Share on WhatsApp
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Share on Social
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
