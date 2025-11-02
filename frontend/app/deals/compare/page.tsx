'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Deal } from '@/types';
import { dealAPI, secondaryMarketAPI } from '@/lib/api';
import { formatPercentage, getDealTypeLabel } from '@/lib/utils';
import { usePreferences } from '@/context/PreferencesContext';
import {
  TrendingUp, Clock, DollarSign, MapPin, Users, Target, Award,
  BarChart3, X, Plus, CheckCircle, ArrowLeft, Crown
} from 'lucide-react';

// Universal item type for comparison
interface ComparisonItem {
  id: string;
  type: 'deal' | 'bundle' | 'secondary';
  title: string;
  expectedRoi: number;
  minInvestment: number;
  targetAmount?: number;
  raisedAmount?: number;
  holdingPeriod?: number;
  location?: string;
  status?: string;
  investorCount?: number;
  itemType?: string; // deal type, bundle type, etc
  monthlyIncome: number;
  dealTotalMonthly?: number;
  rawData: any; // Keep original data for type-specific display
}

function DealCompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [allDeals, setAllDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchAllData();
    // Get items from URL params - supports both old format (ids) and new format (items)
    const ids = searchParams.get('ids');
    const itemsParam = searchParams.get('items');

    if (itemsParam) {
      // New format: items=deal:id1,bundle:id2,secondary:id3
      setSelectedItems(itemsParam.split(','));
    } else if (ids) {
      // Old format: ids=id1,id2,id3 (assumes all are deals)
      setSelectedItems(ids.split(',').map(id => `deal:${id}`));
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedItems.length > 0 && allDeals.length > 0) {
      fetchSelectedItems();
    }
  }, [selectedItems, allDeals]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const response = await dealAPI.list({});
      setAllDeals(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedItems = async () => {
    try {
      const fetchedItems: ComparisonItem[] = [];

      for (const item of selectedItems) {
        const [type, id] = item.split(':');

        if (type === 'deal') {
          const deal = allDeals.find(d => d.id === id);
          if (deal) {
            const minInvestment = parseFloat(deal.min_ticket?.toString() || '0');
            const targetAmount = parseFloat(deal.target_amount?.toString() || '0');
            const expectedROI = parseFloat(deal.expected_roi?.toString() || '0');

            fetchedItems.push({
              id: deal.id,
              type: 'deal',
              title: deal.title,
              expectedRoi: expectedROI,
              minInvestment,
              targetAmount,
              raisedAmount: parseFloat(deal.raised_amount?.toString() || '0'),
              holdingPeriod: deal.holding_period_months,
              location: deal.location,
              status: deal.status,
              investorCount: deal.investor_count,
              itemType: getDealTypeLabel(deal.type),
              monthlyIncome: (minInvestment * (expectedROI / 100)) / 12,
              dealTotalMonthly: (targetAmount * (expectedROI / 100)) / 12,
              rawData: deal
            });
          }
        }
        // Bundle and secondary support will be added by selection features
      }

      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching selected items:', error);
    }
  };

  const handleAddItem = (itemId: string) => {
    if (selectedItems.length >= 4) {
      alert('You can compare up to 4 items at a time');
      return;
    }
    const newItems = [...selectedItems, `deal:${itemId}`];
    setSelectedItems(newItems);
    router.push(`/deals/compare?items=${newItems.join(',')}`);
  };

  const handleRemoveItem = (item: string) => {
    const newItems = selectedItems.filter(i => i !== item);
    setSelectedItems(newItems);
    if (newItems.length > 0) {
      router.push(`/deals/compare?items=${newItems.join(',')}`);
    } else {
      router.push('/deals/compare');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading comparison...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8">
            <Link href="/deals" className="flex items-center gap-2 text-purple-200 hover:text-white mb-4 inline-flex transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Deals
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Compare Investments
                </h1>
                <p className="text-purple-200 text-lg">
                  Side-by-side comparison • Make informed decisions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Item Selector */}
        {items.length < 4 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Add Deals to Compare</h2>
              <span className="text-purple-300 text-sm">({4 - items.length} slots remaining)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allDeals
                .filter(deal => !selectedItems.includes(`deal:${deal.id}`))
                .slice(0, 6)
                .map(deal => (
                  <button
                    key={deal.id}
                    onClick={() => handleAddItem(deal.id)}
                    className="text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold mb-2">
                      <BarChart3 className="w-3 h-3" />
                      DEAL
                    </div>
                    <div className="font-semibold text-sm mb-2 text-white group-hover:text-purple-200 transition-colors line-clamp-2">{deal.title}</div>
                    <div className="text-xs text-purple-300">
                      {getDealTypeLabel(deal.type)} • {formatPercentage(deal.expected_roi || 0)} ROI
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {items.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-purple-400/50 mb-4">
              <BarChart3 className="w-20 h-20 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Select Deals to Compare
            </h3>
            <p className="text-purple-300 max-w-md mx-auto">
              Choose at least 2 investment opportunities above to start comparing them side by side
            </p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            {/* Mobile: Add horizontal scroll wrapper */}
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-sm font-semibold text-purple-200 bg-white/5">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Feature
                    </div>
                  </th>
                  {items.map((item, index) => (
                    <th key={item.id} className="p-4 text-center min-w-[220px] bg-white/5 relative">
                      <div className="text-xs text-purple-400 font-semibold mb-1 flex items-center justify-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {item.type.toUpperCase()}
                      </div>
                      <div className="font-bold text-sm mb-3 text-white px-2">{item.title}</div>
                      <button
                        onClick={() => handleRemoveItem(`${item.type}:${item.id}`)}
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <X className="w-3 h-3" />
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
            <tbody>
              {/* Type */}
              <ComparisonRow
                label="Type"
                values={items.map(item => item.itemType || item.type)}
              />

              {/* Expected ROI */}
              <ComparisonRow
                label="Expected ROI"
                values={items.map(item => formatPercentage(item.expectedRoi))}
                highlight={true}
                highlightBest="max"
              />

              {/* Deal Total Monthly Earning */}
              <ComparisonRow
                label="Total Monthly Generation"
                values={items.map(item => item.dealTotalMonthly ? `${formatCurrency(item.dealTotalMonthly)}/mo` : 'N/A')}
                highlight={true}
                highlightBest="max"
              />

              {/* Monthly Income (based on min investment) */}
              <ComparisonRow
                label="Your Monthly Income (min)"
                values={items.map(item => `${formatCurrency(item.monthlyIncome)}/mo`)}
                highlight={true}
                highlightBest="max"
              />

              {/* Min Investment */}
              <ComparisonRow
                label="Min. Investment"
                values={items.map(item => formatCurrency(item.minInvestment))}
                highlight={true}
                highlightBest="min"
              />

              {items[0].targetAmount && (
                <ComparisonRow
                  label="Target Amount"
                  values={items.map(item => item.targetAmount ? formatCurrency(item.targetAmount) : 'N/A')}
                />
              )}

              {items[0].raisedAmount !== undefined && (
                <>
                  <ComparisonRow
                    label="Raised So Far"
                    values={items.map(item => item.raisedAmount !== undefined ? formatCurrency(item.raisedAmount) : 'N/A')}
                  />
                  <ComparisonRow
                    label="Funding Progress"
                    values={items.map(item => {
                      if (item.raisedAmount !== undefined && item.targetAmount) {
                        return `${((item.raisedAmount / item.targetAmount) * 100).toFixed(1)}%`;
                      }
                      return 'N/A';
                    })}
                  />
                </>
              )}

              {items[0].investorCount !== undefined && (
                <ComparisonRow
                  label="Investors"
                  values={items.map(item => item.investorCount !== undefined ? `${item.investorCount} investors` : 'N/A')}
                />
              )}

              {items[0].holdingPeriod && (
                <ComparisonRow
                  label="Holding Period"
                  values={items.map(item => item.holdingPeriod ? `${item.holdingPeriod} months` : 'N/A')}
                  highlight={true}
                  highlightBest="min"
                />
              )}

              {items[0].location && (
                <ComparisonRow
                  label="Location"
                  values={items.map(item => item.location || 'N/A')}
                />
              )}

              {items[0].status && (
                <ComparisonRow
                  label="Status"
                  values={items.map(item => item.status ? (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      item.status === 'open' ? 'bg-green-100 text-green-800' :
                      item.status === 'funding' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  ) : 'N/A')}
                />
              )}

              {/* Actions */}
              <tr className="border-t border-white/10 bg-white/5">
                <td className="p-4 font-semibold text-purple-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Actions
                  </div>
                </td>
                {items.map(item => (
                  <td key={item.id} className="p-4 text-center">
                    <Link href={item.type === 'deal' ? `/deals/${item.id}` : item.type === 'bundle' ? `/bundles/${item.id}` : `/secondary-market/${item.id}`}>
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                        View Details
                      </button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  values,
  highlight = false,
  highlightBest = 'max'
}: {
  label: string;
  values: any[];
  highlight?: boolean;
  highlightBest?: 'max' | 'min';
}) {
  let bestIndex = -1;

  if (highlight && values.length > 0) {
    const numericValues = values.map(v => {
      if (typeof v === 'string') {
        return parseFloat(v.replace(/[^0-9.-]/g, '')) || 0;
      }
      return parseFloat(v) || 0;
    });

    if (highlightBest === 'max') {
      bestIndex = numericValues.indexOf(Math.max(...numericValues));
    } else {
      bestIndex = numericValues.indexOf(Math.min(...numericValues.filter(v => v > 0)));
    }
  }

  return (
    <tr className="border-t border-white/10 hover:bg-white/5 transition-colors">
      <td className="p-4 font-semibold text-purple-200">{label}</td>
      {values.map((value, index) => (
        <td
          key={index}
          className={`p-4 text-center text-white transition-all ${
            bestIndex === index
              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 font-bold text-green-300 border-l border-r border-green-500/30 relative'
              : ''
          }`}
        >
          {bestIndex === index && (
            <div className="absolute top-2 right-2">
              <Crown className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          )}
          <div className="relative z-10">{value}</div>
        </td>
      ))}
    </tr>
  );
}

export default function DealComparePage() {
  const { formatCurrency } = usePreferences();
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <DealCompareContent />
    </Suspense>
  );
}
