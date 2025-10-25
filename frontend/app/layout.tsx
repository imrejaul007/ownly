'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { walletAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

function Header() {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      // Fetch wallet balance
      walletAPI.getBalance()
        .then(response => {
          setWalletBalance(response.data.data.wallet.availableBalance);
        })
        .catch(() => {
          // Silently fail if wallet fetch fails
        });
    }
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span className="font-bold text-xl">OWNLY Sandbox</span>
            </Link>

            <nav className="hidden lg:flex space-x-4">
              <Link href="/deals" className="text-gray-700 hover:text-primary-600 px-2 py-1 rounded hover:bg-gray-100">
                Deals
              </Link>
              <Link href="/bundles" className="text-gray-700 hover:text-primary-600 px-2 py-1 rounded hover:bg-gray-100">
                Bundles
              </Link>
              <Link href="/secondary-market" className="text-gray-700 hover:text-primary-600 px-2 py-1 rounded hover:bg-gray-100">
                Secondary Market
              </Link>
              <Link href="/investments" className="text-gray-700 hover:text-primary-600 px-2 py-1 rounded hover:bg-gray-100">
                Portfolio
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 px-2 py-1 rounded hover:bg-gray-100">
                Dashboard
              </Link>
              <Link href="/academy" className="text-gray-700 hover:text-primary-600 px-2 py-1 rounded hover:bg-gray-100">
                Academy
              </Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-primary-600 px-2 py-1 rounded hover:bg-gray-100 flex items-center">
                  More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-50">
                  <div className="py-2">
                    <Link href="/community" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      🌍 Community
                    </Link>
                    <Link href="/success-stories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      🌟 Success Stories
                    </Link>
                    <Link href="/referrals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      💰 Referrals
                    </Link>
                    <Link href="/deals/compare" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      ⚖️ Compare Deals
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link href="/analytics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      📊 Analytics
                    </Link>
                    <Link href="/property-management" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      🏠 Properties
                    </Link>
                    <Link href="/documents" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      📄 Documents
                    </Link>
                    <Link href="/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      🔔 Notifications
                    </Link>
                    <Link href="/activity" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      📝 Activity
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      ⚙️ Admin Panel
                    </Link>
                    <Link href="/operations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      🔧 Operations
                    </Link>
                    <Link href="/scenarios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      🎯 Scenarios
                    </Link>
                    <Link href="/reports" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      📈 Reports
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn && walletBalance !== null && (
              <div className="flex items-center bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500">Available Balance</div>
                  <div className="text-sm font-bold text-gray-900">{formatCurrency(walletBalance)}</div>
                </div>
              </div>
            )}
            {isLoggedIn && (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {JSON.parse(localStorage.getItem('user') || '{}').name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {JSON.parse(localStorage.getItem('user') || '{}').name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {JSON.parse(localStorage.getItem('user') || '{}').email || ''}
                      </p>
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      📊 Dashboard
                    </Link>
                    <Link href="/investments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      💼 My Portfolio
                    </Link>
                    <Link href="/wallet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      💰 Wallet
                    </Link>
                    <Link href="/kyc" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      ✓ KYC Status
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      ⚙️ Settings
                    </Link>
                    <Link href="/agent-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      🎯 Agent Dashboard
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="badge badge-yellow">
              SANDBOX
            </div>
            {!isLoggedIn && (
              <>
                <Link href="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />

          {/* Main Content */}
          <main className="flex-1 bg-gray-50 dark:bg-gray-900">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-600 text-sm">
                <p className="mb-2">
                  This is a SANDBOX environment. All data is dummy/simulated. No real money or sensitive information.
                </p>
                <p>© 2024 OWNLY Sandbox. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
