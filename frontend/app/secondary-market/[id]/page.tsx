'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { secondaryMarketAPI } from '@/lib/api';
import { formatCurrency, formatDate, getDealTypeLabel } from '@/lib/utils';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await secondaryMarketAPI.getListingDetails(params.id as string);
      setListing(response.data.data.listing);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async (offerPrice: number) => {
    try {
      await secondaryMarketAPI.makeOffer(params.id as string, { offerPrice });
      setShowOfferModal(false);
      fetchListing();
      alert('Offer submitted successfully!');
    } catch (error: any) {
      console.error('Error making offer:', error);
      alert(error.response?.data?.message || 'Failed to make offer');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h2>
          <p className="text-gray-600 mb-4">The listing you're looking for doesn't exist or has been removed.</p>
          <Link href="/secondary-market" className="btn-primary inline-block">
            Back to Market
          </Link>
        </div>
      </div>
    );
  }

  const deal = listing.investment?.deal;
  const spv = listing.investment?.spv;
  const seller = listing.seller;
  const buyer = listing.buyer;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/secondary-market" className="hover:text-primary-600">
            Secondary Market
          </Link>
          <span>/</span>
          <span className="text-gray-900">{deal?.title || 'Listing'}</span>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {deal?.title}
            </h1>
            <div className="flex items-center space-x-4">
              <span className={`badge badge-${listing.status === 'active' ? 'green' : listing.status === 'sold' ? 'blue' : 'gray'} capitalize`}>
                {listing.status.replace('_', ' ')}
              </span>
              <span className="badge bg-blue-100 text-blue-800">
                {deal ? getDealTypeLabel(deal.type) : 'N/A'}
              </span>
              {deal?.location && (
                <span className="text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {deal.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Listing Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Listing Details</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Shares for Sale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listing.shares_for_sale.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Price per Share</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(listing.price_per_share)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Price</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(listing.total_price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Listed Date</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(listing.created_at)}
                </p>
              </div>
              {listing.listing_expires_at && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Expires On</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(listing.listing_expires_at)}
                  </p>
                </div>
              )}
              {listing.sold_at && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sold Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(listing.sold_at)}
                  </p>
                </div>
              )}
            </div>

            {listing.offer_price && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-1">Current Offer</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(listing.offer_price)}
                </p>
                {buyer && (
                  <p className="text-sm text-gray-600 mt-2">
                    Buyer: {buyer.name}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Original Investment Details */}
          {listing.metadata && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Original Investment Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Original Investment Amount</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(listing.metadata.original_investment_amount || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Original Price per Share</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(listing.metadata.original_price_per_share || 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Deal Information */}
          {deal && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">About the Deal</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                {deal.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-600">Expected ROI</p>
                  <p className="font-semibold text-green-600">{deal.expected_roi}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Holding Period</p>
                  <p className="font-semibold text-gray-900">{deal.holding_period_months} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Target Amount</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(deal.target_amount)}</p>
                </div>
              </div>

              <div className="mt-6">
                <Link href={`/deals/${deal.id}`} className="btn-secondary">
                  View Full Deal Details
                </Link>
              </div>
            </div>
          )}

          {/* SPV Information */}
          {spv && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">SPV Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">SPV Name</p>
                  <p className="font-semibold text-gray-900">{spv.spv_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`badge badge-${spv.status === 'operating' ? 'green' : 'blue'} inline-block capitalize`}>
                    {spv.status}
                  </p>
                </div>
                <div className="mt-4">
                  <Link href={`/spvs/${spv.id}`} className="btn-secondary">
                    View SPV Details
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Seller Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Seller Information</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {seller?.name?.charAt(0) || 'S'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{seller?.name}</p>
                <p className="text-sm text-gray-600">{seller?.email}</p>
              </div>
            </div>
          </div>

          {/* Action Card */}
          {listing.status === 'active' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Make an Offer</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Asking Price</p>
                  <p className="text-3xl font-bold text-primary-600">
                    {formatCurrency(listing.total_price)}
                  </p>
                </div>
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="btn-primary w-full"
                >
                  Make an Offer
                </button>
                <p className="text-xs text-gray-500 text-center">
                  You can offer a different price than the asking price
                </p>
              </div>
            </div>
          )}

          {listing.status === 'sold' && buyer && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-800 mb-2">Sold</h3>
              <p className="text-sm text-gray-700">
                This listing has been sold to {buyer.name} on {formatDate(listing.sold_at)}
              </p>
            </div>
          )}

          {listing.status === 'cancelled' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Cancelled</h3>
              <p className="text-sm text-gray-700">
                This listing has been cancelled by the seller.
              </p>
            </div>
          )}

          {listing.status === 'pending_acceptance' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-yellow-800 mb-2">Offer Pending</h3>
              <p className="text-sm text-gray-700">
                An offer has been made on this listing and is awaiting seller's response.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <OfferModal
          listing={listing}
          onClose={() => setShowOfferModal(false)}
          onSubmit={handleMakeOffer}
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
          <p className="text-sm text-gray-600 mb-2">Shares</p>
          <p className="font-semibold">{listing.shares_for_sale.toLocaleString()} shares</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Asking Price</p>
          <p className="font-semibold text-lg">{formatCurrency(listing.total_price)}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Your Offer (AED)</label>
          <input
            type="number"
            value={offerPrice}
            onChange={(e) => setOfferPrice(parseFloat(e.target.value))}
            className="input w-full"
            step="0.01"
            min="0"
          />
          {offerPrice < listing.total_price && (
            <p className="text-sm text-yellow-600 mt-1">
              Your offer is {formatCurrency(listing.total_price - offerPrice)} below asking price
            </p>
          )}
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
