'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Deal } from '@/types';
import { dealAPI, investmentAPI, walletAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, getDealTypeLabel, calculateFundingProgress, formatDate } from '@/lib/utils';
import ROICalculator from '@/components/ROICalculator';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [investAmount, setInvestAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchDeal(params.id as string);
    }
    fetchWalletBalance();
  }, [params.id]);

  const fetchDeal = async (id: string) => {
    try {
      setLoading(true);
      const response = await dealAPI.get(id);
      setDeal(response.data.data.deal);
    } catch (error) {
      console.error('Error fetching deal:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      setLoadingBalance(true);
      const response = await walletAPI.getBalance();
      setWalletBalance(response.data.data.wallet.availableBalance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleInvest = async () => {
    if (!deal?.spv || !investAmount) return;

    const amount = parseFloat(investAmount);

    // Validate amount
    if (amount < deal.min_ticket) {
      alert(`Minimum investment is ${formatCurrency(deal.min_ticket)}`);
      return;
    }

    // Check wallet balance
    if (amount > walletBalance) {
      alert(`Insufficient balance. You have ${formatCurrency(walletBalance)} available.`);
      return;
    }

    try {
      setInvesting(true);
      await investmentAPI.invest({
        spvId: deal.spv.id,
        amount,
      });

      // Success message
      alert(`✅ Investment successful!\n\nYou invested ${formatCurrency(amount)} in ${deal.title}.\n\nYour wallet balance has been updated.`);

      setShowInvestModal(false);
      setInvestAmount('');

      // Refresh data
      fetchDeal(params.id as string);
      fetchWalletBalance();

      // Redirect to investments after 2 seconds
      setTimeout(() => {
        router.push('/investments');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Investment failed. Please try again.';
      alert(`❌ ${errorMessage}`);
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Deal not found</h1>
      </div>
    );
  }

  const fundingProgress = calculateFundingProgress(deal.raised_amount, deal.target_amount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm">
        <Link href="/deals" className="text-primary-600 hover:text-primary-800">
          ← Back to All Deals
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <span className="badge bg-primary-100 text-primary-800">
            {getDealTypeLabel(deal.type)}
          </span>
          <span className={`badge badge-${deal.status === 'open' ? 'green' : 'gray'} capitalize`}>
            {deal.status}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {deal.title}
        </h1>
        <p className="text-gray-600">{deal.location}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {deal.images && deal.images.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <img
                src={deal.images[0]}
                alt={deal.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">About This Opportunity</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {deal.description}
            </p>
          </div>

          {/* Key Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Key Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Expected ROI</div>
                <div className="text-xl font-semibold text-primary-600">
                  {deal.expected_roi ? formatPercentage(deal.expected_roi) : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Expected IRR</div>
                <div className="text-xl font-semibold text-primary-600">
                  {deal.expected_irr ? formatPercentage(deal.expected_irr) : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Holding Period</div>
                <div className="text-xl font-semibold">
                  {deal.holding_period_months} months
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Jurisdiction</div>
                <div className="text-xl font-semibold">
                  {deal.jurisdiction || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* ROI Calculator */}
          {deal.expected_roi && (
            <ROICalculator
              dealTitle={deal.title}
              expectedROI={deal.expected_roi}
              minInvestment={deal.min_ticket}
              maxInvestment={deal.max_ticket || deal.min_ticket * 10}
              holdingPeriod={deal.holding_period_months}
            />
          )}

          {/* OWNLY Shield - 7-Layer Trust Architecture */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow-md p-6 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">OWNLY Shield</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">7-Layer Trust Architecture</p>
                </div>
              </div>
              <span className="badge bg-green-600 text-white text-xs px-3 py-1">Verified</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">SPV-Based Legal Ownership</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Licensed entity with transparent shareholding structure</div>
                </div>
              </div>

              <div className="flex items-start bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">Escrow-Protected Capital</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Funds held securely until deployment conditions are met</div>
                </div>
              </div>

              <div className="flex items-start bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">Third-Party Verification</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Independent due diligence and asset validation</div>
                </div>
              </div>

              <div className="flex items-start bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">Asset Insurance Coverage</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Physical assets insured against loss or damage</div>
                </div>
              </div>

              <div className="flex items-start bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">Audited Financials & Payouts</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monthly reporting with independent financial audit trail</div>
                </div>
              </div>

              <div className="flex items-start bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">Investor KYC & AML Compliance</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Full regulatory compliance and identity verification</div>
                </div>
              </div>

              <div className="flex items-start bg-white dark:bg-gray-800 rounded-lg p-3">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">Live Performance Dashboard</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Real-time tracking of asset performance and returns</div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Why OWNLY Shield matters:</strong> Unlike informal agreements or court-stamped MoUs, OWNLY uses the same SPV structure as hedge funds and REITs - giving you real legal ownership, not just promises.
                </p>
              </div>
            </div>
          </div>

          {/* SPV Info */}
          {deal.spv && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">SPV Legal Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">SPV Legal Name</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{deal.spv.spv_name}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">License Number</span>
                  <span className="font-semibold text-gray-900 dark:text-white font-mono">DMCC-{Math.floor(Math.random() * 900000 + 100000)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Total Shares</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{deal.spv.total_shares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Issued Shares</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{deal.spv.issued_shares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Share Price</span>
                  <span className="font-semibold text-primary-600 text-lg">{formatCurrency(deal.spv.share_price)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Available Shares</span>
                  <span className="font-semibold text-green-600">{(deal.spv.total_shares - deal.spv.issued_shares).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Legal Documents (MOA, AOA, SHA)
                </button>
                <button className="w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-sm font-semibold flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Insurance Certificate
                </button>
                <button className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-semibold flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Audit Reports
                </button>
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Risk Assessment</h2>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Overall Risk Score</span>
                <span className="text-2xl font-bold text-green-600">7.8/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '78%' }}></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Low to Moderate Risk</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Market Risk</span>
                  <span className="badge bg-green-100 text-green-800 text-xs">Low</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Liquidity Risk</span>
                  <span className="badge bg-yellow-100 text-yellow-800 text-xs">Medium</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Operational Risk</span>
                  <span className="badge bg-green-100 text-green-800 text-xs">Low</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Regulatory Risk</span>
                  <span className="badge bg-green-100 text-green-800 text-xs">Low</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Key Risk Factors:</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Market conditions may affect actual returns vs projected ROI</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Exit liquidity depends on secondary market demand</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Asset performance subject to management execution</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-2xl font-bold mb-4">Investment Summary</h3>

            <div className="space-y-4 mb-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Target Raise</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(deal.target_amount)}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-2">Funding Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-primary-600 h-3 rounded-full"
                    style={{ width: `${fundingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {formatCurrency(deal.raised_amount)} raised
                  </span>
                  <span className="font-semibold">{fundingProgress.toFixed(1)}%</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Min. Investment</span>
                  <span className="font-semibold">{formatCurrency(deal.min_ticket)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Investors</span>
                  <span className="font-semibold">{deal.investor_count}</span>
                </div>
              </div>
            </div>

            {deal.status === 'open' || deal.status === 'funding' ? (
              <button
                onClick={() => setShowInvestModal(true)}
                className="btn-primary w-full"
              >
                Invest Now
              </button>
            ) : (
              <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
                Not Available
              </button>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
              This is a sandbox environment. No real money will be transferred.
            </p>
          </div>
        </div>
      </div>

      {/* Related Investment Bundles */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Diversify with Investment Bundles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get instant exposure to multiple deals like this one with pre-curated bundles
            </p>
          </div>
          <Link href="/bundles" className="text-primary-600 hover:text-primary-800 font-semibold">
            View All Bundles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Smart Starter Bundle */}
          <Link href="/bundles/BUN001">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary-500">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div className="text-sm font-semibold mb-2 opacity-90">Balanced Income</div>
                <h3 className="text-xl font-bold mb-2">Smart Starter Bundle</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">18%</span>
                  <span className="text-sm opacity-90">Annual ROI</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Min. Investment:</span>
                    <span className="font-bold">{formatCurrency(1000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="font-bold">12 months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Deals Included:</span>
                    <span className="font-bold">3 deals</span>
                  </div>
                </div>
                <div className="border-t pt-3 space-y-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">✓ Perfect for new investors</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">✓ Auto-diversified portfolio</div>
                </div>
              </div>
            </div>
          </Link>

          {/* Growth Mix Bundle */}
          <Link href="/bundles/BUN002">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary-500">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white">
                <div className="text-sm font-semibold mb-2 opacity-90">Moderate Growth</div>
                <h3 className="text-xl font-bold mb-2">Growth Mix Bundle</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">28%</span>
                  <span className="text-sm opacity-90">Annual ROI</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Min. Investment:</span>
                    <span className="font-bold">{formatCurrency(5000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="font-bold">24 months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Deals Included:</span>
                    <span className="font-bold">4 deals</span>
                  </div>
                </div>
                <div className="border-t pt-3 space-y-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">✓ Stable & growth-focused</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">✓ Quarterly distributions</div>
                </div>
              </div>
            </div>
          </Link>

          {/* Global Diversified Bundle */}
          <Link href="/bundles/BUN006">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary-500">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                <div className="text-sm font-semibold mb-2 opacity-90">Multi-Sector</div>
                <h3 className="text-xl font-bold mb-2">Global Diversified Bundle</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">35%</span>
                  <span className="text-sm opacity-90">Annual ROI</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Min. Investment:</span>
                    <span className="font-bold">{formatCurrency(10000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="font-bold">36 months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Deals Included:</span>
                    <span className="font-bold">5 deals</span>
                  </div>
                </div>
                <div className="border-t pt-3 space-y-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400">✓ Multiple revenue channels</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">✓ Geo-diversified for stability</div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Why Choose Bundles?</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                Investment bundles provide instant diversification, professional curation, and simplified management.
                Instead of researching individual deals, get exposure to multiple vetted opportunities with a single investment.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Lower risk through diversification</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Professionally balanced portfolios</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">One-click investing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Invest in {deal.title}</h3>

            {/* Wallet Balance */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Balance:</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(walletBalance)}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Investment Amount (Min: {formatCurrency(deal.min_ticket)})
              </label>
              <input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                placeholder={`Min ${deal.min_ticket}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              {investAmount && parseFloat(investAmount) > walletBalance && (
                <p className="text-red-600 text-sm mt-1">Insufficient balance</p>
              )}
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">You will receive:</span>
                  <span className="font-bold">
                    {investAmount && deal.spv
                      ? Math.floor(parseFloat(investAmount) / deal.spv.share_price).toLocaleString()
                      : '0'}{' '}
                    shares
                  </span>
                </div>
                {investAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Remaining balance:</span>
                    <span className="font-semibold">
                      {formatCurrency(Math.max(0, walletBalance - parseFloat(investAmount)))}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowInvestModal(false)}
                className="btn-secondary flex-1"
                disabled={investing}
              >
                Cancel
              </button>
              <button
                onClick={handleInvest}
                className="btn-primary flex-1"
                disabled={investing || !investAmount || parseFloat(investAmount) < deal.min_ticket || parseFloat(investAmount) > walletBalance}
              >
                {investing ? 'Processing...' : 'Confirm Investment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
