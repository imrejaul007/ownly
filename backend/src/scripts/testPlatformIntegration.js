import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

console.log('\n🧪 COMPLETE PLATFORM INTEGRATION TEST\n');
console.log('='.repeat(70));

async function testPlatform() {
  let token = '';
  const results = {
    auth: false,
    deals: false,
    bundles: false,
    sip: false,
    secondaryMarket: false,
    wallet: false,
  };

  try {
    // ==================== AUTHENTICATION ====================
    console.log('\n📝 STEP 1: Authentication');
    console.log('-'.repeat(70));

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'fatima.alhashimi@example.ae',
      password: 'password123',
    });

    token = loginResponse.data.data.token;
    console.log('✅ Authentication: PASSED');
    results.auth = true;

    // ==================== DEALS ====================
    console.log('\n📝 STEP 2: Deals API');
    console.log('-'.repeat(70));

    const dealsResponse = await axios.get(`${API_BASE}/deals`);
    const deals = dealsResponse.data.data.deals || [];
    console.log(`✅ Deals API: PASSED (${deals.length} deals found)`);
    results.deals = true;

    // ==================== BUNDLES ====================
    console.log('\n📝 STEP 3: Bundles API');
    console.log('-'.repeat(70));

    const bundlesResponse = await axios.get(`${API_BASE}/bundles`);
    const bundles = bundlesResponse.data.data.bundles || [];
    console.log(`✅ Bundles API: PASSED (${bundles.length} bundles found)`);
    results.bundles = true;

    // ==================== SIP ====================
    console.log('\n📝 STEP 4: SIP API');
    console.log('-'.repeat(70));

    const sipPlansResponse = await axios.get(`${API_BASE}/sip/plans`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const sipPlans = sipPlansResponse.data.data.plans || [];

    const sipDashboardResponse = await axios.get(`${API_BASE}/sip/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const sipDashboard = sipDashboardResponse.data.data;

    console.log(`✅ SIP API: PASSED`);
    console.log(`   - Plans: ${sipPlans.length}`);
    console.log(`   - Active Subscriptions: ${sipDashboard.active_subscriptions}`);
    console.log(`   - Monthly Commitment: AED ${sipDashboard.total_monthly_commitment?.toLocaleString()}`);
    results.sip = true;

    // ==================== SECONDARY MARKET ====================
    console.log('\n📝 STEP 5: Secondary Market API');
    console.log('-'.repeat(70));

    const secondaryMarketResponse = await axios.get(`${API_BASE}/secondary-market/listings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listings = secondaryMarketResponse.data.data.listings || [];
    console.log(`✅ Secondary Market API: PASSED (${listings.length} listings found)`);
    results.secondaryMarket = true;

    // ==================== WALLET ====================
    console.log('\n📝 STEP 6: Wallet API');
    console.log('-'.repeat(70));

    const walletResponse = await axios.get(`${API_BASE}/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const wallet = walletResponse.data.data;
    console.log(`✅ Wallet API: PASSED`);
    console.log(`   - Total Balance: AED ${wallet.total?.toLocaleString() || 0}`);
    results.wallet = true;

    // ==================== SUMMARY ====================
    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL PLATFORM FEATURES TESTED!');
    console.log('='.repeat(70));

    console.log('\n📊 TEST RESULTS:');
    Object.entries(results).forEach(([feature, passed]) => {
      const status = passed ? '✅ PASSED' : '❌ FAILED';
      console.log(`   ${feature.toUpperCase().padEnd(20)}: ${status}`);
    });

    console.log('\n🌐 FRONTEND URLS:');
    console.log(`   • Dashboard: http://localhost:3004/dashboard`);
    console.log(`   • Deals: http://localhost:3004/deals`);
    console.log(`   • Bundles: http://localhost:3004/bundles`);
    console.log(`   • SIP: http://localhost:3004/sip`);
    console.log(`   • Secondary Market: http://localhost:3004/secondary-market`);
    console.log(`   • Copy Trading: http://localhost:3004/copy-trading`);
    console.log(`   • Wallet: http://localhost:3004/wallet`);
    console.log(`   • Rewards: http://localhost:3004/rewards`);

    console.log('\n💡 LOGIN CREDENTIALS:');
    console.log(`   • Email: fatima.alhashimi@example.ae`);
    console.log(`   • Password: password123`);

    console.log('\n🎯 PLATFORM STATUS:');
    const allPassed = Object.values(results).every(r => r);
    if (allPassed) {
      console.log(`   ✅ ALL SYSTEMS OPERATIONAL`);
    } else {
      console.log(`   ⚠️  SOME SYSTEMS NEED ATTENTION`);
    }

    console.log('\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('\n📋 Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('\nFailed at:', error.config?.url || 'unknown');
    process.exit(1);
  }

  process.exit(0);
}

testPlatform();
