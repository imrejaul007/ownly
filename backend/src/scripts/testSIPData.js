import { User, SIPPlan, SIPSubscription, Bundle } from '../models/index.js';

async function testSIPData() {
  try {
    console.log('\n🧪 Testing SIP Data\n');
    console.log('='.repeat(60));

    // Find Fatima
    const fatima = await User.findOne({
      where: { email: 'fatima.alhashimi@example.ae' }
    });

    if (!fatima) {
      console.log('❌ Fatima user not found!');
      process.exit(1);
    }

    console.log(`\n✅ Found Fatima: ${fatima.email} (${fatima.id})`);

    // Get SIP subscriptions
    const subscriptions = await SIPSubscription.findAll({
      where: { user_id: fatima.id },
      include: [
        {
          model: SIPPlan,
          as: 'plan',
          include: [
            {
              model: Bundle,
              as: 'bundle'
            }
          ]
        }
      ]
    });

    console.log(`\n📊 Fatima's SIP Subscriptions: ${subscriptions.length}\n`);

    subscriptions.forEach((sub, i) => {
      console.log(`${i + 1}. ${sub.plan.name}`);
      console.log(`   - ID: ${sub.id}`);
      console.log(`   - Monthly Amount: AED ${sub.monthly_amount.toLocaleString()}`);
      console.log(`   - Duration: ${sub.duration_months} months`);
      console.log(`   - Status: ${sub.status}`);
      console.log(`   - Total Invested: AED ${sub.total_invested.toLocaleString()}`);
      console.log(`   - Bundle: ${sub.plan.bundle?.name || 'N/A'}`);
      console.log(`   - Start Date: ${sub.start_date?.toLocaleDateString() || 'N/A'}`);
      console.log(`   - Next Debit: ${sub.next_debit_date?.toLocaleDateString() || 'N/A'}\n`);
    });

    console.log('='.repeat(60));
    console.log('✅ Test Complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    process.exit(0);
  }
}

testSIPData();
