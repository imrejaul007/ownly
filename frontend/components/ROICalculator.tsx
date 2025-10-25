'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface ROICalculatorProps {
  dealTitle: string;
  expectedROI: number;
  minInvestment: number;
  maxInvestment?: number;
  holdingPeriod: number;
}

export default function ROICalculator({
  dealTitle,
  expectedROI,
  minInvestment,
  maxInvestment,
  holdingPeriod
}: ROICalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState(minInvestment);
  const [customPeriod, setCustomPeriod] = useState(holdingPeriod);

  const monthlyROI = expectedROI / 12;
  const monthlyReturn = (investmentAmount * monthlyROI) / 100;
  const annualReturn = (investmentAmount * expectedROI) / 100;
  const totalReturn = (investmentAmount * expectedROI * customPeriod) / (100 * 12);
  const finalValue = investmentAmount + totalReturn;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-md p-6 border-2 border-blue-200 dark:border-blue-800">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">ROI Calculator</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Calculate your potential returns</p>
        </div>
      </div>

      {/* Investment Amount Slider */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Investment Amount
        </label>
        <input
          type="range"
          min={minInvestment}
          max={maxInvestment || minInvestment * 10}
          step={minInvestment / 10}
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(Number(e.target.value))}
          className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(minInvestment)}</span>
          <span className="text-2xl font-bold text-blue-600">{formatCurrency(investmentAmount)}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(maxInvestment || minInvestment * 10)}</span>
        </div>
      </div>

      {/* Holding Period Slider */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Holding Period (months)
        </label>
        <input
          type="range"
          min={3}
          max={60}
          step={3}
          value={customPeriod}
          onChange={(e) => setCustomPeriod(Number(e.target.value))}
          className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">3 months</span>
          <span className="text-xl font-bold text-blue-600">{customPeriod} months</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">60 months</span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monthly Return</div>
          <div className="text-xl font-bold text-green-600">{formatCurrency(monthlyReturn)}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{formatPercentage(monthlyROI)}/mo</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Annual Return</div>
          <div className="text-xl font-bold text-green-600">{formatCurrency(annualReturn)}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{formatPercentage(expectedROI)}/yr</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Return</div>
          <div className="text-xl font-bold text-blue-600">{formatCurrency(totalReturn)}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Over {customPeriod} months</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Final Value</div>
          <div className="text-xl font-bold text-purple-600">{formatCurrency(finalValue)}</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">+{formatPercentage((totalReturn / investmentAmount) * 100)}</div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Return Timeline</h4>
        <div className="space-y-2">
          {[3, 6, 12, 24, customPeriod].filter((m, i, arr) => arr.indexOf(m) === i && m <= customPeriod).sort((a, b) => a - b).map((months) => {
            const returnAtMonth = (investmentAmount * expectedROI * months) / (100 * 12);
            const valueAtMonth = investmentAmount + returnAtMonth;
            const percentage = (months / customPeriod) * 100;

            return (
              <div key={months} className="flex items-center">
                <div className="w-16 text-xs text-gray-600 dark:text-gray-400">{months}m</div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="text-xs font-semibold text-white">{formatCurrency(valueAtMonth)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Break-even Info */}
      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900 dark:text-green-100">Break-even: Immediate</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Start earning from month 1 • Monthly distributions • No lock-in fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
