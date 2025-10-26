'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Play, Filter, ThumbsUp, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Teacher',
    location: 'Chicago, IL',
    rating: 5,
    investorType: 'First-time Investor',
    investment: '$5,000',
    returns: '11.2%',
    image: '/testimonials/sarah.jpg',
    quote: 'OWNLY made real estate investing accessible to me as a teacher. I started with just $500 and now have a diversified portfolio of 8 properties. The platform is incredibly easy to use and the returns have exceeded my expectations.',
    date: 'December 2024',
    verified: true,
    hasVideo: true
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Software Engineer',
    location: 'San Francisco, CA',
    rating: 5,
    investorType: 'Experienced Investor',
    investment: '$50,000',
    returns: '9.8%',
    image: '/testimonials/michael.jpg',
    quote: 'As someone who invests in stocks and crypto, OWNLY has been a game-changer for diversifying into real estate without the hassle of being a landlord. The transparency and detailed analytics are exactly what I need.',
    date: 'November 2024',
    verified: true,
    hasVideo: false
  },
  {
    id: 3,
    name: 'Jennifer Martinez',
    role: 'Nurse',
    location: 'Miami, FL',
    rating: 5,
    investorType: 'First-time Investor',
    investment: '$2,500',
    returns: '10.5%',
    image: '/testimonials/jennifer.jpg',
    quote: 'I was skeptical at first, but OWNLY has proven to be a reliable investment platform. The monthly updates and quarterly distributions are consistent. Customer support is outstanding - they answer all my questions promptly.',
    date: 'October 2024',
    verified: true,
    hasVideo: true
  },
  {
    id: 4,
    name: 'Robert Taylor',
    role: 'Retired Veteran',
    location: 'Austin, TX',
    rating: 5,
    investorType: 'Experienced Investor',
    investment: '$25,000',
    returns: '12.1%',
    image: '/testimonials/robert.jpg',
    quote: 'After retiring, I wanted passive income from real estate but didn\'t want the headaches. OWNLY is perfect - professional management, great properties, and solid returns. I\'ve been investing for 3 years now.',
    date: 'September 2024',
    verified: true,
    hasVideo: false
  },
  {
    id: 5,
    name: 'Emily Watson',
    role: 'Marketing Manager',
    location: 'Seattle, WA',
    rating: 4,
    investorType: 'Intermediate Investor',
    investment: '$15,000',
    returns: '8.9%',
    image: '/testimonials/emily.jpg',
    quote: 'Great platform for getting started in real estate. The educational resources helped me understand the market. My only wish is for more property options in the Pacific Northwest, but overall very satisfied.',
    date: 'August 2024',
    verified: true,
    hasVideo: false
  },
  {
    id: 6,
    name: 'David Kim',
    role: 'Small Business Owner',
    location: 'Denver, CO',
    rating: 5,
    investorType: 'Experienced Investor',
    investment: '$40,000',
    returns: '11.7%',
    image: '/testimonials/david.jpg',
    quote: 'OWNLY helps me diversify my business income with real estate. The secondary marketplace is fantastic - I can liquidate positions when I need cash for my business. Much better than traditional real estate investing.',
    date: 'July 2024',
    verified: true,
    hasVideo: true
  },
  {
    id: 7,
    name: 'Amanda Rodriguez',
    role: 'Physician',
    location: 'Boston, MA',
    rating: 5,
    investorType: 'First-time Investor',
    investment: '$30,000',
    returns: '10.3%',
    image: '/testimonials/amanda.jpg',
    quote: 'As a busy physician, I don\'t have time to manage properties. OWNLY does everything for me - from finding great deals to managing tenants to sending me quarterly distributions. It\'s completely passive.',
    date: 'June 2024',
    verified: true,
    hasVideo: false
  },
  {
    id: 8,
    name: 'James Wilson',
    role: 'Financial Advisor',
    location: 'New York, NY',
    rating: 5,
    investorType: 'Expert Investor',
    investment: '$100,000',
    returns: '9.4%',
    image: '/testimonials/james.jpg',
    quote: 'I recommend OWNLY to my clients looking for alternative investments. The due diligence process is thorough, the properties are institutional-quality, and the returns are competitive. Professional operation all around.',
    date: 'May 2024',
    verified: true,
    hasVideo: true
  },
  {
    id: 9,
    name: 'Lisa Anderson',
    role: 'Teacher',
    location: 'Portland, OR',
    rating: 5,
    investorType: 'First-time Investor',
    investment: '$1,000',
    returns: '11.8%',
    image: '/testimonials/lisa.jpg',
    quote: 'Started with just $100 to test it out. Now I invest regularly each month. It\'s like a savings account but with much better returns. Love watching my portfolio grow!',
    date: 'April 2024',
    verified: true,
    hasVideo: false
  },
  {
    id: 10,
    name: 'Christopher Brown',
    role: 'Engineer',
    location: 'San Diego, CA',
    rating: 4,
    investorType: 'Intermediate Investor',
    investment: '$20,000',
    returns: '9.1%',
    image: '/testimonials/christopher.jpg',
    quote: 'Solid platform with good returns. The mobile app makes it easy to monitor investments on the go. Would love to see more commercial properties available.',
    date: 'March 2024',
    verified: true,
    hasVideo: false
  },
  {
    id: 11,
    name: 'Michelle Lee',
    role: 'Attorney',
    location: 'Washington, DC',
    rating: 5,
    investorType: 'Experienced Investor',
    investment: '$75,000',
    returns: '10.9%',
    image: '/testimonials/michelle.jpg',
    quote: 'The legal structure and documentation are top-notch. As an attorney, I appreciate the attention to detail in the operating agreements. Highly professional platform.',
    date: 'February 2024',
    verified: true,
    hasVideo: true
  },
  {
    id: 12,
    name: 'Daniel Garcia',
    role: 'Sales Professional',
    location: 'Phoenix, AZ',
    rating: 5,
    investorType: 'First-time Investor',
    investment: '$8,000',
    returns: '12.4%',
    image: '/testimonials/daniel.jpg',
    quote: 'Best decision I made this year. My portfolio is up significantly and I receive regular income. The team is responsive and the platform keeps getting better with new features.',
    date: 'January 2024',
    verified: true,
    hasVideo: false
  }
];

const trustpilotData = {
  rating: 4.8,
  totalReviews: 2847,
  breakdown: {
    5: 2314,
    4: 398,
    3: 89,
    2: 28,
    1: 18
  }
};

export default function TestimonialsPage() {
  const [filterType, setFilterType] = useState('All');
  const [filterRating, setFilterRating] = useState('All');

  const filteredTestimonials = testimonials.filter(t => {
    if (filterType !== 'All' && t.investorType !== filterType) return false;
    if (filterRating !== 'All' && t.rating !== parseInt(filterRating)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="mx-auto mb-6" size={80} />
          <h1 className="text-5xl font-bold mb-6">Investor Testimonials</h1>
          <p className="text-2xl text-green-50 max-w-3xl mx-auto">
            Real stories from real investors building wealth with OWNLY
          </p>
        </div>
      </section>

      {/* Trustpilot Score */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <div className="text-sm text-gray-600 mb-2">Rated on Trustpilot</div>
                <div className="text-6xl font-bold text-gray-900 mb-2">{trustpilotData.rating}</div>
                <div className="flex justify-center md:justify-start gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={32}
                      className={i < Math.floor(trustpilotData.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <div className="text-gray-600">Based on {trustpilotData.totalReviews.toLocaleString()} reviews</div>
              </div>
              <div className="space-y-2">
                {Object.entries(trustpilotData.breakdown).reverse().map(([stars, count]) => (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < parseInt(stars) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-600 h-full"
                        style={{ width: `${(count / trustpilotData.totalReviews) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 w-12 text-right">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center">
            <Filter className="text-gray-600" size={24} />
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>All</option>
                <option>First-time Investor</option>
                <option>Intermediate Investor</option>
                <option>Experienced Investor</option>
                <option>Expert Investor</option>
              </select>
            </div>
            <div>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>All</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>
            <div className="text-gray-600 ml-auto">
              Showing {filteredTestimonials.length} of {testimonials.length} reviews
            </div>
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Video Testimonials
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Hear directly from our investors
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.filter(t => t.hasVideo).slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-green-200 to-emerald-200 flex items-center justify-center relative group cursor-pointer">
                  <Play className="text-white group-hover:scale-110 transition-transform" size={64} />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 line-clamp-3">{testimonial.quote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Written Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Investor Reviews
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                        {testimonial.verified && (
                          <ThumbsUp className="text-green-600" size={16} />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>

                <Quote className="text-green-200 mb-2" size={32} />
                <p className="text-gray-700 leading-relaxed mb-6">{testimonial.quote}</p>

                <div className="border-t border-gray-200 pt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Investor Type</div>
                    <div className="font-semibold text-gray-900">{testimonial.investorType}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total Invested</div>
                    <div className="font-semibold text-gray-900">{testimonial.investment}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Avg Return</div>
                    <div className="font-semibold text-green-600">{testimonial.returns}</div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">{testimonial.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Investor Success Stories
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">96%</div>
              <div className="text-gray-700">Would Recommend</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">25,000+</div>
              <div className="text-gray-700">Happy Investors</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">$150M+</div>
              <div className="text-gray-700">Total Invested</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">4.8/5</div>
              <div className="text-gray-700">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Community of Investors</h2>
          <p className="text-xl mb-8 text-green-50">
            Start your real estate investment journey today
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
              Browse Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
