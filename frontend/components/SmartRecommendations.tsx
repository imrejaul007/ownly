'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPercentage, getDealTypeLabel } from '@/lib/utils';
import { usePreferences } from '@/context/PreferencesContext';

interface RecommendedDeal {
  id: string;
  title: string;
  type: string;
  expectedRoi: number;
  minTicket: number;
  matchScore: number;
  matchReasons: string[];
  raisedAmount: number;
  targetAmount: number;
  investorCount: number;
}

interface SmartRecommendationsProps {
  userInvestments?: any[];
  riskProfile?: 'conservative' | 'moderate' | 'aggressive';
  maxRecommendations?: number;
}

export default function SmartRecommendations({
  userInvestments = [],
  riskProfile = 'moderate',
  maxRecommendations = 4
}: SmartRecommendationsProps) {
  const { formatCurrency } = usePreferences();
  const [recommendations, setRecommendations] = useState<RecommendedDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI-powered recommendations based on user profile
    const generateRecommendations = () => {
      const mockRecommendations: RecommendedDeal[] = [
        {
          id: 'rec-1',
          title: 'Premium Dubai Mall Kiosk',
          type: 'franchise',
          expectedRoi: 32,
          minTicket: 15000,
          matchScore: 95,
          matchReasons: [
            'Matches your risk profile',
            'Similar to your successful investments',
            'Strong historical performance in your portfolio'
          ],
          raisedAmount: 180000,
          targetAmount: 250000,
          investorCount: 12
        },
        {
          id: 'rec-2',
          title: 'Tech District Office Space',
          type: 'real_estate',
          expectedRoi: 22,
          minTicket: 25000,
          matchScore: 88,
          matchReasons: [
            'Diversifies your portfolio',
            'Low correlation with existing assets',
            'Preferred location category'
          ],
          raisedAmount: 450000,
          targetAmount: 600000,
          investorCount: 18
        },
        {
          id: 'rec-3',
          title: 'Luxury Watch Collection Fund',
          type: 'asset',
          expectedRoi: 45,
          minTicket: 50000,
          matchScore: 82,
          matchReasons: [
            'High ROI matches your goals',
            'Alternative asset for diversification',
            'Trending in your investor segment'
          ],
          raisedAmount: 320000,
          targetAmount: 500000,
          investorCount: 8
        },
        {
          id: 'rec-4',
          title: 'Smart Vending Machine Network',
          type: 'franchise',
          expectedRoi: 28,
          minTicket: 10000,
          matchScore: 76,
          matchReasons: [
            'Low entry point',
            'Passive income stream',
            'Strong market fundamentals'
          ],
          raisedAmount: 85000,
          targetAmount: 150000,
          investorCount: 15
        }
      ];

      // Sort by match score and limit
      const sorted = mockRecommendations
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, maxRecommendations);

      setRecommendations(sorted);
      setLoading(false);
    };

    setTimeout(generateRecommendations, 500);
  }, [userInvestments, riskProfile, maxRecommendations]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow-lg p-6 border-2 border-purple-200 dark:border-purple-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Smart Recommendations
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered matches based on your portfolio
            </p>
          </div>
        </div>
        <span className="badge bg-purple-600 text-white text-xs px-3 py-1">
          Beta
        </span>
      </div>

      {/* Risk Profile Info */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              {riskProfile === 'conservative' && <span className="text-2xl">🛡️</span>}
              {riskProfile === 'moderate' && <span className="text-2xl">⚖️</span>}
              {riskProfile === 'aggressive' && <span className="text-2xl">🚀</span>}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                {riskProfile} Investor Profile
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {userInvestments.length > 0
                  ? `Based on ${userInvestments.length} active investments`
                  : 'Based on initial assessment'
                }
              </div>
            </div>
          </div>
          <button className="text-xs text-purple-600 hover:text-purple-800 font-semibold">
            Update Profile →
          </button>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="space-y-4">
        {recommendations.map((deal, index) => (
          <Link key={deal.id} href={`/deals/${deal.id}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-500">
              {/* Match Score Badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge bg-primary-100 text-primary-800 text-xs">
                      {getDealTypeLabel(deal.type)}
                    </span>
                    {index === 0 && (
                      <span className="badge bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold">
                        🏆 Best Match
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {deal.title}
                  </h4>
                </div>
                <div className="flex flex-col items-end ml-4">
                  <div className="relative w-16 h-16">
                    <svg className="transform -rotate-90" width="64" height="64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${deal.matchScore * 1.76} 176`}
                        className="text-purple-600"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600">
                        {deal.matchScore}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Match</div>
                </div>
              </div>

              {/* Deal Stats */}
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Expected ROI</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatPercentage(deal.expectedRoi)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Min. Investment</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(deal.minTicket)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Investors</div>
                  <div className="text-lg font-bold text-blue-600">
                    {deal.investorCount}
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Why we recommend this:
                </div>
                <div className="space-y-1">
                  {deal.matchReasons.map((reason, i) => (
                    <div key={i} className="flex items-start text-xs">
                      <span className="text-purple-600 mr-2">✓</span>
                      <span className="text-gray-600 dark:text-gray-400">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Funding Progress */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${(deal.raisedAmount / deal.targetAmount) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatCurrency(deal.raisedAmount)} raised
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {Math.round((deal.raisedAmount / deal.targetAmount) * 100)}% funded
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full btn-primary text-sm py-2">
                View Deal Details →
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              How recommendations work
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Our AI analyzes your portfolio composition, investment history, risk tolerance, and performance goals to suggest deals that complement your existing investments while maintaining optimal diversification.
            </p>
          </div>
        </div>
      </div>

      {/* See All Link */}
      <div className="mt-4 text-center">
        <Link href="/deals" className="text-sm font-semibold text-purple-600 hover:text-purple-800">
          Browse All Deals →
        </Link>
      </div>
    </div>
  );
}
