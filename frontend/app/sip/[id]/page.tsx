'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function SIPDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [monthlyAmount, setMonthlyAmount] = useState(1000);
  const [duration, setDuration] = useState(12);
  const [startDate, setStartDate] = useState('');
  const [autoReinvest, setAutoReinvest] = useState(true);

  const sipPlan = {
    id: params.id as string,
    name: 'Premium Real Estate Portfolio SIP',
    description: 'Systematic Investment Plan for diversified real estate portfolio with steady monthly returns',
    category: 'Real Estate',
    minMonthlyInvestment: 500,
    maxMonthlyInvestment: 50000,
    expectedMonthlyReturn: 1.2,
    expectedAnnualReturn: 15.5,
    riskLevel: 'Moderate',
    duration: '12-60 months',
    status: 'Active',
    totalInvestors: 847,
    totalInvested: 12500000,
    assetsInPortfolio: 15,
  };

  const calculateReturns = () => {
    const monthlyReturn = sipPlan.expectedMonthlyReturn / 100;
    const totalInvested = monthlyAmount * duration;
    let futureValue = 0;
    for (let i = 1; i <= duration; i++) {
      futureValue += monthlyAmount * Math.pow(1 + monthlyReturn, duration - i + 1);
    }
    const totalReturns = futureValue - totalInvested;
    const roi = (totalReturns / totalInvested) * 100;
    return {
      totalInvested,
      futureValue: Math.round(futureValue),
      totalReturns: Math.round(totalReturns),
      roi: roi.toFixed(2)
    };
  };

  const returns = calculateReturns();

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex items-center text-green-50 mb-4 text-sm'>
            <Link href='/sip' className='hover:text-white'>SIP Plans</Link>
            <span className='mx-2'>›</span>
            <span>{sipPlan.name}</span>
          </div>
          <h1 className='text-4xl font-bold mb-3'>{sipPlan.name}</h1>
          <p className='text-xl text-green-50'>{sipPlan.description}</p>
          <div className='mt-6 grid grid-cols-3 gap-6'>
            <div className='text-center'>
              <div className='text-3xl font-bold'>{sipPlan.expectedAnnualReturn}%</div>
              <div className='text-sm text-green-50'>Annual Return</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold'>{sipPlan.totalInvestors.toLocaleString()}</div>
              <div className='text-sm text-green-50'>Investors</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold'>{sipPlan.assetsInPortfolio}</div>
              <div className='text-sm text-green-50'>Assets</div>
            </div>
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>SIP Returns Calculator</h2>
          <div className='space-y-6'>
            <div>
              <div className='flex justify-between mb-2'>
                <label className='font-medium'>Monthly Investment Amount</label>
                <span className='text-xl font-bold text-green-600'>AED {monthlyAmount.toLocaleString()}</span>
              </div>
              <input type='range' min={sipPlan.minMonthlyInvestment} max={sipPlan.maxMonthlyInvestment} step={100} value={monthlyAmount} onChange={(e) => setMonthlyAmount(Number(e.target.value))} className='w-full accent-green-600' />
            </div>
            <div>
              <div className='flex justify-between mb-2'>
                <label className='font-medium'>Duration (months)</label>
                <span className='text-xl font-bold text-green-600'>{duration}</span>
              </div>
              <input type='range' min={12} max={60} step={6} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className='w-full accent-green-600' />
            </div>
            <div className='grid grid-cols-2 gap-6 mt-8'>
              <div className='bg-blue-50 rounded-xl p-6'>
                <div className='text-sm text-blue-700'>Total Invested</div>
                <div className='text-3xl font-bold text-blue-900'>AED {returns.totalInvested.toLocaleString()}</div>
              </div>
              <div className='bg-green-50 rounded-xl p-6'>
                <div className='text-sm text-green-700'>Expected Returns</div>
                <div className='text-3xl font-bold text-green-900'>AED {returns.totalReturns.toLocaleString()}</div>
              </div>
              <div className='bg-purple-50 rounded-xl p-6'>
                <div className='text-sm text-purple-700'>Future Value</div>
                <div className='text-3xl font-bold text-purple-900'>AED {returns.futureValue.toLocaleString()}</div>
              </div>
              <div className='bg-orange-50 rounded-xl p-6'>
                <div className='text-sm text-orange-700'>Expected ROI</div>
                <div className='text-3xl font-bold text-orange-900'>{returns.roi}%</div>
              </div>
            </div>
            <button className='w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700'>
              Start SIP Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
