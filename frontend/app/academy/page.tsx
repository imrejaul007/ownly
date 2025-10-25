'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  thumbnail: string;
  lessons: number;
}

const COURSES: Course[] = [
  {
    id: '1',
    title: 'What is Fractional Ownership?',
    description: 'Learn the fundamentals of fractional ownership and how OWNLY democratizes access to real-world assets',
    duration: '15 mins',
    level: 'Beginner',
    category: 'Basics',
    thumbnail: '🏠',
    lessons: 5
  },
  {
    id: '2',
    title: 'Understanding SPVs',
    description: 'Deep dive into Special Purpose Vehicles and how they protect your investments legally',
    duration: '20 mins',
    level: 'Beginner',
    category: 'Legal',
    thumbnail: '🛡️',
    lessons: 6
  },
  {
    id: '3',
    title: 'ROI Calculator Masterclass',
    description: 'Master investment calculations and understand projected vs actual returns',
    duration: '25 mins',
    level: 'Intermediate',
    category: 'Finance',
    thumbnail: '📊',
    lessons: 8
  },
  {
    id: '4',
    title: 'Franchise Investment 101',
    description: 'Everything you need to know about investing in franchise opportunities',
    duration: '30 mins',
    level: 'Beginner',
    category: 'Asset Types',
    thumbnail: '🏪',
    lessons: 10
  },
  {
    id: '5',
    title: 'Real Estate Fractional Investing',
    description: 'Learn how to invest in holiday homes, Airbnb, and retail spaces from AED 500',
    duration: '35 mins',
    level: 'Intermediate',
    category: 'Asset Types',
    thumbnail: '🏢',
    lessons: 12
  },
  {
    id: '6',
    title: 'Risk Management Strategies',
    description: 'Portfolio diversification, risk assessment, and protecting your capital',
    duration: '40 mins',
    level: 'Advanced',
    category: 'Strategy',
    thumbnail: '⚖️',
    lessons: 15
  },
  {
    id: '7',
    title: 'Tax & Compliance for Investors',
    description: 'Understand LRS limits, tax implications, and regulatory compliance',
    duration: '30 mins',
    level: 'Intermediate',
    category: 'Legal',
    thumbnail: '📋',
    lessons: 9
  },
  {
    id: '8',
    title: 'Become an OWNLY RM',
    description: 'Learn how to earn commissions by referring investors to OWNLY',
    duration: '20 mins',
    level: 'Beginner',
    category: 'Earning',
    thumbnail: '💰',
    lessons: 7
  },
];

export default function AcademyPage() {
  const [filter, setFilter] = useState('');

  const filteredCourses = filter
    ? COURSES.filter(c => c.category === filter)
    : COURSES;

  const categories = Array.from(new Set(COURSES.map(c => c.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="text-5xl mr-4">🎓</div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              OWNLY Academy
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Master fractional investing with expert-led courses in 10+ languages
            </p>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Invest Smarter, Not Harder</h2>
            <p className="text-blue-100 mb-6">
              Free education for all OWNLY investors. Learn how SPVs work, calculate ROI,
              manage risk, and build generational wealth.
            </p>
            <div className="flex items-center space-x-6">
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-blue-200">Video Lessons</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10+</div>
                <div className="text-sm text-blue-200">Languages</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Free</div>
                <div className="text-sm text-blue-200">Always</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block text-center">
            <div className="text-9xl">📚</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl mb-2">🎬</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">50+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Video Courses</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl mb-2">🌍</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">10+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Languages</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">5,000+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">4.9/5</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('')}
          className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
            filter === ''
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
          }`}
        >
          All Courses
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
              filter === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-12 text-center">
              <div className="text-7xl">{course.thumbnail}</div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge bg-blue-100 text-blue-800 text-xs">{course.category}</span>
                <span className="badge bg-purple-100 text-purple-800 text-xs">{course.level}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {course.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {course.lessons} lessons
                </div>
              </div>
              <button className="w-full btn-primary">
                Start Learning
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ROI Calculator Tool */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Investment ROI Calculator
        </h2>
        <ROICalculator />
      </div>

      {/* Language Support */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-4">Learn in Your Language</h2>
        <p className="text-purple-100 mb-6">
          All courses available in Malayalam, Hindi, Tamil, Urdu, Telugu, Kannada, Arabic, English, and more.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['🇮🇳 Malayalam', '🇮🇳 Hindi', '🇮🇳 Tamil', '🇮🇳 Telugu', '🇮🇳 Kannada', '🇵🇰 Urdu', '🇸🇦 Arabic', '🇬🇧 English', '🇧🇩 Bengali', '🇱🇰 Sinhalese'].map(lang => (
            <div key={lang} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center font-semibold">
              {lang}
            </div>
          ))}
        </div>
      </div>

      {/* Community Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Join the Community
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Connect with 5,000+ OWNLY investors. Ask questions, share experiences, and learn together.
          </p>
          <button className="btn-primary">
            Join WhatsApp Community
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-4xl mb-4">🎙️</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            OWNLY Podcast
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Weekly interviews with successful investors, entrepreneurs, and industry experts.
          </p>
          <button className="btn-secondary">
            Listen to Podcast
          </button>
        </div>
      </div>
    </div>
  );
}

function ROICalculator() {
  const [investment, setInvestment] = useState(5000);
  const [roi, setRoi] = useState(25);
  const [duration, setDuration] = useState(12);

  const monthlyReturn = (investment * (roi / 100)) / duration;
  const totalReturn = investment * (roi / 100);
  const finalValue = investment + totalReturn;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Investment Amount (AED)
          </label>
          <input
            type="number"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Expected Annual ROI (%)
          </label>
          <input
            type="range"
            min="5"
            max="80"
            value={roi}
            onChange={(e) => setRoi(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-2xl font-bold text-primary-600">{roi}%</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration (Months)
          </label>
          <input
            type="range"
            min="6"
            max="48"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-2xl font-bold text-primary-600">{duration} months</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Returns</h3>
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Return</div>
            <div className="text-3xl font-bold text-green-600">
              AED {monthlyReturn.toFixed(2)}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Return</div>
            <div className="text-3xl font-bold text-blue-600">
              AED {totalReturn.toFixed(2)}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Final Value</div>
            <div className="text-3xl font-bold text-purple-600">
              AED {finalValue.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> This is an estimate based on projected returns. Actual returns may vary based on asset performance.
          </p>
        </div>
      </div>
    </div>
  );
}
