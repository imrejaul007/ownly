'use client';

import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';

interface ROICalculatorProps {
  minInvestment: number;
  expectedROIMin: number;
  expectedROIMax: number;
  holdingPeriodMonths: number;
}

export default function ROICalculator({
  minInvestment,
  expectedROIMin,
  expectedROIMax,
  holdingPeriodMonths
}: ROICalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState(minInvestment);
  const [customHoldingPeriod, setCustomHoldingPeriod] = useState(holdingPeriodMonths);
  const [selectedROI, setSelectedROI] = useState((expectedROIMin + expectedROIMax) / 2);

  // Calculate returns
  const totalReturn = (investmentAmount * selectedROI) / 100;
  const totalValue = investmentAmount + totalReturn;
  const monthlyReturn = totalReturn / customHoldingPeriod;
  const annualReturn = (totalReturn / customHoldingPeriod) * 12;
  const annualROI = (annualReturn / investmentAmount) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">ROI Calculator</h3>
          <p className="text-sm text-gray-400">Calculate your potential returns</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Investment Amount Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              Investment Amount
            </label>
            <span className="text-lg font-bold text-purple-400">{formatCurrency(investmentAmount)}</span>
          </div>
          <input
            type="range"
            min={minInvestment}
            max={minInvestment * 10}
            step={1000}
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{formatCurrency(minInvestment)}</span>
            <span>{formatCurrency(minInvestment * 10)}</span>
          </div>
        </div>

        {/* Expected ROI Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-purple-400" />
              Expected ROI
            </label>
            <span className="text-lg font-bold text-purple-400">{selectedROI.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={expectedROIMin}
            max={expectedROIMax}
            step={0.1}
            value={selectedROI}
            onChange={(e) => setSelectedROI(Number(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span className="text-yellow-400">Conservative: {expectedROIMin}%</span>
            <span className="text-green-400">Optimistic: {expectedROIMax}%</span>
          </div>
        </div>

        {/* Holding Period Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Holding Period
            </label>
            <span className="text-lg font-bold text-purple-400">{customHoldingPeriod} months</span>
          </div>
          <input
            type="range"
            min={6}
            max={60}
            step={1}
            value={customHoldingPeriod}
            onChange={(e) => setCustomHoldingPeriod(Number(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>6 months</span>
            <span>60 months</span>
          </div>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Total Return</span>
            </div>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalReturn)}</div>
            <div className="text-xs text-purple-300 mt-1">{selectedROI.toFixed(1)}% over {customHoldingPeriod} months</div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Final Value</span>
            </div>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</div>
            <div className="text-xs text-green-300 mt-1">Investment + Returns</div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Monthly Income</span>
            </div>
            <div className="text-2xl font-bold text-white">{formatCurrency(monthlyReturn)}</div>
            <div className="text-xs text-blue-300 mt-1">Average per month</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Annual ROI</span>
            </div>
            <div className="text-2xl font-bold text-white">{annualROI.toFixed(1)}%</div>
            <div className="text-xs text-yellow-300 mt-1">Annualized return</div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="pt-6 border-t border-white/10">
          <h4 className="text-sm font-semibold text-white mb-4">Return Timeline</h4>
          <div className="space-y-3">
            {[0, 25, 50, 75, 100].map((percent) => {
              const month = Math.floor((customHoldingPeriod * percent) / 100);
              const value = investmentAmount + (totalReturn * percent) / 100;
              const returnAmount = (totalReturn * percent) / 100;

              return (
                <div key={percent} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-400">
                    {month === 0 ? 'Start' : month === customHoldingPeriod ? 'Exit' : `Month ${month}`}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-32 text-right">
                    <div className="text-sm font-semibold text-white">{formatCurrency(value)}</div>
                    {percent > 0 && (
                      <div className="text-xs text-green-400">+{formatCurrency(returnAmount)}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-xs text-yellow-200">
            <strong>Disclaimer:</strong> This calculator provides estimates based on the expected ROI range.
            Actual returns may vary and are not guaranteed. Past performance does not indicate future results.
          </p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  );
}
