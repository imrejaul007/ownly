'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, HelpCircle, BookOpen, MessageCircle, Mail, Phone,
  ChevronDown, ChevronRight, FileText, Shield, DollarSign,
  Users, TrendingUp, Wallet, Settings, AlertCircle, CheckCircle,
  ExternalLink, Youtube, Send
} from 'lucide-react';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen },
    { id: 'getting-started', label: 'Getting Started', icon: HelpCircle },
    { id: 'investing', label: 'Investing', icon: TrendingUp },
    { id: 'wallet', label: 'Wallet & Payments', icon: Wallet },
    { id: 'returns', label: 'Returns & Payouts', icon: DollarSign },
    { id: 'account', label: 'Account & Security', icon: Shield },
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'What is OWNLY and how does it work?',
      answer: 'OWNLY is a fractional ownership investment platform that allows you to invest in premium real estate, franchises, and startups starting from just AED 1,000. You buy shares in Special Purpose Vehicles (SPVs) that own these assets, and you receive monthly dividends and profit distributions based on your ownership percentage.',
    },
    {
      category: 'getting-started',
      question: 'How do I get started on OWNLY?',
      answer: 'Getting started is simple: 1) Create your account and complete KYC verification, 2) Fund your wallet with a minimum of AED 1,000, 3) Browse available deals and select investments that match your goals, 4) Complete your investment and start receiving monthly returns.',
    },
    {
      category: 'investing',
      question: 'What is the minimum investment amount?',
      answer: 'The minimum investment varies by deal but typically starts at AED 1,000. Some exclusive deals may have higher minimums (AED 5,000-10,000). You can see the minimum investment amount on each deal card.',
    },
    {
      category: 'investing',
      question: 'What types of investments are available?',
      answer: 'OWNLY offers three main investment categories: Real Estate (residential, commercial properties), Franchises (established business franchises), and Startups (early-stage companies). Each category has different risk profiles and expected returns.',
    },
    {
      category: 'investing',
      question: 'How are deals vetted?',
      answer: 'Every deal goes through rigorous due diligence including financial analysis, legal review, market research, and risk assessment by our expert team. Only deals that meet our strict criteria are listed on the platform.',
    },
    {
      category: 'returns',
      question: 'When will I receive my first payout?',
      answer: 'Most deals start generating returns within 30-90 days after the deal is fully funded. Exact timing depends on the deal structure and asset performance. Monthly distributions are typically processed on the 5th of each month.',
    },
    {
      category: 'returns',
      question: 'What are the expected returns?',
      answer: 'Returns vary by asset type and risk level. Real estate typically offers 15-25% annual returns, franchises offer 20-35%, and startups can provide 25-45%. These are projected returns and actual performance may vary.',
    },
    {
      category: 'returns',
      question: 'Can I reinvest my earnings?',
      answer: 'Yes! You can choose to automatically reinvest your monthly payouts into new deals or bundles. This compound growth strategy can significantly increase your long-term returns.',
    },
    {
      category: 'wallet',
      question: 'How do I add funds to my wallet?',
      answer: 'You can fund your wallet through bank transfer, credit/debit card, or wire transfer. Funds are typically available within 1-2 business days for bank transfers and instantly for card payments.',
    },
    {
      category: 'wallet',
      question: 'How do I withdraw my earnings?',
      answer: 'Withdrawals can be requested from your wallet at any time. Simply go to your Wallet page, click "Withdraw", enter the amount, and select your preferred withdrawal method. Funds are typically processed within 3-5 business days.',
    },
    {
      category: 'wallet',
      question: 'Are there any fees?',
      answer: 'OWNLY charges a 2% management fee on annual returns and a 0.5% transaction fee on secondary market trades. There are no fees for deposits, withdrawals, or holding investments.',
    },
    {
      category: 'account',
      question: 'Is my money safe on OWNLY?',
      answer: 'Yes. OWNLY is SEC-regulated and uses bank-grade security. All investments are structured through legal SPVs, providing you with actual ownership rights. Your funds are held in segregated accounts and are fully protected.',
    },
    {
      category: 'account',
      question: 'What is KYC and why is it required?',
      answer: 'KYC (Know Your Customer) is a regulatory requirement to verify your identity. We need a government ID and proof of address. This protects both you and the platform from fraud and ensures compliance with financial regulations.',
    },
    {
      category: 'account',
      question: 'Can I sell my shares before the holding period ends?',
      answer: 'Yes! You can list your shares on our Secondary Market at any time. Other investors can purchase your shares, providing you with liquidity even during the holding period. Note that market prices may vary based on demand.',
    },
  ];

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  const searchedFaqs = searchQuery
    ? filteredFaqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFaqs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full text-blue-300 text-sm font-semibold mb-4 border border-blue-500/30">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-4">
            How Can We Help You?
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/getting-started">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:scale-105 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Getting Started Guide</h3>
              <p className="text-purple-200 text-sm mb-3">
                New to OWNLY? Learn the basics of fractional investing
              </p>
              <div className="flex items-center text-purple-400 text-sm font-semibold">
                Start Learning
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link href="/calculator">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:scale-105 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">ROI Calculator</h3>
              <p className="text-purple-200 text-sm mb-3">
                Calculate potential returns on your investments
              </p>
              <div className="flex items-center text-purple-400 text-sm font-semibold">
                Try Calculator
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:scale-105 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-white mb-2">Contact Support</h3>
            <p className="text-purple-200 text-sm mb-3">
              Can't find what you're looking for? We're here to help
            </p>
            <div className="flex items-center text-purple-400 text-sm font-semibold">
              Get in Touch
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white/5 border border-white/10 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {searchedFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-all"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-purple-200 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {searchedFaqs.length === 0 && (
            <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
              <AlertCircle className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
              <p className="text-purple-200 text-lg">No results found</p>
              <p className="text-purple-400 text-sm">Try a different search term or category</p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Still Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <Mail className="w-8 h-8 mb-4" />
              <h3 className="font-bold mb-2">Email Support</h3>
              <p className="text-blue-100 text-sm mb-4">
                Get a response within 24 hours
              </p>
              <a href="mailto:support@ownly.ae" className="inline-flex items-center text-sm font-semibold hover:underline">
                support@ownly.ae
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
              <MessageCircle className="w-8 h-8 mb-4" />
              <h3 className="font-bold mb-2">Live Chat</h3>
              <p className="text-green-100 text-sm mb-4">
                Chat with our team in real-time
              </p>
              <button className="inline-flex items-center text-sm font-semibold hover:underline">
                Start Chat
                <Send className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
              <Phone className="w-8 h-8 mb-4" />
              <h3 className="font-bold mb-2">Phone Support</h3>
              <p className="text-purple-100 text-sm mb-4">
                Mon-Fri, 9 AM - 6 PM GST
              </p>
              <a href="tel:+97143211234" className="inline-flex items-center text-sm font-semibold hover:underline">
                +971 4 321 1234
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="mt-12 max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-8">
          <h3 className="text-xl font-bold text-white mb-6">
            Legal & Documentation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="#" className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <FileText className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Terms of Service</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Privacy Policy</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <FileText className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Risk Disclosure</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Investor Agreement</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
