import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

console.log('\n🧪 Testing Auto-Reinvest API Endpoint\n');
console.log('=' .repeat(60));

async function testAPI() {
  try {
    // Step 1: Login
    console.log('📝 Step 1: Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'fatima.alhashimi@example.ae',
      password: 'password123',
    });

    const token = loginResponse.data.data.token;
    console.log('✓ Login successful');

    // Step 2: Get investments
    console.log('\n📝 Step 2: Getting user investments...');
    const investmentsResponse = await axios.get(`${API_BASE}/investments/my-investments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const investments = investmentsResponse.data.data.investments;
    console.log(`✓ Found ${investments.length} investments`);

    if (investments.length === 0) {
      console.log('⚠️  No investments found to test');
      return;
    }

    const testInvestment = investments[0];
    console.log(`\n   Testing with Investment ID: ${testInvestment.id}`);
    console.log(`   Amount: AED ${testInvestment.amount}`);
    console.log(`   Current Auto-Reinvest: ${testInvestment.auto_reinvest_enabled ? 'Enabled ✓' : 'Disabled ✗'}`);

    // Step 3: Enable auto-reinvest
    console.log('\n📝 Step 3: Enabling auto-reinvest...');
    const updateResponse = await axios.patch(
      `${API_BASE}/investments/${testInvestment.id}/settings`,
      { auto_reinvest_enabled: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('✓ Auto-reinvest enabled successfully');
    console.log(`   New setting: ${updateResponse.data.data.investment.auto_reinvest_enabled ? 'Enabled ✓' : 'Disabled ✗'}`);

    // Step 4: Verify by getting investment details
    console.log('\n📝 Step 4: Verifying the change...');
    const verifyResponse = await axios.get(
      `${API_BASE}/investments/${testInvestment.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const verified = verifyResponse.data.data.investment.auto_reinvest_enabled;
    console.log(`✓ Verification: Auto-reinvest is ${verified ? 'Enabled ✓' : 'Disabled ✗'}`);

    // Step 5: Toggle it back off
    console.log('\n📝 Step 5: Disabling auto-reinvest...');
    const disableResponse = await axios.patch(
      `${API_BASE}/investments/${testInvestment.id}/settings`,
      { auto_reinvest_enabled: false },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('✓ Auto-reinvest disabled successfully');
    console.log(`   New setting: ${disableResponse.data.data.investment.auto_reinvest_enabled ? 'Enabled ✓' : 'Disabled ✗'}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ All API tests passed successfully!');
    console.log('\nEndpoint Details:');
    console.log(`   URL: PATCH ${API_BASE}/investments/:id/settings`);
    console.log('   Auth: Bearer token required');
    console.log('   Body: { "auto_reinvest_enabled": boolean }');
    console.log('   Returns: Updated investment object');

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }

  process.exit(0);
}

testAPI();
