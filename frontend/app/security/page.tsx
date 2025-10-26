'use client';

import Link from 'next/link';
import {
  Shield, Lock, FileCheck, Award, Eye, AlertTriangle, CheckCircle, Server, Key,
  ShieldCheck, BadgeCheck, Zap, Radio, Database, ShieldAlert, FileText, Users,
  Clock, Target, TrendingUp, DollarSign, CreditCard
} from 'lucide-react';

const securityMeasures = [
  {
    icon: Lock,
    title: '256-bit SSL Encryption',
    description: 'Bank-level encryption protects all data transmitted between your browser and our servers. Your personal and financial information is encrypted both in transit and at rest.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Key,
    title: 'Two-Factor Authentication',
    description: 'Optional 2FA adds an extra layer of security to your account. Use authenticator apps or SMS verification to ensure only you can access your investments.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Server,
    title: 'Secure Infrastructure',
    description: 'Enterprise-grade cloud infrastructure with automatic backups, redundancy, and 99.9% uptime. Our servers are monitored 24/7 for suspicious activity.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Eye,
    title: 'Regular Security Audits',
    description: 'Third-party security firms conduct quarterly penetration testing and vulnerability assessments. We maintain SOC 2 Type II compliance.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: ShieldCheck,
    title: 'Fraud Detection',
    description: 'Advanced AI-powered systems monitor transactions in real-time, detecting and preventing fraudulent activity before it affects your account.',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    icon: FileCheck,
    title: 'KYC/AML Compliance',
    description: 'Rigorous identity verification processes comply with Know Your Customer and Anti-Money Laundering regulations, protecting all investors.',
    color: 'from-indigo-500 to-purple-500'
  }
];

const insuranceCoverage = [
  {
    type: 'Property Insurance',
    coverage: 'Up to AED 18M per property',
    description: 'Comprehensive coverage for physical damage including fire, natural disasters, vandalism, and other perils.',
    details: [
      'Replacement cost coverage',
      'Loss of rental income protection',
      'Liability coverage included',
      'Annual policy reviews'
    ],
    icon: Shield,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    type: 'Cyber Insurance',
    coverage: 'Up to AED 37M',
    description: 'Protection against data breaches, cyber attacks, and technology failures affecting the platform.',
    details: [
      'Data breach notification costs',
      'Identity theft protection',
      'Business interruption coverage',
      'Legal defense costs'
    ],
    icon: ShieldAlert,
    color: 'from-purple-500 to-pink-500'
  },
  {
    type: 'Errors & Omissions',
    coverage: 'Up to AED 11M',
    description: 'Professional liability insurance protecting against claims of negligence or inadequate work.',
    details: [
      'Professional misconduct coverage',
      'Legal defense included',
      'Third-party claims protection',
      'Regulatory proceedings coverage'
    ],
    icon: FileText,
    color: 'from-green-500 to-emerald-500'
  },
  {
    type: 'Directors & Officers',
    coverage: 'Up to AED 18M',
    description: 'Protection for company leadership against claims alleging wrongful acts in their capacity as directors.',
    details: [
      'Management liability coverage',
      'Employment practices liability',
      'Fiduciary liability',
      'Corporate reimbursement'
    ],
    icon: Users,
    color: 'from-orange-500 to-red-500'
  }
];

const regulations = [
  {
    name: 'DFSA Regulated',
    description: 'Regulated by Dubai Financial Services Authority under applicable DIFC laws and regulations',
    icon: BadgeCheck
  },
  {
    name: 'ADGM Compliance',
    description: 'Abu Dhabi Global Market compliance for all securities and financial transactions',
    icon: FileCheck
  },
  {
    name: 'UAE Central Bank',
    description: 'Compliance with UAE Central Bank regulations for financial services and payment systems',
    icon: Database
  },
  {
    name: 'SOC 2 Type II',
    description: 'Annual audits verify security, availability, processing integrity, confidentiality, and privacy controls',
    icon: Shield
  },
  {
    name: 'GDPR & Data Privacy',
    description: 'Full compliance with international data privacy regulations including European GDPR standards',
    icon: Lock
  },
  {
    name: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard compliance for all credit card and payment transactions',
    icon: CreditCard
  }
];

const riskManagement = [
  {
    title: 'Due Diligence Process',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    items: [
      'Comprehensive property inspections',
      'Third-party appraisals',
      'Environmental assessments',
      'Title searches and insurance',
      'Market analysis and comparable sales',
      'Financial modeling and stress testing'
    ]
  },
  {
    title: 'Diversification',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    items: [
      'Multiple property types available',
      'Geographic diversification across regions',
      'Portfolio allocation tools',
      'Risk rating for each property',
      'Minimum investment allows broad diversification',
      'Quarterly portfolio rebalancing recommendations'
    ]
  },
  {
    title: 'Ongoing Monitoring',
    icon: Eye,
    color: 'from-green-500 to-emerald-500',
    items: [
      'Monthly property performance reports',
      'Quarterly financial statements',
      'Annual independent audits',
      'Property management oversight',
      'Market condition tracking',
      'Proactive issue identification'
    ]
  },
  {
    title: 'Investor Protection',
    icon: ShieldCheck,
    color: 'from-orange-500 to-red-500',
    items: [
      'Separate SPV for each property',
      'Independent custodian holds assets',
      'Transparent fee structure',
      'Clear operating agreements',
      'Investor voting rights on major decisions',
      'Quarterly investor calls and updates'
    ]
  }
];

const certifications = [
  { name: 'SOC 2 Type II Certified', icon: BadgeCheck },
  { name: 'ISO 27001 Information Security', icon: Shield },
  { name: 'PCI DSS Level 1 Compliant', icon: Lock },
  { name: 'SSAE 18 Audited', icon: FileCheck },
  { name: 'GDPR Compliant', icon: Eye },
  { name: 'DFSA Regulated', icon: Award }
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-semibold">Enterprise-Grade Protection</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Security & Insurance
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
            Your investments are protected by enterprise-grade security, comprehensive insurance, and strict regulatory compliance
          </p>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">AED 84M+</div>
              <div className="text-sm text-gray-400">Insurance Coverage</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <Lock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">256-bit</div>
              <div className="text-sm text-gray-400">SSL Encryption</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-gray-400">Security Monitoring</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-sm text-gray-400">Platform Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Measures */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Enterprise-Grade Security</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Multiple layers of protection safeguard your data and investments
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityMeasures.map((measure, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition-all group">
              <div className={`w-16 h-16 bg-gradient-to-r ${measure.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <measure.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{measure.title}</h3>
              <p className="text-gray-400 leading-relaxed">{measure.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance Coverage */}
      <div className="py-20 bg-gradient-to-r from-indigo-950/30 to-purple-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Comprehensive Insurance Coverage</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Multiple insurance policies protect your investments from various risks
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {insuranceCoverage.map((insurance, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{insurance.type}</h3>
                    <p className="text-green-400 font-semibold text-lg">{insurance.coverage}</p>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-r ${insurance.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <insurance.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <p className="text-gray-400 mb-6">{insurance.description}</p>
                <ul className="space-y-3">
                  {insurance.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regulatory Compliance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Regulatory Compliance</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We maintain the highest standards of regulatory compliance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regulations.map((reg, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <reg.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">{reg.name}</h3>
                  <p className="text-gray-400 text-sm">{reg.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="py-20 bg-gradient-to-r from-slate-950/50 to-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Security Certifications</h2>
            <p className="text-xl text-gray-400">Industry-recognized standards and certifications</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center hover:border-green-500/50 transition-all group">
                <cert.icon className="w-12 h-12 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-white">{cert.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Management */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Risk Management Framework</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Systematic approach to identifying, assessing, and mitigating investment risks
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {riskManagement.map((category, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}>
                  <category.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{category.title}</h3>
              </div>
              <ul className="space-y-3">
                {category.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Disclosure */}
      <div className="py-20 bg-gradient-to-r from-indigo-950/30 to-purple-950/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Important Risk Disclosure</h3>
                <div className="space-y-3 text-gray-300">
                  <p>
                    Real estate investing involves risk including potential loss of principal. Past performance does not guarantee future results.
                  </p>
                  <p>
                    Investments are illiquid and may not be easily sold. Property values can decrease due to market conditions, economic factors, or property-specific issues.
                  </p>
                  <p>
                    Rental income is not guaranteed and may fluctuate. Unexpected expenses, vacancies, or market changes can reduce returns.
                  </p>
                  <p>
                    All investors should carefully review offering documents, conduct their own due diligence, and consult with financial, legal, and tax advisors before investing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Contact */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Security Questions or Concerns?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Our security team is here to help
        </p>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <p className="text-gray-300 mb-6">
            For security-related inquiries, vulnerability reports, or compliance questions:
          </p>
          <a
            href="mailto:security@ownly.ae"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            <Shield className="w-5 h-5" />
            security@ownly.ae
          </a>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Invest with Confidence</h2>
          <p className="text-xl text-gray-300 mb-8">
            Your security and trust are our top priorities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              <ShieldCheck className="w-5 h-5" />
              Start Investing Securely
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              <Eye className="w-5 h-5" />
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
