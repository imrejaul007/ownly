'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, Video, Play, CheckCircle, Filter } from 'lucide-react';

const upcomingEvents = [
  {
    id: 1,
    title: '2025 Real Estate Investment Outlook Webinar',
    type: 'Webinar',
    category: 'Market Updates',
    date: 'January 15, 2025',
    time: '2:00 PM EST',
    duration: '60 min',
    location: 'Virtual',
    seats: 500,
    registered: 347,
    description: 'Join our expert panel as they discuss market trends, opportunities, and investment strategies for 2025.',
    speakers: ['Michael Chen, CEO', 'Jennifer Martinez, Head of Real Estate'],
    topics: ['Market trends', 'Economic outlook', 'Investment strategies', 'Q&A session']
  },
  {
    id: 2,
    title: 'Beginner Investor Workshop: Getting Started',
    type: 'Workshop',
    category: 'Educational',
    date: 'January 20, 2025',
    time: '6:00 PM EST',
    duration: '90 min',
    location: 'Virtual',
    seats: 200,
    registered: 156,
    description: 'Perfect for new investors. Learn the basics of fractional real estate investing and how to build your portfolio.',
    speakers: ['Sarah Rodriguez, CTO', 'David Kim, CFO'],
    topics: ['Platform overview', 'How to evaluate properties', 'Portfolio diversification', 'Risk management']
  },
  {
    id: 3,
    title: 'Virtual Investor Networking Happy Hour',
    type: 'Networking',
    category: 'Networking',
    date: 'January 25, 2025',
    time: '5:00 PM EST',
    duration: '60 min',
    location: 'Virtual',
    seats: 100,
    registered: 78,
    description: 'Connect with fellow investors, share experiences, and build your network in the OWNLY community.',
    speakers: ['Community Team'],
    topics: ['Open networking', 'Success stories', 'Tips sharing', 'Community building']
  },
  {
    id: 4,
    title: 'Advanced Property Analysis Masterclass',
    type: 'Masterclass',
    category: 'Educational',
    date: 'February 1, 2025',
    time: '1:00 PM EST',
    duration: '120 min',
    location: 'Virtual',
    seats: 150,
    registered: 92,
    description: 'Deep dive into financial modeling, cap rates, NOI, and other critical metrics for property evaluation.',
    speakers: ['David Kim, CFO', 'Investment Analysis Team'],
    topics: ['Financial modeling', 'Cap rate analysis', 'Cash flow projections', 'Risk assessment']
  },
  {
    id: 5,
    title: 'Tax Planning for Real Estate Investors',
    type: 'Webinar',
    category: 'Educational',
    date: 'February 8, 2025',
    time: '3:00 PM EST',
    duration: '75 min',
    location: 'Virtual',
    seats: 300,
    registered: 201,
    description: 'Expert guidance on maximizing tax benefits and understanding tax implications of real estate investing.',
    speakers: ['Tax Advisors', 'David Kim, CFO'],
    topics: ['Tax deductions', 'K-1 forms', 'Tax strategies', 'Q&A with experts']
  },
  {
    id: 6,
    title: 'Quarterly Portfolio Review & Market Update',
    type: 'Webinar',
    category: 'Market Updates',
    date: 'February 15, 2025',
    time: '4:00 PM EST',
    duration: '60 min',
    location: 'Virtual',
    seats: 500,
    registered: 412,
    description: 'Review Q4 2024 performance, market conditions, and preview upcoming opportunities for Q1 2025.',
    speakers: ['Michael Chen, CEO', 'Jennifer Martinez, Head of Real Estate'],
    topics: ['Q4 performance', 'Market analysis', 'New opportunities', 'Investor Q&A']
  }
];

const pastEvents = [
  {
    id: 7,
    title: 'Understanding Secondary Market Trading',
    type: 'Webinar',
    category: 'Educational',
    date: 'December 10, 2024',
    attendees: 456,
    recording: true,
    duration: '55 min'
  },
  {
    id: 8,
    title: 'Year-End Tax Strategies 2024',
    type: 'Workshop',
    category: 'Educational',
    date: 'November 28, 2024',
    attendees: 389,
    recording: true,
    duration: '90 min'
  },
  {
    id: 9,
    title: 'Commercial Real Estate Deep Dive',
    type: 'Masterclass',
    category: 'Educational',
    date: 'November 15, 2024',
    attendees: 234,
    recording: true,
    duration: '120 min'
  },
  {
    id: 10,
    title: 'Investor Success Stories Panel',
    type: 'Panel',
    category: 'Networking',
    date: 'October 30, 2024',
    attendees: 512,
    recording: true,
    duration: '75 min'
  },
  {
    id: 11,
    title: 'Q3 2024 Market Review',
    type: 'Webinar',
    category: 'Market Updates',
    date: 'October 15, 2024',
    attendees: 678,
    recording: true,
    duration: '60 min'
  },
  {
    id: 12,
    title: 'Building a Diversified Real Estate Portfolio',
    type: 'Workshop',
    category: 'Educational',
    date: 'September 25, 2024',
    attendees: 421,
    recording: true,
    duration: '85 min'
  }
];

const eventCategories = ['All', 'Educational', 'Networking', 'Market Updates'];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredUpcoming = upcomingEvents.filter(event =>
    selectedCategory === 'All' || event.category === selectedCategory
  );

  const filteredPast = pastEvents.filter(event =>
    selectedCategory === 'All' || event.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="mx-auto mb-6" size={80} />
          <h1 className="text-5xl font-bold mb-6">Events & Webinars</h1>
          <p className="text-2xl text-green-50 max-w-3xl mx-auto">
            Join our community events, educational webinars, and networking sessions
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Filter className="text-gray-600" size={20} />
            <div className="flex gap-3 overflow-x-auto pb-2">
              {eventCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-xl text-gray-600 mb-12">
            Register now to secure your spot
          </p>

          {filteredUpcoming.length > 0 ? (
            <div className="space-y-8">
              {filteredUpcoming.map((event) => (
                <div key={event.id} className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl shadow-lg overflow-hidden border-2 border-green-200">
                  <div className="grid md:grid-cols-3 gap-6 p-8">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
                          {event.type}
                        </span>
                        <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {event.category}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h3>
                      <p className="text-gray-700 mb-6">{event.description}</p>

                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="text-green-600" size={20} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="text-green-600" size={20} />
                          <span>{event.time} ({event.duration})</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="text-green-600" size={20} />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users className="text-green-600" size={20} />
                          <span>{event.registered}/{event.seats} registered</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Speakers:</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.speakers.map((speaker, idx) => (
                            <span key={idx} className="text-sm bg-white px-3 py-1 rounded-full text-gray-700">
                              {speaker}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Topics Covered:</h4>
                        <ul className="space-y-1">
                          {event.topics.map((topic, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-700">
                              <CheckCircle className="text-green-600" size={16} />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="bg-white rounded-xl p-6 mb-4">
                        <div className="text-center mb-4">
                          <div className="text-4xl font-bold text-gray-900 mb-1">
                            {event.seats - event.registered}
                          </div>
                          <div className="text-gray-600">Seats Available</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            style={{ width: `${(event.registered / event.seats) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-shadow">
                        Register Now (Free)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg">No upcoming events in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events & Recordings */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Video className="text-green-600" size={32} />
            <h2 className="text-4xl font-bold text-gray-900">Past Events & Recordings</h2>
          </div>
          <p className="text-xl text-gray-600 mb-12">
            Catch up on events you missed
          </p>

          {filteredPast.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPast.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-green-200 to-emerald-200 flex items-center justify-center relative group cursor-pointer">
                    <Play className="text-white group-hover:scale-110 transition-transform" size={64} />
                    <div className="absolute top-4 right-4">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Video size={12} />
                        REPLAY
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                      {event.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        {event.type}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        {event.attendees} attendees
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                      Watch Recording
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500 text-lg">No past events in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Event Calendar CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-12 text-center border-2 border-green-200">
            <Calendar className="mx-auto mb-6 text-green-600" size={64} />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Never Miss an Event
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Subscribe to our event calendar and get reminders for upcoming webinars and workshops
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-shadow">
                Subscribe to Calendar
              </button>
              <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-shadow border-2 border-green-600">
                Set Email Reminders
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Investor Community</h2>
          <p className="text-xl mb-8 text-green-50">
            Get access to exclusive events, educational content, and networking opportunities
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
