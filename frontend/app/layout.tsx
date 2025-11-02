'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { walletAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import MobileNav from '@/components/MobileNav';
import { PreferencesProvider } from '@/context/PreferencesContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CurrencySwitcher from '@/components/CurrencySwitcher';
import {
  TrendingUp, LayoutDashboard, Wallet, Wrench, GraduationCap, MoreHorizontal,
  ShoppingBag, Sparkles, Package, Repeat, Building2, ChevronDown, Menu, X,
  Calculator, Target, Shield, Lightbulb, BarChart3, User, Settings, LogOut,
  Home, CreditCard, FileCheck, BadgeCheck, HelpCircle, Award, Users, Zap,
  TrendingDown, Search, Star, BookOpen, Trophy, MapPin, FolderOpen
} from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

function Header() {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      walletAPI.getBalance()
        .then(response => {
          setWalletBalance(response.data.data.wallet.availableBalance);
        })
        .catch(() => {});
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-blue-500/5'
        : 'bg-slate-950/70 backdrop-blur-md border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all group-hover:scale-105">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="font-bold text-lg text-white">OWNLY</span>
              <span className="text-xs text-purple-400 -mt-0.5">Investment Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation - Streamlined */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Invest Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <TrendingUp className="w-4 h-4" />
                Invest
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/deals" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <ShoppingBag className="w-4 h-4" />
                    Browse Deals
                  </Link>
                  <Link href="/featured" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 border-l-2 border-transparent hover:border-orange-500 transition-all">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>Featured Deals</span>
                    <span className="ml-auto text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-semibold">HOT</span>
                  </Link>
                  <Link href="/bundles" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <Package className="w-4 h-4" />
                    Bundles
                  </Link>
                  <Link href="/sip" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <Repeat className="w-4 h-4" />
                    SIP Plans
                  </Link>
                  <Link href="/copy-trading" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 border-l-2 border-transparent hover:border-blue-500 transition-all">
                    <Users className="w-4 h-4 text-blue-400" />
                    Copy Trading
                  </Link>
                  <div className="border-t border-white/10 my-2"></div>
                  <Link href="/exchange" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/20 border-l-2 border-transparent hover:border-green-500 transition-all">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span>Exchange Trading</span>
                    <span className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  </Link>
                  <Link href="/secondary-market" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <Building2 className="w-4 h-4" />
                    Secondary Market
                  </Link>
                </div>
              </div>
            </div>

            {/* Dashboard Link */}
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            {/* Portfolio Link */}
            <Link href="/investments" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <Wallet className="w-4 h-4" />
              Portfolio
            </Link>

            {/* More Dropdown - Consolidated */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <MoreHorizontal className="w-4 h-4" />
                More
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-[80vh] overflow-y-auto">
                <div className="py-2">
                  {/* Quick Access */}
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Access</div>
                  <Link href="/search" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <Search className="w-4 h-4" />
                    Search Deals
                  </Link>
                  <Link href="/watchlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <Star className="w-4 h-4" />
                    Watchlist
                  </Link>

                  <div className="border-t border-white/10 my-2"></div>

                  {/* Tools */}
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools & Analytics</div>
                  <Link href="/calculator" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <Calculator className="w-4 h-4" />
                    ROI Calculator
                  </Link>
                  <Link href="/portfolio-builder" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <Target className="w-4 h-4" />
                    Portfolio Builder
                  </Link>
                  <Link href="/scenarios" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <Lightbulb className="w-4 h-4" />
                    Scenarios
                  </Link>
                  <Link href="/deals/compare" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <BarChart3 className="w-4 h-4" />
                    Compare Deals
                  </Link>
                  <Link href="/property-map" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-blue-500/20 border-l-2 border-transparent hover:border-teal-500 transition-all">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    <span>Property Map</span>
                    <span className="ml-auto text-xs bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full font-semibold">NEW</span>
                  </Link>

                  <div className="border-t border-white/10 my-2"></div>

                  {/* Learn */}
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Learn & Support</div>
                  <Link href="/getting-started" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 border-l-2 border-transparent hover:border-blue-500 transition-all">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>Getting Started</span>
                    <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold">NEW</span>
                  </Link>
                  <Link href="/help" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <HelpCircle className="w-4 h-4" />
                    Help Center
                  </Link>
                  <Link href="/academy" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <GraduationCap className="w-4 h-4" />
                    Academy
                  </Link>

                  <div className="border-t border-white/10 my-2"></div>

                  {/* Community */}
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Community</div>
                  <Link href="/community" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <Users className="w-4 h-4" />
                    Community Hub
                  </Link>
                  <Link href="/rewards" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <Award className="w-4 h-4" />
                    Rewards
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Side - Wallet & User */}
          <div className="flex items-center gap-3">
            {/* Wallet Balance */}
            {isLoggedIn && walletBalance !== null && (
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg px-4 py-2">
                <Wallet className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-xs text-gray-400">Balance</div>
                  <div className="text-sm font-bold text-white">{formatCurrency(walletBalance)}</div>
                </div>
              </div>
            )}

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-all">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {JSON.parse(localStorage.getItem('user') || '{}').name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400 hidden md:block" />
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">
                        {JSON.parse(localStorage.getItem('user') || '{}').name || 'User'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {JSON.parse(localStorage.getItem('user') || '{}').email || ''}
                      </p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link href="/exchange" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/20 border-l-2 border-transparent hover:border-green-500 transition-all">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span>Exchange</span>
                      <span className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    </Link>
                    <Link href="/investments" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                      <Wallet className="w-4 h-4" />
                      Portfolio
                    </Link>
                    <Link href="/progress" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 border-l-2 border-transparent hover:border-purple-500 transition-all">
                      <Trophy className="w-4 h-4 text-purple-400" />
                      <span>Investment Progress</span>
                      <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-semibold">NEW</span>
                    </Link>
                    <Link href="/wallet" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                      <CreditCard className="w-4 h-4" />
                      Wallet
                    </Link>
                    <Link href="/kyc" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                      <BadgeCheck className="w-4 h-4" />
                      KYC Status
                    </Link>
                    <Link href="/documents" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 border-l-2 border-transparent hover:border-blue-500 transition-all">
                      <FolderOpen className="w-4 h-4 text-blue-400" />
                      <span>Documents</span>
                      <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold">NEW</span>
                    </Link>
                    <div className="border-t border-white/10 my-2"></div>

                    {/* Preferences Section */}
                    <div className="px-4 py-1.5">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preferences</div>
                      <div className="space-y-2">
                        <LanguageSwitcher />
                        <CurrencySwitcher />
                      </div>
                    </div>

                    <div className="border-t border-white/10 my-2"></div>
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Sandbox Badge */}
            <div className="hidden lg:flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400">SANDBOX</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <nav className="space-y-1">
              <Link href="/deals" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <ShoppingBag className="w-4 h-4" />
                Browse Deals
              </Link>
              <Link href="/featured" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <Sparkles className="w-4 h-4 text-orange-400" />
                Featured Deals
              </Link>
              <Link href="/exchange" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Exchange
                <span className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              </Link>
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/investments" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <Wallet className="w-4 h-4" />
                Portfolio
              </Link>
              {isLoggedIn && walletBalance !== null && (
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg mx-4">
                  <Wallet className="w-4 h-4 text-green-400" />
                  <div>
                    <div className="text-xs text-gray-400">Balance</div>
                    <div className="text-sm font-bold text-white">{formatCurrency(walletBalance)}</div>
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
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
        <PreferencesProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <Header />

            <main className="flex-1">
              {children}
            </main>

          {/* Footer */}
          <footer className="bg-slate-950/50 backdrop-blur-md border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center items-center gap-8 mb-12 pb-8 border-b border-white/10">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <BadgeCheck className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-xs font-semibold text-gray-400">DFSA Licensed</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-xs font-semibold text-gray-400">Bank-Grade Security</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <FileCheck className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-xs font-semibold text-gray-400">Shariah Compliant</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <BarChart3 className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="text-xs font-semibold text-gray-400">Audited Platform</div>
                </div>
              </div>

              {/* Platform Stats */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AED 50M+</div>
                    <div className="text-sm text-gray-400 mt-1">Total Invested</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">10,000+</div>
                    <div className="text-sm text-gray-400 mt-1">Happy Investors</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">15.2%</div>
                    <div className="text-sm text-gray-400 mt-1">Avg. Annual Returns</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">250+</div>
                    <div className="text-sm text-gray-400 mt-1">Deals Funded</div>
                  </div>
                </div>
              </div>

              {/* Footer Links */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-white mb-4">Company</h3>
                  <ul className="space-y-2">
                    <li><Link href="/about" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">About Us</Link></li>
                    <li><Link href="/how-it-works" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">How It Works</Link></li>
                    <li><Link href="/statistics" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Platform Statistics</Link></li>
                    <li><Link href="/fees" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Fees</Link></li>
                    <li><Link href="/list-your-deal" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">List Your Deal</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-4">Invest</h3>
                  <ul className="space-y-2">
                    <li><Link href="/deals" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Browse Deals</Link></li>
                    <li><Link href="/featured" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Featured Deals</Link></li>
                    <li><Link href="/bundles" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Bundles</Link></li>
                    <li><Link href="/copy-trading" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Copy Trading</Link></li>
                    <li><Link href="/exchange" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Exchange</Link></li>
                    <li><Link href="/progress" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Investment Progress</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-4">Learn</h3>
                  <ul className="space-y-2">
                    <li><Link href="/how-to-invest" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">How to Invest</Link></li>
                    <li><Link href="/academy" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Academy</Link></li>
                    <li><Link href="/faq" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">FAQ</Link></li>
                    <li><Link href="/calculator" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">ROI Calculator</Link></li>
                    <li><Link href="/risk-assessment" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Risk Assessment</Link></li>
                    <li><Link href="/property-map" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Property Map</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-4">Support</h3>
                  <ul className="space-y-2">
                    <li><Link href="/getting-started" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Getting Started</Link></li>
                    <li><Link href="/help" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Help Center</Link></li>
                    <li><Link href="/security" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Security</Link></li>
                    <li><Link href="/shariah-compliance" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Shariah Compliance</Link></li>
                    <li><Link href="/documents" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Documents</Link></li>
                    <li><a href="mailto:support@ownly.ae" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Contact Us</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="pt-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg text-sm mb-2 inline-flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      SANDBOX ENVIRONMENT - All data is dummy/simulated
                    </div>
                    <p className="text-gray-500 text-sm">© 2024 OWNLY. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </footer>

          {/* Mobile Navigation */}
          <MobileNav />
          </div>
        </PreferencesProvider>
      </body>
    </html>
  );
}
