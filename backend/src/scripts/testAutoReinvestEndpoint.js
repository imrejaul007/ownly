import { Investment, User } from '../models/index.js';

console.log('\n🧪 Testing Auto-Reinvest Endpoint\n');
console.log('=' .repeat(60));

async function testEndpoint() {
  try {
    // Get an investment to test with
    const investment = await Investment.findOne({
      where: { status: 'active' },
      include: [
        {
          model: User,
          as: 'investor',
          attributes: ['id', 'email', 'name'],
        },
      ],
    });

    if (!investment) {
      console.log('⚠️  No active investments found to test');
      console.log('   Please create an investment first');
      return;
    }

    console.log('📊 Test Investment Details:');
    console.log(`   Investment ID: ${investment.id}`);
    console.log(`   Investor: ${investment.investor.name} (${investment.investor.email})`);
    console.log(`   Amount: AED ${investment.amount}`);
    console.log(`   Status: ${investment.status}`);
    console.log(`   Current Auto-Reinvest: ${investment.auto_reinvest_enabled ? 'Enabled ✓' : 'Disabled ✗'}`);

    console.log('\n📝 API Endpoint Information:');
    console.log(`   Endpoint: PATCH /api/investments/${investment.id}/settings`);
    console.log('   Authentication: Required (Bearer token)');
    console.log('   Body: { "auto_reinvest_enabled": true/false }');

    console.log('\n💡 Test Example with cURL:');
    console.log(`   # Login first to get token`);
    console.log(`   TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \\`);
    console.log(`     -H "Content-Type: application/json" \\`);
    console.log(`     -d '{"email":"${investment.investor.email}","password":"password123"}' \\`);
    console.log(`     | jq -r '.data.token')`);
    console.log('');
    console.log(`   # Enable auto-reinvest`);
    console.log(`   curl -X PATCH http://localhost:5001/api/investments/${investment.id}/settings \\`);
    console.log(`     -H "Content-Type: application/json" \\`);
    console.log(`     -H "Authorization: Bearer $TOKEN" \\`);
    console.log(`     -d '{"auto_reinvest_enabled": true}'`);

    console.log('\n✅ Endpoint ready for testing!');
    console.log('   Use the cURL command above or test via frontend UI');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  process.exit(0);
}

testEndpoint();
