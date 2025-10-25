'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Story {
  id: string;
  name: string;
  age: number;
  country: string;
  language: string;
  occupation: string;
  image: string;
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
    image: '👨‍💻',
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
    image: '👩‍💼',
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
    image: '👨‍💼',
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
    image: '👨‍💻',
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
    image: '👩‍⚕️',
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
    image: '👴',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="text-5xl mr-4">🌟</div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Investor Success Stories
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real people, real returns, real stories from the OWNLY community
            </p>
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <h2 className="text-3xl font-bold mb-6">OWNLY Community Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl font-bold mb-2">5,000+</div>
            <div className="text-sm text-green-100">Active Investors</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl font-bold mb-2">AED 20M+</div>
            <div className="text-sm text-green-100">Total Invested</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl font-bold mb-2">AED 8.5M+</div>
            <div className="text-sm text-green-100">Returns Paid</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl font-bold mb-2">42%</div>
            <div className="text-sm text-green-100">Avg ROI</div>
          </div>
        </div>
      </div>

      {/* Language Filter */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('')}
          className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
            filter === ''
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
          }`}
        >
          All Stories
        </button>
        {languages.map(language => (
          <button
            key={language}
            onClick={() => setFilter(language)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
              filter === language
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            {language}
          </button>
        ))}
      </div>

      {/* Success Stories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {filteredStories.map(story => (
          <div key={story.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl mr-4">
                    {story.image}
                  </div>
                  <div className="text-white">
                    <h3 className="text-2xl font-bold">{story.name}</h3>
                    <p className="text-blue-100 text-sm">{story.occupation}, {story.age}</p>
                    <p className="text-blue-200 text-xs">{story.country} • {story.language}</p>
                  </div>
                </div>
                <div className="badge bg-green-400 text-green-900 text-sm px-3 py-1">
                  +{story.roi}% ROI
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    AED {(story.invested / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Invested</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    AED {(story.earned / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Earned</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {story.assets.length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Assets</div>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 border-l-4 border-primary-600">
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{story.quote}"
                </p>
              </div>

              {/* Story */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {story.story}
              </p>

              {/* Assets */}
              <div className="mb-4">
                <div className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Invested In:</div>
                <div className="flex flex-wrap gap-2">
                  {story.assets.map((asset, idx) => (
                    <span key={idx} className="badge bg-purple-100 text-purple-800 text-xs">
                      {asset}
                    </span>
                  ))}
                </div>
              </div>

              {/* Join Date */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                OWNLY Investor since {story.joinedDate}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Community Testimonials */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center">What Investors Say About OWNLY</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-yellow-300 text-2xl mb-3">⭐⭐⭐⭐⭐</div>
            <p className="text-sm mb-3">
              "Best investment platform in UAE. Finally something that's not a scam!"
            </p>
            <p className="text-xs text-purple-200">- Sameer K., Dubai</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-yellow-300 text-2xl mb-3">⭐⭐⭐⭐⭐</div>
            <p className="text-sm mb-3">
              "The RM program helped me earn extra income just by referring friends."
            </p>
            <p className="text-xs text-purple-200">- Anjali M., Abu Dhabi</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-yellow-300 text-2xl mb-3">⭐⭐⭐⭐⭐</div>
            <p className="text-sm mb-3">
              "Legal structure gives me confidence. This is the future of investing."
            </p>
            <p className="text-xs text-purple-200">- Khalid A., Sharjah</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Write Your Success Story?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Join 5,000+ investors building wealth through fractional ownership
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/deals">
            <button className="btn-primary px-8 py-3">
              Browse Investment Opportunities
            </button>
          </Link>
          <Link href="/academy">
            <button className="btn-secondary px-8 py-3">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
