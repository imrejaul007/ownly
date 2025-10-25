import sequelize from '../config/database.js';
import { User, Wallet } from '../models/index.js';

const createWallets = async () => {
  try {
    console.log('🔧 Creating wallets for all users...');

    const users = await User.findAll();
    console.log(`📊 Found ${users.length} users`);

    let created = 0;
    let existing = 0;

    for (const user of users) {
      const existingWallet = await Wallet.findOne({ where: { user_id: user.id } });

      if (!existingWallet) {
        // Give different starting balances based on role
        const startingBalance = user.role === 'admin' ? 1000000 : 500000;

        await Wallet.create({
          user_id: user.id,
          currency: 'USD',
          balance_dummy: startingBalance,
          ledger_entries: []
        });

        console.log(`✅ Created wallet for: ${user.email} (${user.full_name}) - $${startingBalance.toLocaleString()}`);
        created++;
      } else {
        console.log(`⏭️  Wallet already exists for: ${user.email}`);
        existing++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Created: ${created} wallets`);
    console.log(`   Already existed: ${existing} wallets`);
    console.log(`   Total users: ${users.length}`);
    console.log('\n🎉 Wallet creation complete!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating wallets:', error);
    process.exit(1);
  }
};

createWallets();
