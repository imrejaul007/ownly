'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Award, TrendingUp, DollarSign, Users, Star, Quote,
  Briefcase, Building, Calendar, Globe, Sparkles, Target,
  ChevronRight, User
} from 'lucide-react';

interface Story {
  id: string;
  name: string;
  age: number;
  country: string;
  language: string;
  occupation: string;
  icon: any;
  invested: number;
  earned: number;
  roi: number;
  assets: string[];
  quote: string;
  story: string;
  joinedDate: string;
}

const STORIES: Story[] = [
  {
    id: '1',
    name: 'Rahul Menon',
    age: 32,
    country: 'UAE',
    language: 'Malayalam',
    occupation: 'IT Professional',
    icon: User,
    invested: 15000,
    earned: 6750,
    roi: 45,
    assets: ['Perfume Store', 'Airbnb Unit', 'Glamping Pod'],
    quote: 'OWNLY changed my life. I was skeptical at first, but the SPV structure gave me confidence.',
    story: 'Started with just AED 2,000 in a perfume store franchise. Saw returns within 30 days. Now I have investments in 5 different assets earning me AED 2,250/month passive income.',
    joinedDate: 'March 2024'
  },
  {
    id: '2',
    name: 'Fatima Al Hashimi',
    age: 28,
    country: 'UAE',
    language: 'Arabic',
    occupation: 'Marketing Manager',
    icon: Briefcase,
    invested: 25000,
    earned: 8750,
    roi: 35,
    assets: ['Capsule Hotel', 'Luxury Car Fleet', 'TikTok Store'],
    quote: 'Finally, an investment platform I can trust. The transparency is unmatched.',
    story: 'As a woman investor, trust was my biggest concern. OWNLY\'s legal structure and monthly reports gave me peace of mind. My portfolio now generates AED 3,500/month.',
    joinedDate: 'January 2024'
  },
  {
    id: '3',
    name: 'Rajesh Kumar',
    age: 45,
    country: 'India (Investing from Dubai)',
    language: 'Hindi',
    occupation: 'Business Owner',
    icon: Building,
    invested: 50000,
    earned: 22500,
    roi: 45,
    assets: ['Multiple Franchises', 'Real Estate', 'Rental Cars'],
    quote: 'Better than mutual funds. Real assets, real returns, full control.',
    story: 'I used to invest in Indian mutual funds with 10-12% returns. With OWNLY, I\'m making 40%+ ROI on tangible assets. Wish I found this sooner!',
    joinedDate: 'November 2023'
  },
  {
    id: '4',
    name: 'Mohammed Bashir',
    age: 38,
    country: 'UAE',
    language: 'Urdu',
    occupation: 'Accountant',
    icon: User,
    invested: 8000,
    earned: 2800,
    roi: 35,
    assets: ['Gym Franchise', 'Perfume Batch'],
    quote: 'Started small, now planning to invest AED 50K more. The RM commission is a bonus!',
    story: 'Not only am I earning from my investments, but I also referred 20+ friends and earned AED 3,000 in commission. It\'s a win-win!',
    joinedDate: 'April 2024'
  },
  {
    id: '5',
    name: 'Priya Nair',
    age: 29,
    country: 'UAE',
    language: 'Malayalam',
    occupation: 'Nurse',
    icon: User,
    invested: 5000,
    earned: 1400,
    roi: 28,
    assets: ['Hookah Bar', 'Mobile Camper'],
    quote: 'I can finally afford to send more money home to my family in Kerala.',
    story: 'As a nurse, I don\'t have big capital. But OWNLY let me start with AED 500. Now earning AED 1,200/month which I send home to support my parents.',
    joinedDate: 'February 2024'
  },
  {
    id: '6',
    name: 'Ahmed Al Mansoori',
    age: 52,
    country: 'UAE',
    language: 'Arabic',
    occupation: 'Retired Government Employee',
    icon: User,
    invested: 100000,
    earned: 32000,
    roi: 32,
    assets: ['Business Centre', 'Holiday Homes', 'Luxury Assets'],
    quote: 'Retirement income sorted. No more worrying about pension not being enough.',
    story: 'After retirement, I was worried about income. OWNLY gave me a way to put my savings to work. Now earning AED 12,000/month - more than my pension!',
    joinedDate: 'October 2023'
  }
];

export default function SuccessStoriesPage() {
  const [filter, setFilter] = useState('');

  const filteredStories = filter
    ? STORIES.filter(s => s.language === filter)
    : STORIES;

  const languages = Array.from(new Set(STORIES.map(s => s.language)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent mb-2">
                Investor Success Stories
              </h1>
              <p className="text-purple-200">
                Real people, real returns, real stories from the OWNLY community
              </p>
            </div>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">OWNLY Community Impact</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="text-4xl font-bold text-white mb-2">5,000+</div>
                <div className="text-sm text-green-100">Active Investors</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="text-4xl font-bold text-white mb-2">AED 20M+</div>
                <div className="text-sm text-green-100">Total Invested</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="text-4xl font-bold text-white mb-2">AED 8.5M+</div>
                <div className="text-sm text-green-100">Returns Paid</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="text-4xl font-bold text-white mb-2">42%</div>
                <div className="text-sm text-green-100">Avg ROI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Filter */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setFilter('')}
            className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              filter === ''
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
            }`}
          >
            All Stories
          </button>
          {languages.map(language => (
            <button
              key={language}
              onClick={() => setFilter(language)}
              className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                filter === language
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              {language}
            </button>
          ))}
        </div>

        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {filteredStories.map(story => {
            const Icon = story.icon;
            return (
              <div key={story.id} className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all overflow-hidden shadow-2xl hover:scale-105 duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 border border-white/30">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-white">
                        <h3 className="text-2xl font-bold">{story.name}</h3>
                        <p className="text-blue-100 text-sm">{story.occupation}, {story.age}</p>
                        <div className="flex items-center gap-2 text-blue-200 text-xs mt-1">
                          <Globe className="w-3 h-3" />
                          {story.country} • {story.language}
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-full font-bold">
                      +{story.roi}% ROI
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
                      <div className="text-2xl font-bold text-blue-400">
                        AED {(story.invested / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-purple-300">Invested</div>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/30">
                      <div className="text-2xl font-bold text-green-400">
                        AED {(story.earned / 1000).toFixed(1)}K
                      </div>
                      <div className="text-xs text-purple-300">Earned</div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/30">
                      <div className="text-2xl font-bold text-purple-400">
                        {story.assets.length}
                      </div>
                      <div className="text-xs text-purple-300">Assets</div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-4 border-l-4 border-purple-500">
                    <div className="flex gap-3">
                      <Quote className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                      <p className="text-purple-100 italic">
                        "{story.quote}"
                      </p>
                    </div>
                  </div>

                  {/* Story */}
                  <p className="text-purple-200 text-sm mb-4">
                    {story.story}
                  </p>

                  {/* Assets */}
                  <div className="mb-4">
                    <div className="text-sm font-semibold mb-2 text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      Invested In:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {story.assets.map((asset, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30 font-semibold">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Join Date */}
                  <div className="flex items-center gap-2 text-xs text-purple-300">
                    <Calendar className="w-3 h-3" />
                    OWNLY Investor since {story.joinedDate}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Community Testimonials */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative">
            <h2 className="text-3xl font-bold mb-6 text-center">What Investors Say About OWNLY</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="flex gap-1 text-yellow-300 text-2xl mb-3">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-sm mb-3">
                  "Best investment platform in UAE. Finally something that's not a scam!"
                </p>
                <p className="text-xs text-purple-200">- Sameer K., Dubai</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="flex gap-1 text-yellow-300 text-2xl mb-3">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-sm mb-3">
                  "The RM program helped me earn extra income just by referring friends."
                </p>
                <p className="text-xs text-purple-200">- Anjali M., Abu Dhabi</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="flex gap-1 text-yellow-300 text-2xl mb-3">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-sm mb-3">
                  "Legal structure gives me confidence. This is the future of investing."
                </p>
                <p className="text-xs text-purple-200">- Khalid A., Sharjah</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-purple-200 mb-6">
            Join 5,000+ investors building wealth through fractional ownership
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/deals">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 hover:scale-105">
                <TrendingUp className="w-5 h-5" />
                Browse Investment Opportunities
              </button>
            </Link>
            <Link href="/academy">
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2 hover:scale-105">
                Learn More
                <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
