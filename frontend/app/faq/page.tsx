'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, ChevronDown, MessageCircle, Mail, HelpCircle,
  ArrowRight, Sparkles, Zap
} from 'lucide-react';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is OWNLY and how does it work?',
        a: 'OWNLY is a fractional real estate investment platform that allows you to invest in premium properties with as little as $100. We handle property acquisition, management, and distribute rental income to investors quarterly.'
      },
      {
        q: 'How do I create an account?',
        a: 'Click on "Sign Up" in the top right corner, provide your email and basic information, verify your identity (KYC), and you\'re ready to start investing. The entire process takes about 5-10 minutes.'
      },
      {
        q: 'What is the minimum investment amount?',
        a: 'The minimum investment is just $100 per property, making real estate investment accessible to everyone. There\'s no maximum limit, and you can diversify across multiple properties.'
      },
      {
        q: 'Who can invest on OWNLY?',
        a: 'OWNLY is available to investors aged 18+ who are residents of the United States. Both accredited and non-accredited investors can participate in our offerings.'
      },
      {
        q: 'Do I need to be an accredited investor?',
        a: 'No, OWNLY is open to both accredited and non-accredited investors. We believe everyone should have access to quality real estate investments.'
      }
    ]
  },
  {
    category: 'Investing',
    questions: [
      {
        q: 'How do I choose which properties to invest in?',
        a: 'Each property listing includes detailed information: location, property type, expected returns, risk rating, market analysis, and financial projections. Use our comparison tools and filters to find properties matching your investment goals.'
      },
      {
        q: 'Can I invest in multiple properties?',
        a: 'Yes! We encourage diversification. You can spread your investment across multiple properties, different locations, and various property types to balance your portfolio risk.'
      },
      {
        q: 'What types of properties are available?',
        a: 'We offer residential (single-family, multi-family), commercial (retail, office), and mixed-use properties. Each category has different risk-return profiles to suit various investment strategies.'
      },
      {
        q: 'How are properties vetted and selected?',
        a: 'Our expert team conducts rigorous due diligence including market analysis, property inspections, legal reviews, and financial modeling. Only properties meeting our strict criteria are listed on the platform.'
      },
      {
        q: 'Can I visit the properties I invest in?',
        a: 'While direct property visits aren\'t typically arranged, we provide comprehensive virtual tours, professional photos, inspection reports, and detailed documentation for each property.'
      },
      {
        q: 'What happens after I invest?',
        a: 'You\'ll receive confirmation, ownership documents, and access to your investment dashboard. You can track property performance, receive updates, and monitor your returns in real-time.'
      }
    ]
  },
  {
    category: 'Returns & Payouts',
    questions: [
      {
        q: 'How do I earn returns on my investment?',
        a: 'You earn through two channels: quarterly rental income distributions and potential property appreciation when the property is sold. All returns are automatically credited to your OWNLY account.'
      },
      {
        q: 'When do I receive rental income?',
        a: 'Rental income is distributed quarterly, typically within 15 days after each quarter ends (Jan 15, Apr 15, Jul 15, Oct 15). You can track upcoming distributions in your dashboard.'
      },
      {
        q: 'What are the expected returns?',
        a: 'Historical returns on our platform average 8-12% annually, combining rental yield (5-7%) and appreciation (3-5%). Individual property returns vary based on location, type, and market conditions.'
      },
      {
        q: 'How do I withdraw my earnings?',
        a: 'Navigate to your wallet, select "Withdraw," choose your linked bank account, enter the amount, and confirm. Funds typically arrive in 3-5 business days. There\'s no minimum withdrawal amount.'
      },
      {
        q: 'Are returns guaranteed?',
        a: 'No, real estate investments carry inherent risks and returns are not guaranteed. Past performance doesn\'t indicate future results. We provide detailed risk assessments for each property to help you make informed decisions.'
      },
      {
        q: 'How is my return calculated?',
        a: 'Your return is proportional to your ownership percentage. If you own 1% of a property generating $10,000 monthly rent, you receive $100 monthly (minus management fees and expenses).'
      }
    ]
  },
  {
    category: 'Security & Safety',
    questions: [
      {
        q: 'Is my money safe on OWNLY?',
        a: 'Yes. We use bank-level encryption, secure payment processors, and segregated accounts. Your investments are backed by real property assets, and we maintain comprehensive insurance coverage.'
      },
      {
        q: 'How is my personal information protected?',
        a: 'We employ 256-bit SSL encryption, two-factor authentication, regular security audits, and comply with GDPR and CCPA regulations. Your data is never sold to third parties.'
      },
      {
        q: 'What happens if OWNLY goes out of business?',
        a: 'Your property ownership is held in a Special Purpose Vehicle (SPV) separate from OWNLY\'s operations. Even if OWNLY ceases operations, you retain your property ownership and rights to income and proceeds.'
      },
      {
        q: 'Are investments insured?',
        a: 'Properties are insured for physical damage and liability. While investments themselves aren\'t FDIC insured (they\'re securities, not deposits), your ownership stake is legally protected and documented.'
      },
      {
        q: 'How do you verify investor identities?',
        a: 'We use industry-leading KYC (Know Your Customer) verification, checking government-issued IDs, proof of address, and screening against global watchlists to prevent fraud and ensure compliance.'
      }
    ]
  },
  {
    category: 'Trading',
    questions: [
      {
        q: 'Can I sell my investment before the property is sold?',
        a: 'Yes, through our secondary marketplace. List your shares for sale, set your price, and other investors can purchase them. Liquidity varies by property popularity and market conditions.'
      },
      {
        q: 'How does the secondary marketplace work?',
        a: 'Access the marketplace from your portfolio, select shares to sell, set your asking price (or accept market price), and list them. When a buyer matches your price, the transfer occurs automatically.'
      },
      {
        q: 'Are there fees for selling my shares?',
        a: 'Yes, there\'s a 2% transaction fee on secondary market sales (split between buyer and seller at 1% each). This covers transfer processing, legal documentation, and platform maintenance.'
      },
      {
        q: 'How long does it take to sell my shares?',
        a: 'Sale time varies. Popular properties in prime locations may sell within days, while others might take weeks or months. You can adjust your price anytime to attract buyers faster.'
      },
      {
        q: 'Can I transfer my investment to someone else?',
        a: 'Direct transfers to family members or entities you control are possible with proper documentation. Contact our support team to initiate a transfer, which typically takes 5-7 business days.'
      }
    ]
  },
  {
    category: 'Legal & Compliance',
    questions: [
      {
        q: 'Is OWNLY regulated?',
        a: 'Yes, OWNLY operates under SEC Regulation Crowdfunding and Regulation D. We\'re registered with the SEC and comply with federal and state securities laws. All offerings are properly filed and documented.'
      },
      {
        q: 'What legal rights do I have as an investor?',
        a: 'You have proportional ownership rights including income distribution, voting on major decisions, access to property information, and proceeds from property sale. All rights are outlined in the operating agreement.'
      },
      {
        q: 'How are taxes handled?',
        a: 'You\'ll receive annual tax documents (K-1 forms) reporting your income, expenses, and any capital gains. Consult with a tax professional as treatment varies based on your individual situation.'
      },
      {
        q: 'What is an SPV?',
        a: 'A Special Purpose Vehicle (SPV) is a legal entity created for each property to hold ownership. You own shares in the SPV, which owns the property. This structure provides liability protection and clean ownership.'
      },
      {
        q: 'Can international investors use OWNLY?',
        a: 'Currently, OWNLY is only available to US residents due to regulatory requirements. We\'re exploring international expansion and will announce when available in additional countries.'
      },
      {
        q: 'What happens during disputes?',
        a: 'Our operating agreements include dispute resolution procedures. Most issues are resolved through mediation. Serious disputes may be subject to arbitration as outlined in the investment terms.'
      }
    ]
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  const categories = ['All', ...faqs.map(f => f.category)];

  const filteredFaqs = faqs.filter(category => {
    if (activeCategory !== 'All' && category.category !== activeCategory) return false;
    if (!searchTerm) return true;
    return category.questions.some(q =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }).map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      !searchTerm ||
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleQuestion = (id: string) => {
    const newOpen = new Set(openQuestions);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenQuestions(newOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
              Find answers to common questions about investing with OWNLY
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white text-lg placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredFaqs.length > 0 ? (
              <div className="space-y-8">
                {filteredFaqs.map((category, idx) => (
                  <div key={idx}>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                      {category.category}
                    </h2>
                    <div className="space-y-4">
                      {category.questions.map((faq, qIdx) => {
                        const questionId = `${idx}-${qIdx}`;
                        const isOpen = openQuestions.has(questionId);

                        return (
                          <div
                            key={qIdx}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all shadow-lg"
                          >
                            <button
                              onClick={() => toggleQuestion(questionId)}
                              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                            >
                              <span className="text-lg font-semibold text-white pr-4">
                                {faq.q}
                              </span>
                              <ChevronDown
                                className={`flex-shrink-0 text-purple-400 transition-transform ${
                                  isOpen ? 'transform rotate-180' : ''
                                }`}
                                size={24}
                              />
                            </button>
                            {isOpen && (
                              <div className="px-6 pb-5 text-purple-200 leading-relaxed border-t border-white/10 pt-4">
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
                <p className="text-purple-200 text-lg mb-4">No questions found matching your search.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">
                Still have questions?
              </h2>
            </div>
            <p className="text-xl text-purple-200 mb-8">
              Our support team is here to help you
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Live Chat</h3>
                <p className="text-purple-200 mb-4">
                  Chat with our support team in real-time
                </p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 mx-auto">
                  <Zap className="w-4 h-4" />
                  Start Chat
                </button>
              </div>
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-pink-500/30 transition-all shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/20">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
                <p className="text-purple-200 mb-4">
                  Get detailed answers via email
                </p>
                <a
                  href="mailto:support@ownly.com"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Investing?</h2>
            <p className="text-xl text-purple-200 mb-8">
              Join thousands of investors building wealth through real estate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                Create Free Account
              </Link>
              <Link
                href="/deals"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2 hover:scale-105"
              >
                Browse Deals
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
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
