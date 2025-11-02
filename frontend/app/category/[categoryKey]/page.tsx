'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { dealAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  Building2, Car, Compass, Utensils, Heart, Store, GraduationCap,
  Film, Laptop, Home, Calendar, Leaf, ShoppingCart, Truck, Factory,
  Briefcase, TrendingUp, Users, BarChart3, ArrowLeft, Sparkles,
  TrendingDown, DollarSign, Target, Clock, ChevronRight, Filter,
  Loader2, MapPin, Shield, BadgeCheck, Star, Zap, Award, CheckCircle,
  Globe, TrendingUpIcon, LineChart
} from 'lucide-react';

// Enhanced category data with custom content for each
const CATEGORIES = [
  {
    key: 'real_estate',
    label: 'Real Estate & Property',
    icon: Building2,
    description: 'Property investments including residential, commercial, and hospitality',
    gradient: 'from-blue-500 via-blue-600 to-cyan-600',
    tagline: 'Build Wealth Through Premium UAE Real Estate',
    extendedDesc: 'Invest in Dubai\'s booming property market with Shariah-compliant opportunities in residential, commercial, and hospitality sectors. Benefit from capital appreciation and rental yields.',
    highlights: [
      { icon: TrendingUp, text: 'Average 8-12% annual returns', color: 'text-blue-400' },
      { icon: Shield, text: 'Freehold & leasehold properties', color: 'text-cyan-400' },
      { icon: Globe, text: 'Prime Dubai locations', color: 'text-blue-300' },
    ],
    bgColor: 'from-blue-600/20 via-cyan-600/10 to-blue-900/5'
  },
  {
    key: 'mobility_transport',
    label: 'Mobility & Transport',
    icon: Car,
    description: 'Vehicle rental, fleet management, and transport services',
    gradient: 'from-purple-500 via-purple-600 to-pink-600',
    tagline: 'Drive the Future of Transportation',
    extendedDesc: 'Tap into UAE\'s growing mobility sector with investments in electric vehicles, fleet management, bike-sharing, and innovative transport solutions serving millions of residents and tourists.',
    highlights: [
      { icon: Zap, text: 'EV charging infrastructure', color: 'text-purple-400' },
      { icon: TrendingUp, text: 'Growing tourism demand', color: 'text-pink-400' },
      { icon: Award, text: 'Government-backed initiatives', color: 'text-purple-300' },
    ],
    bgColor: 'from-purple-600/20 via-pink-600/10 to-purple-900/5'
  },
  {
    key: 'hospitality_tourism',
    label: 'Hospitality & Tourism',
    icon: Compass,
    description: 'Travel, tourism, and hospitality businesses',
    gradient: 'from-green-500 via-green-600 to-emerald-600',
    tagline: 'Invest in UAE\'s World-Class Tourism Industry',
    extendedDesc: 'Dubai welcomes over 16 million tourists annually. Invest in premium hotels, resorts, heritage properties, and unique hospitality experiences in the world\'s fastest-growing tourism destination.',
    highlights: [
      { icon: Globe, text: '16M+ annual visitors', color: 'text-green-400' },
      { icon: Star, text: 'Luxury & boutique hotels', color: 'text-emerald-400' },
      { icon: Award, text: 'Expo 2020 legacy benefits', color: 'text-green-300' },
    ],
    bgColor: 'from-green-600/20 via-emerald-600/10 to-green-900/5'
  },
  {
    key: 'food_beverage',
    label: 'Food & Beverage',
    icon: Utensils,
    description: 'Halal-only food and beverage businesses',
    gradient: 'from-orange-500 via-orange-600 to-red-600',
    tagline: '100% Halal Food & Beverage Opportunities',
    extendedDesc: 'Invest in Dubai\'s thriving halal F&B sector with restaurants, cafes, cloud kitchens, and food delivery services. Benefit from high foot traffic areas and growing dining culture.',
    highlights: [
      { icon: CheckCircle, text: '100% halal certified', color: 'text-orange-400' },
      { icon: TrendingUp, text: 'Growing food tourism', color: 'text-red-400' },
      { icon: Globe, text: 'Multiple cuisine concepts', color: 'text-orange-300' },
    ],
    bgColor: 'from-orange-600/20 via-red-600/10 to-orange-900/5'
  },
  {
    key: 'health_wellness',
    label: 'Health, Beauty & Wellness',
    icon: Heart,
    description: 'Healthcare, beauty, and wellness services',
    gradient: 'from-indigo-500 via-indigo-600 to-purple-600',
    tagline: 'Wellness Revolution in the UAE',
    extendedDesc: 'Invest in premium spas, fitness studios, beauty clinics, and wellness centers. Growing health consciousness and disposable income create strong demand for quality wellness services.',
    highlights: [
      { icon: Heart, text: 'Premium wellness services', color: 'text-indigo-400' },
      { icon: TrendingUp, text: 'Health-conscious market', color: 'text-purple-400' },
      { icon: Award, text: 'Licensed & certified', color: 'text-indigo-300' },
    ],
    bgColor: 'from-indigo-600/20 via-purple-600/10 to-indigo-900/5'
  },
  {
    key: 'retail_franchises',
    label: 'Retail & Franchises',
    icon: Store,
    description: 'Retail stores and franchise opportunities',
    gradient: 'from-pink-500 via-pink-600 to-rose-600',
    tagline: 'Proven Retail & Franchise Concepts',
    extendedDesc: 'Invest in established retail brands and franchise opportunities across fashion, accessories, lifestyle, and specialty stores in Dubai\'s premium malls and high-street locations.',
    highlights: [
      { icon: BadgeCheck, text: 'Established brands', color: 'text-pink-400' },
      { icon: Globe, text: 'Mall & high-street locations', color: 'text-rose-400' },
      { icon: TrendingUp, text: 'Strong retail culture', color: 'text-pink-300' },
    ],
    bgColor: 'from-pink-600/20 via-rose-600/10 to-pink-900/5'
  },
  {
    key: 'education_training',
    label: 'Education & Training',
    icon: GraduationCap,
    description: 'Educational institutions and training centers',
    gradient: 'from-yellow-500 via-yellow-600 to-orange-600',
    tagline: 'Invest in the Future of Education',
    extendedDesc: 'Support quality education with investments in schools, training centers, e-learning platforms, and skill development programs serving UAE\'s diverse, education-focused population.',
    highlights: [
      { icon: Award, text: 'KHDA-approved programs', color: 'text-yellow-400' },
      { icon: Users, text: 'Growing expat families', color: 'text-orange-400' },
      { icon: Zap, text: 'EdTech innovation', color: 'text-yellow-300' },
    ],
    bgColor: 'from-yellow-600/20 via-orange-600/10 to-yellow-900/5'
  },
  {
    key: 'media_entertainment',
    label: 'Media, Marketing & Entertainment',
    icon: Film,
    description: 'Media production, marketing, and family entertainment',
    gradient: 'from-teal-500 via-teal-600 to-cyan-600',
    tagline: 'Create, Market, Entertain',
    extendedDesc: 'Invest in media production studios, marketing agencies, entertainment venues, and content creation platforms serving the region\'s vibrant creative and entertainment industry.',
    highlights: [
      { icon: Film, text: 'Production & studios', color: 'text-teal-400' },
      { icon: Star, text: 'Family entertainment', color: 'text-cyan-400' },
      { icon: Globe, text: 'Regional content hub', color: 'text-teal-300' },
    ],
    bgColor: 'from-teal-600/20 via-cyan-600/10 to-teal-900/5'
  },
  {
    key: 'technology_innovation',
    label: 'Technology & Innovation',
    icon: Laptop,
    description: 'Tech startups and innovative solutions',
    gradient: 'from-red-500 via-red-600 to-pink-600',
    tagline: 'Power the Next Tech Revolution',
    extendedDesc: 'Invest in cutting-edge tech startups, AI solutions, fintech platforms, and digital transformation ventures in DIFC, ADGM, and Dubai Silicon Oasis tech hubs.',
    highlights: [
      { icon: Zap, text: 'AI & blockchain solutions', color: 'text-red-400' },
      { icon: LineChart, text: 'High growth potential', color: 'text-pink-400' },
      { icon: Award, text: 'Government support', color: 'text-red-300' },
    ],
    bgColor: 'from-red-600/20 via-pink-600/10 to-red-900/5'
  },
  {
    key: 'home_services',
    label: 'Home Services & Lifestyle',
    icon: Home,
    description: 'Home maintenance and lifestyle services',
    gradient: 'from-cyan-500 via-cyan-600 to-blue-600',
    tagline: 'Essential Services, Steady Returns',
    extendedDesc: 'Invest in home maintenance, cleaning, pest control, AC services, and lifestyle convenience businesses serving Dubai\'s growing residential and commercial property market.',
    highlights: [
      { icon: CheckCircle, text: 'Essential services', color: 'text-cyan-400' },
      { icon: TrendingUp, text: 'Recurring revenue model', color: 'text-blue-400' },
      { icon: Users, text: 'Large customer base', color: 'text-cyan-300' },
    ],
    bgColor: 'from-cyan-600/20 via-blue-600/10 to-cyan-900/5'
  },
  {
    key: 'events_experiences',
    label: 'Events, Experiences & Entertainment',
    icon: Calendar,
    description: 'Event management and experiential entertainment',
    gradient: 'from-blue-500 via-blue-600 to-cyan-600',
    tagline: 'Memorable Experiences, Profitable Returns',
    extendedDesc: 'Invest in event management companies, experiential entertainment venues, corporate event services, and unique attraction experiences in UAE\'s thriving events industry.',
    highlights: [
      { icon: Calendar, text: 'Corporate & public events', color: 'text-blue-400' },
      { icon: Star, text: 'Unique experiences', color: 'text-cyan-400' },
      { icon: Globe, text: 'Year-round demand', color: 'text-blue-300' },
    ],
    bgColor: 'from-blue-600/20 via-cyan-600/10 to-blue-900/5'
  },
  {
    key: 'agriculture_sustainable',
    label: 'Agriculture & Sustainable Projects',
    icon: Leaf,
    description: 'Agricultural and sustainability-focused investments',
    gradient: 'from-purple-500 via-purple-600 to-pink-600',
    tagline: 'Sustainable Growth, Ethical Returns',
    extendedDesc: 'Support eco-friendly vertical farms, organic agriculture, renewable energy projects, and sustainability-focused ventures aligned with UAE\'s green economy vision.',
    highlights: [
      { icon: Leaf, text: 'Vertical & hydroponic farms', color: 'text-purple-400' },
      { icon: Award, text: 'Government incentives', color: 'text-pink-400' },
      { icon: Globe, text: 'Food security focus', color: 'text-purple-300' },
    ],
    bgColor: 'from-purple-600/20 via-pink-600/10 to-purple-900/5'
  },
  {
    key: 'ecommerce_digital',
    label: 'E-commerce & Digital Ventures',
    icon: ShoppingCart,
    description: 'Online retail and digital business models',
    gradient: 'from-green-500 via-green-600 to-emerald-600',
    tagline: 'Digital Commerce, Unlimited Potential',
    extendedDesc: 'Invest in e-commerce platforms, digital marketplaces, D2C brands, and online retail ventures capitalizing on the region\'s high internet penetration and digital adoption.',
    highlights: [
      { icon: ShoppingCart, text: 'Growing online shopping', color: 'text-green-400' },
      { icon: Globe, text: 'Regional expansion', color: 'text-emerald-400' },
      { icon: Zap, text: 'Low overhead costs', color: 'text-green-300' },
    ],
    bgColor: 'from-green-600/20 via-emerald-600/10 to-green-900/5'
  },
  {
    key: 'logistics_supply_chain',
    label: 'Logistics & Supply Chain',
    icon: Truck,
    description: 'Logistics, warehousing, and supply chain management',
    gradient: 'from-orange-500 via-orange-600 to-red-600',
    tagline: 'Connect Commerce, Deliver Value',
    extendedDesc: 'Invest in last-mile delivery, warehousing, cold storage, and logistics services supporting e-commerce, F&B, and retail sectors in UAE\'s strategic trade hub location.',
    highlights: [
      { icon: Truck, text: 'Last-mile delivery', color: 'text-orange-400' },
      { icon: Globe, text: 'Strategic location', color: 'text-red-400' },
      { icon: TrendingUp, text: 'E-commerce growth', color: 'text-orange-300' },
    ],
    bgColor: 'from-orange-600/20 via-red-600/10 to-orange-900/5'
  },
  {
    key: 'manufacturing_production',
    label: 'Manufacturing & Production',
    icon: Factory,
    description: 'Manufacturing and production facilities',
    gradient: 'from-indigo-500 via-indigo-600 to-purple-600',
    tagline: 'Industrial Excellence, Made in UAE',
    extendedDesc: 'Invest in manufacturing facilities producing construction materials, consumer goods, packaging, and industrial products in Dubai Industrial City and Jebel Ali free zones.',
    highlights: [
      { icon: Factory, text: 'Modern facilities', color: 'text-indigo-400' },
      { icon: Award, text: 'Free zone benefits', color: 'text-purple-400' },
      { icon: Globe, text: 'Export opportunities', color: 'text-indigo-300' },
    ],
    bgColor: 'from-indigo-600/20 via-purple-600/10 to-indigo-900/5'
  },
  {
    key: 'micro_investment_baskets',
    label: 'Smart Micro-Investment Baskets',
    icon: Briefcase,
    description: 'Diversified investment baskets and SIP plans',
    gradient: 'from-pink-500 via-pink-600 to-rose-600',
    tagline: 'Start Small, Grow Big',
    extendedDesc: 'Invest as little as AED 100/month in diversified baskets across multiple sectors. Perfect for first-time investors and those building wealth systematically through SIPs.',
    highlights: [
      { icon: DollarSign, text: 'From AED 100/month', color: 'text-pink-400' },
      { icon: Shield, text: 'Diversified portfolios', color: 'text-rose-400' },
      { icon: TrendingUp, text: 'Automated investing', color: 'text-pink-300' },
    ],
    bgColor: 'from-pink-600/20 via-rose-600/10 to-pink-900/5'
  },
  {
    key: 'secondary_market',
    label: 'Secondary Market Deals',
    icon: TrendingUp,
    description: 'Resale and trading of existing investments',
    gradient: 'from-yellow-500 via-yellow-600 to-orange-600',
    tagline: 'Exit Flexibility, Liquidity Freedom',
    extendedDesc: 'Buy and sell existing investments on OWNLY\'s secondary marketplace. Access immediate investment opportunities or exit positions early with competitive pricing.',
    highlights: [
      { icon: Zap, text: 'Instant liquidity', color: 'text-yellow-400' },
      { icon: LineChart, text: 'Market-driven pricing', color: 'text-orange-400' },
      { icon: Shield, text: 'Verified assets only', color: 'text-yellow-300' },
    ],
    bgColor: 'from-yellow-600/20 via-orange-600/10 to-yellow-900/5'
  },
  {
    key: 'bundles_thematic',
    label: 'Bundles & Thematic Funds',
    icon: Briefcase,
    description: 'Curated investment bundles with specific themes',
    gradient: 'from-teal-500 via-teal-600 to-cyan-600',
    tagline: 'Curated Portfolios, Expert Selection',
    extendedDesc: 'Invest in professionally curated bundles like "Tech Innovators", "Sustainable Future", "Tourism & Hospitality" with diversified exposure to multiple deals in specific themes.',
    highlights: [
      { icon: Award, text: 'Expert-curated', color: 'text-teal-400' },
      { icon: Shield, text: '5-10 deals per bundle', color: 'text-cyan-400' },
      { icon: TrendingUp, text: 'Sector-focused growth', color: 'text-teal-300' },
    ],
    bgColor: 'from-teal-600/20 via-cyan-600/10 to-teal-900/5'
  },
  {
    key: 'community_impact',
    label: 'Community & Impact Projects',
    icon: Users,
    description: 'Social enterprises and community-focused investments',
    gradient: 'from-red-500 via-red-600 to-pink-600',
    tagline: 'Invest with Purpose, Impact with Profit',
    extendedDesc: 'Support businesses creating positive social impact through employment programs, community services, educational initiatives, and sustainable development projects.',
    highlights: [
      { icon: Heart, text: 'Social impact focus', color: 'text-red-400' },
      { icon: Users, text: 'Community benefits', color: 'text-pink-400' },
      { icon: Award, text: 'ESG compliant', color: 'text-red-300' },
    ],
    bgColor: 'from-red-600/20 via-pink-600/10 to-red-900/5'
  },
  {
    key: 'ownly_exchange',
    label: 'OWNLY Exchange & Secondary Assets',
    icon: BarChart3,
    description: 'Marketplace for trading certified investment assets',
    gradient: 'from-cyan-500 via-cyan-600 to-blue-600',
    tagline: 'Trade, Exchange, Profit',
    extendedDesc: 'Access the OWNLY Exchange to trade certified fractional ownership assets, discover arbitrage opportunities, and enjoy flexible liquidity in a regulated marketplace.',
    highlights: [
      { icon: LineChart, text: 'Real-time trading', color: 'text-cyan-400' },
      { icon: Shield, text: 'Regulated platform', color: 'text-blue-400' },
      { icon: Zap, text: 'Instant settlement', color: 'text-cyan-300' },
    ],
    bgColor: 'from-cyan-600/20 via-blue-600/10 to-cyan-900/5'
  },
];

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryKey = params.categoryKey as string;

  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  // Find category data
  const category = CATEGORIES.find(cat => cat.key === categoryKey);

  useEffect(() => {
    if (!category) {
      router.push('/deals');
      return;
    }

    // Fetch and filter deals
    const loadDeals = async () => {
      try {
        setLoading(true);
        const response = await dealAPI.list();

        // API returns { success, message, data } - extract the deals array
        const allDeals = response.data.data || response.data;

        // Filter deals by category OR type (to support both /category/real_estate and /category/retail_franchises)
        let filteredDeals = allDeals.filter((deal: any) =>
          deal.category === categoryKey || deal.type === categoryKey
        );

        // Sort deals
        if (sortBy === 'newest') {
          filteredDeals.sort((a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        } else if (sortBy === 'roi_high') {
          filteredDeals.sort((a: any, b: any) =>
            (b.expected_roi || 0) - (a.expected_roi || 0)
          );
        } else if (sortBy === 'roi_low') {
          filteredDeals.sort((a: any, b: any) =>
            (a.expected_roi || 0) - (b.expected_roi || 0)
          );
        } else if (sortBy === 'funding_high') {
          filteredDeals.sort((a: any, b: any) => {
            const aPercent = (a.raised_amount / a.target_amount) * 100;
            const bPercent = (b.raised_amount / b.target_amount) * 100;
            return bPercent - aPercent;
          });
        }

        setDeals(filteredDeals);
      } catch (err) {
        console.error('Error fetching deals:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryKey, sortBy]);

  if (!category) {
    return null;
  }

  // Calculate category stats
  const totalDeals = deals.length;
  const totalFunding = deals.reduce((sum, deal) => sum + (deal.raised_amount || 0), 0);
  const avgROI = deals.length > 0
    ? deals.reduce((sum, deal) => sum + (deal.expected_roi || 0), 0) / deals.length
    : 0;
  const fundedDeals = deals.filter(deal => deal.status === 'funded').length;

  const IconComponent = category.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-gray-900 to-black">
      {/* Custom Animated Background Orbs based on category gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br ${category.gradient} opacity-20 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br ${category.gradient} opacity-15 rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br ${category.gradient} opacity-10 rounded-full blur-3xl animate-pulse delay-2000`}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-purple-300">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/category" className="hover:text-white transition-colors">
              All Categories
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{category.label}</span>
          </div>
        </div>

        {/* Custom Hero Section for Each Category */}
        <div className={`relative overflow-hidden rounded-3xl mb-12 bg-gradient-to-br ${category.gradient} p-1`}>
          <div className={`bg-gradient-to-br ${category.bgColor} backdrop-blur-xl rounded-3xl p-12 relative overflow-hidden`}>
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            {/* Floating accent shapes */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${category.gradient} opacity-20 rounded-full blur-3xl`}></div>
            <div className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br ${category.gradient} opacity-15 rounded-full blur-2xl`}></div>

            <div className="relative z-10">
              {/* Back Button */}
              <Link
                href="/category"
                className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-6 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to All Categories
              </Link>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left: Content */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`bg-gradient-to-br ${category.gradient} p-4 rounded-2xl shadow-2xl`}>
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-bold text-green-300">Shariah Compliant</span>
                    </div>
                  </div>

                  <h1 className="text-5xl font-bold text-white mb-3 leading-tight">
                    {category.tagline}
                  </h1>

                  <p className="text-xl text-purple-100 mb-6 leading-relaxed">
                    {category.extendedDesc}
                  </p>

                  {/* Category Highlights */}
                  <div className="space-y-3 mb-6">
                    {category.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-500">
                        <div className={`w-10 h-10 bg-gradient-to-br ${category.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
                          <highlight.icon className={`w-5 h-5 ${highlight.color}`} />
                        </div>
                        <span className="text-white font-medium">{highlight.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-6 h-6 text-blue-400" />
                        <span className="text-sm text-purple-200">Total Deals</span>
                      </div>
                      <p className="text-4xl font-bold text-white">{totalDeals}</p>
                      <p className="text-xs text-purple-300 mt-1">Active opportunities</p>
                    </div>
                  </div>

                  <div className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-6 h-6 text-green-400" />
                        <span className="text-sm text-purple-200">Total Funded</span>
                      </div>
                      <p className="text-4xl font-bold text-white">
                        {totalFunding > 1000000 ? `${(totalFunding / 1000000).toFixed(1)}M` : `${(totalFunding / 1000).toFixed(0)}K`}
                      </p>
                      <p className="text-xs text-purple-300 mt-1">AED raised</p>
                    </div>
                  </div>

                  <div className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-6 h-6 text-purple-400" />
                        <span className="text-sm text-purple-200">Average ROI</span>
                      </div>
                      <p className="text-4xl font-bold text-white">{avgROI.toFixed(1)}%</p>
                      <p className="text-xs text-purple-300 mt-1">Expected returns</p>
                    </div>
                  </div>

                  <div className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <BadgeCheck className="w-6 h-6 text-orange-400" />
                        <span className="text-sm text-purple-200">Funded Deals</span>
                      </div>
                      <p className="text-4xl font-bold text-white">{fundedDeals}</p>
                      <p className="text-xs text-purple-300 mt-1">Successfully funded</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-white">
              Available Opportunities
            </h2>
            <span className={`px-4 py-2 rounded-full bg-gradient-to-r ${category.gradient} text-white text-sm font-semibold shadow-lg`}>
              {deals.length} {deals.length === 1 ? 'Deal' : 'Deals'}
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-300" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="roi_high">Highest ROI</option>
              <option value="roi_low">Lowest ROI</option>
              <option value="funding_high">Most Funded</option>
            </select>
          </div>
        </div>

        {/* Deals Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className={`w-12 h-12 text-${category.gradient.split('-')[1]}-500 animate-spin mb-4`} />
            <p className="text-purple-300 text-lg">Loading {category.label} deals...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-20">
            <div className={`bg-gradient-to-br ${category.bgColor} backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-2xl mx-auto`}>
              <div className={`w-24 h-24 bg-gradient-to-br ${category.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl opacity-50`}>
                <IconComponent className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">
                No Deals Available Yet
              </h3>
              <p className="text-purple-100 text-lg mb-6 max-w-lg mx-auto">
                We're currently preparing exciting investment opportunities in {category.label}.
                Check back soon or explore other categories!
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/deals"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${category.gradient} text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-500`}
                >
                  View All Deals
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/category"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 border border-white/20 transition-all duration-500"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => {
              const fundingPercentage = (deal.raised_amount / deal.target_amount) * 100;

              return (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/50 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  {/* Deal Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-600/20 to-blue-600/20 overflow-hidden">
                    {deal.images && deal.images[0] ? (
                      <img
                        src={deal.images[0]}
                        alt={deal.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${category.gradient} opacity-30`}>
                        <IconComponent className="w-20 h-20 text-white" />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {deal.status === 'active' && (
                        <span className="px-3 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-xs font-bold text-white shadow-lg">
                          OPEN
                        </span>
                      )}
                      {deal.status === 'funded' && (
                        <span className="px-3 py-1 rounded-full bg-blue-500/90 backdrop-blur-sm text-xs font-bold text-white shadow-lg">
                          FUNDED
                        </span>
                      )}
                      {deal.badges && deal.badges.includes('hot_deal') && (
                        <span className="px-3 py-1 rounded-full bg-orange-500/90 backdrop-blur-sm text-xs font-bold text-white flex items-center gap-1 shadow-lg">
                          🔥 HOT
                        </span>
                      )}
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${category.gradient} backdrop-blur-md text-xs font-bold text-white shadow-lg`}>
                        {category.label.split(' &')[0].split(',')[0]}
                      </div>
                    </div>
                  </div>

                  {/* Deal Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                      {deal.title}
                    </h3>

                    {deal.location && (
                      <div className="flex items-center gap-1 text-sm text-purple-300 mb-4">
                        <MapPin className="w-4 h-4" />
                        {deal.location}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-purple-300 mb-1">Expected ROI</p>
                        <p className="text-lg font-bold text-green-400">
                          {deal.expected_roi}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-300 mb-1">Min Investment</p>
                        <p className="text-lg font-bold text-white">
                          {formatCurrency(deal.min_ticket)}
                        </p>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-purple-300">Funding Progress</span>
                        <span className="text-white font-semibold">
                          {fundingPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${category.gradient} transition-all duration-500`}
                          style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-purple-300 mt-1">
                        <span>{formatCurrency(deal.raised_amount)} raised</span>
                        <span>{formatCurrency(deal.target_amount)} target</span>
                      </div>
                    </div>

                    {/* Holding Period */}
                    <div className="flex items-center gap-2 text-sm text-purple-300">
                      <Clock className="w-4 h-4" />
                      <span>{deal.holding_period_months} months holding period</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
