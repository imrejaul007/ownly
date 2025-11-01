import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

console.log('\n🧪 BUNDLES FUNCTIONALITY TEST\n');
console.log('='.repeat(70));

async function testBundles() {
  try {
    // ==================== STEP 1: GET BUNDLES ====================
    console.log('\n📝 STEP 1: Get All Bundles');
    console.log('-'.repeat(70));

    const bundlesResponse = await axios.get(`${API_BASE}/bundles`);
    const bundles = bundlesResponse.data.data.bundles || [];

    console.log(`✅ Found ${bundles.length} bundles`);

    bundles.slice(0, 3).forEach((bundle, i) => {
      console.log(`\n   Bundle ${i + 1}: ${bundle.name}`);
      console.log(`   - Slug: ${bundle.slug}`);
      console.log(`   - Status: ${bundle.status}`);
      console.log(`   - Deals Count: ${bundle.deals_count || 0}`);
      console.log(`   - Expected ROI: ${bundle.expected_roi || 'N/A'}%`);
      console.log(`   - Total Target: AED ${bundle.total_target?.toLocaleString() || 0}`);
    });

    // ==================== SUMMARY ====================
    console.log('\n' + '='.repeat(70));
    console.log('✅ BUNDLES TEST COMPLETED!');
    console.log('='.repeat(70));

    console.log('\n📊 SUMMARY:');
    console.log(`   ✓ List Bundles: PASSED (${bundles.length} bundles found)`);
    console.log(`   ✓ Backend API: ✅ WORKING`);

    console.log('\n🌐 FRONTEND URL:');
    console.log(`   • Bundles Page: http://localhost:3004/bundles`);

    console.log('\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('\n📋 Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }

  process.exit(0);
}

testBundles();
