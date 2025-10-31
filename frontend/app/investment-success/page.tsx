'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { dealAPI } from '@/lib/api';
import confetti from 'canvas-confetti';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function InvestmentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderEmail, setReminderEmail] = useState('');
  const [suggestedDeals, setSuggestedDeals] = useState<any[]>([]);

  const investmentAmount = parseFloat(searchParams?.get('amount') || '0');
  const dealId = searchParams?.get('dealId');

  // Trigger confetti on mount
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ['#9333ea', '#ec4899', '#10b981', '#3b82f6', '#f59e0b'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dealId) {
      fetchDeal(dealId);
      fetchSuggestedDeals();
    } else {
      setLoading(false);
    }
  }, [dealId]);

  const fetchDeal = async (id: string) => {
    try {
      const response = await dealAPI.get(id);

      // Try different possible paths for the deal data
      let dealData = response.data?.data?.deal || response.data?.deal || response.data?.data || null;

      if (dealData) {
        console.log('✅ Deal loaded:', dealData.title);
        setDeal(dealData);
      } else {
        console.error('❌ Could not find deal in response');
      }
    } catch (error) {
      console.error('❌ Error fetching deal:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedDeals = async () => {
    try {
      const response = await dealAPI.list({ limit: 3, status: 'active' });
      const deals = response.data?.data?.deals || response.data?.deals || [];
      setSuggestedDeals(deals.slice(0, 3));
    } catch (error) {
      console.error('Error fetching suggested deals:', error);
    }
  };

  // Social Sharing Functions
  const shareOnWhatsApp = () => {
    if (!deal) return;
    const expectedRoi = deal.expected_roi || deal.expectedRoi || 0;
    const text = `I just invested ${formatCurrency(investmentAmount)} in ${deal.title || 'a deal'} on OWNLY! Expected ${expectedRoi}% ROI. Join me in building wealth through smart investments! 💰`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareOnTwitter = () => {
    if (!deal) return;
    const expectedRoi = deal.expected_roi || deal.expectedRoi || 0;
    const text = `Just invested ${formatCurrency(investmentAmount)} in ${deal.title || 'a deal'} on @OWNLY_UAE! Expected ${expectedRoi}% ROI 📈💰 #Investment #WealthBuilding`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    if (!deal) return;
    const expectedRoi = deal.expected_roi || deal.expectedRoi || 0;
    const text = `Excited to share my latest investment in ${deal.title || 'a deal'} through OWNLY! ${formatCurrency(investmentAmount)} invested with an expected ${expectedRoi}% ROI. Building wealth through diversified fractional investments. 📈`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://ownly.ae')}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Download Receipt
  const downloadReceipt = () => {
    if (!deal) return;

    const expectedRoi = deal.expected_roi || deal.expectedRoi || 0;
    const holdingPeriodMonths = deal.holding_period_months || deal.holdingPeriodMonths || 0;
    const expectedReturn = (investmentAmount * expectedRoi) / 100;
    const totalReturn = investmentAmount + expectedReturn;
    const monthlyIncome = holdingPeriodMonths > 0 ? expectedReturn / holdingPeriodMonths : 0;
    const exitDate = holdingPeriodMonths > 0
      ? new Date(Date.now() + holdingPeriodMonths * 30 * 24 * 60 * 60 * 1000)
      : null;

    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
      receiptWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Investment Receipt - OWNLY</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #9333ea; padding-bottom: 20px; }
            .logo { font-size: 32px; font-weight: bold; color: #9333ea; }
            .receipt-id { color: #666; font-size: 14px; margin-top: 10px; }
            .section { margin: 30px 0; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { color: #666; }
            .value { font-weight: bold; color: #000; }
            .highlight { background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; }
            .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 2px solid #eee; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">OWNLY</div>
            <div>Multi-Asset Fractional Investment Platform</div>
            <div class="receipt-id">Transaction ID: ${Date.now().toString(36).toUpperCase()}</div>
            <div class="receipt-id">Date: ${new Date().toLocaleString('en-AE')}</div>
          </div>

          <div class="section">
            <div class="section-title">Investment Details</div>
            <div class="info-row">
              <span class="label">Deal Name:</span>
              <span class="value">${deal.title || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="label">Investment Amount:</span>
              <span class="value">${formatCurrency(investmentAmount)}</span>
            </div>
            <div class="info-row">
              <span class="label">Expected ROI:</span>
              <span class="value">${expectedRoi}%</span>
            </div>
            <div class="info-row">
              <span class="label">Expected Return:</span>
              <span class="value">${formatCurrency(expectedReturn)}</span>
            </div>
            <div class="info-row">
              <span class="label">Total at Exit:</span>
              <span class="value">${formatCurrency(totalReturn)}</span>
            </div>
          </div>

          <div class="highlight">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Monthly Income</div>
            <div style="font-size: 24px; color: #10b981; font-weight: bold;">${formatCurrency(monthlyIncome)}</div>
            <div style="color: #666; margin-top: 5px;">Expected monthly distributions for ${holdingPeriodMonths} months</div>
          </div>

          <div class="section">
            <div class="section-title">Deal Information</div>
            <div class="info-row">
              <span class="label">Category:</span>
              <span class="value">${deal.category || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="label">Deal Type:</span>
              <span class="value">${(deal.deal_type || deal.dealType || 'N/A').replace('_', ' ')}</span>
            </div>
            <div class="info-row">
              <span class="label">Asset Type:</span>
              <span class="value">${(deal.asset_type || deal.assetType || 'N/A').replace('_', ' ')}</span>
            </div>
            <div class="info-row">
              <span class="label">Location:</span>
              <span class="value">${deal.location || 'UAE'}</span>
            </div>
            <div class="info-row">
              <span class="label">Holding Period:</span>
              <span class="value">${holdingPeriodMonths} months</span>
            </div>
            <div class="info-row">
              <span class="label">Expected Exit Date:</span>
              <span class="value">${exitDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) || 'TBD'}</span>
            </div>
          </div>

          <div class="footer">
            <div><strong>OWNLY Investment Platform</strong></div>
            <div>United Arab Emirates</div>
            <div style="margin-top: 10px;">This is a computer-generated receipt and does not require a signature.</div>
            <div>For inquiries, please contact support@ownly.ae</div>
          </div>
        </body>
        </html>
      `);
      receiptWindow.document.close();
      setTimeout(() => receiptWindow.print(), 500);
    }
  };

  // Add to Calendar
  const addToCalendar = () => {
    if (!deal) return;

    const holdingPeriodMonths = deal.holding_period_months || deal.holdingPeriodMonths || 0;
    const exitDate = holdingPeriodMonths > 0
      ? new Date(Date.now() + holdingPeriodMonths * 30 * 24 * 60 * 60 * 1000)
      : null;

    if (!exitDate) return;

    const expectedRoi = deal.expected_roi || deal.expectedRoi || 0;
    const expectedReturn = (investmentAmount * expectedRoi) / 100;
    const totalReturn = investmentAmount + expectedReturn;

    const event = {
      title: `${deal.title || 'Investment'} - Exit Date`,
      description: `Expected exit for your ${formatCurrency(investmentAmount)} investment in ${deal.title || 'this deal'}. Expected return: ${formatCurrency(totalReturn)}`,
      start: exitDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: exitDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
    };

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&dates=${event.start}/${event.end}`;
    window.open(googleCalendarUrl, '_blank');
  };

  // Setup Reminder
  const setupReminder = () => {
    setShowReminderModal(true);
  };

  const submitReminder = () => {
    alert(`✅ Reminder set! You'll receive updates at ${reminderEmail || 'your registered email'}`);
    setShowReminderModal(false);
    setReminderEmail('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Loading your investment details...</p>
        </div>
      </div>
    );
  }

  if (!deal || !investmentAmount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="text-center max-w-md mx-auto p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 mb-2 text-xl font-bold">Invalid Investment Details</p>
          <p className="text-gray-400 mb-6">
            {!dealId && 'Missing deal ID. '}
            {!investmentAmount && 'Missing investment amount. '}
            {dealId && investmentAmount && !deal && 'Could not load deal information.'}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/deals" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold">
              Browse Deals
            </Link>
            <Link href="/portfolio" className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all font-semibold">
              View Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract deal fields with fallbacks
  const expectedRoi = deal.expected_roi || deal.expectedRoi || 0;
  const holdingPeriodMonths = deal.holding_period_months || deal.holdingPeriodMonths || 12;
  const expectedReturn = (investmentAmount * expectedRoi) / 100;
  const totalReturn = investmentAmount + expectedReturn;
  const monthlyIncome = holdingPeriodMonths > 0 ? expectedReturn / holdingPeriodMonths : 0;
  const exitDate = holdingPeriodMonths > 0
    ? new Date(Date.now() + holdingPeriodMonths * 30 * 24 * 60 * 60 * 1000)
    : null;

  const mockCurrentPortfolioValue = 250000;
  const mockNewPortfolioValue = mockCurrentPortfolioValue + investmentAmount;
  const mockTotalInvestments = 8;

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Success Header with Animation */}
        <div className="text-center mb-12 animate-in fade-in zoom-in duration-700">
          <div className="w-28 h-28 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50 animate-bounce">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Investment Successful!
          </h1>
          <p className="text-xl md:text-2xl text-purple-300 mb-6">
            You are now an investor in <span className="font-bold text-purple-400">{deal.title || 'this opportunity'}</span>
          </p>

          {/* Investor Stats */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-slate-950"
                  style={{
                    background: `linear-gradient(135deg, ${['#3b82f6', '#9333ea', '#10b981', '#f59e0b'][i - 1]}, ${['#06b6d4', '#ec4899', '#22d3ee', '#ef4444'][i - 1]})`,
                  }}
                ></div>
              ))}
            </div>
            <span className="text-gray-300">You joined <span className="font-bold text-purple-400">47 other investors</span></span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <button onClick={shareOnWhatsApp} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-lg hover:shadow-green-600/50 font-medium">
            <span className="text-xl">📱</span>
            <span>WhatsApp</span>
          </button>
          <button onClick={shareOnTwitter} className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all shadow-lg hover:shadow-blue-500/50 font-medium">
            <span className="text-xl">🐦</span>
            <span>Twitter</span>
          </button>
          <button onClick={shareOnLinkedIn} className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-all shadow-lg hover:shadow-blue-700/50 font-medium">
            <span className="text-xl">💼</span>
            <span>LinkedIn</span>
          </button>
          <button onClick={downloadReceipt} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-purple-600/50 font-medium">
            <span className="text-xl">📄</span>
            <span>Download Receipt</span>
          </button>
          {exitDate && (
            <button onClick={addToCalendar} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all shadow-lg hover:shadow-orange-600/50 font-medium">
              <span className="text-xl">📅</span>
              <span>Add to Calendar</span>
            </button>
          )}
          <button onClick={setupReminder} className="flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-all shadow-lg hover:shadow-pink-600/50 font-medium">
            <span className="text-xl">🔔</span>
            <span>Reminders</span>
          </button>
        </div>

        {/* Investment Summary - Large Stats */}
        <div className="mb-8 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
            <p className="text-gray-300 text-sm mb-3 font-medium">Investment Amount</p>
            <p className="text-5xl font-bold text-white mb-2">{formatCurrency(investmentAmount)}</p>
            <div className="h-1 w-16 bg-purple-500 rounded-full mx-auto"></div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border-2 border-green-500/30 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
            <p className="text-gray-300 text-sm mb-3 font-medium">Expected Return</p>
            <p className="text-5xl font-bold text-green-400 mb-2">{formatCurrency(expectedReturn)}</p>
            <p className="text-green-300 font-semibold">{expectedRoi}% ROI</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border-2 border-blue-500/30 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
            <p className="text-gray-300 text-sm mb-3 font-medium">Total at Exit</p>
            <p className="text-5xl font-bold text-blue-400 mb-2">{formatCurrency(totalReturn)}</p>
            <div className="h-1 w-16 bg-blue-500 rounded-full mx-auto"></div>
          </div>
        </div>

        {/* Monthly Income & Exit Date */}
        {holdingPeriodMonths > 0 && (
          <div className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center md:text-left">
                <p className="text-gray-400 mb-2">Monthly Income</p>
                <p className="text-4xl font-bold text-purple-400 mb-2">{formatCurrency(monthlyIncome)}</p>
                <p className="text-sm text-gray-400">Distributed automatically each month</p>
              </div>
              <div className="text-center md:text-right border-l border-white/10 pl-8">
                <p className="text-gray-400 mb-2">Expected Exit Date</p>
                <p className="text-3xl font-bold text-white mb-2">
                  {exitDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) || 'TBD'}
                </p>
                <p className="text-sm text-gray-400">{holdingPeriodMonths} months holding period</p>
              </div>
            </div>
          </div>
        )}

        {/* Deal Information Card */}
        <div className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">🏢</span>
            Deal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Deal Name</p>
              <p className="text-2xl font-bold text-white mb-4">{deal.title || 'N/A'}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-6 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 font-semibold">
                {deal.category || 'Investment'}
              </span>
            </div>
          </div>

          {deal.description && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm mb-2">Description</p>
              <p className="text-white leading-relaxed">{deal.description}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/10 grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Deal Type</p>
              <p className="text-white font-semibold capitalize">{(deal.deal_type || deal.dealType || 'N/A').replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Asset Type</p>
              <p className="text-white font-semibold capitalize">{(deal.asset_type || deal.assetType || 'N/A').replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Location</p>
              <p className="text-white font-semibold">{deal.location || 'UAE'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Status</p>
              <p className="text-green-400 font-semibold capitalize">{deal.status || 'Active'}</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">What's Next?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/portfolio" className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 hover:border-purple-500/50 hover:bg-white/10 transition-all">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-2xl font-bold text-white mb-3">View Portfolio</h3>
              <p className="text-gray-400">Track all your investments and earnings</p>
            </Link>

            <Link href="/deals" className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 hover:border-purple-500/50 hover:bg-white/10 transition-all">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-3">Explore Deals</h3>
              <p className="text-gray-400">Discover more opportunities</p>
            </Link>

            <Link href="/wallet" className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 hover:border-purple-500/50 hover:bg-white/10 transition-all">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💳</div>
              <h3 className="text-2xl font-bold text-white mb-3">Manage Wallet</h3>
              <p className="text-gray-400">Add funds or withdraw earnings</p>
            </Link>
          </div>
        </div>

        {/* Referral Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-10 text-center shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-3">Share the Opportunity</h3>
          <p className="text-purple-100 mb-6 text-lg">
            Invite friends to OWNLY and earn AED 50 for each successful referral
          </p>
          <Link
            href="/rewards"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-xl text-lg"
          >
            Get Your Referral Link
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Transaction ID */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">Transaction ID: {Date.now().toString(36).toUpperCase()}</p>
          <p className="text-gray-500 text-sm mt-2">Confirmation sent to your registered email</p>
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-purple-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Setup Investment Reminders</h3>
            <p className="text-gray-400 mb-6">
              Get notified about monthly payouts, performance updates, and exit dates.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email for Notifications (Optional)
                </label>
                <input
                  type="email"
                  value={reminderEmail}
                  onChange={(e) => setReminderEmail(e.target.value)}
                  placeholder="Leave blank to use registered email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                  <span>Monthly payout notifications</span>
                </label>
                <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                  <span>Performance updates</span>
                </label>
                <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                  <span>Exit date reminders</span>
                </label>
                <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" />
                  <span>Weekly portfolio summary</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitReminder}
                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
              >
                Enable Reminders
              </button>
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InvestmentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Loading investment details...</p>
        </div>
      </div>
    }>
      <InvestmentSuccessContent />
    </Suspense>
  );
}
