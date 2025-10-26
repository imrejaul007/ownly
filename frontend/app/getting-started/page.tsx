'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle, ChevronRight, ArrowRight, Zap, Target, Shield,
  TrendingUp, DollarSign, Wallet, ShoppingCart, BarChart3, Award,
  BookOpen, PlayCircle, FileText, Users, Sparkles, Rocket
} from 'lucide-react';

export default function GettingStartedPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [investorType, setInvestorType] = useState<string>('');
  const [riskProfile, setRiskProfile] = useState<string>('');
  const [investmentGoal, setInvestmentGoal] = useState<string>('');

  const steps = [
    { id: 1, title: 'Welcome', description: 'Learn about OWNLY' },
    { id: 2, title: 'Profile', description: 'Set your preferences' },
    { id: 3, title: 'Wallet', description: 'Setup your wallet' },
    { id: 4, title: 'First Investment', description: 'Make your first deal' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full text-purple-300 text-sm font-semibold mb-4 border border-purple-500/30">
            <Rocket className="w-4 h-4" />
            Getting Started Guide
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-4">
            Welcome to OWNLY
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Your journey to building wealth through fractional ownership starts here
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    currentStep >= step.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white/5 border-2 border-white/10 text-purple-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-semibold ${
                      currentStep >= step.id ? 'text-white' : 'text-purple-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-purple-300 hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 transition-all ${
                    currentStep > step.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                      : 'bg-white/10'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-3xl font-bold text-white mb-6">
                How OWNLY Works
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">1. Browse Deals</h3>
                  <p className="text-purple-200 text-sm">
                    Explore vetted investment opportunities in real estate, franchises, and startups
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">2. Invest</h3>
                  <p className="text-purple-200 text-sm">
                    Start from AED 1,000 and own a fraction of premium assets
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">3. Earn</h3>
                  <p className="text-purple-200 text-sm">
                    Receive monthly dividends and profit distributions
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Low Entry Point</h4>
                    <p className="text-purple-200 text-sm">Start investing with as little as AED 1,000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Fully Regulated</h4>
                    <p className="text-purple-200 text-sm">SEC-regulated platform with SPV legal structure</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Monthly Returns</h4>
                    <p className="text-purple-200 text-sm">Average 15-45% annual returns with monthly distributions</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-3xl font-bold text-white mb-6">
                Tell Us About Yourself
              </h2>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-white font-semibold mb-3">
                    What type of investor are you?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'beginner', label: 'Beginner', desc: 'New to investing' },
                      { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
                      { value: 'expert', label: 'Expert', desc: 'Seasoned investor' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setInvestorType(type.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          investorType === type.value
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="font-bold text-white mb-1">{type.label}</div>
                        <div className="text-sm text-purple-300">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">
                    What's your risk tolerance?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'conservative', label: 'Conservative', desc: '10-15% ROI' },
                      { value: 'moderate', label: 'Moderate', desc: '15-25% ROI' },
                      { value: 'aggressive', label: 'Aggressive', desc: '25-45% ROI' },
                    ].map((risk) => (
                      <button
                        key={risk.value}
                        onClick={() => setRiskProfile(risk.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          riskProfile === risk.value
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="font-bold text-white mb-1">{risk.label}</div>
                        <div className="text-sm text-purple-300">{risk.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">
                    What's your primary goal?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { value: 'income', label: 'Passive Income', icon: DollarSign },
                      { value: 'growth', label: 'Capital Growth', icon: TrendingUp },
                      { value: 'diversification', label: 'Diversification', icon: BarChart3 },
                      { value: 'learning', label: 'Learning', icon: BookOpen },
                    ].map((goal) => {
                      const Icon = goal.icon;
                      return (
                        <button
                          key={goal.value}
                          onClick={() => setInvestmentGoal(goal.value)}
                          className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                            investmentGoal === goal.value
                              ? 'border-purple-500 bg-purple-500/20'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-6 h-6 text-purple-400" />
                          <div className="font-bold text-white">{goal.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!investorType || !riskProfile || !investmentGoal}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-3xl font-bold text-white mb-6">
                Setup Your Wallet
              </h2>

              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Digital Wallet</h3>
                    <p className="text-green-100 text-sm">Secure, instant, and easy to use</p>
                  </div>
                </div>
                <p className="text-white text-sm">
                  Your OWNLY wallet allows you to fund investments, receive payouts, and manage your earnings all in one place.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-white">Bank-grade encryption</span>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-white">Instant deposits & withdrawals</span>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span className="text-white">Multi-currency support</span>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Back
                </button>
                <Link href="/wallet" className="flex-1">
                  <button className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-all flex items-center justify-center gap-2">
                    Setup Wallet
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Helpful Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/help">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:scale-105 transition-all cursor-pointer">
                <BookOpen className="w-8 h-8 text-purple-400 mb-3" />
                <h4 className="font-bold text-white mb-2">Help Center</h4>
                <p className="text-purple-200 text-sm">Browse FAQs and guides</p>
              </div>
            </Link>

            <Link href="/calculator">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:scale-105 transition-all cursor-pointer">
                <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
                <h4 className="font-bold text-white mb-2">ROI Calculator</h4>
                <p className="text-purple-200 text-sm">Estimate your returns</p>
              </div>
            </Link>

            <Link href="/deals">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:scale-105 transition-all cursor-pointer">
                <Sparkles className="w-8 h-8 text-pink-400 mb-3" />
                <h4 className="font-bold text-white mb-2">Browse Deals</h4>
                <p className="text-purple-200 text-sm">Start exploring opportunities</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
