'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign, TrendingDown, CheckCircle, XCircle, Calculator, Shield,
  Percent, ArrowRight, Building2, Store, Car, Diamond, Package,
  BarChart3, Coins, Wallet, CreditCard, Ban, Sparkles, Info,
  PieChart, Target, Award, AlertCircle, Eye, Lock, TrendingUp, Clock
} from 'lucide-react';

export default function FeesPage() {
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [holdingPeriod, setHoldingPeriod] = useState(3);
  const [annualReturn, setAnnualReturn] = useState(18);
  const [selectedAssetClass, setSelectedAssetClass] = useState('real-estate');

  const feeStructure = [
    {
      name: 'SPV Setup Fee',
      rate: '7%',
      type: 'One-time',
      description: 'Covers legal entity formation, documentation, regulatory compliance, and initial asset acquisition costs',
      charged: 'Deducted from investment amount when SPV is created',
      example: 'AED 700 on a AED 10,000 investment',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Annual Management Fee',
      rate: '10%',
      type: 'Annual',
      description: 'Covers property management, asset maintenance, investor reporting, distributions, legal compliance, and platform operations',
      charged: 'Deducted from rental income/profits before distribution to investors',
      example: 'AED 1,000/year on AED 10,000 annual rental income',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Exit Success Fee',
      rate: '15%',
      type: 'On Exit',
      description: 'Performance fee on capital appreciation when asset is sold. Only charged on profits, not principal',
      charged: 'Deducted from sale proceeds (profits only)',
      example: 'AED 1,500 on AED 10,000 capital gain',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Secondary Market Trading',
      rate: '2%',
      type: 'Per Trade',
      description: 'Fee for buying/selling ownership tokens on the OWNLY Exchange before asset exit',
      charged: 'Split 1% seller, 1% buyer on trade execution',
      example: 'AED 200 total on AED 10,000 trade',
      icon: TrendingDown,
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Investor Transactions',
      rate: 'AED 0',
      type: 'Always Free',
      description: 'No fees for deposits, withdrawals, transfers, or account maintenance',
      charged: 'Never - completely free',
      example: 'AED 0 on all wallet transactions',
      icon: Wallet,
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const assetClassFees = [
    {
      id: 'real-estate',
      name: 'Real Estate',
      icon: Building2,
      setup: '7%',
      management: '10%',
      exit: '15%',
      avgHolding: '3-5 years',
      minInvest: 'AED 500'
    },
    {
      id: 'franchise',
      name: 'Franchises',
      icon: Store,
      setup: '8%',
      management: '12%',
      exit: '15%',
      avgHolding: '4-6 years',
      minInvest: 'AED 1,000'
    },
    {
      id: 'luxury-cars',
      name: 'Luxury Cars',
      icon: Car,
      setup: '6%',
      management: '8%',
      exit: '12%',
      avgHolding: '2-3 years',
      minInvest: 'AED 2,000'
    },
    {
      id: 'luxury-assets',
      name: 'Luxury Assets',
      icon: Diamond,
      setup: '7%',
      management: '9%',
      exit: '15%',
      avgHolding: '3-4 years',
      minInvest: 'AED 5,000'
    },
    {
      id: 'trade',
      name: 'Trade Finance',
      icon: Package,
      setup: '5%',
      management: '8%',
      exit: '10%',
      avgHolding: '1-2 years',
      minInvest: 'AED 500'
    }
  ];

  const comparisonData = [
    { feature: 'Setup Costs', traditional: '5-10% + legal fees', ownly: '7% all-inclusive', better: true },
    { feature: 'Annual Management', traditional: '10-15% of income', ownly: '10% of income', better: true },
    { feature: 'Transaction Fees', traditional: 'AED 50-200 per', ownly: 'AED 0', better: true },
    { feature: 'Withdrawal Fees', traditional: 'AED 25-100', ownly: 'AED 0', better: true },
    { feature: 'Account Maintenance', traditional: 'AED 10-50/month', ownly: 'AED 0', better: true },
    { feature: 'Minimum Investment', traditional: 'AED 500,000+', ownly: 'AED 500', better: true },
    { feature: 'Exit Fees', traditional: '5-6% agent commission', ownly: '15% on profits only', better: false },
    { feature: 'Liquidity', traditional: 'Very low', ownly: 'Exchange trading (2% fee)', better: true }
  ];

  const noHiddenFees = [
    'No account maintenance fees',
    'No inactivity fees',
    'No deposit fees',
    'No withdrawal fees',
    'No transfer fees',
    'No minimum balance requirements',
    'No early exit penalties (just use Exchange)',
    'No statement or reporting fees',
    'No customer support fees',
    'No KYC/AML processing fees',
    'No currency conversion fees (AED only)',
    'No platform access fees'
  ];

  const calculateFees = () => {
    const setupFee = investmentAmount * 0.07;
    const investedAmount = investmentAmount - setupFee;
    const annualIncome = investedAmount * (annualReturn / 100);
    const annualManagementFee = annualIncome * 0.10;
    const netAnnualIncome = annualIncome - annualManagementFee;
    const totalNetIncome = netAnnualIncome * holdingPeriod;

    // Assume 30% capital appreciation over holding period
    const capitalAppreciation = investedAmount * 0.30;
    const exitSuccessFee = capitalAppreciation * 0.15;
    const netCapitalGain = capitalAppreciation - exitSuccessFee;

    const totalValue = investedAmount + totalNetIncome + netCapitalGain;
    const totalFees = setupFee + (annualManagementFee * holdingPeriod) + exitSuccessFee;
    const totalReturns = totalNetIncome + netCapitalGain;

    return {
      setupFee,
      investedAmount,
      annualIncome,
      annualManagementFee,
      netAnnualIncome,
      totalNetIncome,
      capitalAppreciation,
      exitSuccessFee,
      netCapitalGain,
      totalValue,
      totalFees,
      totalReturns,
      roi: ((totalReturns / investmentAmount) * 100).toFixed(1)
    };
  };

  const fees = calculateFees();

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
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-semibold">100% Transparent Pricing</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Fee Structure
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Simple, transparent fees with no hidden charges.
              <span className="text-blue-400 font-bold"> You always know exactly what you're paying.</span>
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <Percent className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">7%</div>
                <div className="text-xs text-gray-400">Setup Fee</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <BarChart3 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">10%</div>
                <div className="text-xs text-gray-400">Annual Mgmt</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <Coins className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">15%</div>
                <div className="text-xs text-gray-400">Exit Fee (Profits)</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <Ban className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">AED 0</div>
                <div className="text-xs text-gray-400">Hidden Fees</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Complete Fee Breakdown</h2>
          <p className="text-xl text-gray-400">Every fee explained in detail</p>
        </div>

        <div className="space-y-6">
          {feeStructure.map((fee, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all">
              <div className="flex flex-col md:flex-row gap-8">
                <div className={`bg-gradient-to-r ${fee.color} w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl`}>
                  <fee.icon className="w-10 h-10 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{fee.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {fee.rate}
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                          {fee.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                        <Info className="w-4 h-4" />
                        <span className="text-sm">What it covers</span>
                      </div>
                      <p className="text-gray-300 text-sm">{fee.description}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-purple-400 font-semibold mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">When charged</span>
                      </div>
                      <p className="text-gray-300 text-sm">{fee.charged}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                        <Calculator className="w-4 h-4" />
                        <span className="text-sm">Example</span>
                      </div>
                      <p className="text-gray-300 text-sm font-mono">{fee.example}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Class Specific Fees */}
      <div className="py-20 bg-gradient-to-r from-indigo-950/30 to-purple-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Fees by Asset Class</h2>
            <p className="text-xl text-gray-400">Different assets, different fee structures</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {assetClassFees.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setSelectedAssetClass(asset.id)}
                className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-6 hover:scale-105 transition-all ${
                  selectedAssetClass === asset.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'
                }`}
              >
                <asset.icon className={`w-12 h-12 mx-auto mb-3 ${
                  selectedAssetClass === asset.id ? 'text-blue-400' : 'text-gray-400'
                }`} />
                <h3 className="text-sm font-bold text-white mb-2">{asset.name}</h3>
                <p className="text-xs text-gray-400">From {asset.minInvest}</p>
              </button>
            ))}
          </div>

          {assetClassFees.map((asset) => (
            selectedAssetClass === asset.id && (
              <div key={asset.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <asset.icon className="w-16 h-16 text-blue-400" />
                  <div>
                    <h3 className="text-3xl font-bold text-white">{asset.name}</h3>
                    <p className="text-gray-400">Minimum Investment: {asset.minInvest} • Avg Holding: {asset.avgHolding}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-xl p-6 text-center">
                    <Building2 className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <div className="text-sm text-gray-400 mb-2">Setup Fee</div>
                    <div className="text-3xl font-bold text-white">{asset.setup}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 text-center">
                    <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <div className="text-sm text-gray-400 mb-2">Annual Management</div>
                    <div className="text-3xl font-bold text-white">{asset.management}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <div className="text-sm text-gray-400 mb-2">Exit Success Fee</div>
                    <div className="text-3xl font-bold text-white">{asset.exit}</div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Fee Calculator */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Calculator className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Fee Calculator</h2>
            <p className="text-xl text-gray-400">See exactly what you'll pay based on your investment</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <label className="block text-white font-semibold mb-3">
                  Investment Amount
                </label>
                <div className="text-3xl font-bold text-blue-400 mb-4">
                  AED {investmentAmount.toLocaleString()}
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>AED 500</span>
                  <span>AED 100K</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Holding Period
                </label>
                <div className="text-3xl font-bold text-purple-400 mb-4">
                  {holdingPeriod} years
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={holdingPeriod}
                  onChange={(e) => setHoldingPeriod(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1 year</span>
                  <span>10 years</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Expected Annual ROI
                </label>
                <div className="text-3xl font-bold text-green-400 mb-4">
                  {annualReturn}%
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>5%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Setup Fee (7%)</span>
                    <span className="font-mono">-AED {fees.setupFee.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-white font-semibold">
                    <span>Invested Amount</span>
                    <span className="font-mono">AED {fees.investedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Annual Income ({annualReturn}%)</span>
                    <span className="font-mono">AED {fees.annualIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Annual Mgmt Fee (10%)</span>
                    <span className="font-mono">-AED {fees.annualManagementFee.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-400 font-semibold">
                    <span>Net Annual Income</span>
                    <span className="font-mono">AED {fees.netAnnualIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Total Income ({holdingPeriod}yr)</span>
                    <span className="font-mono">AED {fees.totalNetIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Capital Appreciation (30%)</span>
                    <span className="font-mono">AED {fees.capitalAppreciation.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Exit Success Fee (15%)</span>
                    <span className="font-mono">-AED {fees.exitSuccessFee.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-400 font-semibold">
                    <span>Net Capital Gain</span>
                    <span className="font-mono">AED {fees.netCapitalGain.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-400">
                    <span>Total Fees Paid</span>
                    <span className="font-mono">AED {fees.totalFees.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-white/10 pt-6 mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-2">Total Investment</div>
                    <div className="text-2xl font-bold text-white">
                      AED {investmentAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-2">Total Returns</div>
                    <div className="text-2xl font-bold text-green-400">
                      +AED {fees.totalReturns.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-2">Final Value • {fees.roi}% ROI</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      AED {fees.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="py-20 bg-gradient-to-r from-slate-950/50 to-gray-950/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">OWNLY vs Traditional Investing</h2>
            <p className="text-xl text-gray-400">See how we compare</p>
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
                        {row.better ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-400" />
                        )}
                        <span className={row.better ? 'text-blue-400 font-bold' : 'text-yellow-400 font-bold'}>
                          {row.ownly}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* No Hidden Fees */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">No Hidden Fees Guarantee</h2>
            <p className="text-xl text-gray-400">We'll NEVER charge you for these:</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {noHiddenFees.map((fee, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-green-500/50 transition-all">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-white font-medium">{fee}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-12">
            <Award className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Investing?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Simple fees, transparent pricing, no surprises.<br />
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
            <p className="text-sm text-gray-500 mt-6">No credit card required • Zero hidden fees</p>
          </div>
        </div>
      </div>
    </div>
  );
}
