'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, LayoutDashboard, ShoppingCart, Package, RefreshCw, Star,
  Bell, User, Menu, X, Wallet, BarChart3, HelpCircle, Settings,
  TrendingUp, Building, Store, Rocket, Activity, Search
} from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const mainLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/deals', label: 'Deals', icon: ShoppingCart },
    { href: '/bundles', label: 'Bundles', icon: Package },
    { href: '/exchange', label: 'Exchange', icon: RefreshCw },
  ];

  const secondaryLinks = [
    { href: '/search', label: 'Search', icon: Search },
    { href: '/watchlist', label: 'Watchlist', icon: Star },
    { href: '/copy-trading', label: 'Copy Trading', icon: User },
    { href: '/investments', label: 'My Investments', icon: TrendingUp },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/secondary-market', label: 'Secondary Market', icon: Activity },
    { href: '/wallet', label: 'Wallet', icon: Wallet },
    { href: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const utilityLinks = [
    { href: '/calculator', label: 'ROI Calculator', icon: BarChart3 },
    { href: '/featured', label: 'Featured', icon: TrendingUp },
    { href: '/getting-started', label: 'Getting Started', icon: HelpCircle },
    { href: '/help', label: 'Help Center', icon: HelpCircle },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Bottom Nav - Always visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="flex items-center justify-around px-2 py-3">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  active
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-300 hover:bg-white/5'
                }`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{link.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Hamburger Menu Button - Top Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 lg:hidden z-50 p-3 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/5 transition-all"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Full Screen Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 lg:hidden z-40 bg-slate-950/98 backdrop-blur-xl overflow-y-auto">
          <div className="min-h-screen pt-20 pb-24 px-6">
            {/* User Profile Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Investor</h3>
                  <p className="text-purple-100 text-sm">View Profile</p>
                </div>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="mb-8">
              <h3 className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4 px-2">
                Main Menu
              </h3>
              <div className="space-y-2">
                {mainLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                      <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                        active
                          ? 'bg-purple-600 text-white'
                          : 'text-purple-200 hover:bg-white/5'
                      }`}>
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Secondary Navigation */}
            <div className="mb-8">
              <h3 className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4 px-2">
                My Portfolio
              </h3>
              <div className="space-y-2">
                {secondaryLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                      <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                        active
                          ? 'bg-purple-600 text-white'
                          : 'text-purple-200 hover:bg-white/5'
                      }`}>
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Utility Links */}
            <div className="mb-8">
              <h3 className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4 px-2">
                Resources
              </h3>
              <div className="space-y-2">
                {utilityLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                      <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                        active
                          ? 'bg-purple-600 text-white'
                          : 'text-purple-200 hover:bg-white/5'
                      }`}>
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link href="/deals" onClick={() => setIsOpen(false)}>
                <button className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                  Browse Deals
                </button>
              </Link>
              <Link href="/wallet" onClick={() => setIsOpen(false)}>
                <button className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
                  Add Funds
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
