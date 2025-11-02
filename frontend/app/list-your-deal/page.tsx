'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, Building2, Store, Package, TrendingUp, Users, DollarSign,
  CheckCircle, ArrowRight, Target, Zap, Award, BarChart3, Clock,
  FileText, Shield, Globe, Rocket, Star, Eye, MessageSquare,
  Briefcase, Home, Car, Gem, TrendingDown, PieChart, Lock,
  BadgeCheck, Phone, Mail, User, Building, Percent, Calendar,
  ChevronDown, PlayCircle, HelpCircle, Send
} from 'lucide-react';

export default function ListYourDealPage() {
  const [activeAssetType, setActiveAssetType] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    assetType: '',
    assetValue: '',
    message: ''
  });

  const benefits = [
    {
      title: 'Fast Fundraising',
      description: 'Raise capital in 30-60 days vs 6-12 months traditionally',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      stats: '3x faster than banks'
    },
    {
      title: 'Lower Costs',
      description: 'Competitive fees with no hidden charges or upfront costs',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      stats: '50% lower fees'
    },
    {
      title: 'Wider Investor Base',
      description: 'Access 500+ investors and growing retail investor network',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      stats: '500+ active investors'
    },
    {
      title: 'Brand Visibility',
      description: 'Showcase your business to thousands of potential investors',
      icon: Eye,
      color: 'from-purple-500 to-pink-500',
      stats: '10K+ monthly visitors'
    },
    {
      title: 'Legal Protection',
      description: 'SPV structure protects both investors and asset owners',
      icon: Shield,
      color: 'from-indigo-500 to-purple-500',
      stats: '7-layer protection'
    },
    {
      title: 'Ongoing Support',
      description: 'Dedicated relationship manager throughout the process',
      icon: Award,
      color: 'from-pink-500 to-rose-500',
      stats: '24/7 support'
    }
  ];

  const eligibleAssets = [
    {
      name: 'Real Estate',
      description: 'Residential, commercial, retail properties',
      icon: Building2,
      color: 'blue',
      minValue: 'AED 300K+',
      examples: ['Apartments', 'Villas', 'Commercial buildings', 'Retail shops', 'Warehouses'],
      requirements: ['Clear title deed', 'Current valuation', 'Rental income proof', 'No disputes']
    },
    {
      name: 'Franchises',
      description: 'Established franchise businesses',
      icon: Store,
      color: 'purple',
      minValue: 'AED 500K+',
      examples: ['F&B outlets', 'Retail chains', 'Service franchises', 'Educational centers'],
      requirements: ['Franchise agreement', '2+ years operation', 'Proven profitability', 'Financial statements']
    },
    {
      name: 'Operating Businesses',
      description: 'Revenue-generating businesses',
      icon: Briefcase,
      color: 'green',
      minValue: 'AED 500K+',
      examples: ['Manufacturing', 'Distribution', 'Service businesses', 'Tech companies'],
      requirements: ['2+ years trading', 'Audited financials', 'Customer contracts', 'Growth trajectory']
    },
    {
      name: 'Luxury Assets',
      description: 'High-value appreciating assets',
      icon: Gem,
      color: 'pink',
      minValue: 'AED 200K+',
      examples: ['Luxury cars', 'Yachts', 'Art & collectibles', 'Watches'],
      requirements: ['Ownership proof', 'Authentication', 'Appraisal report', 'Insurance']
    },
    {
      name: 'Trade Finance',
      description: 'Short-term trade deals',
      icon: Package,
      color: 'orange',
      minValue: 'AED 100K+',
      examples: ['Import/Export', 'Commodity trading', 'Supply chain finance', 'Invoice factoring'],
      requirements: ['Trade agreement', 'LC/Bank guarantee', 'Cargo insurance', 'Track record']
    },
    {
      name: 'Development Projects',
      description: 'Real estate development',
      icon: Home,
      color: 'indigo',
      minValue: 'AED 1M+',
      examples: ['Residential projects', 'Commercial developments', 'Mixed-use', 'Off-plan'],
      requirements: ['Approved plans', 'Land ownership', 'Contractor agreements', 'Pre-sales']
    }
  ];

  const listingProcess = [
    {
      step: 1,
      title: 'Submit Application',
      description: 'Fill out our simple application form with asset details',
      duration: '10 minutes',
      icon: FileText,
      color: 'blue',
      actions: ['Basic information', 'Asset type & value', 'Financial overview', 'Supporting documents']
    },
    {
      step: 2,
      title: 'Initial Review',
      description: 'Our team reviews your application and provides feedback',
      duration: '3-5 days',
      icon: Eye,
      color: 'purple',
      actions: ['Preliminary assessment', 'Valuation check', 'Compliance review', 'Approval decision']
    },
    {
      step: 3,
      title: 'Due Diligence',
      description: 'Comprehensive verification of asset and documentation',
      duration: '2-3 weeks',
      icon: Shield,
      color: 'orange',
      actions: ['Legal title verification', 'Financial audit', 'Physical inspection', 'Risk assessment']
    },
    {
      step: 4,
      title: 'SPV Creation',
      description: 'Set up dedicated legal entity to hold the asset',
      duration: '1-2 weeks',
      icon: Building,
      color: 'green',
      actions: ['SPV incorporation', 'Asset transfer', 'Legal documentation', 'Governance setup']
    },
    {
      step: 5,
      title: 'Deal Launch',
      description: 'Your deal goes live on OWNLY platform',
      duration: '1 day',
      icon: Rocket,
      color: 'pink',
      actions: ['Deal page creation', 'Marketing campaign', 'Investor outreach', 'Live on platform']
    },
    {
      step: 6,
      title: 'Fundraising',
      description: 'Collect investments from retail and HNI investors',
      duration: '30-60 days',
      icon: TrendingUp,
      color: 'teal',
      actions: ['Investor subscriptions', 'KYC verification', 'Fund collection', 'Target achievement']
    }
  ];

  const requirements = [
    {
      category: 'Financial',
      icon: DollarSign,
      items: [
        'Minimum asset value: AED 100K (varies by type)',
        'Audited financial statements (if applicable)',
        'Proof of income/revenue generation',
        'Clear debt obligations disclosure',
        'Realistic valuation based on market comps'
      ]
    },
    {
      category: 'Legal',
      icon: FileText,
      items: [
        'Clear legal ownership documents',
        'No pending litigation or disputes',
        'All permits and licenses current',
        'Compliance with UAE regulations',
        'Willing to transfer to SPV structure'
      ]
    },
    {
      category: 'Documentation',
      icon: CheckCircle,
      items: [
        'Title deeds / ownership certificates',
        'Recent valuation report (< 6 months)',
        'Insurance policies (if applicable)',
        'Rental agreements / customer contracts',
        'Photos, videos, and marketing materials'
      ]
    }
  ];

  const successStories = [
    {
      name: 'Downtown Dubai Villa',
      type: 'Real Estate',
      raised: 'AED 1.2M',
      timeline: '35 days',
      investors: 240,
      roi: '14% annual',
      quote: 'OWNLY helped us raise capital 3x faster than traditional banks. The process was smooth and transparent.',
      owner: 'Ahmed K., Property Owner'
    },
    {
      name: 'Coffee Franchise Chain',
      type: 'Franchise',
      raised: 'AED 800K',
      timeline: '42 days',
      investors: 160,
      roi: '22% annual',
      quote: 'The investor network on OWNLY gave us access to capital we couldn\'t get elsewhere. Highly recommend!',
      owner: 'Sarah M., Franchise Owner'
    },
    {
      name: 'Luxury Car Collection',
      type: 'Luxury Assets',
      raised: 'AED 500K',
      timeline: '28 days',
      investors: 95,
      roi: '18% annual',
      quote: 'Fractional ownership opened up a new revenue stream for our luxury car portfolio. Brilliant platform.',
      owner: 'Omar R., Asset Manager'
    }
  ];

  const faqs = [
    {
      q: 'How much does it cost to list my asset?',
      a: 'There are no upfront listing fees. OWNLY charges a success-based fee of 7% on the total amount raised, plus an annual management fee of 10% of distributions. You only pay when your deal is successfully funded.'
    },
    {
      q: 'How long does the process take?',
      a: 'From application to funding, the entire process typically takes 6-10 weeks. This includes 3-5 days for initial review, 2-3 weeks for due diligence, 1-2 weeks for SPV setup, and 30-60 days for fundraising.'
    },
    {
      q: 'What is the minimum asset value?',
      a: 'Minimum values vary by asset type: Real Estate (AED 300K+), Franchises & Businesses (AED 500K+), Luxury Assets (AED 200K+), Trade Finance (AED 100K+), Development Projects (AED 1M+).'
    },
    {
      q: 'Do I lose ownership of my asset?',
      a: 'Your asset is transferred to a Special Purpose Vehicle (SPV) where ownership is shared with investors. You can retain a stake and continue managing the asset while benefiting from the capital raised. The SPV structure protects all parties legally.'
    },
    {
      q: 'What if my deal doesn\'t reach its funding goal?',
      a: 'If your deal doesn\'t reach the minimum funding threshold within the campaign period, all investor funds are returned. You can choose to relaunch with adjusted terms or explore alternative funding options.'
    },
    {
      q: 'Can I list multiple assets?',
      a: 'Yes! Many asset owners list multiple properties, franchises, or assets on OWNLY. Each asset is held in a separate SPV for legal protection and clear ownership tracking.'
    },
    {
      q: 'What ongoing obligations do I have?',
      a: 'You\'ll need to provide quarterly financial reports, maintain the asset properly, distribute income to investors on time, and communicate any material changes. OWNLY provides templates and support for all reporting requirements.'
    },
    {
      q: 'How are investor returns paid out?',
      a: 'Rental income, business profits, or other returns are collected by the SPV and automatically distributed to investors monthly or quarterly through the OWNLY platform. All distributions are tracked transparently.'
    },
    {
      q: 'What happens when I want to exit?',
      a: 'You can exit by selling the asset through the SPV, finding a buyer for your stake, or buying out investors at a predetermined valuation. All exit terms are agreed upon before the deal launches.'
    },
    {
      q: 'Is my asset eligible if it has existing debt?',
      a: 'Yes, assets with existing mortgages or loans can be listed, but all debt obligations must be fully disclosed. The deal structure will account for debt service, and investor returns are calculated on a net basis.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you! Our team will contact you within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Background Grid Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-semibold">For Asset Owners & Businesses</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 tracking-tight">
              List Your Deal on OWNLY
            </h1>
            <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto mb-8">
              Raise capital from 500+ investors. Fast, transparent, and
              <span className="text-purple-400 font-bold"> cost-effective fundraising</span> for your business or asset.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="#apply" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all hover:scale-105">
                Apply to List
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#process" className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
                <Eye className="w-5 h-5" />
                How It Works
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'Avg. Time to Fund', value: '45 days', icon: Clock },
                { label: 'Success Rate', value: '92%', icon: Award },
                { label: 'Active Investors', value: '500+', icon: Users },
                { label: 'Total Funded', value: 'AED 10M+', icon: DollarSign }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <stat.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent mb-4">
              Why List on OWNLY?
            </h2>
            <p className="text-xl text-purple-200">Benefits that traditional fundraising can't match</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all group">
                <div className={`bg-gradient-to-r ${benefit.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 mb-4">{benefit.description}</p>
                <div className="inline-flex px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                  {benefit.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eligible Assets */}
      <div className="py-20 bg-gradient-to-r from-slate-950/50 to-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-4">
              What Assets Can You List?
            </h2>
            <p className="text-xl text-purple-200">We accept a wide range of income-generating and appreciating assets</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eligibleAssets.map((asset, idx) => (
              <button
                key={idx}
                onClick={() => setActiveAssetType(idx)}
                className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-8 text-left hover:scale-105 transition-all ${
                  activeAssetType === idx ? 'border-purple-500 shadow-2xl' : 'border-white/10'
                }`}
              >
                <asset.icon className={`w-12 h-12 text-${asset.color}-400 mb-4`} />
                <h3 className="text-2xl font-bold text-white mb-2">{asset.name}</h3>
                <p className="text-gray-400 mb-4">{asset.description}</p>

                <div className="mb-6 py-3 border-y border-white/10">
                  <p className="text-sm text-gray-400">Minimum Value</p>
                  <p className="text-xl font-bold text-purple-400">{asset.minValue}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-sm font-semibold text-gray-300">Examples:</p>
                  {asset.examples.slice(0, 3).map((example, eIdx) => (
                    <div key={eIdx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">{example}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-300">Requirements:</p>
                  {asset.requirements.map((req, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-400">{req}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listing Process */}
      <div id="process" className="py-20 bg-gradient-to-r from-purple-950/30 to-blue-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent mb-4">
              The Listing Process
            </h2>
            <p className="text-xl text-purple-200">From application to funding in 6 simple steps</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listingProcess.map((step, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-purple-400">STEP {step.step}</span>
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{step.duration}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{step.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {step.actions.map((action, aIdx) => (
                    <div key={aIdx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{action}</span>
                    </div>
                  ))}
                </div>

                {idx < listingProcess.length - 1 && (
                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent mb-4">
              Listing Requirements
            </h2>
            <p className="text-xl text-purple-200">What you need to get started</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {requirements.map((req, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <req.icon className="w-12 h-12 text-purple-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-6">{req.category}</h3>
                <div className="space-y-3">
                  {req.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-12 h-12 text-purple-400 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Not Sure If Your Asset Qualifies?</h3>
                <p className="text-gray-300 mb-4">
                  Our team reviews each application individually. Even if your asset doesn't perfectly fit the criteria,
                  we encourage you to apply. We work with unique and innovative investment opportunities.
                </p>
                <a href="#apply" className="inline-flex items-center gap-2 text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                  Apply Now - We'll Help You
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-20 bg-gradient-to-r from-blue-950/30 to-purple-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mb-6 shadow-lg shadow-yellow-500/30">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-purple-200">Real deals, real results from OWNLY listings</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                    {story.type}
                  </span>
                  <BadgeCheck className="w-6 h-6 text-green-400" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">{story.name}</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Raised</p>
                    <p className="text-lg font-bold text-green-400">{story.raised}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Timeline</p>
                    <p className="text-lg font-bold text-blue-400">{story.timeline}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Investors</p>
                    <p className="text-lg font-bold text-purple-400">{story.investors}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Returns</p>
                    <p className="text-lg font-bold text-yellow-400">{story.roi}</p>
                  </div>
                </div>

                <blockquote className="border-l-4 border-purple-500 pl-4 mb-4">
                  <p className="text-gray-300 italic text-sm mb-2">"{story.quote}"</p>
                  <cite className="text-xs text-gray-500 not-italic">— {story.owner}</cite>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-purple-500/30">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-purple-200">Common questions from asset owners and businesses</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all group"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-all"
                >
                  <h3 className="font-bold text-lg text-white pr-4 group-hover:text-purple-200 transition-colors">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 text-purple-400 flex-shrink-0 transition-transform ${
                    openFAQ === idx ? 'rotate-180' : ''
                  }`} />
                </button>
                {openFAQ === idx && (
                  <div className="px-6 pb-6 animate-fadeIn">
                    <p className="text-purple-200 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div id="apply" className="py-20 bg-gradient-to-r from-purple-950/50 to-pink-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-lg shadow-purple-500/30">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-4">
              Apply to List Your Asset
            </h2>
            <p className="text-purple-200 text-lg">Fill out the form below and our team will contact you within 24 hours</p>

            {/* Progress Steps Indicator */}
            <div className="mt-8 flex items-center justify-center gap-2 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/30">1</div>
                <span className="text-sm font-medium text-white hidden sm:inline">Submit Form</span>
              </div>
              <div className="w-8 h-0.5 bg-white/20"></div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-purple-300 text-sm font-bold">2</div>
                <span className="text-sm font-medium text-purple-300 hidden sm:inline">Review</span>
              </div>
              <div className="w-8 h-0.5 bg-white/20"></div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-purple-300 text-sm font-bold">3</div>
                <span className="text-sm font-medium text-purple-300 hidden sm:inline">Launch</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Your name"
                  />
                  <p className="text-xs text-purple-300 mt-1">Enter your full legal name</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-purple-300 mt-1">We'll send updates to this email</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="+971 XX XXX XXXX"
                  />
                  <p className="text-xs text-purple-300 mt-1">For quick follow-up calls</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Your company (optional)"
                  />
                  <p className="text-xs text-purple-300 mt-1">Optional if listing as individual</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <Package className="w-4 h-4 inline mr-2" />
                    Asset Type *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.assetType}
                      onChange={(e) => setFormData({...formData, assetType: e.target.value})}
                      className="w-full appearance-none bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">Select type</option>
                      <option value="real-estate" className="bg-slate-900">Real Estate</option>
                      <option value="franchise" className="bg-slate-900">Franchise</option>
                      <option value="business" className="bg-slate-900">Operating Business</option>
                      <option value="luxury" className="bg-slate-900">Luxury Assets</option>
                      <option value="trade" className="bg-slate-900">Trade Finance</option>
                      <option value="development" className="bg-slate-900">Development Project</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 pointer-events-none" />
                  </div>
                  <p className="text-xs text-purple-300 mt-1">Choose the category that best fits</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Asset Value *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.assetValue}
                      onChange={(e) => setFormData({...formData, assetValue: e.target.value})}
                      className="w-full appearance-none bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">Select range</option>
                      <option value="100-300k" className="bg-slate-900">AED 100K - 300K</option>
                      <option value="300-500k" className="bg-slate-900">AED 300K - 500K</option>
                      <option value="500k-1m" className="bg-slate-900">AED 500K - 1M</option>
                      <option value="1m-5m" className="bg-slate-900">AED 1M - 5M</option>
                      <option value="5m+" className="bg-slate-900">AED 5M+</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 pointer-events-none" />
                  </div>
                  <p className="text-xs text-purple-300 mt-1">Estimated current market value</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Additional Details
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  placeholder="Tell us more about your asset, expected returns, current status, etc."
                />
                <p className="text-xs text-purple-300 mt-1">Provide any relevant details about your asset</p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 rounded border-purple-500/50 text-purple-600 focus:ring-purple-500/50 focus:ring-2 bg-white/5 cursor-pointer"
                  />
                  <p className="text-sm text-purple-200">
                    I agree to OWNLY's terms and conditions and understand that my application will be reviewed.
                    I consent to being contacted by the OWNLY team regarding my application.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send className="w-5 h-5" />
                Submit Application
              </button>

              <div className="text-center">
                <p className="text-sm text-purple-300 mb-2">
                  Our team will review your application and respond within 24 hours
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-purple-400">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Secure & Confidential</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>24hr Response</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-lg shadow-purple-500/30">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-6">
                Ready to Raise Capital?
              </h2>
              <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                Join 50+ successful asset owners who've raised capital on OWNLY.<br />
                Fast, transparent, and cost-effective fundraising.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <a href="#apply" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all hover:scale-105">
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link href="/deals" className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
                  <Eye className="w-5 h-5" />
                  View Live Deals
                </Link>
              </div>
              <div className="inline-flex items-center gap-6 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-purple-200">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>listings@ownly.ae</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-2 text-sm text-purple-200">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span>+971 XX XXX XXXX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
