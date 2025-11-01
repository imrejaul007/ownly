'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, Shield, Scale, CheckCircle, XCircle, BookOpen, Users,
  Award, Globe, FileText, AlertCircle, ArrowRight, Eye, Mosque,
  Star, BadgeCheck, Building2, Store, Package, TrendingUp, Lock,
  Search, Target, DollarSign, Percent, BarChart3, Heart, Zap,
  MessageSquare, ChevronDown, HelpCircle, Briefcase, Home, Car
} from 'lucide-react';

export default function ShariahCompliancePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const shariahPrinciples = [
    {
      title: 'No Riba (Interest)',
      description: 'All investments are structured to avoid interest-based transactions',
      icon: Percent,
      color: 'from-green-500 to-emerald-500',
      details: [
        'Profit and loss sharing structures',
        'Asset-backed transactions only',
        'No fixed guaranteed returns',
        'Real economic activity underlying all deals'
      ]
    },
    {
      title: 'No Gharar (Uncertainty)',
      description: 'Transparent transactions with clear terms and minimal ambiguity',
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
      details: [
        'Full disclosure of asset details',
        'Clear ownership structure through SPV',
        'Transparent pricing and valuation',
        'Documented terms and conditions'
      ]
    },
    {
      title: 'No Haram Activities',
      description: 'Only invest in Shariah-compliant businesses and assets',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      details: [
        'No alcohol, gambling, or pork',
        'No conventional banking or insurance',
        'No weapons or tobacco',
        'Ethical business practices only'
      ]
    },
    {
      title: 'Asset-Backed',
      description: 'Every investment is backed by a real, tangible asset',
      icon: Building2,
      color: 'from-orange-500 to-red-500',
      details: [
        'Real estate properties',
        'Operating businesses',
        'Tangible luxury assets',
        'Physical commodities and goods'
      ]
    }
  ];

  const shariahBoard = [
    {
      name: 'Dr. Mohammad Al-Qasim',
      role: 'Chief Shariah Advisor',
      credentials: 'PhD Islamic Finance, Al-Azhar University',
      experience: '20+ years in Islamic banking',
      specialization: 'Real estate & business Sukuk',
      icon: Award
    },
    {
      name: 'Sheikh Ahmed Al-Mansoori',
      role: 'Shariah Board Member',
      credentials: 'Scholar, Dubai Islamic Studies Center',
      experience: '15+ years Shariah supervision',
      specialization: 'Asset-based financing structures',
      icon: BookOpen
    },
    {
      name: 'Dr. Fatima Al-Zahra',
      role: 'Shariah Compliance Officer',
      credentials: 'PhD Shariah Law, UAE University',
      experience: '10+ years compliance auditing',
      specialization: 'Fintech & digital asset compliance',
      icon: FileText
    }
  ];

  const complianceStructures = [
    {
      name: 'Musharakah (Partnership)',
      description: 'Joint ownership structure where investors and OWNLY share profits and losses',
      usage: 'Operating businesses, franchises',
      icon: Briefcase,
      color: 'blue',
      features: [
        'Shared ownership and management',
        'Profit and loss distribution by ownership percentage',
        'All parties participate in decision making',
        'Exit through asset sale or buyout'
      ]
    },
    {
      name: 'Ijarah (Leasing)',
      description: 'Islamic leasing where investors own the asset and lease it to tenants',
      usage: 'Real estate properties',
      icon: Home,
      color: 'green',
      features: [
        'Investors own the property directly',
        'Tenant pays rent (not interest)',
        'Maintenance costs borne by owner',
        'Ownership transferred at end of lease'
      ]
    },
    {
      name: 'Murabaha (Cost-Plus Sale)',
      description: 'Asset purchase and sale with transparent markup instead of interest',
      usage: 'Trade finance, commodity trading',
      icon: Package,
      color: 'purple',
      features: [
        'Asset purchased and sold at disclosed profit',
        'Transparent pricing structure',
        'Deferred payment allowed',
        'Ownership transfer at completion'
      ]
    },
    {
      name: 'Mudarabah (Profit Sharing)',
      description: 'Capital provider and entrepreneur share profits from business venture',
      usage: 'Startup investments, venture deals',
      icon: TrendingUp,
      color: 'orange',
      features: [
        'Investor provides capital (Rabb-ul-Mal)',
        'Manager provides expertise (Mudarib)',
        'Profits shared per agreement',
        'Losses borne by capital provider'
      ]
    }
  ];

  const prohibitedActivities = [
    {
      category: 'Riba (Interest)',
      icon: XCircle,
      examples: [
        'Conventional banking',
        'Interest-bearing loans',
        'Bonds with fixed returns',
        'Derivative trading'
      ]
    },
    {
      category: 'Gharar (Excessive Uncertainty)',
      icon: AlertCircle,
      examples: [
        'Speculative trading',
        'Options and futures',
        'Uncertain contracts',
        'Gambling activities'
      ]
    },
    {
      category: 'Haram Sectors',
      icon: Shield,
      examples: [
        'Alcohol production/sales',
        'Pork products',
        'Gambling & casinos',
        'Adult entertainment'
      ]
    },
    {
      category: 'Unethical Business',
      icon: Scale,
      examples: [
        'Weapons manufacturing',
        'Tobacco products',
        'Conventional insurance',
        'Exploitative practices'
      ]
    }
  ];

  const screeningProcess = [
    {
      step: 1,
      title: 'Business Activity Screen',
      description: 'Verify the core business is Shariah-compliant',
      icon: Search,
      checks: [
        'Primary revenue sources',
        'Product/service offerings',
        'Target market and customers',
        'Operating model and practices'
      ]
    },
    {
      step: 2,
      title: 'Financial Ratios Screen',
      description: 'Ensure financial structure meets Shariah standards',
      icon: BarChart3,
      checks: [
        'Debt to assets ratio < 33%',
        'Interest income < 5% of total',
        'Non-compliant income < 5%',
        'Cash/receivables < 50% of assets'
      ]
    },
    {
      step: 3,
      title: 'Legal Structure Review',
      description: 'Validate the SPV structure is Shariah-compliant',
      icon: FileText,
      checks: [
        'Ownership documentation',
        'Contract terms and conditions',
        'Profit/loss sharing mechanism',
        'Exit and dissolution clauses'
      ]
    },
    {
      step: 4,
      title: 'Ongoing Monitoring',
      description: 'Continuous compliance verification throughout investment',
      icon: Eye,
      checks: [
        'Quarterly financial audits',
        'Business activity monitoring',
        'Income source verification',
        'Annual Shariah audit'
      ]
    }
  ];

  const certifications = [
    {
      title: 'AAOIFI Compliant',
      description: 'Following standards of Accounting and Auditing Organization for Islamic Financial Institutions',
      icon: BadgeCheck,
      color: 'blue'
    },
    {
      title: 'Shariah Board Approved',
      description: 'Every deal reviewed and approved by our independent Shariah Advisory Board',
      icon: Award,
      color: 'green'
    },
    {
      title: 'Regular Audits',
      description: 'Quarterly compliance audits by third-party Shariah experts',
      icon: FileText,
      color: 'purple'
    },
    {
      title: 'Fatwa Documented',
      description: 'Written Shariah opinions (Fatwa) for all investment structures',
      icon: BookOpen,
      color: 'orange'
    }
  ];

  const complianceAssets = [
    {
      asset: 'Residential Real Estate',
      compliant: true,
      structure: 'Ijarah',
      reason: 'Tangible asset with rental income'
    },
    {
      asset: 'Commercial Properties',
      compliant: true,
      structure: 'Ijarah',
      reason: 'Asset-backed with lease income'
    },
    {
      asset: 'Halal Franchises',
      compliant: true,
      structure: 'Musharakah',
      reason: 'Compliant business operations'
    },
    {
      asset: 'Luxury Vehicles',
      compliant: true,
      structure: 'Ijarah',
      reason: 'Asset-backed with usage income'
    },
    {
      asset: 'Trade Finance',
      compliant: true,
      structure: 'Murabaha',
      reason: 'Asset purchase & resale'
    },
    {
      asset: 'Tech Startups',
      compliant: 'conditional',
      structure: 'Mudarabah',
      reason: 'Subject to business screening'
    }
  ];

  const faqs = [
    {
      q: 'What makes OWNLY Shariah-compliant?',
      a: 'OWNLY operates under full Shariah supervision with an independent Advisory Board. All deals are structured using Islamic finance principles (Ijarah, Musharakah, Murabaha, Mudarabah), avoiding interest (Riba) and uncertainty (Gharar). Every investment is asset-backed and screened for prohibited activities.'
    },
    {
      q: 'Who oversees Shariah compliance at OWNLY?',
      a: 'We have an independent Shariah Advisory Board comprising qualified Islamic scholars and finance experts with 15-20+ years of experience. They review every deal, approve structures, and conduct regular audits to ensure ongoing compliance.'
    },
    {
      q: 'How do you avoid Riba (interest)?',
      a: 'All investments are structured as profit/loss sharing (Musharakah), leasing (Ijarah), or cost-plus sale (Murabaha) - none involve interest. Returns come from actual asset performance, rental income, or business profits, not predetermined interest rates.'
    },
    {
      q: 'What assets are prohibited?',
      a: 'We do not accept assets related to alcohol, pork, gambling, conventional banking, insurance, weapons, tobacco, or adult entertainment. All businesses must pass ethical and Shariah screening before listing.'
    },
    {
      q: 'How is Gharar (uncertainty) avoided?',
      a: 'Full transparency is maintained through detailed asset documentation, clear SPV ownership structure, disclosed pricing, and comprehensive contracts. All terms are documented and agreed upon before investment, eliminating ambiguity.'
    },
    {
      q: 'Are luxury assets like cars Shariah-compliant?',
      a: 'Yes, when structured properly. Luxury cars are structured as Ijarah (leasing) where investors own the asset and earn from its usage. The asset is tangible, the income source is clear, and no interest is involved.'
    },
    {
      q: 'How do you handle non-compliant income?',
      a: 'If a business has minor non-compliant income (e.g., <5% from interest deposits), it must be purified by donating an equivalent amount to charity. Our Shariah Board calculates this and ensures purification occurs.'
    },
    {
      q: 'Can I get a Fatwa for specific investments?',
      a: 'Yes. Each deal on OWNLY has a written Shariah opinion (Fatwa) from our Advisory Board confirming its compliance. These are available to investors upon request.'
    },
    {
      q: 'What if compliance status changes?',
      a: 'Continuous monitoring ensures ongoing compliance. If a business changes activities or exceeds non-compliant income thresholds, investors are notified immediately. Options include restructuring, income purification, or exit.'
    },
    {
      q: 'Are there different compliance levels?',
      a: 'We only list fully Shariah-compliant assets. However, some assets are "core compliant" (e.g., mosque properties, halal franchises) while others require purification (e.g., businesses with small bank interest income). All details are disclosed.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-semibold">100% Shariah-Compliant Investing</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Islamic Finance Excellence
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Invest with confidence knowing every asset on OWNLY is
              <span className="text-green-400 font-bold"> verified Shariah-compliant</span> and supervised by qualified Islamic scholars.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/deals" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all">
                Browse Halal Deals
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#board" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all">
                <Users className="w-5 h-5" />
                Meet Our Scholars
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'Shariah Board', value: '3 Scholars', icon: Users },
                { label: 'Compliant Deals', value: '100%', icon: BadgeCheck },
                { label: 'AAOIFI Standards', value: 'Certified', icon: Award },
                { label: 'Quarterly Audits', value: 'Regular', icon: FileText }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <stat.icon className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shariah Principles */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Scale className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Shariah Principles</h2>
            <p className="text-xl text-gray-400">The foundations of Islamic finance at OWNLY</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {shariahPrinciples.map((principle, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-green-500/50 transition-all">
                <div className={`bg-gradient-to-r ${principle.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                  <principle.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{principle.title}</h3>
                <p className="text-gray-400 mb-6">{principle.description}</p>

                <div className="space-y-3">
                  {principle.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shariah Board */}
      <div id="board" className="py-20 bg-gradient-to-r from-green-950/30 to-emerald-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Users className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Shariah Advisory Board</h2>
            <p className="text-xl text-gray-400">Qualified Islamic scholars overseeing every investment</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {shariahBoard.map((member, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:border-green-500/50 transition-all">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <member.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-green-400 font-semibold mb-4">{member.role}</p>
                <div className="space-y-3 text-sm text-gray-400 text-left">
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{member.credentials}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>{member.experience}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>{member.specialization}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Board Responsibilities</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Deal Approval', desc: 'Review and approve every investment structure', icon: CheckCircle },
                { title: 'Ongoing Monitoring', desc: 'Quarterly compliance audits and reviews', icon: Eye },
                { title: 'Fatwa Issuance', desc: 'Written Shariah opinions for all structures', icon: FileText }
              ].map((resp, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <resp.icon className="w-8 h-8 text-green-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-1">{resp.title}</h4>
                    <p className="text-sm text-gray-400">{resp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Structures */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Building2 className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Islamic Investment Structures</h2>
            <p className="text-xl text-gray-400">AAOIFI-compliant structures used at OWNLY</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {complianceStructures.map((structure, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`bg-${structure.color}-500/10 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <structure.icon className={`w-7 h-7 text-${structure.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{structure.name}</h3>
                    <p className="text-gray-400 mb-3">{structure.description}</p>
                    <div className={`inline-flex px-3 py-1 bg-${structure.color}-500/20 text-${structure.color}-300 rounded-full text-sm font-semibold`}>
                      {structure.usage}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {structure.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prohibited Activities */}
      <div className="py-20 bg-gradient-to-r from-red-950/30 to-orange-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Prohibited Activities</h2>
            <p className="text-xl text-gray-400">What we do NOT invest in</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {prohibitedActivities.map((category, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <category.icon className="w-10 h-10 text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-4">{category.category}</h3>
                <div className="space-y-2">
                  {category.examples.map((example, eIdx) => (
                    <div key={eIdx} className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-12 h-12 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Zero Tolerance Policy</h3>
                <p className="text-gray-300">
                  OWNLY maintains strict screening standards. Any asset or business involved in prohibited activities
                  is immediately rejected, regardless of potential returns. Our Shariah Board conducts thorough due diligence
                  on every listing to ensure full compliance with Islamic principles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screening Process */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Search className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">4-Step Screening Process</h2>
            <p className="text-xl text-gray-400">How we verify Shariah compliance</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {screeningProcess.map((step, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  <step.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{step.description}</p>

                <div className="space-y-2">
                  {step.checks.map((check, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-300">{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="py-20 bg-gradient-to-r from-blue-950/30 to-indigo-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <BadgeCheck className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Certifications & Audits</h2>
            <p className="text-xl text-gray-400">Verified compliance you can trust</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, idx) => (
              <div key={idx} className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:border-${cert.color}-500/50 transition-all`}>
                <cert.icon className={`w-12 h-12 text-${cert.color}-400 mx-auto mb-4`} />
                <h3 className="text-xl font-bold text-white mb-3">{cert.title}</h3>
                <p className="text-gray-400 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <FileText className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Audit Reports</h3>
              <p className="text-gray-400 mb-6">
                Independent third-party Shariah audits conducted quarterly. All reports are reviewed by our
                Advisory Board and made available to investors.
              </p>
              <Link href="/reports" className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                View Audit Reports
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <BookOpen className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Fatwa Library</h3>
              <p className="text-gray-400 mb-6">
                Access written Shariah opinions (Fatwa) for all investment structures. Each Fatwa details
                the compliance reasoning and approval.
              </p>
              <Link href="/fatwa" className="inline-flex items-center gap-2 text-green-400 font-semibold hover:text-green-300 transition-colors">
                Browse Fatwa Library
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Compliance Table */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Asset Compliance Overview</h2>
            <p className="text-gray-400">Quick reference for different asset types</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Asset Type</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Status</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Structure</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceAssets.map((asset, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 text-white font-medium">{asset.asset}</td>
                      <td className="text-center py-4 px-6">
                        {asset.compliant === true && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            Compliant
                          </span>
                        )}
                        {asset.compliant === 'conditional' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-semibold">
                            <AlertCircle className="w-4 h-4" />
                            Conditional
                          </span>
                        )}
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className="inline-flex px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                          {asset.structure}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-sm">{asset.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-gradient-to-r from-slate-950/50 to-gray-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <HelpCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Shariah Compliance FAQs</h2>
            <p className="text-gray-400">Common questions about Islamic investing on OWNLY</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-green-500/50 transition-all"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="font-bold text-lg text-white pr-4">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 text-green-400 flex-shrink-0 transition-transform ${
                    openFAQ === idx ? 'rotate-180' : ''
                  }`} />
                </button>
                {openFAQ === idx && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-3xl p-12">
            <Heart className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Invest with Peace of Mind</h2>
            <p className="text-xl text-gray-300 mb-8">
              Every OWNLY investment is 100% Shariah-compliant, supervised by qualified scholars,
              and structured according to Islamic finance principles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/deals" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all">
                Browse Halal Deals
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/how-to-invest" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all">
                <Eye className="w-5 h-5" />
                How to Invest
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Questions about Shariah compliance? Contact our scholars at shariah@ownly.ae
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
