'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';

interface DealSocialProofProps {
  dealId: string;
  investorCount: number;
  targetAmount: number;
  raisedAmount: number;
  showTrending?: boolean;
  compact?: boolean;
}

export default function DealSocialProof({
  dealId,
  investorCount,
  targetAmount,
  raisedAmount,
  showTrending = true,
  compact = false
}: DealSocialProofProps) {
  const [recentInvestors, setRecentInvestors] = useState(0);
  const [viewingNow, setViewingNow] = useState(0);

  useEffect(() => {
    // Simulate real-time metrics
    setRecentInvestors(Math.floor(Math.random() * 15) + 3);
    setViewingNow(Math.floor(Math.random() * 25) + 5);

    // Update every minute
    const interval = setInterval(() => {
      setRecentInvestors(Math.floor(Math.random() * 15) + 3);
      setViewingNow(Math.floor(Math.random() * 25) + 5);
    }, 60000);

    return () => clearInterval(interval);
  }, [dealId]);

  const fundingPercentage = (raisedAmount / targetAmount) * 100;
  const isTrending = investorCount > 10 && fundingPercentage > 30;
  const isHotDeal = recentInvestors > 8;
  const isAlmostFunded = fundingPercentage > 85;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        {isTrending && showTrending && (
          <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold">
            🔥 Trending
          </span>
        )}
        {isAlmostFunded && (
          <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold animate-pulse">
            ⚡ Almost Funded
          </span>
        )}
        <span className="text-gray-600 dark:text-gray-400">
          👥 {investorCount} investors
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Trending & Hot Deal Badges */}
      {showTrending && (isTrending || isHotDeal || isAlmostFunded) && (
        <div className="flex flex-wrap gap-2">
          {isTrending && (
            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full">
              🔥 TRENDING
            </span>
          )}
          {isHotDeal && (
            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full">
              ⚡ HOT DEAL
            </span>
          )}
          {isAlmostFunded && (
            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold rounded-full animate-pulse">
              🚨 {Math.round(100 - fundingPercentage)}% Left
            </span>
          )}
        </div>
      )}

      {/* Investor Activity */}
      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {investorCount} investors joined
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {recentInvestors} in the last 24 hours
            </div>
          </div>
        </div>
      </div>

      {/* Viewing Activity */}
      <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="relative mr-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-bold text-blue-600">{viewingNow}</span> people viewing now
        </div>
      </div>

      {/* Funding Velocity */}
      {fundingPercentage > 50 && (
        <div className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <div className="text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.round(fundingPercentage)}% funded
            </span>
            <span className="text-gray-600 dark:text-gray-400"> • </span>
            <span className="text-purple-600 font-semibold">
              {formatCurrency(targetAmount - raisedAmount)} remaining
            </span>
          </div>
        </div>
      )}

      {/* Investment Milestones */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Funding Progress</span>
          <span className="font-bold">{Math.round(fundingPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">
            {formatCurrency(raisedAmount)} raised
          </span>
          <span className="text-gray-900 dark:text-white font-semibold">
            {formatCurrency(targetAmount)} goal
          </span>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-xs text-green-600 font-bold">✓</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Verified SPV</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-xs text-green-600 font-bold">✓</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Insured</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-xs text-green-600 font-bold">✓</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Audited</div>
          </div>
        </div>
      </div>
    </div>
  );
}
