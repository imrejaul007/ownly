'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { secondaryMarketAPI } from '@/lib/api';
import { formatCurrency, formatDate, getDealTypeLabel } from '@/lib/utils';

export default function SecondaryMarketPage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-listings' | 'my-purchases' | 'my-offers'>('browse');
  const [listings, setListings] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  // Filter states
  const [filters, setFilters] = useState({
    dealType: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  useEffect(() => {
    fetchListings();
  }, [activeTab, filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      if (activeTab === 'browse') {
        const params: any = {};
        if (filters.dealType) params.dealType = filters.dealType;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;

        const response = await secondaryMarketAPI.getActiveListings(params);
        let filteredListings = response.data.data.listings;

        // Client-side search filter for deal title
        if (filters.search) {
          filteredListings = filteredListings.filter((listing: any) =>
            listing.investment?.deal?.title?.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        setListings(filteredListings);
      } else {
        const response = await secondaryMarketAPI.getMyListings();
        setMyListings(response.data.data.listings);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      dealType: '',
      minPrice: '',
      maxPrice: '',
      search: '',
    });
  };

  const handleMakeOffer = async (listingId: string, offerPrice: number) => {
    try {
      await secondaryMarketAPI.makeOffer(listingId, { offerPrice });
      setShowOfferModal(false);
      fetchListings();
      alert('Offer submitted successfully!');
    } catch (error: any) {
      console.error('Error making offer:', error);
      alert(error.response?.data?.message || 'Failed to make offer');
    }
  };

  const handleRespondToOffer = async (listingId: string, action: 'accept' | 'reject') => {
    try {
      await secondaryMarketAPI.respondToOffer(listingId, { action });
      fetchListings();
      alert(`Offer ${action}ed successfully!`);
    } catch (error: any) {
      console.error('Error responding to offer:', error);
      alert(error.response?.data?.message || `Failed to ${action} offer`);
    }
  };

  const handleCancelListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to cancel this listing?')) return;

    try {
      await secondaryMarketAPI.cancelListing(listingId);
      fetchListings();
      alert('Listing cancelled successfully!');
    } catch (error: any) {
      console.error('Error cancelling listing:', error);
      alert(error.response?.data?.message || 'Failed to cancel listing');
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
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Secondary Market
            </h1>
            <p className="text-purple-100">
              Buy and sell investment shares from other investors • Access immediate liquidity
            </p>
          </div>
          <div className="hidden md:block text-7xl">💱</div>
        </div>

        {/* Market Statistics */}
        {activeTab === 'browse' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-purple-100 text-xs mb-1">Active Listings</div>
              <div className="text-3xl font-bold">{listings.length}</div>
              <div className="text-xs text-purple-200 mt-1">Available now</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-purple-100 text-xs mb-1">Total Market Value</div>
              <div className="text-3xl font-bold">
                {formatCurrency(listings.reduce((sum, l) => sum + parseFloat(l.total_price || 0), 0))}
              </div>
              <div className="text-xs text-purple-200 mt-1">In listings</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-purple-100 text-xs mb-1">Avg Investment</div>
              <div className="text-3xl font-bold">
                {formatCurrency(listings.length > 0 ? listings.reduce((sum, l) => sum + parseFloat(l.total_price || 0), 0) / listings.length : 0)}
              </div>
              <div className="text-xs text-purple-200 mt-1">Per listing</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-purple-100 text-xs mb-1">Total Shares</div>
              <div className="text-3xl font-bold">
                {listings.reduce((sum, l) => sum + parseInt(l.shares_for_sale || 0), 0).toLocaleString()}
              </div>
              <div className="text-xs text-purple-200 mt-1">For sale</div>
            </div>
          </div>
        )}
      </div>

      {/* Market Opportunity Banner */}
      {activeTab === 'browse' && listings.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <span className="text-3xl">🚀</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-1">
                Investment Opportunities Available
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                {listings.length} pre-vetted investments ready for immediate purchase • Average {
                  (listings.reduce((sum, l) => {
                    const roi = l.investment?.deal?.expected_roi || 12;
                    return sum + roi;
                  }, 0) / listings.length).toFixed(1)
                }% expected annual return
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-600 dark:text-green-400 mb-1">Potential Monthly Income</div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(
                  listings.reduce((sum, l) => {
                    const price = parseFloat(l.total_price || 0);
                    const roi = l.investment?.deal?.expected_roi || 12;
                    return sum + ((price * (roi / 100)) / 12);
                  }, 0)
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'browse'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Browse Listings
          </button>
          <button
            onClick={() => setActiveTab('my-listings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-listings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('my-purchases')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-purchases'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Purchases
          </button>
          <button
            onClick={() => setActiveTab('my-offers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-offers'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Offers
          </button>
        </nav>
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search by Deal
                </label>
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deal Type
                </label>
                <select
                  value={filters.dealType}
                  onChange={(e) => setFilters({ ...filters, dealType: e.target.value })}
                  className="input w-full"
                >
                  <option value="">All Types</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="startup">Startup</option>
                  <option value="franchise">Franchise</option>
                  <option value="asset">Asset</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Price (AED)
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Price (AED)
                </label>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="input w-full"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={clearFilters} className="btn-secondary text-sm">
                Clear Filters
              </button>
            </div>
          </div>

          {/* Listings */}
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No active listings available</p>
            </div>
          ) : (
            listings.map((listing) => {
              // Calculate potential and earnings metrics
              const deal = listing.investment?.deal;
              const expectedAnnualROI = deal?.expected_roi || 12;
              const pricePerShare = parseFloat(listing.price_per_share || 0);
              const sharesForSale = parseInt(listing.shares_for_sale || 0);
              const totalPrice = parseFloat(listing.total_price || 0);

              // Calculate monthly revenue per share
              const monthlyRevenuePerShare = (pricePerShare * (expectedAnnualROI / 100)) / 12;
              const totalMonthlyRevenue = monthlyRevenuePerShare * sharesForSale;

              // Calculate annual potential return
              const annualReturn = totalPrice * (expectedAnnualROI / 100);

              // Check if there's a discount (if we have original investment data)
              const originalValue = listing.investment?.amount ?
                (parseFloat(listing.investment.amount) / (listing.investment.shares_issued || 1)) * sharesForSale :
                totalPrice;
              const discountPercentage = ((originalValue - totalPrice) / originalValue) * 100;
              const hasDiscount = discountPercentage > 5;
              const hasPremium = discountPercentage < -5;

              return (
                <div
                  key={listing.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800"
                >
                  {/* Top indicator bar */}
                  <div className={`h-2 ${
                    hasDiscount ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                    expectedAnnualROI > 15 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                    'bg-gradient-to-r from-purple-400 to-pink-500'
                  }`}></div>

                  <div className="p-6">
                    {/* Header with badges */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                              {listing.investment?.deal?.title}
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold">
                                {listing.investment?.deal ? getDealTypeLabel(listing.investment.deal.type) : 'N/A'}
                              </span>
                              {hasDiscount && (
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold flex items-center">
                                  <span className="mr-1">🔥</span>
                                  {Math.abs(discountPercentage).toFixed(0)}% Discount
                                </span>
                              )}
                              {hasPremium && (
                                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-xs font-semibold">
                                  Premium Listing
                                </span>
                              )}
                              {expectedAnnualROI > 15 && (
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-semibold flex items-center">
                                  <span className="mr-1">⭐</span>
                                  High Yield
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Listed by: <span className="font-semibold">{listing.seller?.name}</span> • {formatDate(listing.created_at)}
                            </div>
                          </div>
                        </div>

                        {/* Investment Potential Banner */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                <span className="text-2xl">💎</span>
                              </div>
                              <div>
                                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                                  Investment Potential
                                </div>
                                <div className="text-lg font-bold text-indigo-900 dark:text-indigo-300">
                                  {formatCurrency(annualReturn)}/year
                                </div>
                                <div className="text-xs text-indigo-600 dark:text-indigo-400">
                                  Based on {expectedAnnualROI}% expected annual return
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Monthly Passive Income</div>
                              <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">
                                {formatCurrency(totalMonthlyRevenue)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {/* Shares Available */}
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1 flex items-center">
                              <span className="mr-1">📊</span>
                              Shares Available
                            </div>
                            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                              {sharesForSale.toLocaleString()}
                            </div>
                          </div>

                          {/* Price per Share */}
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1 flex items-center">
                              <span className="mr-1">💰</span>
                              Per Share
                            </div>
                            <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                              {formatCurrency(pricePerShare)}
                            </div>
                          </div>

                          {/* Monthly Revenue Per Share */}
                          <div className="bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-800/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
                            <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold mb-1 flex items-center">
                              <span className="mr-1">💵</span>
                              Monthly/Share
                            </div>
                            <div className="text-xl font-bold text-teal-700 dark:text-teal-300">
                              {formatCurrency(monthlyRevenuePerShare)}
                            </div>
                            <div className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                              ~{expectedAnnualROI}% APY
                            </div>
                          </div>

                          {/* Total Investment */}
                          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-800/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                            <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1 flex items-center">
                              <span className="mr-1">🎯</span>
                              Total Price
                            </div>
                            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                              {formatCurrency(totalPrice)}
                            </div>
                          </div>
                        </div>

                        {/* Additional Value Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Expected ROI */}
                          <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-lg">📈</span>
                            </div>
                            <div>
                              <div className="text-xs text-green-600 dark:text-green-400">Expected ROI</div>
                              <div className="text-lg font-bold text-green-700 dark:text-green-300">
                                {expectedAnnualROI}% APY
                              </div>
                            </div>
                          </div>

                          {/* Deal Location */}
                          {deal?.location && (
                            <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-lg">📍</span>
                              </div>
                              <div>
                                <div className="text-xs text-blue-600 dark:text-blue-400">Location</div>
                                <div className="text-sm font-bold text-blue-700 dark:text-blue-300 truncate">
                                  {deal.location}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Payback Period */}
                          <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-lg">⏱️</span>
                            </div>
                            <div>
                              <div className="text-xs text-purple-600 dark:text-purple-400">Est. Payback</div>
                              <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                {Math.ceil(100 / expectedAnnualROI)} years
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          setSelectedListing(listing);
                          setShowOfferModal(true);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg flex items-center font-semibold"
                      >
                        <span className="mr-2">💼</span>
                        Make Offer
                      </button>
                      <Link href={`/secondary-market/${listing.id}`}>
                        <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-semibold flex items-center">
                          <span className="mr-2">📋</span>
                          View Details
                        </button>
                      </Link>
                      {deal && (
                        <Link href={`/deals/${deal.id}`}>
                          <button className="px-6 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-all font-semibold flex items-center border border-blue-200 dark:border-blue-800">
                            <span className="mr-2">🏢</span>
                            Deal Info
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* My Listings Tab */}
      {activeTab === 'my-listings' && (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <Link href="/portfolio" className="btn-primary">
              + Create Listing
            </Link>
          </div>

          {myListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">You haven't created any listings yet</p>
              <Link href="/portfolio" className="btn-primary inline-block mt-4">
                Go to Portfolio
              </Link>
            </div>
          ) : (
            myListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {listing.investment?.deal?.title}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <span className={`badge badge-${listing.status === 'active' ? 'green' : listing.status === 'sold' ? 'blue' : 'gray'} capitalize`}>
                        {listing.status}
                      </span>
                      {listing.buyer && (
                        <span className="text-sm text-gray-600">
                          Buyer: {listing.buyer.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Shares</p>
                    <p className="font-semibold">{listing.shares_for_sale.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Asking Price</p>
                    <p className="font-semibold">{formatCurrency(listing.total_price)}</p>
                  </div>
                  {listing.offer_price && (
                    <div>
                      <p className="text-sm text-gray-600">Offer Price</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(listing.offer_price)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">
                      {listing.status === 'sold' ? 'Sold On' : 'Listed On'}
                    </p>
                    <p className="font-semibold">
                      {formatDate(listing.sold_at || listing.created_at)}
                    </p>
                  </div>
                </div>

                {listing.status === 'pending_acceptance' && (
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => handleRespondToOffer(listing.id, 'accept')}
                      className="btn-primary"
                    >
                      Accept Offer
                    </button>
                    <button
                      onClick={() => handleRespondToOffer(listing.id, 'reject')}
                      className="btn-secondary"
                    >
                      Reject Offer
                    </button>
                  </div>
                )}

                {listing.status === 'active' && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleCancelListing(listing.id)}
                      className="btn-secondary text-sm"
                    >
                      Cancel Listing
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* My Purchases Tab */}
      {activeTab === 'my-purchases' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Track your investments acquired through the secondary market. These shares were purchased from other investors.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your secondary market purchases will appear here</p>
            <Link href="/investments" className="btn-primary inline-block">
              View All Investments
            </Link>
          </div>
        </div>
      )}

      {/* My Offers Tab */}
      {activeTab === 'my-offers' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Track all offers you've made on other investors' listings. See pending, accepted, and rejected offers.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your offers will appear here</p>
            <Link href="/secondary-market" onClick={() => setActiveTab('browse')} className="btn-primary inline-block">
              Browse Listings
            </Link>
          </div>
        </div>
      )}

      {/* Make Offer Modal */}
      {showOfferModal && selectedListing && (
        <OfferModal
          listing={selectedListing}
          onClose={() => {
            setShowOfferModal(false);
            setSelectedListing(null);
          }}
          onSubmit={(offerPrice) => handleMakeOffer(selectedListing.id, offerPrice)}
        />
      )}
    </div>
  );
}

function OfferModal({
  listing,
  onClose,
  onSubmit,
}: {
  listing: any;
  onClose: () => void;
  onSubmit: (offerPrice: number) => void;
}) {
  const [offerPrice, setOfferPrice] = useState(listing.total_price);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Make an Offer</h2>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Deal</p>
          <p className="font-semibold">{listing.investment?.deal?.title}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Asking Price</p>
          <p className="font-semibold text-lg">{formatCurrency(listing.total_price)}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Your Offer</label>
          <input
            type="number"
            value={offerPrice}
            onChange={(e) => setOfferPrice(parseFloat(e.target.value))}
            className="input w-full"
            step="0.01"
            min="0"
          />
        </div>

        <div className="flex space-x-3">
          <button onClick={() => onSubmit(offerPrice)} className="btn-primary flex-1">
            Submit Offer
          </button>
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
