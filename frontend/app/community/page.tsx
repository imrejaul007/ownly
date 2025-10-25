'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Community {
  id: string;
  name: string;
  language: string;
  flag: string;
  members: number;
  invested: number;
  avgROI: number;
  leader: string;
  description: string;
  whatsappLink: string;
  upcomingEvent: string;
}

const COMMUNITIES: Community[] = [
  {
    id: '1',
    name: 'Malayalam Investors',
    language: 'Malayalam',
    flag: '🇮🇳',
    members: 1250,
    invested: 5200000,
    avgROI: 38,
    leader: 'Suresh Menon',
    description: 'Kerala expats building wealth together through smart investments',
    whatsappLink: '#',
    upcomingEvent: 'Onam Celebration & Investment Mixer - Sept 15'
  },
  {
    id: '2',
    name: 'Hindi Niveshak',
    language: 'Hindi',
    flag: '🇮🇳',
    members: 980,
    invested: 4100000,
    avgROI: 42,
    leader: 'Rajesh Kumar',
    description: 'North Indian professionals creating passive income streams',
    whatsappLink: '#',
    upcomingEvent: 'Diwali Investment Summit - Nov 12'
  },
  {
    id: '3',
    name: 'Tamil Investment Circle',
    language: 'Tamil',
    flag: '🇮🇳',
    members: 875,
    invested: 3800000,
    avgROI: 35,
    leader: 'Ravi Shankar',
    description: 'Tamil community building generational wealth',
    whatsappLink: '#',
    upcomingEvent: 'Pongal Wealth Fest - Jan 2025'
  },
  {
    id: '4',
    name: 'Urdu Investors Club',
    language: 'Urdu',
    flag: '🇵🇰',
    members: 720,
    invested: 3200000,
    avgROI: 40,
    leader: 'Ahmed Hassan',
    description: 'Pakistani & North Indian Muslim investors united',
    whatsappLink: '#',
    upcomingEvent: 'Eid Investment Celebration - April 2025'
  },
  {
    id: '5',
    name: 'Arabic Investment Hub',
    language: 'Arabic',
    flag: '🇦🇪',
    members: 650,
    invested: 8500000,
    avgROI: 36,
    leader: 'Mohammed Al Maktoum',
    description: 'Local Emirati and Arab expats growing wealth',
    whatsappLink: '#',
    upcomingEvent: 'UAE National Day Gala - Dec 2'
  },
  {
    id: '6',
    name: 'Telugu Wealth Builders',
    language: 'Telugu',
    flag: '🇮🇳',
    members: 580,
    invested: 2400000,
    avgROI: 39,
    leader: 'Venkat Reddy',
    description: 'Andhra & Telangana expats investing smart',
    whatsappLink: '#',
    upcomingEvent: 'Ugadi Investment Workshop - March 2025'
  },
  {
    id: '7',
    name: 'Kannada Investor Network',
    language: 'Kannada',
    flag: '🇮🇳',
    members: 420,
    invested: 1900000,
    avgROI: 37,
    leader: 'Sunil Gowda',
    description: 'Karnataka community creating wealth together',
    whatsappLink: '#',
    upcomingEvent: 'Kannada Rajyotsava Meetup - Nov 1'
  },
  {
    id: '8',
    name: 'Bengali Investors',
    language: 'Bengali',
    flag: '🇧🇩',
    members: 385,
    invested: 1600000,
    avgROI: 34,
    leader: 'Arijit Das',
    description: 'Bengali community building passive income',
    whatsappLink: '#',
    upcomingEvent: 'Pohela Boishakh Investment Fair - April 14'
  }
];

export default function CommunityPage() {
  const [selectedLang, setSelectedLang] = useState('');

  const filteredCommunities = selectedLang
    ? COMMUNITIES.filter(c => c.language === selectedLang)
    : COMMUNITIES;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="text-5xl mr-4">🤝</div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              OWNLY Community
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join language-specific investor communities. Build wealth together.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">5,000+ Investors. 10+ Languages. One Mission.</h2>
            <p className="text-purple-100 mb-6">
              Connect with investors who speak your language, understand your culture,
              and share your financial goals. Together we're stronger.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-bold">5,000+</div>
                <div className="text-sm text-purple-200">Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold">AED 30M+</div>
                <div className="text-sm text-purple-200">Invested</div>
              </div>
              <div>
                <div className="text-3xl font-bold">38%</div>
                <div className="text-sm text-purple-200">Avg ROI</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block text-center">
            <div className="text-9xl">🌍</div>
          </div>
        </div>
      </div>

      {/* Language Filter */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedLang('')}
          className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
            selectedLang === ''
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
          }`}
        >
          All Communities
        </button>
        {COMMUNITIES.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedLang(c.language)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition flex items-center ${
              selectedLang === c.language
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            <span className="mr-2">{c.flag}</span>
            {c.language}
          </button>
        ))}
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {filteredCommunities.map(community => (
          <div key={community.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-5xl mr-3">{community.flag}</div>
                  <div className="text-white">
                    <h3 className="text-2xl font-bold">{community.name}</h3>
                    <p className="text-blue-100 text-sm">Led by {community.leader}</p>
                  </div>
                </div>
                <div className="badge bg-green-400 text-green-900 text-sm px-3 py-1">
                  {community.avgROI}% ROI
                </div>
              </div>
              <p className="text-blue-50 text-sm">{community.description}</p>
            </div>

            <div className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {community.members.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Members</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    AED {(community.invested / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Invested</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {community.avgROI}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Avg ROI</div>
                </div>
              </div>

              {/* Upcoming Event */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📅</span>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Upcoming Event:</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{community.upcomingEvent}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 btn-primary flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Join WhatsApp
                </button>
                <Link href="/success-stories" className="flex-1">
                  <button className="w-full btn-secondary">
                    View Stories
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Why Join an OWNLY Community?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🗣️</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Speak Your Language
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Discuss investments, ask questions, and learn in your native language with people who understand your background.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Cultural Events
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Celebrate Onam, Diwali, Eid, and more with exclusive community events, concerts, and networking mixers.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Trusted Network
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with community leaders, successful investors, and like-minded individuals building generational wealth.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-6">Upcoming Community Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">🎵</span>
              <div>
                <h3 className="font-bold text-lg">Music Concert & Networking</h3>
                <p className="text-sm text-orange-100">December 20, 2024 • Dubai</p>
              </div>
            </div>
            <p className="text-sm text-orange-50 mb-3">
              Exclusive for 1000+ AED investors. Top Malayalam artist performance.
            </p>
            <button className="btn bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg font-semibold text-sm">
              Reserve Ticket
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">🏆</span>
              <div>
                <h3 className="font-bold text-lg">OWNLY Awards 2024</h3>
                <p className="text-sm text-orange-100">January 15, 2025 • Abu Dhabi</p>
              </div>
            </div>
            <p className="text-sm text-orange-50 mb-3">
              Celebrate top investors, community leaders, and success stories.
            </p>
            <button className="btn bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg font-semibold text-sm">
              Register Now
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">🏏</span>
              <div>
                <h3 className="font-bold text-lg">IPL Viewing Party</h3>
                <p className="text-sm text-orange-100">March 2025 • Dubai</p>
              </div>
            </div>
            <p className="text-sm text-orange-50 mb-3">
              Watch CSK vs RCB with fellow investors. Premium lounge access.
            </p>
            <button className="btn bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg font-semibold text-sm">
              Join Waitlist
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">🎓</span>
              <div>
                <h3 className="font-bold text-lg">Investment Masterclass</h3>
                <p className="text-sm text-orange-100">Every Saturday • Online</p>
              </div>
            </div>
            <p className="text-sm text-orange-50 mb-3">
              Weekly webinars in 10 languages covering SPVs, ROI, risk management.
            </p>
            <button className="btn bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg font-semibold text-sm">
              Attend Free
            </button>
          </div>
        </div>
      </div>

      {/* Ownlyaire Club */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 text-gray-900">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold mb-2">💎 The Ownlyaire Club</h2>
            <p className="text-gray-800">Exclusive club for investors with AED 1M+ portfolio</p>
          </div>
          <div className="text-7xl">👑</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1">25</div>
            <div className="text-sm">Elite Members</div>
          </div>
          <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1">AED 50M+</div>
            <div className="text-sm">Combined Wealth</div>
          </div>
          <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1">48%</div>
            <div className="text-sm">Avg ROI</div>
          </div>
          <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1">VIP</div>
            <div className="text-sm">Access</div>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
          <h3 className="font-bold text-lg mb-3">Exclusive Perks:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-sm">Private yacht parties & luxury experiences</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-sm">IPL box seats & celebrity meet & greets</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-sm">Early access to premium deals</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-sm">Dedicated RM & priority support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
