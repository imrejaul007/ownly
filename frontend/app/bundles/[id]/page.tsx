'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import {
  Package, TrendingUp, Shield, Clock, Users, Target, CheckCircle,
  ArrowLeft, Zap, DollarSign, Calendar, BarChart3, AlertCircle, Percent
} from 'lucide-react';
import ROICalculator from '@/components/ROICalculator';

interface Deal {
  id: string;
  title: string;
  slug: string;
  type: string;
  expected_roi: string;
  BundleDeal?: {
    allocation_percentage: string;
    is_core: boolean;
    weight: number;
  };
}

interface Bundle {
  id: string;
  name: string;
  slug: string;
  bundle_type: string;
  category: string;
  description: string;
  min_investment: string;
  target_amount: string;
  raised_amount: string;
  investor_count: number;
  expected_roi_min: string;
  expected_roi_max: string;
  holding_period_months: number;
  status: string;
  images: string[];
  features: string[];
  risk_level: string;
  diversification_score: number;
  deals?: Deal[];
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function BundleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investing, setInvesting] = useState(false);
  const [investmentError, setInvestmentError] = useState<string | null>(null);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bundles/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setBundle(data.data);
        } else {
          setError('Bundle not found');
        }
      } catch (err) {
        console.error('Error fetching bundle:', err);
        setError('Failed to load bundle');
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [params.id]);

  const handleInvest = async () => {
    if (!bundle) return;

    setInvesting(true);
    setInvestmentError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bundles/${bundle.id}/invest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(bundle.min_investment)
        })
      });

      const data = await response.json();

      if (data.success) {
        setInvestmentSuccess(true);
        setTimeout(() => {
          router.push('/portfolio');
        }, 2000);
      } else {
        setInvestmentError(data.message || 'Failed to process investment');
      }
    } catch (error: any) {
      console.error('Investment error:', error);
      setInvestmentError('Failed to process investment. Please try again.');
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading bundle...</p>
        </div>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-4">Bundle Not Found</h2>
          <p className="text-purple-300 mb-6">{error || 'The bundle you are looking for does not exist.'}</p>
          <Link href="/bundles" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Bundles
          </Link>
        </div>
      </div>
    );
  }

  const avgROI = (parseFloat(bundle.expected_roi_min) + parseFloat(bundle.expected_roi_max)) / 2;
  const minInvestment = parseFloat(bundle.min_investment);
  const projectedReturns = (minInvestment * avgROI) / 100;
  const totalReturn = minInvestment + projectedReturns;
  const fundingProgress = (parseFloat(bundle.raised_amount) / parseFloat(bundle.target_amount)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/bundles"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bundles
          </Link>

          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1.5 mb-4">
                <Package className="w-4 h-4 text-purple-300" />
                <span className="text-purple-200 text-sm font-semibold capitalize">{bundle.bundle_type.replace('_', ' ')}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-4">
                {bundle.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-purple-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-3xl font-bold text-green-400">{avgROI.toFixed(1)}%</span>
                  <span className="text-sm">Avg ROI</span>
                </div>
                <div className="w-px h-6 bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{bundle.holding_period_months} months</span>
                </div>
                <div className="w-px h-6 bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="capitalize">{bundle.risk_level} risk</span>
                </div>
                <div className="w-px h-6 bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>{bundle.diversification_score}/100 diversification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Investment Calculator */}
            <div className="bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-yellow-300" />
                <h2 className="text-2xl font-bold text-white">Investment Calculator</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-sm text-green-100 mb-2">You Invest</div>
                  <div className="text-3xl font-bold text-white">{formatCurrency(parseFloat(bundle.min_investment))}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-sm text-green-100 mb-2">Projected Returns ({bundle.holding_period_months} months)</div>
                  <div className="text-3xl font-bold text-white">+{formatCurrency(projectedReturns)}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-sm text-green-100 mb-2">Total Value</div>
                  <div className="text-3xl font-bold text-white">{formatCurrency(totalReturn)}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">About This Bundle</h2>
              </div>
              <p className="text-purple-100 leading-relaxed">{bundle.description}</p>
            </div>

            {/* Asset Allocation - Show deal allocation percentages */}
            {bundle.deals && bundle.deals.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Deal Allocation</h2>
                </div>

                <div className="space-y-4">
                  {bundle.deals.map((deal) => {
                    const allocation = parseFloat(deal.BundleDeal?.allocation_percentage || '0');
                    const isCore = deal.BundleDeal?.is_core || false;

                    return (
                      <div key={deal.id}>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{deal.title}</span>
                            {isCore && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full px-2 py-0.5">
                                CORE
                              </span>
                            )}
                          </div>
                          <span className="text-purple-200">{allocation}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                            style={{ width: `${allocation}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-purple-300 mt-1 flex items-center justify-between">
                          <span>{formatCurrency((minInvestment * allocation) / 100)} allocated</span>
                          <span className="text-green-400">{deal.expected_roi}% ROI</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Features */}
            {bundle.features && bundle.features.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Key Features</h2>
                </div>

                <ul className="space-y-3">
                  {bundle.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-purple-100">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ROI Calculator */}
            <ROICalculator
              minInvestment={parseFloat(bundle.min_investment)}
              expectedROIMin={parseFloat(bundle.expected_roi_min)}
              expectedROIMax={parseFloat(bundle.expected_roi_max)}
              holdingPeriodMonths={bundle.holding_period_months}
            />

            {/* Included Deals */}
            {bundle.deals && bundle.deals.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Included Deals ({bundle.deals.length})</h2>
                </div>

                <div className="space-y-3">
                  {bundle.deals.map(deal => (
                    <Link
                      key={deal.id}
                      href={`/deals/${deal.slug}`}
                      className="block bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all hover:scale-102"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">{deal.title}</div>
                          <div className="flex items-center gap-3 text-sm text-purple-300">
                            <span className="capitalize">{deal.type}</span>
                            <span>•</span>
                            <span className="text-green-400">{deal.expected_roi}% ROI</span>
                            {deal.BundleDeal?.is_core && (
                              <>
                                <span>•</span>
                                <span className="text-yellow-400">Core Holding</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-purple-400 font-semibold">
                          {parseFloat(deal.BundleDeal?.allocation_percentage || '0')}% →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sticky top-4">
              <h3 className="text-xl font-bold text-white mb-4">Start Investing</h3>

              <div className="mb-6">
                <div className="text-sm text-purple-300 mb-2">Minimum Investment</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {formatCurrency(minInvestment)}
                </div>
              </div>

              <button
                onClick={() => setShowInvestModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all mb-4"
              >
                Invest in This Bundle
              </button>

              <div className="text-xs text-purple-300 text-center mb-4">
                By investing, you agree to OWNLY's terms and conditions
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">ROI Range</span>
                  <span className="font-semibold text-white">{bundle.expected_roi_min}% - {bundle.expected_roi_max}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">Duration</span>
                  <span className="font-semibold text-white">{bundle.holding_period_months} months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">Risk Level</span>
                  <span className="font-semibold text-white capitalize">{bundle.risk_level}</span>
                </div>
                {bundle.deals && (
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Deals Included</span>
                    <span className="font-semibold text-white">{bundle.deals.length}</span>
                  </div>
                )}
                {fundingProgress > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Funding Progress</span>
                    <span className="font-semibold text-white">{fundingProgress.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Why This Bundle */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white">Why This Bundle?</h3>
              </div>
              <p className="text-sm text-purple-100">
                This curated bundle offers instant portfolio diversification with professional asset allocation,
                saving you time while maximizing returns through strategic sector exposure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Invest in {bundle.name}</h2>

            {investmentSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Investment Successful!</h3>
                <p className="text-purple-200">
                  Redirecting to your portfolio...
                </p>
              </div>
            ) : (
              <>
                <p className="text-purple-200 mb-6">
                  You are about to invest {formatCurrency(minInvestment)} in this bundle.
                </p>

                {investmentError && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{investmentError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={handleInvest}
                    disabled={investing}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {investing ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        Processing...
                      </span>
                    ) : (
                      'Confirm Investment'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowInvestModal(false);
                      setInvestmentError(null);
                    }}
                    disabled={investing}
                    className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-semibold hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
