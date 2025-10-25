import sequelize, { syncDatabase } from '../src/config/database.js';
import {
  User,
  Wallet,
  Deal,
  SPV,
  Investment,
  Agent,
  Asset,
} from '../src/models/index.js';
import {
  generateUser,
  generateDeal,
  generateSPV,
  generateInvestment,
  generateAgent,
  generateWallet,
  generateAsset,
} from '../src/utils/dataGenerator.js';
import authConfig from '../src/config/auth.js';

const DEFAULT_COUNTS = {
  investors: 100,
  agents: 20,
  deals: 50,
  admins: 5,
};

async function seedUsers(count = DEFAULT_COUNTS.investors) {
  console.log(`\n📊 Seeding ${count} investor users...`);

  const users = [];

  // Create investors
  for (let i = 0; i < count; i++) {
    const role = i < count * 0.8
      ? authConfig.roles.INVESTOR_RETAIL
      : authConfig.roles.INVESTOR_HNI;

    const user = generateUser(role);
    users.push(user);
  }

  const createdUsers = await User.bulkCreate(users, { returning: true });
  console.log(`✅ Created ${createdUsers.length} investors`);

  return createdUsers;
}

async function seedAdmins(count = DEFAULT_COUNTS.admins) {
  console.log(`\n👑 Seeding ${count} admin users...`);

  const admins = [];

  // Create platform admins
  admins.push(generateUser(authConfig.roles.ADMIN, {
    name: 'Admin User',
    email: 'admin@ownly.io',
    kyc_status: authConfig.kycStatus.APPROVED,
  }));

  // Create other admin roles
  for (let i = 1; i < count; i++) {
    const role = [
      authConfig.roles.SPV_ADMIN,
      authConfig.roles.OPERATIONS,
      authConfig.roles.PROPERTY_MANAGER,
    ][i % 3];

    admins.push(generateUser(role, {
      kyc_status: authConfig.kycStatus.APPROVED,
    }));
  }

  const createdAdmins = await User.bulkCreate(admins, { returning: true });
  console.log(`✅ Created ${createdAdmins.length} admin users`);

  return createdAdmins;
}

async function seedWallets(users) {
  console.log(`\n💰 Creating wallets for ${users.length} users...`);

  const wallets = users.map(user => generateWallet(user.id));
  const createdWallets = await Wallet.bulkCreate(wallets, { returning: true });

  console.log(`✅ Created ${createdWallets.length} wallets`);
  return createdWallets;
}

async function seedAgents(count = DEFAULT_COUNTS.agents) {
  console.log(`\n🤝 Seeding ${count} agents...`);

  const agentUsers = [];
  for (let i = 0; i < count; i++) {
    agentUsers.push(generateUser(authConfig.roles.AGENT, {
      kyc_status: authConfig.kycStatus.APPROVED,
    }));
  }

  const createdAgentUsers = await User.bulkCreate(agentUsers, { returning: true });

  // Create agent profiles
  const agentProfiles = createdAgentUsers.map(user => generateAgent(user.id));
  const createdAgents = await Agent.bulkCreate(agentProfiles, { returning: true });

  // Create wallets for agents
  await seedWallets(createdAgentUsers);

  console.log(`✅ Created ${createdAgents.length} agents`);
  return createdAgents;
}

async function seedDeals(count = DEFAULT_COUNTS.deals, admins) {
  console.log(`\n🏢 Seeding ${count} deals...`);

  const deals = [];
  const adminId = admins[0]?.id || null;

  // Create variety of deals
  const dealTypes = ['real_estate', 'franchise', 'startup', 'asset'];

  for (let i = 0; i < count; i++) {
    const type = dealTypes[i % dealTypes.length];
    const deal = generateDeal(adminId, { type });
    deals.push(deal);
  }

  const createdDeals = await Deal.bulkCreate(deals, { returning: true });
  console.log(`✅ Created ${createdDeals.length} deals`);

  return createdDeals;
}

async function seedSPVs(deals) {
  console.log(`\n🏦 Creating SPVs for ${deals.length} deals...`);

  const spvs = [];

  for (const deal of deals) {
    // Only create SPVs for deals that are funding or funded
    if (['funding', 'funded', 'closed'].includes(deal.status)) {
      const spv = generateSPV(deal.id, deal);
      spvs.push(spv);
    }
  }

  const createdSPVs = await SPV.bulkCreate(spvs, { returning: true });
  console.log(`✅ Created ${createdSPVs.length} SPVs`);

  return createdSPVs;
}

async function seedInvestments(users, spvs) {
  console.log(`\n💵 Creating investments...`);

  const investments = [];

  // Each SPV gets random investors
  for (const spv of spvs) {
    const deal = await Deal.findByPk(spv.deal_id);
    const investorCount = Math.floor(Math.random() * 15) + 5; // 5-20 investors per deal

    // Select random investors
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    const selectedInvestors = shuffledUsers.slice(0, investorCount);

    let totalRaised = 0;

    for (const investor of selectedInvestors) {
      const investment = generateInvestment(investor.id, spv.id, deal.id, spv);
      investments.push(investment);
      totalRaised += parseFloat(investment.amount);
    }

    // Update SPV and Deal with raised amounts
    await spv.update({
      issued_shares: investments
        .filter(inv => inv.spv_id === spv.id)
        .reduce((sum, inv) => sum + inv.shares_issued, 0),
      escrow_balance: totalRaised,
    });

    await deal.update({
      raised_amount: totalRaised,
      investor_count: investorCount,
    });
  }

  const createdInvestments = await Investment.bulkCreate(investments, { returning: true });
  console.log(`✅ Created ${createdInvestments.length} investments`);

  return createdInvestments;
}

async function seedAssets(spvs) {
  console.log(`\n🏗️  Creating assets for SPVs...`);

  const assets = [];

  for (const spv of spvs) {
    const deal = await Deal.findByPk(spv.deal_id);

    const assetType = deal.type === 'real_estate' ? 'property' :
                     deal.type === 'franchise' ? 'franchise_unit' : 'business';

    const asset = generateAsset(spv.id, assetType);
    assets.push(asset);
  }

  const createdAssets = await Asset.bulkCreate(assets, { returning: true });
  console.log(`✅ Created ${createdAssets.length} assets`);

  return createdAssets;
}

async function seedAll(options = {}) {
  const {
    investors = DEFAULT_COUNTS.investors,
    agents = DEFAULT_COUNTS.agents,
    deals = DEFAULT_COUNTS.deals,
    admins = DEFAULT_COUNTS.admins,
  } = options;

  console.log('\n🌱 Starting database seeding...\n');
  console.log('=' .repeat(50));

  try {
    // Connect and sync database
    await syncDatabase({ force: true }); // WARNING: This will drop all tables

    // Seed in order (respecting foreign key constraints)
    const adminUsers = await seedAdmins(admins);
    const investorUsers = await seedUsers(investors);
    const allUsers = [...adminUsers, ...investorUsers];

    await seedWallets(allUsers);
    await seedAgents(agents);

    const createdDeals = await seedDeals(deals, adminUsers);
    const createdSPVs = await seedSPVs(createdDeals);
    await seedInvestments(investorUsers, createdSPVs);
    await seedAssets(createdSPVs);

    console.log('\n' + '='.repeat(50));
    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Total Users: ${allUsers.length}`);
    console.log(`   - Investors: ${investorUsers.length}`);
    console.log(`   - Admins: ${adminUsers.length}`);
    console.log(`   - Agents: ${agents}`);
    console.log(`   - Deals: ${createdDeals.length}`);
    console.log(`   - SPVs: ${createdSPVs.length}`);
    console.log('\n🔐 Default Login:');
    console.log(`   Email: admin@ownly.io`);
    console.log(`   Password: password123`);
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--investors' && args[i + 1]) {
    options.investors = parseInt(args[i + 1]);
  }
  if (args[i] === '--deals' && args[i + 1]) {
    options.deals = parseInt(args[i + 1]);
  }
  if (args[i] === '--agents' && args[i + 1]) {
    options.agents = parseInt(args[i + 1]);
  }
}

// Run seeding
seedAll(options)
  .then(() => {
    console.log('👋 Exiting...\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
