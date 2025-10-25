'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'investment' | 'exit' | 'payout' | 'milestone';
  userInitial: string;
  userName: string;
  dealTitle: string;
  dealId: string;
  amount?: number;
  timestamp: Date;
  highlighted?: boolean;
}

export default function ActivityFeed({ maxItems = 10 }: { maxItems?: number }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Generate mock activity data
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'investment',
        userInitial: 'F',
        userName: 'Fatima A.',
        dealTitle: 'Dubai Marina Waterfront',
        dealId: 'deal-1',
        amount: 50000,
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        highlighted: true
      },
      {
        id: '2',
        type: 'investment',
        userInitial: 'M',
        userName: 'Mohammed K.',
        dealTitle: 'TikTok Café Franchise',
        dealId: 'deal-2',
        amount: 25000,
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: '3',
        type: 'payout',
        userInitial: 'S',
        userName: 'Sara H.',
        dealTitle: 'Luxury Watch Portfolio',
        dealId: 'deal-3',
        amount: 3500,
        timestamp: new Date(Date.now() - 12 * 60 * 1000)
      },
      {
        id: '4',
        type: 'investment',
        userInitial: 'A',
        userName: 'Ahmed R.',
        dealTitle: 'Smart Gym Chain',
        dealId: 'deal-4',
        amount: 75000,
        timestamp: new Date(Date.now() - 18 * 60 * 1000)
      },
      {
        id: '5',
        type: 'milestone',
        userInitial: 'R',
        userName: 'Rashid M.',
        dealTitle: 'JBR Luxury Villas',
        dealId: 'deal-5',
        timestamp: new Date(Date.now() - 25 * 60 * 1000)
      },
      {
        id: '6',
        type: 'investment',
        userInitial: 'L',
        userName: 'Layla S.',
        dealTitle: 'Classic Car Collection',
        dealId: 'deal-6',
        amount: 100000,
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        highlighted: true
      },
      {
        id: '7',
        type: 'payout',
        userInitial: 'K',
        userName: 'Khalid F.',
        dealTitle: 'Downtown Office Tower',
        dealId: 'deal-7',
        amount: 8200,
        timestamp: new Date(Date.now() - 42 * 60 * 1000)
      },
      {
        id: '8',
        type: 'investment',
        userInitial: 'N',
        userName: 'Noura A.',
        dealTitle: 'Dubai Hills Villa',
        dealId: 'deal-8',
        amount: 150000,
        timestamp: new Date(Date.now() - 55 * 60 * 1000)
      },
      {
        id: '9',
        type: 'exit',
        userInitial: 'Y',
        userName: 'Yousef B.',
        dealTitle: 'Tech Startup Fund',
        dealId: 'deal-9',
        amount: 45000,
        timestamp: new Date(Date.now() - 68 * 60 * 1000)
      },
      {
        id: '10',
        type: 'investment',
        userInitial: 'H',
        userName: 'Hessa M.',
        dealTitle: 'Trade Inventory Pool',
        dealId: 'deal-10',
        amount: 30000,
        timestamp: new Date(Date.now() - 75 * 60 * 1000)
      }
    ];

    setActivities(mockActivities.slice(0, maxItems));

    // Simulate live updates every 30 seconds
    const interval = setInterval(() => {
      if (isLive) {
        // In production, this would fetch real data from the API
        // For now, just update the timestamp of the first item
        setActivities(prev =>
          prev.map((act, i) =>
            i === 0 ? { ...act, timestamp: new Date() } : act
          )
        );
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [maxItems, isLive]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'investment':
        return (
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'payout':
        return (
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'exit':
        return (
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'milestone':
        return (
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        );
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'investment':
        return (
          <>
            <span className="font-semibold">{activity.userName}</span> invested{' '}
            <span className="font-bold text-green-600">{formatCurrency(activity.amount!)}</span> in{' '}
            <Link href={`/deals/${activity.dealId}`} className="text-primary-600 hover:underline">
              {activity.dealTitle}
            </Link>
          </>
        );
      case 'payout':
        return (
          <>
            <span className="font-semibold">{activity.userName}</span> received payout of{' '}
            <span className="font-bold text-blue-600">{formatCurrency(activity.amount!)}</span> from{' '}
            <Link href={`/deals/${activity.dealId}`} className="text-primary-600 hover:underline">
              {activity.dealTitle}
            </Link>
          </>
        );
      case 'exit':
        return (
          <>
            <span className="font-semibold">{activity.userName}</span> successfully exited{' '}
            <Link href={`/deals/${activity.dealId}`} className="text-primary-600 hover:underline">
              {activity.dealTitle}
            </Link>{' '}
            with return of <span className="font-bold text-purple-600">{formatCurrency(activity.amount!)}</span>
          </>
        );
      case 'milestone':
        return (
          <>
            <Link href={`/deals/${activity.dealId}`} className="text-primary-600 hover:underline font-semibold">
              {activity.dealTitle}
            </Link>{' '}
            reached 100% funding milestone
          </>
        );
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Live Activity</h3>
          {isLive && (
            <span className="ml-3 flex items-center">
              <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-xs text-green-600 font-semibold">LIVE</span>
            </span>
          )}
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-all ${
              activity.highlighted
                ? 'bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            } ${index === 0 ? 'animate-fadeIn' : ''}`}
          >
            {getActivityIcon(activity.type)}

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {getActivityText(activity)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {getTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">247</div>
            <div className="text-xs text-gray-500">Investments Today</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">1.2M</div>
            <div className="text-xs text-gray-500">Volume (AED)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">1,843</div>
            <div className="text-xs text-gray-500">Active Investors</div>
          </div>
        </div>
      </div>
    </div>
  );
}
