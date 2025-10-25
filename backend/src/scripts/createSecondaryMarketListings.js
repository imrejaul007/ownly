import dotenv from 'dotenv';
import sequelize from '../config/database.js';
import { SecondaryMarketListing, Investment, User, Deal } from '../models/index.js';

dotenv.config();

const createSecondaryMarketListings = async () => {
  try {
    console.log('\n🚀 Creating Secondary Market Listings...\n');

    // Get all active investments with deals
    const investments = await Investment.findAll({
      where: { status: 'active' },
      include: [
        { model: Deal, as: 'deal' },
        { model: User, as: 'investor' },
      ],
      limit: 20, // Create listings from first 20 investments
    });

    if (investments.length === 0) {
      console.log('❌ No investments found. Please create investments first.');
      return;
    }

    console.log(`Found ${investments.length} investments to create listings from...\n`);

    const listingsData = [];

    // Create diverse listings with different scenarios
    for (let i = 0; i < Math.min(investments.length, 15); i++) {
      const investment = investments[i];
      const totalShares = parseInt(investment.shares_issued);

      // Skip if no shares
      if (totalShares <= 0) continue;

      // Vary the percentage of shares being sold (20% to 80%)
      const sharePercentage = 0.2 + Math.random() * 0.6;
      const sharesForSale = Math.floor(totalShares * sharePercentage);

      if (sharesForSale <= 0) continue;

      // Calculate original price per share
      const originalPricePerShare = parseFloat(investment.amount) / totalShares;

      // Vary the markup/discount (-20% to +50%)
      const priceMultiplier = 0.8 + Math.random() * 0.7;
      const pricePerShare = originalPricePerShare * priceMultiplier;
      const totalPrice = pricePerShare * sharesForSale;

      // Determine status (most active, some with offers, few sold/cancelled)
      let status = 'active';
      let buyerId = null;
      let offerPrice = null;
      let soldAt = null;

      const statusRand = Math.random();
      if (statusRand < 0.15) {
        // 15% chance of pending acceptance (has offer)
        status = 'pending_acceptance';
        // Get a random user as buyer (different from seller)
        const potentialBuyers = await User.findAll({
          where: { id: { [sequelize.Sequelize.Op.ne]: investment.user_id } },
          limit: 10,
        });
        if (potentialBuyers.length > 0) {
          buyerId = potentialBuyers[Math.floor(Math.random() * potentialBuyers.length)].id;
          // Offer price is usually 5-10% below asking
          offerPrice = totalPrice * (0.90 + Math.random() * 0.05);
        }
      } else if (statusRand < 0.20) {
        // 5% chance of sold
        status = 'sold';
        const potentialBuyers = await User.findAll({
          where: { id: { [sequelize.Sequelize.Op.ne]: investment.user_id } },
          limit: 10,
        });
        if (potentialBuyers.length > 0) {
          buyerId = potentialBuyers[Math.floor(Math.random() * potentialBuyers.length)].id;
          offerPrice = totalPrice * (0.92 + Math.random() * 0.08);
          soldAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Within last 30 days
        }
      } else if (statusRand < 0.23) {
        // 3% chance of cancelled
        status = 'cancelled';
      }

      // Set listing expiration (some expire, some don't)
      let listingExpiresAt = null;
      if (Math.random() < 0.3) {
        // 30% have expiration dates
        const daysUntilExpiry = 7 + Math.floor(Math.random() * 60); // 7 to 67 days
        listingExpiresAt = new Date(Date.now() + daysUntilExpiry * 24 * 60 * 60 * 1000);
      }

      // Create listing date (1-60 days ago)
      const daysAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      listingsData.push({
        investment_id: investment.id,
        seller_id: investment.user_id,
        buyer_id: buyerId,
        shares_for_sale: sharesForSale,
        price_per_share: pricePerShare.toFixed(2),
        total_price: totalPrice.toFixed(2),
        offer_price: offerPrice ? offerPrice.toFixed(2) : null,
        status,
        listing_expires_at: listingExpiresAt,
        sold_at: soldAt,
        created_at: createdAt,
        metadata: {
          deal_title: investment.deal?.title,
          original_investment_amount: parseFloat(investment.amount),
          original_price_per_share: originalPricePerShare.toFixed(2),
          price_change_percentage: ((priceMultiplier - 1) * 100).toFixed(2),
        },
      });
    }

    // Bulk create listings
    const createdListings = await SecondaryMarketListing.bulkCreate(listingsData);

    console.log(`\n✅ Created ${createdListings.length} secondary market listings!\n`);

    // Show summary by status
    const statusCounts = createdListings.reduce((acc, listing) => {
      acc[listing.status] = (acc[listing.status] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Listings by Status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

    // Show some sample listings
    console.log('\n📝 Sample Listings:\n');
    for (let i = 0; i < Math.min(5, createdListings.length); i++) {
      const listing = createdListings[i];
      const investment = investments.find(inv => inv.id === listing.investment_id);
      console.log(`${i + 1}. ${investment?.deal?.title || 'Unknown Deal'}`);
      console.log(`   Shares: ${listing.shares_for_sale} | Price: AED ${parseFloat(listing.total_price).toLocaleString()}`);
      console.log(`   Status: ${listing.status}`);
      if (listing.metadata?.price_change_percentage) {
        const change = parseFloat(listing.metadata.price_change_percentage);
        const symbol = change >= 0 ? '+' : '';
        console.log(`   Price Change: ${symbol}${change}%`);
      }
      console.log('');
    }

    console.log('✅ Secondary market data created successfully!\n');

  } catch (error) {
    console.error('❌ Error creating secondary market listings:', error);
    throw error;
  }
};

// Run the script
(async () => {
  try {
    await createSecondaryMarketListings();
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Script failed:', error);
    await sequelize.close();
    process.exit(1);
  }
})();
