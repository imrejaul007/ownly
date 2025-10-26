'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, BookOpen, Shield, TrendingUp, Building, Scale,
  FileText, DollarSign, Clock, PlayCircle, Globe, MessageCircle,
  Mic, Star, Users, Languages, Sparkles, Target, ChevronRight,
  Award, Video
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  icon: any;
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
    icon: Building,
    lessons: 5
  },
  {
    id: '2',
    title: 'Understanding SPVs',
    description: 'Deep dive into Special Purpose Vehicles and how they protect your investments legally',
    duration: '20 mins',
    level: 'Beginner',
    category: 'Legal',
    icon: Shield,
    lessons: 6
  },
  {
    id: '3',
    title: 'ROI Calculator Masterclass',
    description: 'Master investment calculations and understand projected vs actual returns',
    duration: '25 mins',
    level: 'Intermediate',
    category: 'Finance',
    icon: TrendingUp,
    lessons: 8
  },
  {
    id: '4',
    title: 'Franchise Investment 101',
    description: 'Everything you need to know about investing in franchise opportunities',
    duration: '30 mins',
    level: 'Beginner',
    category: 'Asset Types',
    icon: Building,
    lessons: 10
  },
  {
    id: '5',
    title: 'Real Estate Fractional Investing',
    description: 'Learn how to invest in holiday homes, Airbnb, and retail spaces from AED 500',
    duration: '35 mins',
    level: 'Intermediate',
    category: 'Asset Types',
    icon: Building,
    lessons: 12
  },
  {
    id: '6',
    title: 'Risk Management Strategies',
    description: 'Portfolio diversification, risk assessment, and protecting your capital',
    duration: '40 mins',
    level: 'Advanced',
    category: 'Strategy',
    icon: Scale,
    lessons: 15
  },
  {
    id: '7',
    title: 'Tax & Compliance for Investors',
    description: 'Understand LRS limits, tax implications, and regulatory compliance',
    duration: '30 mins',
    level: 'Intermediate',
    category: 'Legal',
    icon: FileText,
    lessons: 9
  },
  {
    id: '8',
    title: 'Become an OWNLY RM',
    description: 'Learn how to earn commissions by referring investors to OWNLY',
    duration: '20 mins',
    level: 'Beginner',
    category: 'Earning',
    icon: DollarSign,
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-2">
                OWNLY Academy
              </h1>
              <p className="text-purple-200">
                Master fractional investing with expert-led courses in 10+ languages
              </p>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Invest Smarter, Not Harder</h2>
              <p className="text-blue-100 mb-6">
                Free education for all OWNLY investors. Learn how SPVs work, calculate ROI,
                manage risk, and build generational wealth.
              </p>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-sm text-blue-100">Video Lessons</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-3xl font-bold text-white">10+</div>
                  <div className="text-sm text-blue-100">Languages</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-3xl font-bold text-white">Free</div>
                  <div className="text-sm text-blue-100">Always</div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <BookOpen className="w-20 h-20 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center hover:border-blue-500/30 transition-all shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">50+</div>
            <div className="text-sm text-purple-300">Video Courses</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center hover:border-purple-500/30 transition-all shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">10+</div>
            <div className="text-sm text-purple-300">Languages</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center hover:border-pink-500/30 transition-all shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">5,000+</div>
            <div className="text-sm text-purple-300">Students</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center hover:border-yellow-500/30 transition-all shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">4.9/5</div>
            <div className="text-sm text-purple-300">Average Rating</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setFilter('')}
            className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              filter === ''
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
            }`}
          >
            All Courses
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                filter === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCourses.map(course => {
            const Icon = course.icon;
            return (
              <div key={course.id} className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all overflow-hidden shadow-2xl hover:scale-105 duration-300">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-12 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto border border-white/30">
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30 font-semibold">
                      {course.category}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30 font-semibold">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-purple-200 text-sm mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-purple-300 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" />
                      {course.lessons} lessons
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                    <PlayCircle className="w-4 h-4" />
                    Start Learning
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ROI Calculator Tool */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              Investment ROI Calculator
            </h2>
          </div>
          <ROICalculator />
        </div>

        {/* Language Support */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <Languages className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Learn in Your Language</h2>
            </div>
            <p className="text-purple-100 mb-6">
              All courses available in Malayalam, Hindi, Tamil, Urdu, Telugu, Kannada, Arabic, English, and more.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { flag: '🇮🇳', name: 'Malayalam' },
                { flag: '🇮🇳', name: 'Hindi' },
                { flag: '🇮🇳', name: 'Tamil' },
                { flag: '🇮🇳', name: 'Telugu' },
                { flag: '🇮🇳', name: 'Kannada' },
                { flag: '🇵🇰', name: 'Urdu' },
                { flag: '🇸🇦', name: 'Arabic' },
                { flag: '🇬🇧', name: 'English' },
                { flag: '🇧🇩', name: 'Bengali' },
                { flag: '🇱🇰', name: 'Sinhalese' }
              ].map(lang => (
                <div key={lang.name} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center font-semibold text-white border border-white/30">
                  <span className="text-2xl mr-2">{lang.flag}</span>
                  {lang.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-green-500/30 transition-all shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Join the Community
            </h3>
            <p className="text-purple-200 mb-4">
              Connect with 5,000+ OWNLY investors. Ask questions, share experiences, and learn together.
            </p>
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2">
              <Users className="w-4 h-4" />
              Join WhatsApp Community
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-pink-500/30 transition-all shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-pink-500/20">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              OWNLY Podcast
            </h3>
            <p className="text-purple-200 mb-4">
              Weekly interviews with successful investors, entrepreneurs, and industry experts.
            </p>
            <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              Listen to Podcast
            </button>
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
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Investment Amount (AED)
          </label>
          <input
            type="number"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Expected Annual ROI (%)
          </label>
          <input
            type="range"
            min="5"
            max="80"
            value={roi}
            onChange={(e) => setRoi(Number(e.target.value))}
            className="w-full h-3 bg-blue-500/20 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${((roi - 5) / 75) * 100}%, rgba(59, 130, 246, 0.2) ${((roi - 5) / 75) * 100}%, rgba(59, 130, 246, 0.2) 100%)`
            }}
          />
          <div className="text-center text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
            {roi}%
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Duration (Months)
          </label>
          <input
            type="range"
            min="6"
            max="48"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-3 bg-blue-500/20 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${((duration - 6) / 42) * 100}%, rgba(59, 130, 246, 0.2) ${((duration - 6) / 42) * 100}%, rgba(59, 130, 246, 0.2) 100%)`
            }}
          />
          <div className="text-center text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
            {duration} months
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border-2 border-green-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-green-400" />
          Your Returns
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
            <div className="text-sm text-purple-300 mb-1">Monthly Return</div>
            <div className="text-3xl font-bold text-green-400">
              AED {monthlyReturn.toFixed(2)}
            </div>
          </div>

          <div className="p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
            <div className="text-sm text-purple-300 mb-1">Total Return</div>
            <div className="text-3xl font-bold text-blue-400">
              AED {totalReturn.toFixed(2)}
            </div>
          </div>

          <div className="p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
            <div className="text-sm text-purple-300 mb-1">Final Value</div>
            <div className="text-3xl font-bold text-purple-400">
              AED {finalValue.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
          <p className="text-sm text-blue-200">
            <strong>Note:</strong> This is an estimate based on projected returns. Actual returns may vary based on asset performance.
          </p>
        </div>
      </div>
    </div>
  );
}
