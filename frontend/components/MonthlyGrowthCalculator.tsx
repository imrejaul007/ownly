'use client';

import { useState } from 'react';
import { Wallet } from 'lucide-react';

export default function MonthlyGrowthCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const annualROI = 25; // 25% annual ROI

  // Calculate monthly and yearly returns
  const monthlyPayout = Math.round((investmentAmount * (annualROI / 100)) / 12);
  const yearlyReturn = Math.round(investmentAmount * (annualROI / 100));

  return (
    <div className="mb-12 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">See Your Money Grow Monthly</h2>
        <p className="text-purple-200 text-lg">Visual timeline of investment growth with monthly payouts</p>
      </div>

      {/* Investment Amount Selector */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6 mb-6">
        <div className="mb-4">
          <label className="text-white font-semibold text-lg mb-2 block">
            Customize Your Investment Amount
          </label>
          <p className="text-purple-300 text-sm mb-4">
            Move the slider to see how your money grows with different investment amounts
          </p>
        </div>

        <div className="space-y-4">
          {/* Amount Display */}
          <div className="flex items-center justify-between">
            <span className="text-purple-200">Investment Amount:</span>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                AED {investmentAmount.toLocaleString()}
              </div>
              <div className="text-sm text-purple-300">at {annualROI}% annual ROI</div>
            </div>
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              className="w-full h-3 bg-purple-900/30 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${((investmentAmount - 1000) / (100000 - 1000)) * 100}%, rgb(88 28 135 / 0.3) ${((investmentAmount - 1000) / (100000 - 1000)) * 100}%, rgb(88 28 135 / 0.3) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-purple-300 mt-2">
              <span>AED 1,000</span>
              <span>AED 100,000</span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[5000, 10000, 25000, 50000].map((amount) => (
              <button
                key={amount}
                onClick={() => setInvestmentAmount(amount)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  investmentAmount === amount
                    ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                {amount >= 1000 ? `${amount / 1000}K` : amount}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Timeline */}
      <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-200 text-sm">
              Your customized investment projection
            </span>
            <span className="text-green-400 font-bold">
              Monthly: AED {monthlyPayout.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((month) => (
            <div key={month} className="bg-white/5 backdrop-blur-xl rounded-lg border border-purple-500/20 p-4 text-center hover:bg-white/10 transition-all group">
              <div className="text-xs text-purple-300 mb-2">Month {month}</div>
              <div className="flex items-center justify-center mb-2">
                <Wallet className="w-5 h-5 text-green-400 group-hover:scale-125 transition-transform" />
              </div>
              <div className="text-lg font-bold text-green-400">
                AED {monthlyPayout.toLocaleString()}
              </div>
              <div className="text-xs text-purple-200 mt-1">Payout</div>
              <div className="mt-2 h-1 bg-green-500/30 rounded-full group-hover:bg-green-500/50 transition-all"></div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-green-500/10 backdrop-blur-xl rounded-xl border border-green-500/30 p-4 text-center">
          <div className="text-sm text-green-200 mb-2">After 12 Months</div>
          <div className="text-3xl font-bold text-green-400">
            AED {yearlyReturn.toLocaleString()} Earned
          </div>
          <div className="text-xs text-green-200 mt-1">
            + Your original AED {investmentAmount.toLocaleString()} principal returned
          </div>
          <div className="text-xs text-green-300 mt-2 font-semibold">
            Total Value: AED {(investmentAmount + yearlyReturn).toLocaleString()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(168 85 247), rgb(236 72 153));
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(168 85 247), rgb(236 72 153));
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  );
}
