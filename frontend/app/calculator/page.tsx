'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercentage } from '@/lib/utils';

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
    { name: 'Conservative', roi: 12, period: 12, amount: 5000 },
    { name: 'Balanced', roi: 25, period: 24, amount: 10000 },
    { name: 'Growth', roi: 40, period: 36, amount: 25000 },
    { name: 'Aggressive', roi: 60, period: 48, amount: 50000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Investment Calculator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Plan your investment strategy and visualize potential returns
            </p>
          </div>
          <Link href="/deals">
            <button className="btn-primary">
              Browse Deals
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preset Scenarios */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Quick Scenarios</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {presetScenarios.map((scenario) => (
                <button
                  key={scenario.name}
                  onClick={() => {
                    setInvestmentAmount(scenario.amount);
                    setAnnualROI(scenario.roi);
                    setHoldingPeriod(scenario.period);
                  }}
                  className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 transition text-center"
                >
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {scenario.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {scenario.roi}% ROI
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {scenario.period} months
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Input Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Customize Your Investment</h2>

            {/* Investment Amount */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Investment Amount
              </label>
              <input
                type="range"
                min={1000}
                max={500000}
                step={1000}
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">AED 1,000</span>
                <span className="text-3xl font-bold text-blue-600">{formatCurrency(investmentAmount)}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">AED 500,000</span>
              </div>
            </div>

            {/* Annual ROI */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Expected Annual ROI
              </label>
              <input
                type="range"
                min={5}
                max={70}
                step={1}
                value={annualROI}
                onChange={(e) => setAnnualROI(Number(e.target.value))}
                className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">5%</span>
                <span className="text-3xl font-bold text-green-600">{annualROI}%</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">70%</span>
              </div>
            </div>

            {/* Holding Period */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Holding Period (months)
              </label>
              <input
                type="range"
                min={3}
                max={60}
                step={3}
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(Number(e.target.value))}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">3 months</span>
                <span className="text-3xl font-bold text-purple-600">{holdingPeriod} months</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">60 months</span>
              </div>
            </div>

            {/* Reinvestment Toggle */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Reinvest Returns</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically reinvest monthly returns for compound growth
                  </div>
                </div>
                <button
                  onClick={() => setReinvestReturns(!reinvestReturns)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    reinvestReturns ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reinvestReturns ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Comparison: With vs Without Reinvestment */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg shadow-md p-6 border-2 border-indigo-200 dark:border-indigo-800">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              The Power of Compounding
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Without Reinvestment */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Simple Returns</div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatCurrency((investmentAmount * annualROI * holdingPeriod) / (100 * 12))}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Profit</div>
                <div className="mt-3 text-sm">
                  <div className="text-gray-900 dark:text-white font-semibold">
                    Final Value: {formatCurrency(investmentAmount + (investmentAmount * annualROI * holdingPeriod) / (100 * 12))}
                  </div>
                </div>
              </div>

              {/* With Reinvestment */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Compound Returns</div>
                  <span className="badge bg-green-600 text-white text-xs">Recommended</span>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {formatCurrency(investmentAmount * Math.pow(1 + annualROI / 100 / 12, holdingPeriod) - investmentAmount)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Profit</div>
                <div className="mt-3 text-sm">
                  <div className="text-gray-900 dark:text-white font-semibold">
                    Final Value: {formatCurrency(investmentAmount * Math.pow(1 + annualROI / 100 / 12, holdingPeriod))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                    Difference: {formatCurrency(
                      (investmentAmount * Math.pow(1 + annualROI / 100 / 12, holdingPeriod) - investmentAmount) -
                      ((investmentAmount * annualROI * holdingPeriod) / (100 * 12))
                    )}
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Reinvesting can significantly boost your returns over time
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Visualization */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Growth Timeline</h2>
            <div className="space-y-3">
              {[6, 12, 18, 24, 30, 36, holdingPeriod]
                .filter((m, i, arr) => arr.indexOf(m) === i && m <= holdingPeriod)
                .sort((a, b) => a - b)
                .map((months) => {
                  const simpleReturn = (investmentAmount * annualROI * months) / (100 * 12);
                  const compoundReturn = investmentAmount * Math.pow(1 + annualROI / 100 / 12, months);
                  const percentage = (months / holdingPeriod) * 100;

                  return (
                    <div key={months} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Month {months}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500">
                            Simple: {formatCurrency(investmentAmount + simpleReturn)}
                          </span>
                          <span className="text-xs text-green-600 font-semibold">
                            Compound: {formatCurrency(compoundReturn)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 text-xs text-gray-600 dark:text-gray-400">{months}m</div>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                          {/* Simple Returns Bar */}
                          <div
                            className="absolute top-0 left-0 bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full opacity-50"
                            style={{ width: `${percentage}%` }}
                          />
                          {/* Compound Returns Bar */}
                          <div
                            className="absolute top-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="text-xs font-semibold text-white">
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
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-lg p-6 sticky top-4 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Results</h3>

            {/* Initial Investment */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Initial Investment</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(investmentAmount)}
              </div>
            </div>

            {/* Monthly Return */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monthly Return</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(monthlyReturn)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {formatPercentage(monthlyROI)}/month
              </div>
            </div>

            {/* Annual Return */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Annual Return</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(annualReturn)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {formatPercentage(annualROI)}/year
              </div>
            </div>

            {/* Total Return */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white">
              <div className="text-xs opacity-90 mb-1">Total Profit ({holdingPeriod} months)</div>
              <div className="text-3xl font-bold mb-2">
                {formatCurrency(totalReturn)}
              </div>
              <div className="text-sm opacity-90">
                {reinvestReturns ? '✓ With Compounding' : 'Simple Returns'}
              </div>
            </div>

            {/* Final Value */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Final Value</div>
              <div className="text-3xl font-bold text-purple-600">
                {formatCurrency(finalValue)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                +{formatPercentage(totalROI)} total ROI
              </div>
            </div>

            {/* CTA */}
            <Link href="/deals">
              <button className="w-full btn-primary mb-3">
                Find Deals with {annualROI}% ROI
              </button>
            </Link>
            <Link href="/featured">
              <button className="w-full btn-secondary">
                View Featured Opportunities
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Educational Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-4xl mb-3">📈</div>
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Start Small</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Begin with as little as AED 1,000 and grow your portfolio over time. Diversify across multiple deals for better risk management.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-4xl mb-3">💰</div>
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Reinvest Returns</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Maximize your gains by reinvesting monthly returns. Compounding can significantly boost your wealth over time.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Set Goals</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Define your investment timeline and target returns. Use this calculator to plan and achieve your financial goals.
          </p>
        </div>
      </div>
    </div>
  );
}
