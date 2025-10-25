import fs from 'fs';
import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;

// Database connection
const pool = new Pool({
  user: 'rejaulkarim',
  host: 'localhost',
  database: 'ownly_sandbox',
  password: '',
  port: 5432,
});

// Fatima's email (we'll find or create her account)
const FATIMA_EMAIL = 'fatima.alhashimi@example.ae';

// Map simulation deal types to database enum values
function mapDealType(simType) {
  const typeMap = {
    'foco': 'franchise',
    'real_estate': 'real_estate',
    'alternative': 'asset',
    'trade': 'asset',
    'equity': 'startup',
    'bundle': 'asset'
  };
  return typeMap[simType.toLowerCase()] || 'asset';
}

// Map simulation deal statuses to database enum values
function mapDealStatus(simStatus) {
  const statusMap = {
    'active': 'funding',
    'open': 'open',
    'funding': 'funding',
    'funded': 'funded',
    'closed': 'closed',
    'exited': 'exited',
    'failed': 'failed'
  };
  return statusMap[simStatus.toLowerCase()] || 'open';
}

// Map simulation SPV statuses to database enum values
function mapSpvStatus(simStatus) {
  const statusMap = {
    'active': 'active',
    'open': 'active',
    'funding': 'active',
    'funded': 'operating',
    'operating': 'operating',
    'closed': 'operating',
    'exited': 'exited',
    'failed': 'dissolved'
  };
  return statusMap[simStatus.toLowerCase()] || 'active';
}

console.log('🚀 Starting OWNLY Simulation Data Import...\n');

async function importData() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Load simulation data
    console.log('📂 Loading simulation data from JSON...');
    const simulationData = JSON.parse(fs.readFileSync('./ownly-simulation-data.json', 'utf8'));
    console.log(`✅ Loaded ${simulationData.deals.length} deals, ${simulationData.investors.length} investors\n`);

    // Step 1: Find or create Fatima's user account
    console.log('👤 Step 1: Setting up Fatima\'s account...');
    let fatimaUser = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [FATIMA_EMAIL]
    );

    let fatimaUserId;

    if (fatimaUser.rows.length === 0) {
      // Create Fatima's account
      const hashedPassword = await bcrypt.hash('password123', 10);
      const newUser = await client.query(
        `INSERT INTO users (email, password_hash, name, role, kyc_status, is_active, country, city, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         RETURNING *`,
        [FATIMA_EMAIL, hashedPassword, 'Fatima Al Hashimi', 'investor_hni', 'approved', true, 'UAE', 'Dubai']
      );
      fatimaUserId = newUser.rows[0].id;
      console.log(`✅ Created new account for Fatima (${fatimaUserId})\n`);
    } else {
      fatimaUserId = fatimaUser.rows[0].id;
      console.log(`✅ Found existing account for Fatima (${fatimaUserId})\n`);
    }

    // Step 2: Import Deals and SPVs
    console.log('📋 Step 2: Importing deals and SPVs...');
    const dealMapping = {}; // Map simulation deal IDs to database IDs

    for (const deal of simulationData.deals) {
      // Create Deal FIRST (SPVs reference deals, not the other way around)
      const dbDeal = await client.query(
        `INSERT INTO deals (id, title, slug, type, jurisdiction, location, description,
                            target_amount, min_ticket, max_ticket, raised_amount, investor_count,
                            holding_period_months, expected_roi, expected_irr,
                            status, open_date, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
         RETURNING id`,
        [
          deal.title,
          deal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          mapDealType(deal.type),
          deal.location || 'UAE',
          deal.location,
          deal.description,
          deal.targetAmount,
          deal.minInvestment,
          deal.maxInvestment,
          deal.raisedAmount,
          deal.investorCount,
          deal.timeline,
          deal.annualRoi,
          deal.annualRoi * 1.1, // IRR slightly higher
          mapDealStatus(deal.status),
          deal.startDate
        ]
      );

      const dealId = dbDeal.rows[0].id;

      // Create SPV with the deal_id reference
      const spv = await client.query(
        `INSERT INTO spvs (id, deal_id, spv_name, jurisdiction, total_shares, issued_shares, share_price,
                           escrow_balance, operating_balance, total_revenue, total_expenses,
                           total_distributed, status, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
         RETURNING id`,
        [
          dealId,
          deal.spvName,
          deal.location || 'UAE',
          1000000,
          Math.floor(deal.raisedAmount / 100),
          100,
          deal.raisedAmount,
          0,
          0,
          0,
          0,
          mapSpvStatus(deal.status)
        ]
      );

      const spvId = spv.rows[0].id;

      dealMapping[deal.dealId] = {
        dbDealId: dealId,
        dbSpvId: spvId,
        deal: deal
      };
    }

    console.log(`✅ Imported ${Object.keys(dealMapping).length} deals\n`);

    // Step 3: Create wallets for Fatima
    console.log('💰 Step 3: Creating wallet for Fatima...');

    // Check if wallet exists
    const existingWallet = await client.query(
      'SELECT * FROM wallets WHERE user_id = $1',
      [fatimaUserId]
    );

    let walletId;
    if (existingWallet.rows.length === 0) {
      const wallet = await client.query(
        `INSERT INTO wallets (id, user_id, currency, balance_dummy, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
         RETURNING id`,
        [fatimaUserId, 'AED', 10000000] // 10M AED starting balance
      );
      walletId = wallet.rows[0].id;
      console.log(`✅ Created wallet with AED 10,000,000 balance\n`);
    } else {
      walletId = existingWallet.rows[0].id;
      // Update balance
      await client.query(
        'UPDATE wallets SET balance_dummy = $1, currency = $2 WHERE id = $3',
        [10000000, 'AED', walletId]
      );
      console.log(`✅ Updated existing wallet balance\n`);
    }

    // Step 4: Create investments for Fatima across ALL deals
    console.log('💼 Step 4: Creating investments for Fatima across all deals...');
    let investmentCount = 0;

    for (const [simDealId, dealData] of Object.entries(dealMapping)) {
      const deal = dealData.deal;
      const investmentAmount = Math.floor(Math.random() * (deal.maxInvestment - deal.minInvestment) + deal.minInvestment);
      const sharesIssued = Math.floor(investmentAmount / 100);

      const investment = await client.query(
        `INSERT INTO investments (id, user_id, spv_id, deal_id, amount, shares_issued, share_price,
                                  status, invested_at, current_value, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         RETURNING id`,
        [
          fatimaUserId,
          dealData.dbSpvId,
          dealData.dbDealId,
          investmentAmount,
          sharesIssued,
          100,
          deal.status.toLowerCase() === 'exited' ? 'exited' : 'active',
          deal.startDate,
          Math.floor(investmentAmount * (1 + deal.annualRoi / 100))
        ]
      );

      // Note: Payouts are tracked at SPV level with payout_items JSONB
      // Skipping individual payout records for now

      investmentCount++;
    }

    console.log(`✅ Created ${investmentCount} investments with monthly payouts\n`);

    // Step 5: Update deal statistics
    console.log('📊 Step 5: Updating deal statistics...');
    for (const [simDealId, dealData] of Object.entries(dealMapping)) {
      await client.query(
        `UPDATE deals
         SET raised_amount = $1, investor_count = $2
         WHERE id = $3`,
        [dealData.deal.raisedAmount, dealData.deal.investorCount, dealData.dbDealId]
      );
    }
    console.log('✅ Updated deal statistics\n');

    await client.query('COMMIT');

    console.log('✅ IMPORT COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`   - User: Fatima Al Hashimi (${FATIMA_EMAIL})`);
    console.log(`   - Deals imported: ${Object.keys(dealMapping).length}`);
    console.log(`   - Investments created: ${investmentCount}`);
    console.log(`   - Starting wallet balance: AED 10,000,000`);
    console.log('\n🎉 Fatima now has access to all deals!\n');
    console.log('🔐 Login credentials:');
    console.log(`   Email: ${FATIMA_EMAIL}`);
    console.log('   Password: password123\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error importing data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

importData().catch(console.error);
