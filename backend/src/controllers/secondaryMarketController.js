import sequelize from '../config/database.js';
import {
  SecondaryMarketListing,
  Investment,
  User,
  Deal,
  SPV,
  Wallet,
  Transaction
} from '../models/index.js';
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * List all active secondary market listings
 */
export const getActiveListings = async (req, res, next) => {
  try {
    const { dealId, minPrice, maxPrice, dealType } = req.query;

    const where = { status: 'active' };

    const listings = await SecondaryMarketListing.findAll({
      where,
      include: [
        {
          model: Investment,
          as: 'investment',
          include: [
            {
              model: Deal,
              as: 'deal',
              where: dealId ? { id: dealId } : {},
              ...(dealType && { where: { type: dealType } }),
            },
            {
              model: SPV,
              as: 'spv',
            },
          ],
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // Filter by price if specified
    let filteredListings = listings;
    if (minPrice) {
      filteredListings = filteredListings.filter(
        listing => parseFloat(listing.total_price) >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      filteredListings = filteredListings.filter(
        listing => parseFloat(listing.total_price) <= parseFloat(maxPrice)
      );
    }

    successResponse(res, {
      listings: filteredListings,
      count: filteredListings.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's own listings (as seller)
 */
export const getMyListings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const listings = await SecondaryMarketListing.findAll({
      where: { seller_id: userId },
      include: [
        {
          model: Investment,
          as: 'investment',
          include: [
            {
              model: Deal,
              as: 'deal',
            },
            {
              model: SPV,
              as: 'spv',
            },
          ],
        },
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    successResponse(res, { listings, count: listings.length });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new secondary market listing
 */
export const createListing = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { investmentId, sharesForSale, pricePerShare, expiresInDays } = req.body;

    // Validate investment ownership
    const investment = await Investment.findOne({
      where: { id: investmentId, user_id: userId },
      include: [{ model: Deal, as: 'deal' }],
    });

    if (!investment) {
      return errorResponse(res, 'Investment not found or not owned by you', 404);
    }

    // Check if shares available
    const existingListings = await SecondaryMarketListing.findAll({
      where: {
        investment_id: investmentId,
        status: ['active', 'pending_acceptance'],
      },
    });

    const totalListedShares = existingListings.reduce(
      (sum, listing) => sum + parseInt(listing.shares_for_sale),
      0
    );

    const availableShares = parseInt(investment.shares_issued) - totalListedShares;

    if (sharesForSale > availableShares) {
      return errorResponse(
        res,
        `Only ${availableShares} shares available to list. ${totalListedShares} already listed.`,
        400
      );
    }

    // Calculate total price
    const totalPrice = parseFloat(pricePerShare) * parseInt(sharesForSale);

    // Calculate expiration date
    let listingExpiresAt = null;
    if (expiresInDays) {
      listingExpiresAt = new Date();
      listingExpiresAt.setDate(listingExpiresAt.getDate() + parseInt(expiresInDays));
    }

    // Create listing
    const listing = await SecondaryMarketListing.create(
      {
        investment_id: investmentId,
        seller_id: userId,
        shares_for_sale: sharesForSale,
        price_per_share: pricePerShare,
        total_price: totalPrice,
        status: 'active',
        listing_expires_at: listingExpiresAt,
        metadata: {
          deal_title: investment.deal?.title,
          original_investment_amount: investment.amount,
          original_price_per_share: parseFloat(investment.amount) / parseInt(investment.shares_issued),
        },
      },
      { transaction: t }
    );

    await t.commit();

    // Fetch full listing with relationships
    const fullListing = await SecondaryMarketListing.findByPk(listing.id, {
      include: [
        {
          model: Investment,
          as: 'investment',
          include: [{ model: Deal, as: 'deal' }, { model: SPV, as: 'spv' }],
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    successResponse(res, { listing: fullListing }, 201);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * Make an offer on a listing
 */
export const makeOffer = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { listingId } = req.params;
    const { offerPrice } = req.body;

    // Get listing
    const listing = await SecondaryMarketListing.findByPk(listingId, {
      include: [
        {
          model: Investment,
          as: 'investment',
          include: [{ model: Deal, as: 'deal' }],
        },
      ],
    });

    if (!listing) {
      return errorResponse(res, 'Listing not found', 404);
    }

    if (listing.status !== 'active') {
      return errorResponse(res, 'Listing is not active', 400);
    }

    if (listing.seller_id === userId) {
      return errorResponse(res, 'Cannot make offer on your own listing', 400);
    }

    // Check wallet balance
    const wallet = await Wallet.findOne({ where: { user_id: userId } });
    if (!wallet || parseFloat(wallet.balance) < parseFloat(offerPrice)) {
      return errorResponse(res, 'Insufficient wallet balance', 400);
    }

    // Update listing with offer
    await listing.update(
      {
        buyer_id: userId,
        offer_price: offerPrice,
        status: 'pending_acceptance',
        metadata: {
          ...listing.metadata,
          offer_made_at: new Date(),
        },
      },
      { transaction: t }
    );

    await t.commit();

    // Fetch updated listing
    const updatedListing = await SecondaryMarketListing.findByPk(listingId, {
      include: [
        {
          model: Investment,
          as: 'investment',
          include: [{ model: Deal, as: 'deal' }],
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    successResponse(res, { listing: updatedListing });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * Accept/reject an offer (seller action)
 */
export const respondToOffer = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { listingId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    const listing = await SecondaryMarketListing.findByPk(listingId, {
      include: [
        {
          model: Investment,
          as: 'investment',
        },
      ],
    });

    if (!listing) {
      return errorResponse(res, 'Listing not found', 404);
    }

    if (listing.seller_id !== userId) {
      return errorResponse(res, 'Only seller can respond to offers', 403);
    }

    if (listing.status !== 'pending_acceptance') {
      return errorResponse(res, 'No pending offer to respond to', 400);
    }

    if (action === 'reject') {
      // Reject offer - return to active
      await listing.update(
        {
          buyer_id: null,
          offer_price: null,
          status: 'active',
          metadata: {
            ...listing.metadata,
            offer_rejected_at: new Date(),
          },
        },
        { transaction: t }
      );

      await t.commit();

      successResponse(res, { message: 'Offer rejected', listing });
      return;
    }

    if (action === 'accept') {
      // Accept offer - complete the transaction
      const buyer = await User.findByPk(listing.buyer_id);
      const seller = await User.findByPk(listing.seller_id);

      const buyerWallet = await Wallet.findOne({ where: { user_id: buyer.id } });
      const sellerWallet = await Wallet.findOne({ where: { user_id: seller.id } });

      const transactionAmount = parseFloat(listing.offer_price || listing.total_price);

      // Check buyer has funds
      if (parseFloat(buyerWallet.balance) < transactionAmount) {
        return errorResponse(res, 'Buyer has insufficient funds', 400);
      }

      // Transfer funds
      await buyerWallet.update(
        { balance: parseFloat(buyerWallet.balance) - transactionAmount },
        { transaction: t }
      );

      await sellerWallet.update(
        { balance: parseFloat(sellerWallet.balance) + transactionAmount },
        { transaction: t }
      );

      // Create new investment for buyer
      const originalInvestment = listing.investment;
      const sharesBeingSold = parseInt(listing.shares_for_sale);
      const pricePerShare = transactionAmount / sharesBeingSold;

      const newInvestment = await Investment.create(
        {
          user_id: buyer.id,
          deal_id: originalInvestment.deal_id,
          spv_id: originalInvestment.spv_id,
          amount: transactionAmount,
          shares_issued: sharesBeingSold,
          status: 'active',
          invested_at: new Date(),
          metadata: {
            ...originalInvestment.metadata,
            acquired_via_secondary_market: true,
            original_seller_id: seller.id,
            listing_id: listing.id,
          },
        },
        { transaction: t }
      );

      // Update seller's investment (reduce shares)
      const remainingShares = parseInt(originalInvestment.shares_issued) - sharesBeingSold;
      if (remainingShares > 0) {
        await originalInvestment.update(
          { shares_issued: remainingShares },
          { transaction: t }
        );
      } else {
        // All shares sold
        await originalInvestment.update(
          {
            shares_issued: 0,
            status: 'exited',
          },
          { transaction: t }
        );
      }

      // Record transactions
      await Transaction.create(
        {
          user_id: buyer.id,
          type: 'secondary_market_purchase',
          amount: -transactionAmount,
          description: `Purchased ${sharesBeingSold} shares via secondary market`,
          reference_type: 'secondary_market_listing',
          reference_id: listing.id,
          metadata: { investment_id: newInvestment.id },
        },
        { transaction: t }
      );

      await Transaction.create(
        {
          user_id: seller.id,
          type: 'secondary_market_sale',
          amount: transactionAmount,
          description: `Sold ${sharesBeingSold} shares via secondary market`,
          reference_type: 'secondary_market_listing',
          reference_id: listing.id,
          metadata: { original_investment_id: originalInvestment.id },
        },
        { transaction: t }
      );

      // Update listing
      await listing.update(
        {
          status: 'sold',
          sold_at: new Date(),
          metadata: {
            ...listing.metadata,
            transaction_completed_at: new Date(),
            new_investment_id: newInvestment.id,
          },
        },
        { transaction: t }
      );

      await t.commit();

      successResponse(res, {
        message: 'Offer accepted and transaction completed',
        listing,
        newInvestment,
      });
      return;
    }

    errorResponse(res, 'Invalid action. Must be "accept" or "reject"', 400);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * Cancel a listing (seller action)
 */
export const cancelListing = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.params;

    const listing = await SecondaryMarketListing.findByPk(listingId);

    if (!listing) {
      return errorResponse(res, 'Listing not found', 404);
    }

    if (listing.seller_id !== userId) {
      return errorResponse(res, 'Only seller can cancel the listing', 403);
    }

    if (listing.status === 'sold') {
      return errorResponse(res, 'Cannot cancel a sold listing', 400);
    }

    await listing.update({
      status: 'cancelled',
      metadata: {
        ...listing.metadata,
        cancelled_at: new Date(),
      },
    });

    successResponse(res, { message: 'Listing cancelled', listing });
  } catch (error) {
    next(error);
  }
};

/**
 * Get listing details
 */
export const getListingDetails = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    const listing = await SecondaryMarketListing.findByPk(listingId, {
      include: [
        {
          model: Investment,
          as: 'investment',
          include: [
            {
              model: Deal,
              as: 'deal',
            },
            {
              model: SPV,
              as: 'spv',
            },
          ],
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!listing) {
      return errorResponse(res, 'Listing not found', 404);
    }

    successResponse(res, { listing });
  } catch (error) {
    next(error);
  }
};
