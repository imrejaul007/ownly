'use client';

import Link from 'next/link';
import {
  TrendingUp, Shield, Users, Globe, CheckCircle, Target, ArrowRight,
  Building2, Car, Anchor, Package, Store, Home, Sparkles, DollarSign,
  Award, BarChart3, Zap, Lock, Eye, Briefcase, PieChart, LineChart,
  TrendingDown, Percent, ArrowUpRight, Clock, Star, AlertCircle,
  UserCircle, Code, Network, FileCheck, Calendar, TrendingUpDown,
  MessageSquare, Handshake, BadgeCheck, Scale, Server, Database,
  Smartphone, Coins, Receipt, XCircle
} from 'lucide-react';

const keyMetrics = [
  { label: 'AUM Target (Year 3)', value: 'AED 250M', growth: '+1150%', icon: TrendingUp },
  { label: 'Revenue (Year 3)', value: 'AED 40M', growth: '+900%', icon: DollarSign },
  { label: 'Gross Margin', value: '68%', growth: 'Industry Leading', icon: Percent },
  { label: 'Target Investors', value: '200K+', growth: 'By 2028', icon: Users }
];

const investmentHighlights = [
  {
    title: 'Massive TAM',
    description: '$16T RWA market by 2030',
    detail: '400M+ underserved retail investors across Asia & GCC',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Proven Traction',
    description: '14 Live Assets, AED 10M+ Deployed',
    detail: '500+ early investors, 50% MoM growth',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Legal Moat',
    description: '7-Layer SPV Trust Architecture',
    detail: 'Only platform with full SPV-based fractional ownership',
    icon: Shield,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Viral Distribution',
    description: '10K+ RM Network',
    detail: 'Low CAC (AED 80-120), High LTV (AED 2000+)',
    icon: Zap,
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'Asset-Light Model',
    description: 'Platform Revenue, Not Asset Risk',
    detail: 'Setup fees, management fees, exit fees - recurring revenue',
    icon: Lock,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'First-Mover Advantage',
    description: 'No Direct Competitor',
    detail: 'Only fractional franchise + alternative asset platform',
    icon: Award,
    color: 'from-indigo-500 to-purple-500'
  }
];

const financialProjections = [
  { year: 'Year 1', aum: 20, revenue: 4, investors: 10, margin: 62 },
  { year: 'Year 2', aum: 80, revenue: 15, investors: 50, margin: 65 },
  { year: 'Year 3', aum: 250, revenue: 40, investors: 200, margin: 68 }
];

const unitEconomics = [
  { metric: 'Average Investment', value: 'AED 5,000', trend: 'up' },
  { metric: 'Customer Acquisition Cost', value: 'AED 100', trend: 'down' },
  { metric: 'Lifetime Value', value: 'AED 2,000', trend: 'up' },
  { metric: 'LTV/CAC Ratio', value: '20x', trend: 'up' },
  { metric: 'Payback Period', value: '2 months', trend: 'down' },
  { metric: 'Gross Margin', value: '68%', trend: 'up' }
];

const revenueBreakdown = [
  { stream: 'SPV Setup Fees', percentage: 30, amount: 'AED 12M' },
  { stream: 'Monthly Management Fees', percentage: 45, amount: 'AED 18M' },
  { stream: 'Exit Success Fees', percentage: 15, amount: 'AED 6M' },
  { stream: 'Platform Subscriptions', percentage: 7, amount: 'AED 2.8M' },
  { stream: 'Listing Fees', percentage: 3, amount: 'AED 1.2M' }
];

const competitiveAnalysis = [
  { feature: 'Fractional Ownership', ownly: true, competitor1: false, competitor2: true, competitor3: false },
  { feature: 'Franchise Assets', ownly: true, competitor1: false, competitor2: false, competitor3: false },
  { feature: 'SPV Legal Structure', ownly: true, competitor1: false, competitor2: true, competitor3: false },
  { feature: 'Alternative Assets', ownly: true, competitor1: false, competitor2: false, competitor3: false },
  { feature: 'Monthly Passive Income', ownly: true, competitor1: false, competitor2: true, competitor3: false },
  { feature: 'AED 500 Minimum', ownly: true, competitor1: false, competitor2: false, competitor3: true },
  { feature: 'RM Distribution Network', ownly: true, competitor1: false, competitor2: false, competitor3: false },
  { feature: 'Secondary Market', ownly: true, competitor1: false, competitor2: true, competitor3: true }
];

const useOfFunds = [
  { category: 'Product & Tech', percentage: 30, amount: 'AED 150K', items: ['MVP Platform', 'Mobile Apps', 'Infrastructure'] },
  { category: 'Legal & Compliance', percentage: 20, amount: 'AED 100K', items: ['SPV Setup', 'Licenses', 'Legal Team'] },
  { category: 'Sales & Marketing', percentage: 25, amount: 'AED 125K', items: ['RM Onboarding', 'Brand Building', 'Content'] },
  { category: 'Operations & Team', percentage: 20, amount: 'AED 100K', items: ['Core Team', 'Office', 'Operations'] },
  { category: 'Buffer & Working Capital', percentage: 5, amount: 'AED 25K', items: ['Contingency', 'Cash Reserve'] }
];

const milestones = [
  { quarter: 'Q1 2025', milestone: 'MVP Launch + 50 SPVs', metric: 'AED 20M AUM', status: 'in-progress' },
  { quarter: 'Q2 2025', milestone: '10K Users + 100 SPVs', metric: 'AED 50M AUM', status: 'planned' },
  { quarter: 'Q3 2025', milestone: 'Mobile App + Secondary Market', metric: 'AED 100M AUM', status: 'planned' },
  { quarter: 'Q4 2025', milestone: 'Break Even + 300 SPVs', metric: 'AED 150M AUM', status: 'planned' }
];

const teamMembers = [
  {
    name: 'Rejaul Karim',
    role: 'Founder & CEO',
    background: '8+ years in fintech & asset management',
    expertise: 'Product Strategy, Fundraising, Business Development',
    linkedin: '#',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Advisory Board',
    role: 'Legal & Compliance Advisor',
    background: 'Ex-Partner at leading UAE law firm',
    expertise: 'SPV structuring, DFSA/SCA regulations',
    linkedin: '#',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Key Hire (Q1 2025)',
    role: 'CTO',
    background: 'Ex-Senior Engineer at fintech unicorn',
    expertise: 'Platform architecture, blockchain integration',
    linkedin: '#',
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Key Hire (Q2 2025)',
    role: 'Head of Operations',
    background: 'Ex-VP Operations at real estate platform',
    expertise: 'Asset onboarding, investor relations',
    linkedin: '#',
    color: 'from-orange-500 to-red-500'
  }
];

const risks = [
  {
    risk: 'Regulatory Changes',
    level: 'Medium',
    mitigation: 'Proactive engagement with DFSA/SCA, flexible SPV structure, legal compliance buffer in budget',
    icon: Scale
  },
  {
    risk: 'Market Competition',
    level: 'Medium',
    mitigation: 'First-mover advantage, unique asset classes (franchises), 7-layer legal moat, RM network exclusivity',
    icon: Users
  },
  {
    risk: 'Asset Performance',
    level: 'Low',
    mitigation: 'Diversified portfolio, rigorous due diligence, asset-light model (platform fees, not asset risk)',
    icon: TrendingDown
  },
  {
    risk: 'Technology Scaling',
    level: 'Low',
    mitigation: 'Cloud-native architecture, experienced CTO hire, phased rollout approach',
    icon: Server
  }
];

const partnerships = [
  { partner: 'Leading UAE Law Firm', type: 'Legal', status: 'Active', detail: 'SPV structuring & regulatory compliance' },
  { partner: 'Big 4 Accounting Firm', type: 'Audit', status: 'Active', detail: 'Financial audits & tax advisory' },
  { partner: 'Licensed Custodian', type: 'Asset Custody', status: 'In Discussion', detail: 'Secure asset holding & management' },
  { partner: 'UAE Bank', type: 'Banking', status: 'In Discussion', detail: 'Investor fund management & disbursement' },
  { partner: 'KYC/AML Provider', type: 'Compliance', status: 'Active', detail: 'Identity verification & compliance checks' },
  { partner: 'Cloud Infrastructure', type: 'Technology', status: 'Active', detail: 'AWS/Azure enterprise partnership' }
];

const testimonials = [
  {
    name: 'Ahmed Al-Mansoori',
    role: 'HNI Investor',
    investment: 'AED 50K across 5 SPVs',
    quote: 'Finally, a platform that lets me invest in franchises I actually use. Monthly returns are consistent, and the SPV structure gives me real ownership peace of mind.',
    avatar: 'AM',
    rating: 5
  },
  {
    name: 'Fatima Al-Hashimi',
    role: 'Professional Investor',
    investment: 'AED 30K in Real Estate SPVs',
    quote: 'The transparency is incredible. I can see exactly which property I own fractions of, and the rental income flows monthly like clockwork. This is the future of retail investing.',
    avatar: 'FH',
    rating: 5
  },
  {
    name: 'Priya Sharma',
    role: 'Expat Investor',
    investment: 'AED 10K Starter Portfolio',
    quote: 'As an expat, I always wanted to invest in Dubai real estate but couldn\'t afford full properties. OWNLY made it possible with just AED 5,000. Already earned 12% returns.',
    avatar: 'PS',
    rating: 5
  }
];

const techStack = [
  { area: 'Frontend', tech: 'Next.js 14, React, TypeScript, Tailwind CSS', icon: Smartphone },
  { area: 'Backend', tech: 'Node.js, Express, PostgreSQL, Redis', icon: Server },
  { area: 'Blockchain', tech: 'Ethereum/Polygon for tokenization (Phase 2)', icon: Database },
  { area: 'Infrastructure', tech: 'AWS/Azure, Kubernetes, CI/CD pipelines', icon: Network },
  { area: 'Security', tech: 'SOC 2 compliant, end-to-end encryption, MFA', icon: Lock },
  { area: 'Compliance', tech: 'KYC/AML automation, audit trails, regulatory reporting', icon: FileCheck }
];

const whyNowReasons = [
  {
    reason: 'RWA Tokenization Explosion',
    detail: 'Market growing from $2B (2023) to $16T (2030) - 45% CAGR',
    metric: '45% CAGR',
    icon: TrendingUp,
    color: 'blue'
  },
  {
    reason: 'Retail Investor Sophistication',
    detail: 'Post-pandemic wealth democratization, crypto natives seeking real assets',
    metric: '400M+ TAM',
    icon: Users,
    color: 'purple'
  },
  {
    reason: 'UAE Regulatory Clarity',
    detail: 'DFSA/SCA frameworks for digital assets now mature and investor-friendly',
    metric: 'Clear Framework',
    icon: BadgeCheck,
    color: 'green'
  },
  {
    reason: 'Zero Interest Rate Era Ending',
    detail: 'Investors seeking yield alternatives beyond traditional savings',
    metric: '12-25% Yields',
    icon: Percent,
    color: 'orange'
  }
];

const capTable = [
  { stakeholder: 'Rejaul Karim (Founder)', ownership: 90, shares: '900,000', note: 'Pre-investment' },
  { stakeholder: 'This Round (New Investors)', ownership: 10, shares: '100,000', note: 'AED 500K' },
  { stakeholder: 'ESOP Pool (Reserved)', ownership: 0, shares: '150,000', note: 'Future allocation' }
];

const burnRunway = {
  monthlyBurn: 35000,
  currentCash: 50000,
  postFundingCash: 550000,
  currentRunway: 1.5,
  postFundingRunway: 16,
  breakEvenMonth: 14
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Executive Summary - Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-semibold">Series Seed Investment Opportunity</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
              OWNLY
            </h1>
            <p className="text-3xl md:text-4xl text-gray-300 font-semibold mb-4">
              The BlackRock for Retail Investors
            </p>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Democratizing access to institutional-grade real-world assets through SPV-based fractional ownership
            </p>

            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Seeking</p>
                <p className="text-2xl font-bold text-white">AED 500K</p>
              </div>
              <div className="h-8 w-px bg-gray-700"></div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Valuation</p>
                <p className="text-2xl font-bold text-white">AED 5M</p>
              </div>
              <div className="h-8 w-px bg-gray-700"></div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Equity</p>
                <p className="text-2xl font-bold text-white">10%</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-xl">Rejaul Karim</p>
                  <p className="text-gray-400">Founder & CEO</p>
                  <p className="text-sm text-blue-400">Platform Under Development • Dubai, UAE</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keyMetrics.map((metric, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <metric.icon className="w-8 h-8 text-blue-400 mb-3" />
                <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                <p className="text-xs text-green-400">{metric.growth}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Highlights */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Investment Highlights</h2>
            <p className="text-xl text-gray-400">Why OWNLY is a compelling investment opportunity</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentHighlights.map((highlight, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition-all group">
                <div className={`bg-gradient-to-r ${highlight.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <highlight.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{highlight.title}</h3>
                <p className="text-blue-400 font-semibold mb-3">{highlight.description}</p>
                <p className="text-gray-400 text-sm">{highlight.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-950/30 to-blue-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">The Team</h2>
            <p className="text-xl text-gray-400">Domain expertise meets execution excellence</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
                <div className="flex items-start gap-6">
                  <div className={`bg-gradient-to-r ${member.color} w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <UserCircle className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-blue-400 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-400 text-sm mb-2">{member.background}</p>
                    <p className="text-gray-500 text-xs italic">{member.expertise}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Why This Team Wins</h3>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Combining fintech execution, legal/regulatory expertise, and operational excellence.
              Founder brings 8+ years in asset management, backed by advisors with deep UAE regulatory knowledge and upcoming key hires from unicorn companies.
            </p>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-950/30 to-purple-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Massive Market Opportunity</h2>
            <p className="text-xl text-gray-400">$16 Trillion RWA market by 2030</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <Globe className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">400M+</h3>
              <p className="text-gray-400 mb-4">Underserved retail investors across Asia & GCC</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">UAE Expats</span>
                  <span className="text-white font-semibold">3.5M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">India (LRS)</span>
                  <span className="text-white font-semibold">50M+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SEA + GCC</span>
                  <span className="text-white font-semibold">350M+</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <DollarSign className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">$350B+</h3>
              <p className="text-gray-400 mb-4">Available capital seeking yield</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">UAE TAM</span>
                  <span className="text-white font-semibold">AED 100B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">India LRS</span>
                  <span className="text-white font-semibold">$250B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GCC Expats</span>
                  <span className="text-white font-semibold">AED 80B</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">$16T</h3>
              <p className="text-gray-400 mb-4">RWA tokenization market by 2030</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">CAGR</span>
                  <span className="text-white font-semibold">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Our TAM</span>
                  <span className="text-white font-semibold">$500B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Target Share</span>
                  <span className="text-white font-semibold">0.1%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
            <p className="text-2xl text-white font-bold mb-2">
              Even 0.01% market share = AED 100M+ AUM
            </p>
            <p className="text-gray-400">Capturing just a fraction of the market creates a unicorn</p>
          </div>
        </div>
      </section>

      {/* Why Now */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Why Now?</h2>
            <p className="text-xl text-gray-400">Perfect storm of market conditions for explosive growth</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyNowReasons.map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:scale-105 transition-all">
                <div className={`bg-${item.color}-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                  <item.icon className={`w-8 h-8 text-${item.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.reason}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.detail}</p>
                <div className={`inline-flex px-3 py-1 bg-${item.color}-500/20 text-${item.color}-300 rounded-full text-sm font-semibold`}>
                  {item.metric}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-12 h-12 text-green-400" />
              <div>
                <h3 className="text-2xl font-bold text-white">The Window is NOW</h3>
                <p className="text-gray-300">First-mover advantage in RWA democratization</p>
              </div>
            </div>
            <p className="text-gray-400">
              The convergence of regulatory clarity, technological maturity, and investor appetite creates a once-in-a-decade opportunity.
              Traditional finance is waking up to RWAs - but retail platforms like OWNLY are still scarce. The next 18-24 months will define market leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Financial Projections */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Financial Projections</h2>
            <p className="text-xl text-gray-400">3-Year path to AED 40M+ revenue</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Metric</th>
                    {financialProjections.map((proj, idx) => (
                      <th key={idx} className="text-center py-4 px-6 text-sm font-semibold text-gray-400">{proj.year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-white font-semibold">AUM</td>
                    {financialProjections.map((proj, idx) => (
                      <td key={idx} className="text-center py-4 px-6 text-green-400 font-bold">AED {proj.aum}M</td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-white font-semibold">Revenue</td>
                    {financialProjections.map((proj, idx) => (
                      <td key={idx} className="text-center py-4 px-6 text-blue-400 font-bold">AED {proj.revenue}M</td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-white font-semibold">Investors</td>
                    {financialProjections.map((proj, idx) => (
                      <td key={idx} className="text-center py-4 px-6 text-purple-400 font-bold">{proj.investors}K</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-white font-semibold">Gross Margin</td>
                    {financialProjections.map((proj, idx) => (
                      <td key={idx} className="text-center py-4 px-6 text-yellow-400 font-bold">{proj.margin}%</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Revenue Breakdown (Year 3)</h3>
              <div className="space-y-4">
                {revenueBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">{item.stream}</span>
                      <span className="text-white font-semibold">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-green-400 mt-1">{item.amount}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Key Growth Drivers</h3>
              <div className="space-y-4">
                {[
                  { driver: 'SPVs Launched', y1: '100', y3: '700', growth: '600%' },
                  { driver: 'Active RMs', y1: '5K', y3: '50K', growth: '900%' },
                  { driver: 'Avg Investment', y1: 'AED 3K', y3: 'AED 7K', growth: '133%' },
                  { driver: 'Platform Fee', y1: '8%', y3: '12%', growth: '50%' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">{item.driver}</p>
                      <p className="text-sm text-gray-400">Y1: {item.y1} → Y3: {item.y3}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-bold">{item.growth}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unit Economics */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-950/30 to-emerald-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Unit Economics</h2>
            <p className="text-xl text-gray-400">Industry-leading LTV/CAC ratio of 20x</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {unitEconomics.map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">{item.metric}</p>
                  {item.trend === 'up' ? (
                    <ArrowUpRight className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-green-400" />
                  )}
                </div>
                <p className="text-3xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Per-Investor Economics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Average Investment</span>
                  <span className="text-white font-bold text-xl">AED 5,000</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">OWNLY Take Rate (8%)</span>
                  <span className="text-green-400 font-bold text-xl">AED 400</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Reinvestments (3x lifetime)</span>
                  <span className="text-blue-400 font-bold text-xl">AED 1,200</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg">
                  <span className="text-white font-semibold">Total LTV</span>
                  <span className="text-green-400 font-bold text-2xl">AED 2,000</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Per-SPV Economics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Avg SPV Size</span>
                  <span className="text-white font-bold text-xl">AED 300K</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Setup Fee (7%)</span>
                  <span className="text-green-400 font-bold text-xl">AED 21K</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Annual Management (10%)</span>
                  <span className="text-blue-400 font-bold text-xl">AED 54K/yr</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
                  <span className="text-white font-semibold">Total Revenue (3yr)</span>
                  <span className="text-blue-400 font-bold text-2xl">AED 183K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & IP */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Technology & IP</h2>
            <p className="text-xl text-gray-400">Enterprise-grade platform with proprietary SPV automation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {techStack.map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.area}</h3>
                    <p className="text-gray-400 text-sm">{item.tech}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8">
              <Code className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Proprietary IP</h3>
              <ul className="space-y-3">
                {[
                  'SPV auto-creation & legal doc generation engine',
                  'Asset tokenization framework (blockchain-ready)',
                  'Investor KYC/AML automation system',
                  'Real-time portfolio analytics dashboard'
                ].map((ip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{ip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-8">
              <Lock className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Security & Compliance</h3>
              <ul className="space-y-3">
                {[
                  'SOC 2 Type II compliance roadmap',
                  'Bank-grade encryption (AES-256)',
                  'Multi-factor authentication (MFA)',
                  'Automated regulatory reporting'
                ].map((sec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{sec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Go-to-Market Strategy */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-950/30 to-red-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Go-to-Market Strategy</h2>
            <p className="text-xl text-gray-400">Viral distribution through 10K+ RM network</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <Network className="w-12 h-12 text-orange-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Relationship Managers</h3>
              <p className="text-gray-400 mb-4">Our secret weapon for investor acquisition</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Active RMs</span>
                  <span className="text-white font-bold">50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pipeline (Onboarding)</span>
                  <span className="text-white font-bold">200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Y1 Target</span>
                  <span className="text-green-400 font-bold">5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Y3 Target</span>
                  <span className="text-green-400 font-bold">50,000</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <Coins className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">RM Economics</h3>
              <p className="text-gray-400 mb-4">Industry-leading commission structure</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Setup Fee Commission</span>
                  <span className="text-green-400 font-bold">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recurring Revenue Share</span>
                  <span className="text-green-400 font-bold">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg RM Earnings (Y1)</span>
                  <span className="text-white font-bold">AED 50K/yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Top Performer Earnings</span>
                  <span className="text-white font-bold">AED 200K+/yr</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <Receipt className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">RM Recruitment</h3>
              <p className="text-gray-400 mb-4">Multi-channel RM acquisition</p>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-white font-semibold">Insurance Agents</span>
                  <p className="text-gray-400 text-xs">Existing network of 100K+ in UAE</p>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-white font-semibold">Real Estate Brokers</span>
                  <p className="text-gray-400 text-xs">Property-savvy sales professionals</p>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-white font-semibold">Financial Advisors</span>
                  <p className="text-gray-400 text-xs">High-net-worth client relationships</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Why RMs Love OWNLY</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Zap className="w-8 h-8 text-yellow-400 mb-2" />
                <p className="text-white font-semibold mb-1">Recurring Income</p>
                <p className="text-gray-400 text-sm">Earn every month investor stays active</p>
              </div>
              <div>
                <Target className="w-8 h-8 text-green-400 mb-2" />
                <p className="text-white font-semibold mb-1">Easy to Sell</p>
                <p className="text-gray-400 text-sm">Real assets investors understand</p>
              </div>
              <div>
                <Handshake className="w-8 h-8 text-blue-400 mb-2" />
                <p className="text-white font-semibold mb-1">Full Support</p>
                <p className="text-gray-400 text-sm">Training, materials, sales assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Analysis */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Competitive Landscape</h2>
            <p className="text-xl text-gray-400">Clear differentiation in a growing market</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Feature</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-blue-400">OWNLY</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">RE Crowdfund</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Stock Trading</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-400">Crypto RWA</th>
                  </tr>
                </thead>
                <tbody>
                  {competitiveAnalysis.map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="py-4 px-6 text-white font-medium">{row.feature}</td>
                      <td className="text-center py-4 px-6">
                        {row.ownly ? (
                          <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-700 mx-auto"></div>
                        )}
                      </td>
                      <td className="text-center py-4 px-6">
                        {row.competitor1 ? (
                          <CheckCircle className="w-6 h-6 text-gray-600 mx-auto" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-800 mx-auto"></div>
                        )}
                      </td>
                      <td className="text-center py-4 px-6">
                        {row.competitor2 ? (
                          <CheckCircle className="w-6 h-6 text-gray-600 mx-auto" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-800 mx-auto"></div>
                        )}
                      </td>
                      <td className="text-center py-4 px-6">
                        {row.competitor3 ? (
                          <CheckCircle className="w-6 h-6 text-gray-600 mx-auto" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-800 mx-auto"></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6">
              <Award className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Only Platform</h3>
              <p className="text-gray-400">Offering fractional franchise + alternative asset ownership</p>
            </div>
            <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-6">
              <Shield className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Legal Moat</h3>
              <p className="text-gray-400">7-layer SPV trust architecture competitors can't replicate</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-6">
              <Users className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Distribution Edge</h3>
              <p className="text-gray-400">10K+ RM network no one else has access to</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Validation */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-950/30 to-cyan-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Customer Validation</h2>
            <p className="text-xl text-gray-400">Real investors, real returns, real testimonials</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm italic mb-4">&quot;{testimonial.quote}&quot;</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500">Invested: {testimonial.investment}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <MessageSquare className="w-10 h-10 text-teal-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">4.8/5</p>
                <p className="text-sm text-gray-400">User Rating</p>
              </div>
              <div>
                <TrendingUp className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">85%</p>
                <p className="text-sm text-gray-400">Reinvestment Rate</p>
              </div>
              <div>
                <Users className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">60%</p>
                <p className="text-sm text-gray-400">Referral Rate</p>
              </div>
              <div>
                <Award className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">92%</p>
                <p className="text-sm text-gray-400">Would Recommend</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use of Funds */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-950/30 to-pink-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Use of Funds</h2>
            <p className="text-xl text-gray-400">Strategic allocation of AED 500K investment</p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 mb-12">
            {useOfFunds.map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-white mb-2">{item.percentage}%</div>
                <div className="text-2xl font-bold text-blue-400 mb-3">{item.amount}</div>
                <h3 className="text-sm font-semibold text-white mb-3">{item.category}</h3>
                <ul className="space-y-1">
                  {item.items.map((subItem, subIdx) => (
                    <li key={subIdx} className="text-xs text-gray-400">{subItem}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">12-Month Milestones</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400 font-semibold">{milestone.quarter}</span>
                    </div>
                    <h4 className="text-white font-semibold mb-2">{milestone.milestone}</h4>
                    <p className="text-green-400 text-sm font-bold">{milestone.metric}</p>
                    <div className="mt-3">
                      {milestone.status === 'in-progress' && (
                        <span className="inline-flex px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                          In Progress
                        </span>
                      )}
                      {milestone.status === 'planned' && (
                        <span className="inline-flex px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                          Planned
                        </span>
                      )}
                    </div>
                  </div>
                  {idx < milestones.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Burn Rate & Runway */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Burn Rate & Runway</h2>
            <p className="text-xl text-gray-400">Path to profitability with 16-month runway</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Current Situation</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Monthly Burn Rate</span>
                  <span className="text-red-400 font-bold text-xl">AED {burnRunway.monthlyBurn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Current Cash</span>
                  <span className="text-yellow-400 font-bold text-xl">AED {burnRunway.currentCash.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <span className="text-white font-semibold">Current Runway</span>
                  <span className="text-red-300 font-bold text-xl">{burnRunway.currentRunway} months</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">After This Round</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Monthly Burn Rate</span>
                  <span className="text-orange-400 font-bold text-xl">AED {burnRunway.monthlyBurn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Post-Funding Cash</span>
                  <span className="text-green-400 font-bold text-xl">AED {burnRunway.postFundingCash.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <span className="text-white font-semibold">New Runway</span>
                  <span className="text-green-300 font-bold text-xl">{burnRunway.postFundingRunway} months</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-6">
              <TrendingUpDown className="w-16 h-16 text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">Path to Break-Even</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Break-Even Target</p>
                    <p className="text-3xl font-bold text-white">Month {burnRunway.breakEvenMonth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Required AUM</p>
                    <p className="text-3xl font-bold text-green-400">AED 120M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Buffer After Break-Even</p>
                    <p className="text-3xl font-bold text-blue-400">2 months</p>
                  </div>
                </div>
                <p className="text-gray-400 mt-4">
                  Conservative projections give us 16-month runway to reach break-even at month 14, with 2-month safety buffer.
                  Based on current 50% MoM growth rate, we expect to achieve break-even 2 months ahead of schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traction */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Proven Traction</h2>
            <p className="text-xl text-gray-400">14 live assets, AED 10M+ deployed, 50% MoM growth</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Live SPVs', value: '14', icon: Building2, color: 'blue' },
              { label: 'Capital Deployed', value: 'AED 10M+', icon: DollarSign, color: 'green' },
              { label: 'Early Investors', value: '500+', icon: Users, color: 'purple' },
              { label: 'MoM Growth', value: '50%', icon: TrendingUp, color: 'orange' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:scale-105 transition-transform">
                <stat.icon className={`w-12 h-12 text-${stat.color}-400 mx-auto mb-4`} />
                <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-12 text-center">
            <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Product-Market Fit Validated</h3>
            <p className="text-xl text-gray-300 mb-6">
              Pre-revenue validation with 500+ early adopters and 14 live assets
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div>
                <p className="text-3xl font-bold text-green-400 mb-1">85%</p>
                <p className="text-sm text-gray-400">Reinvestment Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-400 mb-1">4.8/5</p>
                <p className="text-sm text-gray-400">User Satisfaction</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-400 mb-1">60%</p>
                <p className="text-sm text-gray-400">Referral Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory & Compliance */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-950/30 to-violet-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Regulatory & Compliance</h2>
            <p className="text-xl text-gray-400">Fully compliant with UAE financial regulations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <Scale className="w-12 h-12 text-indigo-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-6">Regulatory Status</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-semibold">Operating License</p>
                    <p className="text-gray-400 text-sm">Dubai mainland company registration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-semibold">SPV Framework</p>
                    <p className="text-gray-400 text-sm">Legal entity structure approved by advisors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-semibold">DFSA/SCA Consultation</p>
                    <p className="text-gray-400 text-sm">In active dialogue for full licensing (Q2 2025)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-semibold">KYC/AML Compliance</p>
                    <p className="text-gray-400 text-sm">Automated verification with licensed provider</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <FileCheck className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-6">Legal Structure</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white font-semibold mb-2">Platform Entity</p>
                  <p className="text-gray-400 text-sm">OWNLY Technologies FZ-LLC (Dubai)</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white font-semibold mb-2">SPV Structure</p>
                  <p className="text-gray-400 text-sm">Each asset held in dedicated SPV entity</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white font-semibold mb-2">Investor Protection</p>
                  <p className="text-gray-400 text-sm">7-layer trust architecture with legal moat</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white font-semibold mb-2">Securities Classification</p>
                  <p className="text-gray-400 text-sm">Operating under private placement exemptions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-8 text-center">
            <BadgeCheck className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Regulatory Roadmap Clear</h3>
            <p className="text-gray-300 max-w-3xl mx-auto">
              We operate in full compliance with current UAE regulations and are proactively engaging with DFSA/SCA for formal licensing as the regulatory framework for digital assets matures. Our legal advisors confirm our SPV model is compliant with private investment regulations.
            </p>
          </div>
        </div>
      </section>

      {/* Strategic Partnerships */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Strategic Partnerships</h2>
            <p className="text-xl text-gray-400">Industry-leading partners for legal, compliance, and operations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerships.map((partnership, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <Handshake className="w-10 h-10 text-blue-400" />
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    partnership.status === 'Active'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {partnership.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{partnership.partner}</h3>
                <p className="text-sm text-blue-400 mb-3">{partnership.type}</p>
                <p className="text-xs text-gray-400">{partnership.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cap Table */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-950/50 to-gray-950/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Cap Table</h2>
            <p className="text-xl text-gray-400">Clean and simple ownership structure</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Stakeholder</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Ownership %</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Shares</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Note</th>
                </tr>
              </thead>
              <tbody>
                {capTable.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5">
                    <td className="py-4 px-6 text-white font-semibold">{row.stakeholder}</td>
                    <td className="text-right py-4 px-6">
                      <span className={`font-bold ${row.ownership > 0 ? 'text-blue-400' : 'text-gray-500'}`}>
                        {row.ownership}%
                      </span>
                    </td>
                    <td className="text-right py-4 px-6 text-gray-400">{row.shares}</td>
                    <td className="text-right py-4 px-6 text-gray-500 text-sm">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-400 mb-2">Total Outstanding</p>
              <p className="text-3xl font-bold text-white">1,000,000</p>
              <p className="text-xs text-gray-500 mt-1">Fully diluted shares</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-400 mb-2">ESOP Reserved</p>
              <p className="text-3xl font-bold text-purple-400">15%</p>
              <p className="text-xs text-gray-500 mt-1">For key hires</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-400 mb-2">Price Per Share</p>
              <p className="text-3xl font-bold text-green-400">AED 5.00</p>
              <p className="text-xs text-gray-500 mt-1">This round</p>
            </div>
          </div>
        </div>
      </section>

      {/* Risks & Mitigation */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Risks & Mitigation</h2>
            <p className="text-xl text-gray-400">Transparency on challenges and how we address them</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {risks.map((risk, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <risk.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{risk.risk}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        risk.level === 'Low'
                          ? 'bg-green-500/20 text-green-300'
                          : risk.level === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {risk.level} Risk
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pl-16">
                  <p className="text-sm font-semibold text-blue-400 mb-2">Mitigation Strategy:</p>
                  <p className="text-gray-400 text-sm">{risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-6">
              <Shield className="w-16 h-16 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Risk-Aware Execution</h3>
                <p className="text-gray-300">
                  We proactively identify and mitigate risks through our asset-light business model (platform fees, not asset ownership),
                  robust legal frameworks, diversified revenue streams, and strong governance. Our experienced advisors help us navigate
                  regulatory evolution, and our first-mover advantage gives us time to build defensible moats before competition intensifies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Terms */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-950/30 to-indigo-950/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-4">Investment Terms</h2>
            <p className="text-xl text-gray-400">Join us in building the future of retail investing</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Round Size</p>
                  <p className="text-3xl font-bold text-white">AED 500,000</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pre-Money Valuation</p>
                  <p className="text-3xl font-bold text-white">AED 4.5M</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Post-Money Valuation</p>
                  <p className="text-3xl font-bold text-white">AED 5.0M</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Equity Offered</p>
                  <p className="text-3xl font-bold text-blue-400">10%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Instrument</p>
                  <p className="text-3xl font-bold text-white">SAFE / Equity</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Minimum Ticket</p>
                  <p className="text-3xl font-bold text-white">AED 100K</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">Investor Rights & Protections</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Information rights (quarterly updates)',
                  'Pro-rata rights in future rounds',
                  'Board observer seat (>AED 200K)',
                  'Anti-dilution protection',
                  'Liquidation preference (1x)',
                  'Standard drag-along/tag-along rights'
                ].map((right, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{right}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Expected Exit Scenarios</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-lg text-purple-100 mb-2">Strategic Acquisition</p>
                <p className="text-3xl font-bold text-white">5-7x</p>
                <p className="text-sm text-purple-200">Year 4-5</p>
              </div>
              <div>
                <p className="text-lg text-purple-100 mb-2">PE Buyout</p>
                <p className="text-3xl font-bold text-white">8-12x</p>
                <p className="text-sm text-purple-200">Year 5-6</p>
              </div>
              <div>
                <p className="text-lg text-purple-100 mb-2">IPO/RWA Exchange</p>
                <p className="text-3xl font-bold text-white">15x+</p>
                <p className="text-sm text-purple-200">Year 6-7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold text-white mb-6">Let's Build the Future Together</h2>
          <p className="text-2xl text-gray-300 mb-8">
            Join us in democratizing access to real-world assets for 400M+ retail investors
          </p>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
            <p className="text-gray-400 mb-4">For investor inquiries and pitch deck:</p>
            <p className="text-2xl text-white font-bold mb-2">founder@ownly.ae</p>
            <p className="text-blue-400">Rejaul Karim • Founder & CEO</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/deals"
              className="bg-white text-gray-900 px-12 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
            >
              View Live Assets
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all border-2 border-white/20"
            >
              Join as Early Investor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
