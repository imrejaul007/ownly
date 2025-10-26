'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Users, DollarSign, Building, Activity, BarChart3,
  Globe, Zap, Target, Award, CheckCircle, ArrowUp, Briefcase,
  PieChart, TrendingDown, Clock
} from 'lucide-react';

const mockRealtimeActivity = [
  { user: 'Ahmed K.', action: 'invested AED 18,500 in Dubai Marina Residences', time: '2 min ago' },
  { user: 'Fatima M.', action: 'earned AED 4,560 dividend from Abu Dhabi Business Park', time: '5 min ago' },
  { user: 'Mohammed T.', action: 'invested AED 9,200 in Sharjah Tech Hub', time: '8 min ago' },
  { user: 'Sarah W.', action: 'sold shares in JLT Commercial Tower', time: '12 min ago' },
  { user: 'Khalid K.', action: 'invested AED 36,800 in Dubai Creek Harbour', time: '15 min ago' },
  { user: 'Layla P.', action: 'earned AED 3,280 dividend from Al Raha Beach Project', time: '18 min ago' },
  { user: 'Omar H.', action: 'invested AED 27,600 in Business Bay Office Space', time: '22 min ago' },
  { user: 'Noor L.', action: 'invested AED 11,050 in Dubai Silicon Oasis Tech Center', time: '25 min ago' }
];

export default function PlatformStatsPage() {
  const [totalInvested, setTotalInvested] = useState(551234567);
  const [activeInvestors, setActiveInvestors] = useState(10384);
  const [dealsCompleted, setDealsCompleted] = useState(248);
  const [activities, setActivities] = useState(mockRealtimeActivity);

  // Simulate real-time counter updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalInvested(prev => prev + Math.floor(Math.random() * 15000));
      if (Math.random() > 0.7) {
        setActiveInvestors(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate activity feed updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivities = [...activities];
      const actions = [
        'invested AED 7,350 in Downtown Dubai Retail Space',
        'earned AED 5,740 dividend from DIFC Financial Tower',
        'invested AED 20,250 in Palm Jumeirah Villa Complex',
        'sold shares in Dubai Healthcare City Clinic'
      ];
      const names = ['Ali', 'Hessa', 'Rashid', 'Maryam', 'Yousef', 'Aisha'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      newActivities.unshift({
        user: randomName + ' ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '.',
        action: actions[Math.floor(Math.random() * actions.length)],
        time: 'Just now'
      });
      newActivities.pop();
      setActivities(newActivities);
    }, 8000);

    return () => clearInterval(interval);
  }, [activities]);

  const liveStats = [
    {
      icon: DollarSign,
      label: 'Total Invested',
      value: `AED ${(totalInvested / 1000000).toFixed(1)}M`,
      change: '+AED 462K today',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: Users,
      label: 'Active Investors',
      value: activeInvestors.toLocaleString(),
      change: '+127 today',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Building,
      label: 'Deals Funded',
      value: dealsCompleted,
      change: '8 new this week',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      icon: TrendingUp,
      label: 'Average Returns',
      value: '15.2%',
      change: 'Annualized',
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-500/20'
    }
  ];

  const growthData = [
    { month: 'Jan', investors: 7200, invested: 182 },
    { month: 'Feb', investors: 7650, invested: 191 },
    { month: 'Mar', investors: 8100, invested: 201 },
    { month: 'Apr', investors: 8520, invested: 210 },
    { month: 'May', investors: 8900, invested: 218 },
    { month: 'Jun', investors: 9280, invested: 224 },
    { month: 'Jul', investors: 9620, invested: 230 },
    { month: 'Aug', investors: 9890, invested: 235 },
    { month: 'Sep', investors: 10150, invested: 240 },
    { month: 'Oct', investors: 10250, invested: 244 },
    { month: 'Nov', investors: 10340, invested: 246 },
    { month: 'Dec', investors: 10384, invested: 248 }
  ];

  const regionalStats = [
    { region: 'Dubai', properties: 126, invested: 'AED 285M', growth: '+28%', icon: Building },
    { region: 'Abu Dhabi', properties: 84, invested: 'AED 186M', growth: '+22%', icon: Briefcase },
    { region: 'Sharjah', properties: 24, invested: 'AED 52M', growth: '+35%', icon: Target },
    { region: 'Other Emirates', properties: 14, invested: 'AED 28M', growth: '+18%', icon: Globe }
  ];

  const categoryStats = [
    { type: 'Real Estate SPV', count: 98, percentage: 39, color: 'from-blue-500 to-cyan-500' },
    { type: 'Business SPV', count: 72, percentage: 29, color: 'from-purple-500 to-pink-500' },
    { type: 'Fixed Yield', count: 52, percentage: 21, color: 'from-green-500 to-emerald-500' },
    { type: 'Luxury Assets', count: 26, percentage: 11, color: 'from-orange-500 to-red-500' }
  ];

  const todayStats = [
    { label: 'New Investments', value: '89', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Total Volume', value: 'AED 1.2M', icon: DollarSign, color: 'text-blue-400' },
    { label: 'New Investors', value: '127', icon: Users, color: 'text-purple-400' },
    { label: 'Dividends Paid', value: 'AED 156K', icon: Award, color: 'text-orange-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <Activity className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-green-300 text-sm font-semibold">Live Platform Statistics</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Platform Analytics
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto mb-6">
            Real-time data showing platform activity, growth, and investor success
          </p>
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-purple-200 text-sm">Updates every 5 seconds</span>
          </div>
        </div>
      </div>

      {/* Live Counter Cards */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {liveStats.map((stat, idx) => (
            <div
              key={idx}
              className={`relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border ${stat.borderColor} hover:scale-105 transition-all duration-300 group`}
            >
              <div className="absolute top-3 right-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>

              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                <stat.icon className="text-white w-7 h-7" />
              </div>

              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-purple-200 mb-3">{stat.label}</div>
              <div className="flex items-center gap-1 text-xs text-green-400 font-semibold">
                <ArrowUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Activity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Today's Activity</h2>
          <p className="text-purple-200 text-lg">Live platform performance metrics</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {todayStats.map((stat, idx) => (
            <div key={idx} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center hover:border-purple-500/30 transition-all">
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-purple-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Activity className="text-green-400 animate-pulse w-8 h-8" />
              <h2 className="text-4xl font-bold text-white">Live Activity Feed</h2>
            </div>
            <p className="text-purple-200 text-lg">Recent platform transactions</p>
          </div>

          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
              <span className="text-white font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Transactions
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold">LIVE</span>
              </div>
            </div>

            <div className="divide-y divide-white/5 max-h-96 overflow-y-auto custom-scrollbar">
              {activities.map((activity, idx) => (
                <div
                  key={idx}
                  className="px-6 py-4 hover:bg-white/5 transition-all"
                  style={{ animation: `fadeIn 0.3s ease-in ${idx * 0.05}s` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="font-semibold text-white">{activity.user}</span>
                      <span className="text-purple-200"> {activity.action}</span>
                    </div>
                    <span className="text-sm text-purple-300 whitespace-nowrap">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Growth Charts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <BarChart3 className="mx-auto mb-4 text-blue-400 w-12 h-12" />
          <h2 className="text-4xl font-bold text-white mb-4">Platform Growth</h2>
          <p className="text-xl text-purple-200">Year-over-year growth trajectory</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Investors Growth */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-400" />
              Investor Growth (2024)
            </h3>
            <div className="space-y-3">
              {growthData.map((data, idx) => (
                <div key={idx} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-12 text-sm text-purple-200 font-semibold">{data.month}</div>
                    <div className="flex-1 text-right text-sm text-purple-200">
                      {data.investors.toLocaleString()}
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500 group-hover:from-blue-400 group-hover:to-cyan-400"
                      style={{ width: `${(data.investors / 11000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deals Funded */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Building className="w-6 h-6 text-purple-400" />
              Deals Funded (2024)
            </h3>
            <div className="space-y-3">
              {growthData.map((data, idx) => (
                <div key={idx} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-12 text-sm text-purple-200 font-semibold">{data.month}</div>
                    <div className="flex-1 text-right text-sm text-purple-200">
                      {data.invested}
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 group-hover:from-purple-400 group-hover:to-pink-400"
                      style={{ width: `${(data.invested / 260) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Distribution */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Globe className="mx-auto mb-4 text-green-400 w-12 h-12" />
            <h2 className="text-4xl font-bold text-white mb-4">Regional Distribution</h2>
            <p className="text-xl text-purple-200">Investment spread across UAE</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regionalStats.map((region, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-green-500/30 transition-all group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <region.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{region.region}</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-purple-200 mb-1">Properties</div>
                    <div className="text-2xl font-bold text-white">{region.properties}</div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-200 mb-1">Total Invested</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {region.invested}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-200 mb-1">YoY Growth</div>
                    <div className="flex items-center gap-1 text-xl font-bold text-blue-400">
                      <TrendingUp className="w-5 h-5" />
                      {region.growth}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Category Distribution */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <PieChart className="mx-auto mb-4 text-purple-400 w-12 h-12" />
          <h2 className="text-4xl font-bold text-white mb-4">Portfolio by Category</h2>
          <p className="text-xl text-purple-200">Asset allocation across investment types</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <div className="space-y-6">
            {categoryStats.map((type, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center`}>
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-white text-lg">{type.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white text-lg">{type.count} deals</div>
                    <div className="text-sm text-purple-200">{type.percentage}%</div>
                  </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${type.color} h-full transition-all duration-500 group-hover:shadow-lg`}
                    style={{ width: `${type.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Award className="mx-auto mb-4 text-yellow-400 w-12 h-12" />
            <h2 className="text-4xl font-bold text-white mb-4">Platform Milestones</h2>
            <p className="text-xl text-purple-200">Key achievements in our journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center hover:border-green-500/30 transition-all group">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                AED 550M+
              </div>
              <div className="text-white font-semibold mb-1">Total Platform Investment</div>
              <div className="text-sm text-purple-300">Achieved Dec 2024</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center hover:border-blue-500/30 transition-all group">
              <div className="text-6xl mb-4">🏆</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                10,000+
              </div>
              <div className="text-white font-semibold mb-1">Active Investor Milestone</div>
              <div className="text-sm text-purple-300">Achieved Nov 2024</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center hover:border-purple-500/30 transition-all group">
              <div className="text-6xl mb-4">🌟</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                248+
              </div>
              <div className="text-white font-semibold mb-1">Deals Successfully Funded</div>
              <div className="text-sm text-purple-300">Since 2020</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join the Growing Community
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            Be part of the UAE investment revolution
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-green-500/20 transition-all hover:scale-105"
            >
              Start Investing Today
            </Link>
            <Link
              href="/deals"
              className="bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20 hover:border-white/40"
            >
              Browse Available Deals
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
