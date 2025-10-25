import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/database.js';
import {
  User,
  Deal,
  SPV,
  Investment,
  Transaction,
} from '../models/index.js';
import logger from '../config/logger.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * OWNLY Data Importer
 *
 * Imports comprehensive JSON dataset including:
 * - 15 Brands (mapped to Deals)
 * - 20 Investors (mapped to Users)
 * - Portfolio investments (mapped to Investments)
 * - 36 months of ROI data (mapped to Transactions)
 * - Exit events (mapped to Transactions)
 */

const importOwnlyData = async () => {
  try {
    logger.info('🚀 Starting OWNLY data import...');

    // Read the seed data JSON file
    const seedDataPath = path.join(__dirname, '../../seed-data.json');

    if (!fs.existsSync(seedDataPath)) {
      throw new Error(`Seed data file not found at ${seedDataPath}`);
    }

    const rawData = fs.readFileSync(seedDataPath, 'utf8');
    const data = JSON.parse(rawData);

    logger.info(`📊 Dataset info: ${data.platform} - Generated on ${data.generated_on}`);

    // Connect to database
    await sequelize.authenticate();
    logger.info('✅ Database connection established');

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Track imported entities for reference
      const brandIdMap = new Map(); // JSON brand_id -> DB Deal ID
      const spvIdMap = new Map(); // DB Deal ID -> DB SPV ID
      const investorIdMap = new Map(); // JSON investor_id -> DB User ID
      const investmentMap = new Map(); // investor_id + brand_id -> DB Investment ID

      // ==================== STEP 1: Import Brands as Deals ====================
      logger.info('📦 Step 1/5: Importing brands as deals...');

      // Create a default admin user for created_by (if needed)
      let adminUser = await User.findOne({ where: { email: 'admin@ownly.ae' } });
      if (!adminUser) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        adminUser = await User.create({
          email: 'admin@ownly.ae',
          password: hashedPassword,
          name: 'OWNLY Admin',
          role: 'admin',
        }, { transaction });
        logger.info('✅ Created admin user');
      }

      for (const brand of data.brands) {
        // Map category to deal type (note: Rental maps to 'asset' since model only supports 4 types)
        const dealTypeMap = {
          'Franchise': 'franchise',
          'Real Estate': 'real_estate',
          'Asset': 'asset',
          'Startup': 'startup',
          'Rental': 'asset', // Map Rental to asset type
        };

        // Generate slug from brand name
        const slug = brand.name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-')         // Replace spaces with hyphens
          .replace(/-+/g, '-')          // Replace multiple hyphens with single
          .trim();

        const deal = await Deal.create({
          title: brand.name,
          slug: slug,
          type: dealTypeMap[brand.category] || 'asset',
          description: `${brand.niche} - ${brand.category}`,
          location: brand.location,
          target_amount: brand.min_invest * 10, // Example: 10x minimum investment
          min_ticket: brand.min_invest,
          max_ticket: brand.min_invest * 100, // Example: 100x minimum
          expected_roi: brand.monthly_roi_pct * 12, // Annual ROI estimate
          holding_period_months: 36, // 36 months
          status: 'open', // Deal is open for investment
          raised_amount: 0, // Will be updated when investments are added
          investor_count: 0,
          images: [brand.logo],
          documents: [],
          metadata: {
            category: brand.category,
            niche: brand.niche,
            monthly_roi_pct: brand.monthly_roi_pct,
            risk_level: brand.risk,
            original_brand_id: brand.id,
            equity_offered: 0, // Co-ownership model, not equity
            valuation: brand.min_invest * 1000,
          },
          created_by: adminUser.id,
        }, { transaction });

        brandIdMap.set(brand.id, deal.id);
        logger.info(`  ✅ Imported brand: ${brand.name} (ID: ${brand.id} -> ${deal.id})`);

        // Create SPV for this deal immediately
        const sharePrice = 100.00; // $100 per share
        const totalShares = Math.floor(deal.target_amount / sharePrice);

        const spv = await SPV.create({
          deal_id: deal.id,
          spv_name: `${brand.name} SPV`,
          jurisdiction: 'UAE - DIFC',
          registration_number: `AE-SPV-${brand.id.toString().padStart(6, '0')}`,
          total_shares: totalShares,
          issued_shares: 0, // Will be updated when investments are added
          share_price: sharePrice,
          status: 'active',
          virtual_bank_account: `AE07${Math.floor(Math.random() * 1000000000000000)}`,
          inception_date: new Date(data.generated_on || '2023-01-01'),
          spv_documents: [],
        }, { transaction });

        spvIdMap.set(deal.id, spv.id);
        logger.info(`  ✅ Created SPV: ${spv.spv_name} (${totalShares.toLocaleString()} shares @ ${sharePrice} AED)`);
      }

      logger.info(`✅ Imported ${data.brands.length} brands`);

      // ==================== STEP 2: Import Investors as Users ====================
      logger.info('👥 Step 2/4: Importing investors...');

      const tierMap = {
        'Platinum': 'premium',
        'Gold': 'premium',
        'Silver': 'standard',
        'Bronze': 'standard',
      };

      for (const investor of data.investors || []) {
        const hashedPassword = await bcrypt.hash('investor123', 10); // Default password

        // Map tier to role (HNI = High Net Worth Individual)
        const roleMap = {
          'Platinum': 'investor_hni',
          'Gold': 'investor_hni',
          'Silver': 'investor_retail',
          'Bronze': 'investor_retail',
        };

        const user = await User.create({
          email: investor.email,
          password: hashedPassword,
          name: investor.name,
          role: roleMap[investor.tier] || 'investor_retail',
          phone: `+971-${Math.floor(Math.random() * 10000000000)}`, // Placeholder
          kyc_status: 'approved',
          city: investor.city,
          preferences: {
            tier: tierMap[investor.tier] || 'standard',
            initial_capital: investor.initial_capital,
            original_investor_id: investor.investor_id,
          },
        }, { transaction });

        investorIdMap.set(investor.investor_id, user.id);
        logger.info(`  ✅ Imported investor: ${investor.name} (${investor.investor_id} -> ${user.id})`);
      }

      logger.info(`✅ Imported ${data.investors?.length || 0} investors`);

      // ==================== STEP 3: Import Portfolio Investments ====================
      logger.info('💼 Step 3/4: Importing portfolio investments...');

      let totalInvestments = 0;

      for (const investor of data.investors || []) {
        const userId = investorIdMap.get(investor.investor_id);
        if (!userId) {
          logger.warn(`  ⚠️ User not found for investor ${investor.investor_id}`);
          continue;
        }

        for (const portfolioItem of investor.portfolio || []) {
          const dealId = brandIdMap.get(portfolioItem.brand_id);
          if (!dealId) {
            logger.warn(`  ⚠️ Deal not found for brand ${portfolioItem.brand_id}`);
            continue;
          }

          // Get the final portfolio value from last month of data
          const monthlyData = portfolioItem.monthly_data || [];
          const lastMonth = monthlyData[monthlyData.length - 1];
          const currentValue = lastMonth?.portfolio_value || portfolioItem.initial_investment;

          // Get SPV for this deal
          const spvId = spvIdMap.get(dealId);
          if (!spvId) {
            logger.warn(`  ⚠️ SPV not found for deal ${dealId}`);
            continue;
          }

          // Calculate shares issued
          const sharePrice = 100.00; // Same as SPV share price
          const sharesIssued = Math.floor(portfolioItem.initial_investment / sharePrice);

          const investment = await Investment.create({
            deal_id: dealId,
            spv_id: spvId,
            user_id: userId,
            amount: portfolioItem.initial_investment,
            shares_issued: sharesIssued,
            share_price: sharePrice,
            current_value: currentValue,
            status: portfolioItem.exit_event ? 'exited' : 'active',
            invested_at: new Date(investor.joined),
          }, { transaction });

          investmentMap.set(`${investor.investor_id}_${portfolioItem.brand_id}`, investment.id);
          totalInvestments++;

          // Update deal's raised_amount and investor_count
          await Deal.increment(
            {
              raised_amount: portfolioItem.initial_investment,
              investor_count: 1,
            },
            {
              where: { id: dealId },
              transaction,
            }
          );

          // Update SPV's issued_shares
          await SPV.increment(
            { issued_shares: sharesIssued },
            {
              where: { id: spvId },
              transaction,
            }
          );

          logger.info(`  ✅ Invested: ${investor.name} -> ${portfolioItem.brand} (${portfolioItem.initial_investment} AED)`);
        }
      }

      logger.info(`✅ Created ${totalInvestments} investments`);

      // ==================== STEP 4: Import Monthly ROI Transactions ====================
      logger.info('💰 Step 4/4: Importing monthly ROI transactions...');

      let totalTransactions = 0;

      for (const investor of data.investors || []) {
        const userId = investorIdMap.get(investor.investor_id);
        if (!userId) continue;

        for (const portfolioItem of investor.portfolio || []) {
          const investmentId = investmentMap.get(`${investor.investor_id}_${portfolioItem.brand_id}`);
          if (!investmentId) continue;

          const dealId = brandIdMap.get(portfolioItem.brand_id);

          // Import each month's ROI data
          for (const monthData of portfolioItem.monthly_data || []) {
            // Create ROI credit transaction
            await Transaction.create({
              investment_id: investmentId,
              user_id: userId,
              deal_id: dealId,
              type: 'payout',
              amount: monthData.earned,
              status: 'completed',
              description: `Monthly ROI - ${monthData.month} (${monthData.roi_percent.toFixed(2)}%)`,
              payment_method: 'bank_transfer',
              reference: `ROI-${monthData.month}-${investmentId}`,
              metadata: {
                month: monthData.month,
                roi_percent: monthData.roi_percent,
                reinvested: monthData.reinvested,
                withdrawn: monthData.withdrawn,
                portfolio_value: monthData.portfolio_value,
                transaction_type: 'roi_credit',
              },
              created_at: new Date(monthData.month + '-15'), // Mid-month
            }, { transaction });

            totalTransactions++;
          }

          // Import exit event if exists
          if (portfolioItem.exit_event) {
            await Transaction.create({
              investment_id: investmentId,
              user_id: userId,
              deal_id: dealId,
              type: 'payout',
              amount: portfolioItem.exit_event.exit_value,
              status: 'completed',
              description: `Exit Event - ${portfolioItem.exit_event.month} (${portfolioItem.exit_event.exit_multiplier}x)`,
              payment_method: 'bank_transfer',
              reference: `EXIT-${portfolioItem.exit_event.month}-${investmentId}`,
              metadata: {
                month: portfolioItem.exit_event.month,
                exit_value: portfolioItem.exit_event.exit_value,
                exit_multiplier: portfolioItem.exit_event.exit_multiplier,
                transaction_type: 'exit_event',
              },
              created_at: new Date(portfolioItem.exit_event.month + '-01'),
            }, { transaction });

            totalTransactions++;
          }
        }
      }

      logger.info(`✅ Created ${totalTransactions} transactions (ROI + exits)`);

      // Commit transaction
      await transaction.commit();

      // ==================== Summary ====================
      logger.info('');
      logger.info('═══════════════════════════════════════════════════════');
      logger.info('🎉 OWNLY DATA IMPORT COMPLETED SUCCESSFULLY');
      logger.info('═══════════════════════════════════════════════════════');
      logger.info(`✅ Brands (Deals): ${data.brands.length}`);
      logger.info(`✅ SPVs: ${data.brands.length} (one per deal)`);
      logger.info(`✅ Investors (Users): ${data.investors?.length || 0}`);
      logger.info(`✅ Investments: ${totalInvestments}`);
      logger.info(`✅ Transactions: ${totalTransactions}`);
      logger.info('═══════════════════════════════════════════════════════');

      if (data.platform_totals) {
        logger.info('');
        logger.info('📊 Platform Totals (from dataset):');
        logger.info(`   Total Invested: ${data.platform_totals.total_invested.toLocaleString()} AED`);
        logger.info(`   Total ROI Distributed: ${data.platform_totals.total_roi_distributed.toLocaleString()} AED`);
        logger.info(`   Total Reinvested: ${data.platform_totals.total_reinvested.toLocaleString()} AED`);
        logger.info(`   Total Exits: ${data.platform_totals.total_exits.toLocaleString()} AED`);
      }

      logger.info('');
      logger.info('🔐 Default Login Credentials:');
      logger.info('   Admin: admin@ownly.ae / admin123');
      logger.info('   Investors: [investor-email] / investor123');
      logger.info('');

      process.exit(0);

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    logger.error('❌ Import failed:', error);
    logger.error(error.stack);
    process.exit(1);
  }
};

// Run the import
importOwnlyData();
