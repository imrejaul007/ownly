'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Deal } from '@/types';
import { dealAPI, bundleAPI, secondaryMarketAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, getDealTypeLabel } from '@/lib/utils';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <Link href="/deals" className="text-white hover:text-primary-100 mb-4 inline-block">
            ← Back to Deals
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            Compare Investment Opportunities
          </h1>
          <p className="text-primary-100 text-lg">
            Compare up to 4 investment opportunities side by side to make informed decisions
          </p>
        </div>
      </div>

      {/* Item Selector */}
      {items.length < 4 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Add Items to Compare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allDeals
              .filter(deal => !selectedItems.includes(`deal:${deal.id}`))
              .slice(0, 6)
              .map(deal => (
                <button
                  key={deal.id}
                  onClick={() => handleAddItem(deal.id)}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition"
                >
                  <div className="text-xs text-primary-600 font-semibold mb-1">📋 DEAL</div>
                  <div className="font-semibold text-sm mb-1">{deal.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {getDealTypeLabel(deal.type)} • {formatPercentage(deal.expected_roi || 0)} ROI
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {items.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Select Items to Compare
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Choose at least 2 items from deals, bundles, or secondary market to start comparing
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
                  Feature
                </th>
                {items.map(item => (
                  <th key={item.id} className="p-4 text-center min-w-[200px] bg-gray-50 dark:bg-gray-900">
                    <div className="text-xs text-primary-600 font-semibold mb-1">
                      {item.type.toUpperCase()}
                    </div>
                    <div className="font-bold text-sm mb-2">{item.title}</div>
                    <button
                      onClick={() => handleRemoveItem(`${item.type}:${item.id}`)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
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
              <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <td className="p-4 font-semibold">Actions</td>
                {items.map(item => (
                  <td key={item.id} className="p-4 text-center">
                    <Link href={item.type === 'deal' ? `/deals/${item.id}` : item.type === 'bundle' ? `/bundles/${item.id}` : `/secondary-market/${item.id}`}>
                      <button className="btn-primary w-full mb-2">
                        View Details
                      </button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
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
    <tr className="border-t border-gray-200 dark:border-gray-700">
      <td className="p-4 font-semibold text-gray-700 dark:text-gray-300">{label}</td>
      {values.map((value, index) => (
        <td
          key={index}
          className={`p-4 text-center ${
            bestIndex === index
              ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400'
              : ''
          }`}
        >
          {value}
        </td>
      ))}
    </tr>
  );
}

export default function DealComparePage() {
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
