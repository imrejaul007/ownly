'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, UserPlus, ShieldCheck, Wallet, Search, TrendingUp, Coins,
  ArrowRight, CheckCircle, Building2, Package, Target, Clock,
  AlertCircle, Eye, MessageSquare, FileText, PieChart, BarChart3,
  Repeat, Lock, Scale, Globe, Zap, DollarSign, Percent, Award,
  TrendingDown, Calculator, HelpCircle, Star, PlayCircle, ChevronDown
} from 'lucide-react';

export default function HowToInvestPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeInvestmentType, setActiveInvestmentType] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [calculatorAmount, setCalculatorAmount] = useState(5000);
  const [calculatorROI, setCalculatorROI] = useState(18);

  const investmentSteps = [
    {
      number: 1,
      title: 'Sign Up & Verify',
      description: 'Create your account and complete KYC verification to unlock investment opportunities.',
      icon: UserPlus,
      color: 'from-blue-500 to-cyan-500',
      duration: '5 minutes',
      details: [
        'Sign up with email or phone number',
        'Complete KYC with Emirates ID or Passport',
        'Verify your identity via selfie',
        'Get approved within 24 hours'
      ]
    },
    {
      number: 2,
      title: 'Fund Your Wallet',
      description: 'Add funds securely to start investing immediately.',
      icon: Wallet,
      color: 'from-purple-500 to-pink-500',
      duration: 'Instant',
      details: [
        'Bank transfer (local & international)',
        'Credit/Debit card (Visa, Mastercard)',
        'Minimum deposit: AED 500',
        'No hidden fees, instant credit'
      ]
    },
    {
      number: 3,
      title: 'Browse & Analyze',
      description: 'Explore vetted deals across real estate, franchises, and alternative assets.',
      icon: Search,
      color: 'from-orange-500 to-red-500',
      duration: '15-30 minutes',
      details: [
        'Filter by asset type, ROI, and risk level',
        'View detailed due diligence reports',
        'Check property docs, financials, and projections',
        'Compare multiple investment opportunities'
      ]
    },
    {
      number: 4,
      title: 'Invest & Own',
      description: 'Invest as little as AED 500 and become a fractional owner.',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      duration: '2 minutes',
      details: [
        'Select investment amount (min AED 500)',
        'Review SPV terms and legal structure',
        'Confirm investment with one click',
        'Receive digital ownership certificate'
      ]
    },
    {
      number: 5,
      title: 'Earn Returns',
      description: 'Start earning monthly distributions and track your portfolio.',
      icon: Coins,
      color: 'from-teal-500 to-cyan-500',
      duration: 'Ongoing',
      details: [
        'Monthly rental income or business distributions',
        'Automatic payout to your wallet',
        'Real-time portfolio tracking',
        'Reinvest or withdraw anytime'
      ]
    }
  ];

  const investmentOptions = [
    {
      title: 'Direct Deals',
      description: 'Invest in individual properties, franchises, or businesses',
      icon: Building2,
      color: 'blue',
      minInvest: 'AED 500',
      avgROI: '12-25%',
      duration: '1-5 years',
      features: [
        'Choose specific assets you believe in',
        'Full transparency on deal structure',
        'Monthly income distributions',
        'Exit through asset sale or secondary market'
      ]
    },
    {
      title: 'Bundles',
      description: 'Diversified portfolios of pre-selected assets',
      icon: Package,
      color: 'purple',
      minInvest: 'AED 2,000',
      avgROI: '15-20%',
      duration: '2-3 years',
      features: [
        'Instant diversification across asset classes',
        'Professional portfolio management',
        'Lower risk through diversification',
        'Rebalancing and optimization included'
      ]
    },
    {
      title: 'SIP (Systematic Investment Plan)',
      description: 'Automated monthly investments for long-term wealth',
      icon: Repeat,
      color: 'green',
      minInvest: 'AED 500/month',
      avgROI: '18-22%',
      duration: '3-10 years',
      features: [
        'Auto-invest monthly from your wallet',
        'Rupee cost averaging benefits',
        'Compounding returns over time',
        'Pause or adjust anytime'
      ]
    }
  ];

  const howDealsWork = [
    {
      stage: 'Due Diligence',
      description: 'Every asset undergoes rigorous 7-step verification',
      icon: FileText,
      color: 'blue',
      points: [
        'Legal title verification & ownership proof',
        'Financial audit & revenue validation',
        'Market analysis & comparable valuation',
        'Physical inspection & condition assessment',
        'Tenant/operator background checks',
        'Risk assessment & mitigation planning',
        'Third-party appraisal & compliance review'
      ]
    },
    {
      stage: 'SPV Structure',
      description: 'Your investment is protected through a Special Purpose Vehicle',
      icon: Scale,
      color: 'purple',
      points: [
        'Dedicated legal entity per asset',
        'Your ownership is legally registered',
        'Bankruptcy remote from OWNLY platform',
        '7-layer trust architecture protection',
        'Transparent governance and reporting',
        'Professional asset management',
        'Regular audits and compliance checks'
      ]
    },
    {
      stage: 'Monthly Payouts',
      description: 'Earn regular passive income from your investments',
      icon: DollarSign,
      color: 'green',
      points: [
        'Rental income distributed monthly',
        'Business profits shared quarterly',
        'Automatic payment to your wallet',
        'Detailed breakdown and reports',
        'Tax documentation provided',
        'Reinvestment option available',
        'Compound your returns over time'
      ]
    }
  ];

  const riskLevels = [
    {
      level: 'Low Risk',
      range: '8-12% ROI',
      examples: ['Prime real estate', 'Established franchises', 'Government-backed assets'],
      icon: ShieldCheck,
      color: 'green'
    },
    {
      level: 'Medium Risk',
      range: '12-18% ROI',
      examples: ['Commercial properties', 'Growing businesses', 'Trade finance'],
      icon: BarChart3,
      color: 'yellow'
    },
    {
      level: 'High Risk',
      range: '18-30% ROI',
      examples: ['Startups', 'Luxury assets', 'Development projects'],
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const faqs = [
    {
      q: 'What is the minimum investment amount?',
      a: 'The minimum investment is AED 500 for direct deals and SIP plans. For Bundles, the minimum is AED 2,000. This allows you to start investing with minimal capital and diversify across multiple assets.'
    },
    {
      q: 'How do I earn returns?',
      a: 'You earn monthly rental income from real estate, quarterly distributions from businesses, and capital gains when assets are sold. All payments are automatically credited to your OWNLY wallet.'
    },
    {
      q: 'What is an SPV and how does it protect me?',
      a: 'A Special Purpose Vehicle (SPV) is a dedicated legal entity that holds each asset. Your fractional ownership is legally registered in the SPV, protecting your investment even if OWNLY ceases operations. This is bankruptcy remote and provides 7-layer legal protection.'
    },
    {
      q: 'Can I sell my investment before the deal ends?',
      a: 'Yes! Our Secondary Exchange allows you to trade ownership tokens with other investors anytime. This provides liquidity for investments that traditionally require years to exit. Note that prices fluctuate based on supply and demand.'
    },
    {
      q: 'What fees does OWNLY charge?',
      a: 'OWNLY charges a one-time setup fee (7% of investment) and annual management fee (10% of distributions). No hidden fees. All costs are clearly disclosed before you invest. View our detailed fee structure at /fees.'
    },
    {
      q: 'Are my investments insured?',
      a: 'Assets are insured against physical damage and liability. Your legal ownership is protected through SPV structure. However, investment returns are not guaranteed and depend on asset performance. Please review risk disclosures carefully.'
    },
    {
      q: 'How are returns taxed?',
      a: 'UAE residents enjoy 0% personal income tax on investment returns. International investors should consult local tax advisors. We provide detailed transaction reports for tax filing purposes.'
    },
    {
      q: 'What happens if a property remains vacant?',
      a: 'Each deal has a reserve fund (3-6 months) to cover vacancy periods. If vacancy extends, distributions pause until a new tenant is secured. You retain ownership and benefit when the property is re-leased or sold.'
    },
    {
      q: 'How do I track my investments?',
      a: 'Your dashboard provides real-time portfolio tracking, monthly performance reports, upcoming distributions, and asset updates. You also receive email/SMS notifications for important events.'
    },
    {
      q: 'Can I invest from outside the UAE?',
      a: 'Yes! We accept international investors from most countries (excluding sanctioned regions). You can fund your wallet via international bank transfer or supported payment methods. KYC requirements apply.'
    }
  ];

  const monthlyReturn = (calculatorAmount * (calculatorROI / 100)) / 12;
  const annualReturn = calculatorAmount * (calculatorROI / 100);
  const fiveYearReturn = calculatorAmount * Math.pow(1 + (calculatorROI / 100), 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-semibold">Complete Investor Guide</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              How to Invest on OWNLY
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Your step-by-step guide to building wealth through fractional ownership of
              <span className="text-blue-400 font-bold"> premium real-world assets</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all">
                Start Investing Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/deals" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all">
                <Eye className="w-5 h-5" />
                Browse Deals
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'Min Investment', value: 'AED 500', icon: DollarSign },
                { label: 'Avg Returns', value: '12-25%', icon: TrendingUp },
                { label: 'Active Deals', value: '14+', icon: Building2 },
                { label: 'Investors', value: '500+', icon: Globe }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Investment Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">5 Simple Steps to Start Investing</h2>
          <p className="text-xl text-gray-400">From signup to earning passive income</p>
        </div>

        {/* Progress Tracker */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex items-center justify-between min-w-max md:min-w-0 px-4">
            {investmentSteps.map((step, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <button
                  onClick={() => setActiveStep(idx)}
                  className={`flex flex-col items-center min-w-max px-4 transition-all ${
                    activeStep === idx ? 'scale-110' : 'opacity-70'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold mb-2 ${
                    activeStep === idx
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl'
                      : 'bg-white/10 text-gray-500'
                  }`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <span className={`text-sm font-semibold ${activeStep === idx ? 'text-white' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </button>
                {idx < investmentSteps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 ${activeStep > idx ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/10'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Step Details */}
        <div className="max-w-5xl mx-auto">
          {investmentSteps.map((step, idx) => (
            <div
              key={idx}
              className={`transition-all duration-500 ${
                activeStep === idx ? 'block' : 'hidden'
              }`}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className={`bg-gradient-to-r ${step.color} w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="text-sm font-bold text-blue-400">STEP {step.number}</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                        {step.duration}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-xl text-gray-300 mb-8">{step.description}</p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {step.details.map((detail, detailIdx) => (
                        <div key={detailIdx} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{detail}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 mt-8">
                      {idx > 0 && (
                        <button
                          onClick={() => setActiveStep(idx - 1)}
                          className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                        >
                          Previous
                        </button>
                      )}
                      {idx < investmentSteps.length - 1 && (
                        <button
                          onClick={() => setActiveStep(idx + 1)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
                        >
                          Next Step
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Options */}
      <div className="py-20 bg-gradient-to-r from-indigo-950/30 to-purple-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Investment Style</h2>
            <p className="text-xl text-gray-400">Three ways to invest based on your goals and strategy</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {investmentOptions.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setActiveInvestmentType(idx)}
                className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-8 text-left hover:scale-105 transition-all ${
                  activeInvestmentType === idx ? 'border-blue-500 shadow-2xl' : 'border-white/10'
                }`}
              >
                <option.icon className={`w-12 h-12 text-${option.color}-400 mb-4`} />
                <h3 className="text-2xl font-bold text-white mb-3">{option.title}</h3>
                <p className="text-gray-400 mb-6">{option.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-400 text-sm">Min Investment</span>
                    <span className="text-white font-bold">{option.minInvest}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-400 text-sm">Avg Returns</span>
                    <span className="text-green-400 font-bold">{option.avgROI}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 text-sm">Duration</span>
                    <span className="text-blue-400 font-bold">{option.duration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {option.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* How Deals Work */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How OWNLY Deals Work</h2>
            <p className="text-xl text-gray-400">From due diligence to monthly payouts</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howDealsWork.map((stage, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className={`bg-${stage.color}-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                  <stage.icon className={`w-8 h-8 text-${stage.color}-400`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{stage.stage}</h3>
                <p className="text-gray-400 mb-6">{stage.description}</p>

                <div className="space-y-3">
                  {stage.points.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Levels */}
      <div className="py-20 bg-gradient-to-r from-slate-950/50 to-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Understanding Risk Levels</h2>
            <p className="text-xl text-gray-400">Higher returns come with higher risk - choose wisely</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {riskLevels.map((risk, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <risk.icon className={`w-12 h-12 text-${risk.color}-400 mb-4`} />
                <h3 className="text-2xl font-bold text-white mb-2">{risk.level}</h3>
                <p className="text-xl font-bold text-green-400 mb-6">{risk.range}</p>

                <div className="space-y-3">
                  <p className="text-sm text-gray-400 font-semibold mb-3">Examples:</p>
                  {risk.examples.map((example, eIdx) => (
                    <div key={eIdx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-12 h-12 text-orange-400 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Risk Disclosure</h3>
                <p className="text-gray-300 mb-4">
                  All investments carry risk. Past performance does not guarantee future results. You may lose some or all of your capital.
                  OWNLY provides detailed risk assessments for each deal, but you should conduct your own due diligence and invest only what you can afford to lose.
                </p>
                <p className="text-gray-400 text-sm">
                  Diversification across multiple assets and asset classes can help reduce portfolio risk. Consider consulting a financial advisor before investing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="py-20 bg-gradient-to-r from-blue-950/30 to-purple-950/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Calculator className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Calculate Your Returns</h2>
            <p className="text-gray-400">See how much you could earn with OWNLY</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Investment Amount: AED {calculatorAmount.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={calculatorAmount}
                  onChange={(e) => setCalculatorAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>AED 500</span>
                  <span>AED 100,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Expected Annual ROI: {calculatorROI}%
                </label>
                <input
                  type="range"
                  min="8"
                  max="30"
                  step="1"
                  value={calculatorROI}
                  onChange={(e) => setCalculatorROI(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>8% (Low Risk)</span>
                  <span>30% (High Risk)</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-6">
                <p className="text-sm text-gray-400 mb-2">Monthly Income</p>
                <p className="text-3xl font-bold text-white mb-1">AED {monthlyReturn.toFixed(0)}</p>
                <p className="text-xs text-green-400">Passive income/month</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
                <p className="text-sm text-gray-400 mb-2">Annual Return</p>
                <p className="text-3xl font-bold text-white mb-1">AED {annualReturn.toFixed(0)}</p>
                <p className="text-xs text-green-400">Total Year 1 returns</p>
              </div>

              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6">
                <p className="text-sm text-gray-400 mb-2">5-Year Value</p>
                <p className="text-3xl font-bold text-white mb-1">AED {fiveYearReturn.toFixed(0)}</p>
                <p className="text-xs text-green-400">With compounding</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-6 text-center">
              * Calculations are estimates based on historical averages. Actual returns may vary. Not guaranteed.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <HelpCircle className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Investor FAQs</h2>
            <p className="text-gray-400">Everything you need to know before investing</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="font-bold text-lg text-white pr-4">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 text-blue-400 flex-shrink-0 transition-transform ${
                    openFAQ === idx ? 'rotate-180' : ''
                  }`} />
                </button>
                {openFAQ === idx && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/faq" className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              View All FAQs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-950/50 to-purple-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-12">
            <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Your Investment Journey?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 500+ investors already building wealth with OWNLY.<br />
              Start with as little as AED 500 today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/deals" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all">
                <Eye className="w-5 h-5" />
                Browse Deals
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-6">No credit card required • Start in minutes • AED 500 minimum</p>
          </div>
        </div>
      </div>
    </div>
  );
}
