'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

interface SearchResults {
  deals: any[];
  investments: any[];
  documents: any[];
  announcements: any[];
  total: number;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState({
    dealType: '',
    dealStatus: '',
    minAmount: '',
    maxAmount: '',
    location: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  useEffect(() => {
    if (query.length >= 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const performAdvancedSearch = async (entity: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (query) params.append('q', query);

      Object.entries(advancedFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search/${entity}?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();

      // Update results with entity-specific data
      setResults({
        deals: entity === 'deals' ? data.results : [],
        investments: entity === 'investments' ? data.results : [],
        documents: entity === 'documents' ? data.results : [],
        announcements: entity === 'announcements' ? data.results : [],
        total: data.results.length,
      });
    } catch (error) {
      console.error('Error performing advanced search:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search/suggestions?q=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      performSearch(query);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter !== 'all' && query) {
      performAdvancedSearch(filter);
    } else if (query) {
      performSearch(query);
    }
  };

  const getTotalResults = () => {
    if (!results) return 0;
    if (activeFilter === 'all') return results.total;
    if (activeFilter === 'deals') return results.deals.length;
    if (activeFilter === 'investments') return results.investments.length;
    if (activeFilter === 'documents') return results.documents.length;
    if (activeFilter === 'announcements') return results.announcements.length;
    return 0;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search</h1>
          <p className="text-gray-600">Search across deals, investments, documents, and announcements</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for deals, investments, documents..."
                className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <span className="text-xl">🔍</span>
              </div>
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setResults(null);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion);
                      setSuggestions([]);
                      performSearch(suggestion);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => handleFilterChange('deals')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'deals'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Deals {results && `(${results.deals.length})`}
            </button>
            <button
              onClick={() => handleFilterChange('investments')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'investments'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Investments {results && `(${results.investments.length})`}
            </button>
            <button
              onClick={() => handleFilterChange('documents')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'documents'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Documents {results && `(${results.documents.length})`}
            </button>
            <button
              onClick={() => handleFilterChange('announcements')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'announcements'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Announcements {results && `(${results.announcements.length})`}
            </button>
          </div>
        </div>

        {activeFilter === 'deals' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Deal Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deal Type</label>
                <select
                  value={advancedFilters.dealType}
                  onChange={(e) => {
                    setAdvancedFilters({ ...advancedFilters, dealType: e.target.value });
                    performAdvancedSearch('deals');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="equity">Equity</option>
                  <option value="debt">Debt</option>
                  <option value="revenue_share">Revenue Share</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={advancedFilters.dealStatus}
                  onChange={(e) => {
                    setAdvancedFilters({ ...advancedFilters, dealStatus: e.target.value });
                    performAdvancedSearch('deals');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="funded">Funded</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={advancedFilters.location}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, location: e.target.value })}
                  onBlur={() => performAdvancedSearch('deals')}
                  placeholder="e.g., New York"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount</label>
                <input
                  type="number"
                  value={advancedFilters.minAmount}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, minAmount: e.target.value })}
                  onBlur={() => performAdvancedSearch('deals')}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount</label>
                <input
                  type="number"
                  value={advancedFilters.maxAmount}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, maxAmount: e.target.value })}
                  onBlur={() => performAdvancedSearch('deals')}
                  placeholder="∞"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Searching...</div>
          </div>
        )}

        {!loading && results && (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Found {getTotalResults()} result{getTotalResults() !== 1 ? 's' : ''} for "{query}"
            </div>

            {(activeFilter === 'all' || activeFilter === 'deals') && results.deals.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Deals</h2>
                <div className="space-y-4">
                  {results.deals.map((deal) => (
                    <Link
                      key={deal.id}
                      href={`/deals/${deal.id}`}
                      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            deal.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {deal.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>💰 ${deal.target_raise?.toLocaleString()}</span>
                        <span>📊 {deal.deal_type}</span>
                        {deal.location && <span>📍 {deal.location}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(activeFilter === 'all' || activeFilter === 'investments') && results.investments.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Investments</h2>
                <div className="space-y-4">
                  {results.investments.map((investment) => (
                    <Link
                      key={investment.id}
                      href={`/portfolio`}
                      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Investment in {investment.Deal?.title || 'Unknown Deal'}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            investment.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {investment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>💵 ${investment.amount?.toLocaleString()}</span>
                        <span>📅 {new Date(investment.created_at).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(activeFilter === 'all' || activeFilter === 'documents') && results.documents.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
                <div className="space-y-4">
                  {results.documents.map((document) => (
                    <div
                      key={document.id}
                      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">📄</span>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{document.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 capitalize">{document.document_type}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                        <span>📅 {new Date(document.created_at).toLocaleDateString()}</span>
                        {document.file_size && <span>📦 {(document.file_size / 1024).toFixed(0)} KB</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeFilter === 'all' || activeFilter === 'announcements') &&
              results.announcements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Announcements</h2>
                  <div className="space-y-4">
                    {results.announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              announcement.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : announcement.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {announcement.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{announcement.message}</p>
                        <div className="text-xs text-gray-500">
                          📅 {new Date(announcement.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {getTotalResults() === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters to find what you're looking for
                </p>
              </div>
            )}
          </div>
        )}

        {!loading && !results && query && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-6xl mb-4">👋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Press Enter to search</h3>
            <p className="text-gray-600">Enter your search query and press Enter to see results</p>
          </div>
        )}

        {!loading && !results && !query && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-6xl mb-4">🔎</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
            <p className="text-gray-600 mb-4">
              Search across all your deals, investments, documents, and announcements
            </p>
            <div className="text-sm text-gray-500">
              <p>Try searching for:</p>
              <div className="flex justify-center gap-2 mt-2">
                <button
                  onClick={() => {
                    setQuery('real estate');
                    performSearch('real estate');
                  }}
                  className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  real estate
                </button>
                <button
                  onClick={() => {
                    setQuery('tech');
                    performSearch('tech');
                  }}
                  className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  tech
                </button>
                <button
                  onClick={() => {
                    setQuery('contract');
                    performSearch('contract');
                  }}
                  className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  contract
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
