'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  UserPlus, ShieldCheck, Wallet, Search, TrendingUp, Coins,
  ArrowRight, CheckCircle, Building2, Car, Diamond, Store,
  Lock, Globe, Smartphone, HeadphonesIcon, Zap, Award,
  BarChart3, FileText, Users, DollarSign, Clock, Target,
  Play, ArrowDown, Sparkles, TrendingDown, Scale, Home,
  Package, Eye, MessageSquare, Star
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeAssetClass, setActiveAssetClass] = useState(0);

  const steps = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up in under 2 minutes with just your email and basic information. No complicated paperwork.',
      icon: UserPlus,
      color: 'from-blue-500 to-cyan-500',
      details: [
        'Quick email verification',
        'Secure password setup',
        'Basic profile creation',
        'No initial deposit required'
      ],
      duration: '2 minutes',
      difficulty: 'Easy'
    },
    {
      number: 2,
      title: 'Complete KYC Verification',
      description: 'Verify your identity to comply with regulations and unlock full platform access.',
      icon: ShieldCheck,
      color: 'from-green-500 to-emerald-500',
      details: [
        'Upload ID document (Emirates ID/Passport)',
        'Selfie verification for identity match',
        'Address proof documentation',
        'Approval within 24 hours or less'
      ],
      duration: '5 minutes',
      difficulty: 'Easy'
    },
    {
      number: 3,
      title: 'Fund Your Wallet',
      description: 'Add funds to your OWNLY wallet using secure payment methods.',
      icon: Wallet,
      color: 'from-purple-500 to-pink-500',
      details: [
        'Bank transfer (local & international)',
        'Credit/Debit card payments accepted',
        'Instant balance updates & notifications',
        'Minimum deposit: AED 500 only'
      ],
      duration: 'Instant',
      difficulty: 'Easy'
    },
    {
      number: 4,
      title: 'Browse & Analyze Deals',
      description: 'Explore vetted investment opportunities across various asset classes.',
      icon: Search,
      color: 'from-orange-500 to-red-500',
      details: [
        'Detailed deal information & financials',
        'Expected ROI calculations & projections',
        'Risk assessment scores & ratings',
        'Property images, docs & virtual tours'
      ],
      duration: '10-30 minutes',
      difficulty: 'Easy'
    },
    {
      number: 5,
      title: 'Invest & Own',
      description: 'Invest as little as AED 500 and become a fractional owner of premium assets.',
      icon: TrendingUp,
      color: 'from-teal-500 to-cyan-500',
      details: [
        'Select your investment amount',
        'Review deal terms & SPV structure',
        'Confirm investment with one click',
        'Receive digital ownership certificate'
      ],
      duration: '2 minutes',
      difficulty: 'Easy'
    },
    {
      number: 6,
      title: 'Earn & Grow',
      description: 'Start earning monthly returns and track your growing portfolio in real-time.',
      icon: Coins,
      color: 'from-green-600 to-emerald-600',
      details: [
        'Monthly rental income & distributions',
        'Automatic distribution to your wallet',
        'Real-time portfolio tracking & analytics',
        'Reinvest or withdraw funds anytime'
      ],
      duration: 'Ongoing',
      difficulty: 'Passive'
    }
  ];

  const assetClasses = [
    { icon: Building2, name: 'Real Estate', color: 'blue', minInvest: 'AED 500' },
    { icon: Store, name: 'Franchises', color: 'purple', minInvest: 'AED 1,000' },
    { icon: Car, name: 'Luxury Cars', color: 'orange', minInvest: 'AED 2,000' },
    { icon: Diamond, name: 'Luxury Assets', color: 'pink', minInvest: 'AED 5,000' },
    { icon: Package, name: 'Trade Finance', color: 'green', minInvest: 'AED 500' },
    { icon: BarChart3, name: 'Business SPVs', color: 'indigo', minInvest: 'AED 1,000' }
  ];

  const comparisonData = [
    { feature: 'Minimum Investment', traditional: 'AED 500,000+', ownly: 'AED 500', ownlyBetter: true },
    { feature: 'Time to Start', traditional: '2-3 months', ownly: '30 minutes', ownlyBetter: true },
    { feature: 'Paperwork Required', traditional: 'Extensive', ownly: 'Minimal', ownlyBetter: true },
    { feature: 'Asset Diversity', traditional: 'Limited', ownly: 'All asset classes', ownlyBetter: true },
    { feature: 'Liquidity', traditional: 'Very Low', ownly: 'Exchange Trading', ownlyBetter: true },
    { feature: 'Legal Protection', traditional: 'Standard', ownly: '7-Layer SPV', ownlyBetter: true },
    { feature: 'Monthly Income', traditional: 'Manual', ownly: 'Automated', ownlyBetter: true },
    { feature: 'Portfolio Tracking', traditional: 'None', ownly: 'Real-time App', ownlyBetter: true }
  ];

  const trustBadges = [
    { icon: ShieldCheck, label: 'UAE Regulated', description: 'Licensed & Compliant' },
    { icon: Lock, label: 'Bank-Grade Security', description: 'AES-256 Encryption' },
    { icon: Scale, label: 'SPV Legal Structure', description: '7-Layer Protection' },
    { icon: Users, label: '500+ Investors', description: 'Trusted Community' }
  ];

  const stats = [
    { label: 'Active Investors', value: '500+', icon: Users },
    { label: 'Total Deployed', value: 'AED 10M+', icon: DollarSign },
    { label: 'Live Deals', value: '14+', icon: Building2 },
    { label: 'Avg ROI', value: '18%', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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
              <span className="text-blue-300 text-sm font-semibold">Simple, Secure, Profitable</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              How OWNLY Works
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Start investing in premium real estate, franchises, and luxury assets in just
              <span className="text-green-400 font-bold"> 6 simple steps</span>.
              No prior experience needed.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Your Investment Journey</h2>
          <p className="text-xl text-gray-400">From signup to earning passive income in 6 easy steps</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <button
                  onClick={() => setActiveStep(idx)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    activeStep === idx
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-125 shadow-xl'
                      : activeStep > idx
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-gray-500'
                  }`}
                >
                  {activeStep > idx ? <CheckCircle className="w-6 h-6" /> : step.number}
                </button>
                {idx < steps.length - 1 && (
                  <div className={`h-1 w-full mt-6 ${activeStep > idx ? 'bg-green-500' : 'bg-white/10'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Step Details */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`transition-all duration-500 ${
                activeStep === idx ? 'block' : 'hidden'
              }`}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                <div className="flex items-start gap-8">
                  <div className={`bg-gradient-to-r ${step.color} w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm font-bold text-blue-400">STEP {step.number}</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                        {step.duration}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                        {step.difficulty}
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

                    {idx < steps.length - 1 && (
                      <button
                        onClick={() => setActiveStep(idx + 1)}
                        className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
                      >
                        Next Step
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SPV Legal Structure */}
      <div className="py-20 bg-gradient-to-r from-indigo-950/30 to-purple-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How Your Investment is Protected</h2>
            <p className="text-xl text-gray-400">7-Layer SPV Trust Architecture</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <Scale className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Special Purpose Vehicle (SPV)</h3>
              <p className="text-gray-400 mb-4">
                Each asset is held in a dedicated legal entity, ensuring your ownership is protected and separate from the platform.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Legal entity per asset</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Bankruptcy remote</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Full transparency</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <FileText className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Your Ownership Certificate</h3>
              <p className="text-gray-400 mb-4">
                Receive a digital certificate proving your fractional ownership in the SPV that holds the physical asset.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Legally binding document</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Blockchain verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Transferable ownership</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <Lock className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Your Money is Safe</h3>
              <p className="text-gray-400 mb-4">
                Assets held in trust, segregated accounts, and regular audits ensure your investment is protected.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Segregated accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Third-party audits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Insurance coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Classes */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What You Can Invest In</h2>
            <p className="text-xl text-gray-400">Diversify across multiple asset classes</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {assetClasses.map((asset, idx) => (
              <button
                key={idx}
                onClick={() => setActiveAssetClass(idx)}
                className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-6 hover:scale-105 transition-all ${
                  activeAssetClass === idx ? 'border-blue-500' : 'border-white/10'
                }`}
              >
                <asset.icon className={`w-10 h-10 text-${asset.color}-400 mx-auto mb-3`} />
                <h3 className="text-sm font-bold text-white mb-1">{asset.name}</h3>
                <p className="text-xs text-gray-400">From {asset.minInvest}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="py-20 bg-gradient-to-r from-slate-950/50 to-gray-950/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">OWNLY vs Traditional Investing</h2>
            <p className="text-xl text-gray-400">See why thousands choose OWNLY</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Feature</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Traditional</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-blue-400">OWNLY</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5">
                    <td className="py-4 px-6 text-white font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-gray-400">{row.traditional}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {row.ownlyBetter && <CheckCircle className="w-5 h-5 text-green-400" />}
                        <span className="text-blue-400 font-bold">{row.ownly}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-all">
                <badge.icon className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-white mb-1">{badge.label}</h3>
                <p className="text-xs text-gray-400">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Preview */}
      <div className="py-20 bg-gradient-to-r from-blue-950/30 to-purple-950/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Quick Questions</h2>
            <p className="text-gray-400">Everything you need to know</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How much can I invest?',
                a: 'Minimum investment is AED 500. Maximum depends on the deal size and your investor category (Retail/HNI).'
              },
              {
                q: 'How do I earn returns?',
                a: 'You earn monthly rental income or business distributions sent directly to your wallet, plus potential capital appreciation when the asset is sold.'
              },
              {
                q: 'Can I sell my investment before the deal ends?',
                a: 'Yes! Use our secondary Exchange to trade your ownership tokens with other investors anytime, providing liquidity.'
              },
              {
                q: 'What if the platform shuts down?',
                a: 'Your ownership is protected in separate SPV entities. Even if OWNLY ceases operations, you retain legal ownership of your asset fractions.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all">
                <h3 className="font-bold text-lg text-white mb-2 flex items-start gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                  {faq.q}
                </h3>
                <p className="text-gray-400 pl-7">{faq.a}</p>
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
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-12">
            <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Investing?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 500+ investors already earning passive income with OWNLY.<br />
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
            <p className="text-sm text-gray-500 mt-6">No credit card required • Get started in minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
