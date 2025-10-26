'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import {
  Calculator, DollarSign, TrendingUp, Clock, Sparkles, Target,
  RefreshCw, BarChart3, ArrowRight, Info, Zap, Award
} from 'lucide-react';

export default function InvestmentCalculatorPage() {
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [annualROI, setAnnualROI] = useState(25);
  const [holdingPeriod, setHoldingPeriod] = useState(24);
  const [reinvestReturns, setReinvestReturns] = useState(false);

  // Calculations
  const monthlyROI = annualROI / 12;
  const monthlyReturn = (investmentAmount * monthlyROI) / 100;
  const annualReturn = (investmentAmount * annualROI) / 100;

  // Calculate with/without reinvestment
  const calculateReturns = () => {
    if (reinvestReturns) {
      // Compound growth with monthly compounding
      const monthlyRate = annualROI / 100 / 12;
      const finalValue = investmentAmount * Math.pow(1 + monthlyRate, holdingPeriod);
      const totalReturn = finalValue - investmentAmount;
      return { finalValue, totalReturn };
    } else {
      // Simple returns
      const totalReturn = (investmentAmount * annualROI * holdingPeriod) / (100 * 12);
      const finalValue = investmentAmount + totalReturn;
      return { finalValue, totalReturn };
    }
  };

  const { finalValue, totalReturn } = calculateReturns();
  const totalROI = ((totalReturn / investmentAmount) * 100);

  // Preset scenarios
  const presetScenarios = [
    { name: 'Conservative', roi: 12, period: 12, amount: 5000, icon: Target },
    { name: 'Balanced', roi: 25, period: 24, amount: 10000, icon: BarChart3 },
    { name: 'Growth', roi: 40, period: 36, amount: 25000, icon: TrendingUp },
    { name: 'Aggressive', roi: 60, period: 48, amount: 50000, icon: Zap },
  ];

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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                    Investment Calculator
                  </h1>
                </div>
              </div>
              <p className="text-purple-200 text-lg">
                Plan your investment strategy and visualize potential returns
              </p>
            </div>
            <Link href="/deals">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Browse Deals
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preset Scenarios */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Quick Scenarios</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {presetScenarios.map((scenario) => (
                  <button
                    key={scenario.name}
                    onClick={() => {
                      setInvestmentAmount(scenario.amount);
                      setAnnualROI(scenario.roi);
                      setHoldingPeriod(scenario.period);
                    }}
                    className="group p-4 bg-white/5 border-2 border-white/10 rounded-xl hover:border-purple-500/50 transition-all text-center hover:scale-105 duration-300"
                  >
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <scenario.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-sm font-bold text-white mb-2">
                      {scenario.name}
                    </div>
                    <div className="text-xs text-purple-300">
                      {scenario.roi}% ROI
                    </div>
                    <div className="text-xs text-purple-300">
                      {scenario.period} months
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Controls */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Customize Your Investment</h2>

              {/* Investment Amount */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-semibold text-purple-200 mb-3">
                  <DollarSign className="w-4 h-4" />
                  Investment Amount
                </label>
                <input
                  type="range"
                  min={1000}
                  max={500000}
                  step={1000}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="w-full h-3 bg-blue-500/20 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${((investmentAmount - 1000) / 499000) * 100}%, rgba(59, 130, 246, 0.2) ${((investmentAmount - 1000) / 499000) * 100}%, rgba(59, 130, 246, 0.2) 100%)`
                  }}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-purple-300">AED 1,000</span>
                  <span className="text-3xl font-bold text-blue-400">{formatCurrency(investmentAmount)}</span>
                  <span className="text-sm text-purple-300">AED 500,000</span>
                </div>
              </div>

              {/* Annual ROI */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-semibold text-purple-200 mb-3">
                  <TrendingUp className="w-4 h-4" />
                  Expected Annual ROI
                </label>
                <input
                  type="range"
                  min={5}
                  max={70}
                  step={1}
                  value={annualROI}
                  onChange={(e) => setAnnualROI(Number(e.target.value))}
                  className="w-full h-3 bg-green-500/20 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(34 197 94) ${((annualROI - 5) / 65) * 100}%, rgba(34, 197, 94, 0.2) ${((annualROI - 5) / 65) * 100}%, rgba(34, 197, 94, 0.2) 100%)`
                  }}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-purple-300">5%</span>
                  <span className="text-3xl font-bold text-green-400">{annualROI}%</span>
                  <span className="text-sm text-purple-300">70%</span>
                </div>
              </div>

              {/* Holding Period */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-semibold text-purple-200 mb-3">
                  <Clock className="w-4 h-4" />
                  Holding Period (months)
                </label>
                <input
                  type="range"
                  min={3}
                  max={60}
                  step={3}
                  value={holdingPeriod}
                  onChange={(e) => setHoldingPeriod(Number(e.target.value))}
                  className="w-full h-3 bg-purple-500/20 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${((holdingPeriod - 3) / 57) * 100}%, rgba(168, 85, 247, 0.2) ${((holdingPeriod - 3) / 57) * 100}%, rgba(168, 85, 247, 0.2) 100%)`
                  }}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-purple-300">3 months</span>
                  <span className="text-3xl font-bold text-purple-400">{holdingPeriod} months</span>
                  <span className="text-sm text-purple-300">60 months</span>
                </div>
              </div>

              {/* Reinvestment Toggle */}
              <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-bold text-white mb-1">
                      <RefreshCw className="w-5 h-5 text-green-400" />
                      Reinvest Returns
                    </div>
                    <div className="text-sm text-purple-200">
                      Automatically reinvest monthly returns for compound growth
                    </div>
                  </div>
                  <button
                    onClick={() => setReinvestReturns(!reinvestReturns)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ml-4 ${
                      reinvestReturns ? 'bg-green-600' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${
                        reinvestReturns ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Comparison: With vs Without Reinvestment */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-indigo-500/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">
                  The Power of Compounding
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Without Reinvestment */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                  <div className="text-xs text-purple-200 mb-3">Simple Returns</div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {formatCurrency((investmentAmount * annualROI * holdingPeriod) / (100 * 12))}
                  </div>
                  <div className="text-xs text-purple-300 mb-4">Total Profit</div>
                  <div className="text-sm">
                    <div className="text-white font-semibold">
                      Final Value: {formatCurrency(investmentAmount + (investmentAmount * annualROI * holdingPeriod) / (100 * 12))}
                    </div>
                  </div>
                </div>

                {/* With Reinvestment */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border-2 border-green-500/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-purple-200">Compound Returns</div>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">Recommended</span>
                  </div>
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {formatCurrency(investmentAmount * Math.pow(1 + annualROI / 100 / 12, holdingPeriod) - investmentAmount)}
                  </div>
                  <div className="text-xs text-purple-300 mb-4">Total Profit</div>
                  <div className="text-sm">
                    <div className="text-white font-semibold">
                      Final Value: {formatCurrency(investmentAmount * Math.pow(1 + annualROI / 100 / 12, holdingPeriod))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-yellow-200 mb-1">
                      Difference: {formatCurrency(
                        (investmentAmount * Math.pow(1 + annualROI / 100 / 12, holdingPeriod) - investmentAmount) -
                        ((investmentAmount * annualROI * holdingPeriod) / (100 * 12))
                      )}
                    </p>
                    <p className="text-xs text-yellow-100">
                      Reinvesting can significantly boost your returns over time
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Visualization */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Growth Timeline</h2>
              </div>
              <div className="space-y-4">
                {[6, 12, 18, 24, 30, 36, holdingPeriod]
                  .filter((m, i, arr) => arr.indexOf(m) === i && m <= holdingPeriod)
                  .sort((a, b) => a - b)
                  .map((months) => {
                    const simpleReturn = (investmentAmount * annualROI * months) / (100 * 12);
                    const compoundReturn = investmentAmount * Math.pow(1 + annualROI / 100 / 12, months);
                    const percentage = (months / holdingPeriod) * 100;

                    return (
                      <div key={months} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-white">
                            Month {months}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-blue-300">
                              Simple: {formatCurrency(investmentAmount + simpleReturn)}
                            </span>
                            <span className="text-xs text-green-400 font-bold">
                              Compound: {formatCurrency(compoundReturn)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-16 text-xs text-purple-300 font-semibold">{months}m</div>
                          <div className="flex-1 bg-white/10 rounded-full h-8 relative overflow-hidden border border-white/10">
                            {/* Simple Returns Bar */}
                            <div
                              className="absolute top-0 left-0 bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full opacity-40"
                              style={{ width: `${percentage}%` }}
                            />
                            {/* Compound Returns Bar */}
                            <div
                              className="absolute top-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full flex items-center justify-end pr-3"
                              style={{ width: `${percentage}%` }}
                            >
                              <span className="text-xs font-bold text-white">
                                {formatCurrency(compoundReturn)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Results Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 sticky top-4 border-2 border-blue-500/30 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-white">Your Results</h3>

              {/* Initial Investment */}
              <div className="mb-4 p-4 bg-white/10 rounded-xl border border-white/10">
                <div className="text-xs text-purple-200 mb-2">Initial Investment</div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(investmentAmount)}
                </div>
              </div>

              {/* Monthly Return */}
              <div className="mb-4 p-4 bg-white/10 rounded-xl border border-white/10">
                <div className="text-xs text-purple-200 mb-2">Monthly Return</div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(monthlyReturn)}
                </div>
                <div className="text-xs text-purple-300 mt-1">
                  {formatPercentage(monthlyROI)}/month
                </div>
              </div>

              {/* Annual Return */}
              <div className="mb-4 p-4 bg-white/10 rounded-xl border border-white/10">
                <div className="text-xs text-purple-200 mb-2">Annual Return</div>
                <div className="text-2xl font-bold text-blue-400">
                  {formatCurrency(annualReturn)}
                </div>
                <div className="text-xs text-purple-300 mt-1">
                  {formatPercentage(annualROI)}/year
                </div>
              </div>

              {/* Total Return */}
              <div className="mb-4 p-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white shadow-lg">
                <div className="text-xs opacity-90 mb-2">Total Profit ({holdingPeriod} months)</div>
                <div className="text-3xl font-bold mb-2">
                  {formatCurrency(totalReturn)}
                </div>
                <div className="text-sm opacity-90 flex items-center gap-2">
                  {reinvestReturns && <RefreshCw className="w-4 h-4" />}
                  {reinvestReturns ? 'With Compounding' : 'Simple Returns'}
                </div>
              </div>

              {/* Final Value */}
              <div className="mb-6 p-4 bg-white/10 rounded-xl border border-white/10">
                <div className="text-xs text-purple-200 mb-2">Final Value</div>
                <div className="text-3xl font-bold text-purple-400">
                  {formatCurrency(finalValue)}
                </div>
                <div className="text-xs text-green-400 mt-1">
                  +{formatPercentage(totalROI)} total ROI
                </div>
              </div>

              {/* CTA */}
              <Link href="/deals">
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5" />
                  Find Deals with {annualROI}% ROI
                </button>
              </Link>
              <Link href="/featured">
                <button className="w-full bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/15 transition-all flex items-center justify-center gap-2 border border-white/10">
                  <Sparkles className="w-5 h-5" />
                  View Featured Opportunities
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Educational Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Start Small</h3>
            <p className="text-sm text-purple-200">
              Begin with as little as AED 1,000 and grow your portfolio over time. Diversify across multiple deals for better risk management.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Reinvest Returns</h3>
            <p className="text-sm text-purple-200">
              Maximize your gains by reinvesting monthly returns. Compounding can significantly boost your wealth over time.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Set Goals</h3>
            <p className="text-sm text-purple-200">
              Define your investment timeline and target returns. Use this calculator to plan and achieve your financial goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
