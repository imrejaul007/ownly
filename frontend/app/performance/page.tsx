'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, DollarSign, Home, BarChart3, PieChart, Calendar } from 'lucide-react';

const performanceData = [
  {
    property: 'Sunset Apartments, Austin TX',
    type: 'Multi-Family',
    invested: '$2.5M',
    fundedDate: 'Jan 2020',
    exitDate: 'Dec 2024',
    annualReturn: '12.4%',
    totalReturn: '68.2%',
    rentalYield: '7.2%',
    appreciation: '5.2%',
    status: 'Exited'
  },
  {
    property: 'Downtown Retail Center, Miami FL',
    type: 'Commercial',
    invested: '$4.2M',
    fundedDate: 'Mar 2020',
    exitDate: 'Nov 2024',
    annualReturn: '10.8%',
    totalReturn: '54.1%',
    rentalYield: '6.5%',
    appreciation: '4.3%',
    status: 'Exited'
  },
  {
    property: 'Oak Street Residences, Seattle WA',
    type: 'Multi-Family',
    invested: '$3.1M',
    fundedDate: 'Jun 2020',
    exitDate: '-',
    annualReturn: '11.2%',
    totalReturn: '50.4%',
    rentalYield: '6.8%',
    appreciation: '4.4%',
    status: 'Active'
  },
  {
    property: 'Tech Park Office, San Jose CA',
    type: 'Commercial',
    invested: '$5.5M',
    fundedDate: 'Sep 2020',
    exitDate: 'Oct 2024',
    annualReturn: '13.1%',
    totalReturn: '57.4%',
    rentalYield: '7.8%',
    appreciation: '5.3%',
    status: 'Exited'
  },
  {
    property: 'Riverside Condos, Portland OR',
    type: 'Residential',
    invested: '$1.8M',
    fundedDate: 'Dec 2020',
    exitDate: '-',
    annualReturn: '9.7%',
    totalReturn: '38.8%',
    rentalYield: '5.9%',
    appreciation: '3.8%',
    status: 'Active'
  },
  {
    property: 'Main Street Mixed-Use, Denver CO',
    type: 'Mixed-Use',
    invested: '$3.8M',
    fundedDate: 'Feb 2021',
    exitDate: '-',
    annualReturn: '10.5%',
    totalReturn: '42.0%',
    rentalYield: '6.4%',
    appreciation: '4.1%',
    status: 'Active'
  },
  {
    property: 'Lakeside Villas, Orlando FL',
    type: 'Residential',
    invested: '$2.2M',
    fundedDate: 'May 2021',
    exitDate: '-',
    annualReturn: '11.8%',
    totalReturn: '42.5%',
    rentalYield: '7.1%',
    appreciation: '4.7%',
    status: 'Active'
  },
  {
    property: 'University Plaza, Boston MA',
    type: 'Commercial',
    invested: '$6.2M',
    fundedDate: 'Aug 2021',
    exitDate: '-',
    annualReturn: '9.3%',
    totalReturn: '32.6%',
    rentalYield: '5.7%',
    appreciation: '3.6%',
    status: 'Active'
  },
  {
    property: 'Green Valley Homes, Phoenix AZ',
    type: 'Residential',
    invested: '$2.9M',
    fundedDate: 'Nov 2021',
    exitDate: 'Sep 2024',
    annualReturn: '14.2%',
    totalReturn: '42.6%',
    rentalYield: '8.1%',
    appreciation: '6.1%',
    status: 'Exited'
  },
  {
    property: 'Harbor View Apartments, Charleston SC',
    type: 'Multi-Family',
    invested: '$3.5M',
    fundedDate: 'Jan 2022',
    exitDate: '-',
    annualReturn: '10.1%',
    totalReturn: '30.3%',
    rentalYield: '6.2%',
    appreciation: '3.9%',
    status: 'Active'
  }
];

const yearlyPerformance = [
  { year: '2020', avgReturn: '11.2%', dealsCompleted: 5, totalInvested: '$12.8M' },
  { year: '2021', avgReturn: '10.8%', dealsCompleted: 12, totalInvested: '$28.5M' },
  { year: '2022', avgReturn: '9.5%', dealsCompleted: 18, totalInvested: '$42.3M' },
  { year: '2023', avgReturn: '10.2%', dealsCompleted: 24, totalInvested: '$53.7M' },
  { year: '2024', avgReturn: '9.8%', dealsCompleted: 19, totalInvested: '$38.2M' }
];

const assetClassBreakdown = [
  { type: 'Multi-Family', percentage: 35, avgReturn: '10.8%', count: 42 },
  { type: 'Commercial', percentage: 28, avgReturn: '9.6%', count: 28 },
  { type: 'Residential', percentage: 22, avgReturn: '11.2%', count: 31 },
  { type: 'Mixed-Use', percentage: 15, avgReturn: '10.1%', count: 18 }
];

const metrics = [
  { label: 'Overall Success Rate', value: '94.2%', description: 'Properties meeting or exceeding projections' },
  { label: 'Average Annual Return', value: '9.8%', description: 'Across all completed investments' },
  { label: 'Average Hold Period', value: '3.8 years', description: 'From acquisition to exit' },
  { label: 'Total Properties', value: '119', description: 'Funded since platform launch' }
];

export default function PerformancePage() {
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredData = performanceData.filter(deal => {
    if (filterType !== 'All' && deal.type !== filterType) return false;
    if (filterStatus !== 'All' && deal.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="mx-auto mb-6" size={80} />
          <h1 className="text-5xl font-bold mb-6">Performance History</h1>
          <p className="text-2xl text-green-50 max-w-3xl mx-auto">
            Track record of consistent returns and successful real estate investments
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {metrics.map((metric, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{metric.value}</div>
                <div className="text-gray-900 font-semibold mb-1">{metric.label}</div>
                <div className="text-gray-600 text-sm">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yearly Performance */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Year-Over-Year Performance
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Consistent growth and returns since 2020
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-gray-900 font-bold">Year</th>
                    <th className="px-6 py-4 text-left text-gray-900 font-bold">Avg. Return</th>
                    <th className="px-6 py-4 text-left text-gray-900 font-bold">Deals Completed</th>
                    <th className="px-6 py-4 text-left text-gray-900 font-bold">Total Invested</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyPerformance.map((year, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-900">{year.year}</td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-bold text-lg">{year.avgReturn}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{year.dealsCompleted}</td>
                      <td className="px-6 py-4 text-gray-700">{year.totalInvested}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Class Breakdown */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <PieChart className="mx-auto mb-4 text-green-600" size={64} />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Performance by Asset Class
            </h2>
            <p className="text-xl text-gray-600">
              Diversified portfolio across multiple property types
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assetClassBreakdown.map((asset, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-8 text-center">
                <Home className="mx-auto mb-4 text-green-600" size={48} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{asset.type}</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">{asset.percentage}%</div>
                <div className="text-gray-600 mb-4">of total portfolio</div>
                <div className="border-t border-gray-300 pt-4 space-y-2">
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Avg Return:</span> {asset.avgReturn}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Properties:</span> {asset.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Deals */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Historical Deal Performance
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Detailed performance data for individual properties
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>All</option>
                <option>Multi-Family</option>
                <option>Commercial</option>
                <option>Residential</option>
                <option>Mixed-Use</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>All</option>
                <option>Active</option>
                <option>Exited</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Property</th>
                    <th className="px-6 py-4 text-left">Type</th>
                    <th className="px-6 py-4 text-left">Invested</th>
                    <th className="px-6 py-4 text-left">Funded</th>
                    <th className="px-6 py-4 text-left">Annual Return</th>
                    <th className="px-6 py-4 text-left">Total Return</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((deal, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-900">{deal.property}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {deal.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{deal.invested}</td>
                      <td className="px-6 py-4 text-gray-700">{deal.fundedDate}</td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-bold">{deal.annualReturn}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-bold">{deal.totalReturn}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          deal.status === 'Active'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {deal.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Showing {filteredData.length} of {performanceData.length} properties
          </p>
        </div>
      </section>

      {/* Performance Highlights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Performance Highlights
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <BarChart3 className="text-green-600 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Highest Return</h3>
              <div className="text-4xl font-bold text-green-600 mb-2">14.2%</div>
              <p className="text-gray-700">Green Valley Homes, Phoenix AZ (2021-2024)</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <DollarSign className="text-green-600 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Largest Exit</h3>
              <div className="text-4xl font-bold text-green-600 mb-2">$6.2M</div>
              <p className="text-gray-700">University Plaza, Boston MA</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <Calendar className="text-green-600 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Best Rental Yield</h3>
              <div className="text-4xl font-bold text-green-600 mb-2">8.1%</div>
              <p className="text-gray-700">Green Valley Homes, Phoenix AZ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-yellow-50 border-t-4 border-yellow-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Important Disclaimer</h3>
          <p className="text-gray-700 leading-relaxed">
            Past performance is not indicative of future results. All investments involve risk, including the potential loss of principal. The performance data shown represents historical returns and should not be considered a guarantee of future performance. Individual investment results will vary based on timing, property selection, market conditions, and other factors. Please review all offering documents carefully and consult with financial advisors before investing.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Building Your Portfolio</h2>
          <p className="text-xl mb-8 text-green-50">
            Join thousands of investors achieving consistent returns
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
              View Current Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
