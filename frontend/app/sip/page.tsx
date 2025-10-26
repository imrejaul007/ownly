'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import {
  ArrowLeft, TrendingUp, Zap, Target, RefreshCw, Sparkles,
  CheckCircle, Clock, Shield, AlertCircle, Filter, Calendar,
  DollarSign, BarChart3, ArrowRight, Repeat
} from 'lucide-react';

interface SIPPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  plan_type: string;
  monthly_amount_min: string;
  monthly_amount_max: string;
  duration_months_min: number;
  duration_months_max: number;
  expected_roi_min: string;
  expected_roi_max: string;
  bundle_id: string | null;
  auto_rebalance: boolean;
  auto_compound: boolean;
  risk_level: string;
  status: string;
  features: string[];
  allocation_strategy: any;
  images: string[];
  bundle?: {
    id: string;
    name: string;
    category: string;
  };
}

export default function SIPPlansPage() {
  const [plans, setPlans] = useState<SIPPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sip/plans`);
        const data = await response.json();

        if (data.success) {
          setPlans(data.data);
        } else {
          setError('Failed to load SIP plans');
        }
      } catch (err) {
        console.error('Error fetching SIP plans:', err);
        setError('Failed to load SIP plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const filteredPlans = filter
    ? plans.filter(p => p.plan_type === filter)
    : plans;

  const planTypes = ['conservative', 'balanced', 'aggressive', 'luxury', 'custom'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading SIP plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg">{error}</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Repeat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                SIP Investment Plans
              </h1>
            </div>
          </div>
          <p className="text-purple-200 text-lg">
            Systematic Investment Plans - Build wealth through monthly automated investments
          </p>
        </div>

        {/* Benefits Banner */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl p-8 mb-8 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Why Choose SIP Plans?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Consistent Wealth Building</h3>
                  <p className="text-purple-100 text-sm">Invest small amounts monthly, grow big over time</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Fully Automated</h3>
                  <p className="text-purple-100 text-sm">Set it and forget it - auto-investing every month</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Dollar-Cost Averaging</h3>
                  <p className="text-purple-100 text-sm">Reduce market timing risk automatically</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-purple-300" />
            <h3 className="text-lg font-semibold text-white">Filter by Type</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilter('')}
              className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                filter === ''
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              All Plans
            </button>
            {planTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all capitalize ${
                  filter === type
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        {filteredPlans.length === 0 ? (
          <div className="text-center py-20">
            <Repeat className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
            <p className="text-purple-200 text-lg">No SIP plans found.</p>
            <button
              onClick={() => setFilter('')}
              className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPlans.map(plan => (
              <SIPPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              How SIP Plans Work
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-xl text-white mb-2">1. Choose Your Plan</h3>
              <p className="text-purple-200 text-sm">
                Select a SIP plan based on your risk appetite and monthly budget
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-xl text-white mb-2">2. Set Monthly Amount</h3>
              <p className="text-purple-200 text-sm">
                Decide how much you want to invest every month
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-bold text-xl text-white mb-2">3. Auto-Invest</h3>
              <p className="text-purple-200 text-sm">
                Your chosen amount gets invested automatically each month
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="font-bold text-xl text-white mb-2">4. Track & Grow</h3>
              <p className="text-purple-200 text-sm">
                Watch your wealth compound over time with monthly reports
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function SIPPlanCard({ plan }: { plan: SIPPlan }) {
  const getTypeColor = (type: string) => {
    const colors: any = {
      'conservative': 'from-green-500 to-emerald-600',
      'balanced': 'from-blue-500 to-cyan-600',
      'aggressive': 'from-purple-500 to-pink-600',
      'luxury': 'from-yellow-500 to-orange-600',
      'custom': 'from-gray-600 to-slate-700',
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getRiskColor = (risk: string) => {
    const colors: any = {
      'low': 'text-green-400 bg-green-500/10 border-green-500/20',
      'medium': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      'high': 'text-red-400 bg-red-500/10 border-red-500/20',
    };
    return colors[risk] || 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  const avgROI = (parseFloat(plan.expected_roi_min) + parseFloat(plan.expected_roi_max)) / 2;

  return (
    <Link href={`/sip/${plan.id}`}>
      <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer overflow-hidden h-full flex flex-col hover:scale-105 duration-300 shadow-2xl">
        {/* Header with Gradient */}
        <div className={`bg-gradient-to-r ${getTypeColor(plan.plan_type)} p-6 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="text-xs font-semibold mb-2 opacity-90 uppercase tracking-wider">{plan.plan_type}</div>
            <h3 className="text-2xl font-bold mb-3 line-clamp-2">{plan.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{avgROI.toFixed(1)}%</span>
              <span className="text-sm opacity-90">Expected ROI</span>
            </div>
            <div className="text-xs opacity-75 mt-1">
              {plan.expected_roi_min}% - {plan.expected_roi_max}% range
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-purple-300 mb-2">
                <Calendar className="w-3 h-3" />
                Monthly Investment
              </div>
              <div className="font-bold text-sm text-white">
                {formatCurrency(parseFloat(plan.monthly_amount_min))} - {formatCurrency(parseFloat(plan.monthly_amount_max))}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-purple-300 mb-2">
                <Clock className="w-3 h-3" />
                Duration Range
              </div>
              <div className="font-bold text-sm text-white">
                {plan.duration_months_min} - {plan.duration_months_max} months
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-purple-300 mb-2">
                <Shield className="w-3 h-3" />
                Risk Level
              </div>
              <div className={`font-semibold text-sm capitalize px-2 py-1 rounded-lg border ${getRiskColor(plan.risk_level)}`}>
                {plan.risk_level}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-purple-300 mb-2">
                <AlertCircle className="w-3 h-3" />
                Status
              </div>
              <div className={`font-semibold text-sm capitalize ${
                plan.status === 'active' ? 'text-green-400' : 'text-gray-400'
              }`}>
                {plan.status}
              </div>
            </div>
          </div>

          {/* Linked Bundle */}
          {plan.bundle && (
            <div className="mb-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="text-xs text-blue-300 mb-1">Auto-invests in</div>
              <div className="font-semibold text-sm text-blue-400">
                {plan.bundle.name}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <p className="text-sm text-purple-200 line-clamp-3">
              {plan.description}
            </p>
          </div>

          {/* Features */}
          <div className="mt-auto">
            <div className="text-sm font-semibold text-white mb-3">Key Features</div>
            <ul className="space-y-2 mb-4">
              {plan.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="text-xs text-purple-200 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Additional Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {plan.auto_rebalance && (
                <span className="text-xs px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Auto-Rebalance
                </span>
              )}
              {plan.auto_compound && (
                <span className="text-xs px-3 py-1.5 bg-green-500/20 text-green-300 rounded-full border border-green-500/30 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Auto-Compound
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
            Start Monthly Investment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
