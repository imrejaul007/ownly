'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, TrendingUp, DollarSign, Users, Zap, Clock, MapPin, Filter, ArrowUpRight } from 'lucide-react';

const mockActivities = [
  { type: 'investment', user: 'Michael R.', amount: '$5,000', property: 'Miami Beachfront Condos', location: 'Miami, FL', time: '2 min ago' },
  { type: 'dividend', user: 'Sarah L.', amount: '$124', property: 'Austin Tech Plaza', location: 'Austin, TX', time: '5 min ago' },
  { type: 'investment', user: 'David K.', amount: '$2,500', property: 'Seattle Green Apartments', location: 'Seattle, WA', time: '8 min ago' },
  { type: 'trade', user: 'Jennifer M.', amount: '$8,900', property: 'Portland Mixed-Use Building', location: 'Portland, OR', time: '12 min ago' },
  { type: 'investment', user: 'Robert T.', amount: '$10,000', property: 'Boston Commercial Center', location: 'Boston, MA', time: '15 min ago' },
  { type: 'dividend', user: 'Emily W.', amount: '$89', property: 'Denver Retail Plaza', location: 'Denver, CO', time: '18 min ago' },
  { type: 'investment', user: 'Christopher B.', amount: '$7,500', property: 'Phoenix Residential Complex', location: 'Phoenix, AZ', time: '22 min ago' },
  { type: 'investment', user: 'Lisa P.', amount: '$3,000', property: 'Atlanta Office Tower', location: 'Atlanta, GA', time: '25 min ago' },
  { type: 'trade', user: 'Daniel G.', amount: '$4,200', property: 'Chicago Lakefront Property', location: 'Chicago, IL', time: '28 min ago' },
  { type: 'dividend', user: 'Michelle L.', amount: '$156', property: 'LA Commercial Plaza', location: 'Los Angeles, CA', time: '32 min ago' }
];

const trendingProperties = [
  {
    id: 1,
    name: 'Miami Beachfront Condos',
    location: 'Miami, FL',
    type: 'Residential',
    invested: '$892K',
    investors: 247,
    targetReturn: '11.2%',
    percentFunded: 89,
    trending: true
  },
  {
    id: 2,
    name: 'Austin Tech Plaza',
    location: 'Austin, TX',
    type: 'Commercial',
    invested: '$1.2M',
    investors: 312,
    targetReturn: '9.8%',
    percentFunded: 95,
    trending: true
  },
  {
    id: 3,
    name: 'Seattle Green Apartments',
    location: 'Seattle, WA',
    type: 'Multi-Family',
    invested: '$756K',
    investors: 189,
    targetReturn: '10.5%',
    percentFunded: 76,
    trending: false
  },
  {
    id: 4,
    name: 'Boston Commercial Center',
    location: 'Boston, MA',
    type: 'Commercial',
    invested: '$1.8M',
    investors: 421,
    targetReturn: '9.2%',
    percentFunded: 72,
    trending: false
  }
];

const recentTrades = [
  { property: 'Portland Mixed-Use Building', shares: 250, price: '$35.60', total: '$8,900', time: '12 min ago' },
  { property: 'Chicago Lakefront Property', shares: 150, price: '$28.00', total: '$4,200', time: '28 min ago' },
  { property: 'Denver Tech Campus', shares: 300, price: '$42.50', total: '$12,750', time: '45 min ago' },
  { property: 'San Francisco Retail', shares: 100, price: '$67.80', total: '$6,780', time: '1 hour ago' }
];

const activityStats = [
  { label: 'Today\'s Investments', value: '$287,450', change: '+12.4%' },
  { label: 'Active Investors', value: '1,247', change: '+3.2%' },
  { label: 'Dividends Paid', value: '$42,180', change: '+8.7%' },
  { label: 'Avg. Investment', value: '$3,840', change: '+5.1%' }
];

export default function LiveActivityPage() {
  const [activities, setActivities] = useState(mockActivities);
  const [filter, setFilter] = useState('all');
  const [totalInvestments, setTotalInvestments] = useState(287450);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivities = [...activities];
      const types = ['investment', 'dividend', 'trade'];
      const names = ['John D.', 'Jane S.', 'Mike T.', 'Emma W.', 'Alex K.'];
      const properties = [
        { name: 'New York Apartments', location: 'New York, NY' },
        { name: 'San Francisco Tech Hub', location: 'San Francisco, CA' },
        { name: 'Dallas Commercial Plaza', location: 'Dallas, TX' }
      ];

      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomProperty = properties[Math.floor(Math.random() * properties.length)];
      const randomAmount = randomType === 'dividend'
        ? `$${Math.floor(Math.random() * 200) + 50}`
        : `$${(Math.floor(Math.random() * 20) + 1) * 500}`;

      newActivities.unshift({
        type: randomType,
        user: randomName,
        amount: randomAmount,
        property: randomProperty.name,
        location: randomProperty.location,
        time: 'Just now'
      });

      if (newActivities.length > 20) {
        newActivities.pop();
      }

      setActivities(newActivities);

      if (randomType === 'investment') {
        setTotalInvestments(prev => prev + parseInt(randomAmount.replace(/[$,]/g, '')));
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [activities]);

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(a => a.type === filter);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'investment':
        return <DollarSign className="text-green-600" size={20} />;
      case 'dividend':
        return <TrendingUp className="text-blue-600" size={20} />;
      case 'trade':
        return <ArrowUpRight className="text-purple-600" size={20} />;
      default:
        return <Activity className="text-gray-600" size={20} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'investment':
        return 'bg-green-100 border-green-300';
      case 'dividend':
        return 'bg-blue-100 border-blue-300';
      case 'trade':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Activity className="animate-pulse" size={80} />
          </div>
          <h1 className="text-5xl font-bold mb-6">Live Activity Feed</h1>
          <p className="text-2xl text-green-50 max-w-3xl mx-auto mb-6">
            Real-time platform activity, trending investments, and market pulse
          </p>
          <div className="flex items-center justify-center gap-2 text-green-100">
            <Zap size={20} className="animate-pulse" />
            <span>Updates every 8 seconds</span>
          </div>
        </div>
      </section>

      {/* Activity Stats */}
      <section className="py-12 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {activityStats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {idx === 0 ? `$${totalInvestments.toLocaleString()}` : stat.value}
                </div>
                <div className="text-sm text-green-600 font-semibold">{stat.change} today</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Live Feed */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Activity className="text-green-600 animate-pulse" size={32} />
                  <h2 className="text-3xl font-bold text-gray-900">Live Activity</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-600" size={20} />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Activity</option>
                    <option value="investment">Investments</option>
                    <option value="dividend">Dividends</option>
                    <option value="trade">Trades</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
                  <span className="text-white font-semibold">Recent Transactions</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white text-sm">Live</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {filteredActivities.map((activity, idx) => (
                    <div
                      key={idx}
                      className={`px-6 py-4 hover:bg-gray-50 transition-colors border-l-4 ${getActivityColor(activity.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">{getActivityIcon(activity.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{activity.user}</span>
                              <span className="text-gray-600">
                                {activity.type === 'investment' && 'invested'}
                                {activity.type === 'dividend' && 'earned'}
                                {activity.type === 'trade' && 'traded'}
                              </span>
                              <span className="font-bold text-green-600">{activity.amount}</span>
                            </div>
                            <div className="text-sm text-gray-700 mb-1">{activity.property}</div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin size={12} />
                              {activity.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap ml-4">
                          <Clock size={14} />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Properties */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="text-orange-500" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Trending Now</h3>
                </div>
                <div className="space-y-4">
                  {trendingProperties.map((property) => (
                    <div key={property.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm mb-1">{property.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                            <MapPin size={12} />
                            {property.location}
                          </div>
                        </div>
                        {property.trending && (
                          <TrendingUp className="text-orange-500" size={16} />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div>
                          <div className="text-gray-600">Invested</div>
                          <div className="font-semibold text-gray-900">{property.invested}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Investors</div>
                          <div className="font-semibold text-gray-900">{property.investors}</div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">Funded</span>
                          <span className="font-semibold text-gray-900">{property.percentFunded}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${property.percentFunded}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-600">Target Return:</span>
                        <span className="font-bold text-green-600 ml-1">{property.targetReturn}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/deals"
                  className="block text-center mt-4 text-green-600 hover:text-green-700 font-semibold text-sm"
                >
                  View All Properties →
                </Link>
              </div>

              {/* Recent Trades */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <ArrowUpRight className="text-purple-500" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Recent Trades</h3>
                </div>
                <div className="space-y-3">
                  {recentTrades.map((trade, idx) => (
                    <div key={idx} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                      <div className="font-semibold text-gray-900 text-sm mb-1">{trade.property}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-1">
                        <div>
                          <span className="text-gray-600">Shares:</span>
                          <span className="font-semibold text-gray-900 ml-1">{trade.shares}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Price:</span>
                          <span className="font-semibold text-gray-900 ml-1">{trade.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-600">{trade.total}</span>
                        <span className="text-gray-500">{trade.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="font-bold text-gray-900 mb-4">24 Hour Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">New Investments</span>
                    <span className="font-bold text-gray-900">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Total Volume</span>
                    <span className="font-bold text-green-600">$287K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">New Investors</span>
                    <span className="font-bold text-gray-900">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Dividends Paid</span>
                    <span className="font-bold text-blue-600">$42K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Secondary Trades</span>
                    <span className="font-bold text-purple-600">18</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Action</h2>
          <p className="text-xl mb-8 text-green-50">
            Be part of the live investment activity and start building your portfolio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-shadow"
            >
              Create Free Account
            </Link>
            <Link
              href="/deals"
              className="bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-800 transition-colors border-2 border-white"
            >
              Browse Live Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
