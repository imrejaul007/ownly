import { Bundle, BundleDeal, Deal } from '../models/index.js';

async function verifyBundles() {
  try {
    console.log('🔍 Verifying Investment Bundles...\n');

    const bundles = await Bundle.findAll({
      include: [{
        model: BundleDeal,
        as: 'bundleDeals',
        include: [{
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title', 'type', 'expected_roi']
        }]
      }],
      order: [['created_at', 'DESC']]
    });

    console.log(`📦 Total Bundles Created: ${bundles.length}\n`);
    console.log('='.repeat(80) + '\n');

    // Group bundles by type
    const byType = {
      category_based: bundles.filter(b => b.bundle_type === 'category_based'),
      roi_based: bundles.filter(b => b.bundle_type === 'roi_based'),
      thematic: bundles.filter(b => b.bundle_type === 'thematic'),
    };

    // Display Category-Based Bundles
    console.log('🏢 CATEGORY-BASED BUNDLES:\n');
    byType.category_based.forEach((bundle, idx) => {
      console.log(`${idx + 1}. ${bundle.name}`);
      console.log(`   Slug: ${bundle.slug}`);
      console.log(`   Category: ${bundle.category}`);
      console.log(`   Min Investment: AED ${(bundle.min_investment / 1000).toFixed(0)}K`);
      console.log(`   Target: AED ${(bundle.target_amount / 1000000).toFixed(1)}M`);
      console.log(`   ROI Range: ${bundle.expected_roi_min}% - ${bundle.expected_roi_max}%`);
      console.log(`   Holding Period: ${bundle.holding_period_months} months`);
      console.log(`   Risk Level: ${bundle.risk_level.toUpperCase()}`);
      console.log(`   Diversification Score: ${bundle.diversification_score}/100`);
      console.log(`   Status: ${bundle.status.toUpperCase()}`);
      console.log(`   Deals Included: ${bundle.bundleDeals?.length || 0}`);
      if (bundle.bundleDeals && bundle.bundleDeals.length > 0) {
        bundle.bundleDeals.forEach((bd, i) => {
          console.log(`     ${i + 1}. ${bd.deal?.title} (${bd.allocation_percentage}% allocation${bd.is_core ? ' - CORE' : ''})`);
        });
      }
      console.log('');
    });

    console.log('='.repeat(80) + '\n');

    // Display ROI-Based Bundles
    console.log('📈 ROI-BASED BUNDLES:\n');
    byType.roi_based.forEach((bundle, idx) => {
      console.log(`${idx + 1}. ${bundle.name}`);
      console.log(`   Slug: ${bundle.slug}`);
      console.log(`   Category: ${bundle.category}`);
      console.log(`   Min Investment: AED ${(bundle.min_investment / 1000).toFixed(0)}K`);
      console.log(`   Target: AED ${(bundle.target_amount / 1000000).toFixed(1)}M`);
      console.log(`   ROI Range: ${bundle.expected_roi_min}% - ${bundle.expected_roi_max}%`);
      console.log(`   Holding Period: ${bundle.holding_period_months} months`);
      console.log(`   Risk Level: ${bundle.risk_level.toUpperCase()}`);
      console.log(`   Diversification Score: ${bundle.diversification_score}/100`);
      console.log(`   Status: ${bundle.status.toUpperCase()}`);
      console.log(`   Deals Included: ${bundle.bundleDeals?.length || 0}`);
      if (bundle.bundleDeals && bundle.bundleDeals.length > 0) {
        bundle.bundleDeals.forEach((bd, i) => {
          console.log(`     ${i + 1}. ${bd.deal?.title} (${bd.allocation_percentage}% allocation${bd.is_core ? ' - CORE' : ''})`);
        });
      }
      console.log('');
    });

    console.log('='.repeat(80) + '\n');

    // Display Thematic Bundles
    console.log('🎨 THEMATIC BUNDLES:\n');
    byType.thematic.forEach((bundle, idx) => {
      console.log(`${idx + 1}. ${bundle.name}`);
      console.log(`   Slug: ${bundle.slug}`);
      console.log(`   Category: ${bundle.category}`);
      console.log(`   Min Investment: AED ${(bundle.min_investment / 1000).toFixed(0)}K`);
      console.log(`   Target: AED ${(bundle.target_amount / 1000000).toFixed(1)}M`);
      console.log(`   ROI Range: ${bundle.expected_roi_min}% - ${bundle.expected_roi_max}%`);
      console.log(`   Holding Period: ${bundle.holding_period_months} months`);
      console.log(`   Risk Level: ${bundle.risk_level.toUpperCase()}`);
      console.log(`   Diversification Score: ${bundle.diversification_score}/100`);
      console.log(`   Status: ${bundle.status.toUpperCase()}`);
      console.log(`   Deals Included: ${bundle.bundleDeals?.length || 0}`);
      if (bundle.bundleDeals && bundle.bundleDeals.length > 0) {
        bundle.bundleDeals.forEach((bd, i) => {
          console.log(`     ${i + 1}. ${bd.deal?.title} (${bd.allocation_percentage}% allocation${bd.is_core ? ' - CORE' : ''})`);
        });
      }
      console.log('');
    });

    console.log('='.repeat(80) + '\n');

    // Summary Statistics
    console.log('📊 BUNDLE STATISTICS:\n');
    console.log(`Total Bundles: ${bundles.length}`);
    console.log(`Category-Based: ${byType.category_based.length}`);
    console.log(`ROI-Based: ${byType.roi_based.length}`);
    console.log(`Thematic: ${byType.thematic.length}`);
    console.log('');

    // Risk Distribution
    const riskDistribution = {
      low: bundles.filter(b => b.risk_level === 'low').length,
      medium: bundles.filter(b => b.risk_level === 'medium').length,
      high: bundles.filter(b => b.risk_level === 'high').length,
    };
    console.log('Risk Distribution:');
    console.log(`  Low Risk: ${riskDistribution.low} bundles`);
    console.log(`  Medium Risk: ${riskDistribution.medium} bundles`);
    console.log(`  High Risk: ${riskDistribution.high} bundles`);
    console.log('');

    // Investment Range
    const minInvestments = bundles.map(b => parseFloat(b.min_investment));
    const minInvestment = Math.min(...minInvestments);
    const maxInvestment = Math.max(...minInvestments);
    console.log('Investment Range:');
    console.log(`  Minimum Entry: AED ${(minInvestment / 1000).toFixed(0)}K`);
    console.log(`  Maximum Entry: AED ${(maxInvestment / 1000).toFixed(0)}K`);
    console.log('');

    // ROI Range
    const allROIs = bundles.flatMap(b => [parseFloat(b.expected_roi_min), parseFloat(b.expected_roi_max)]);
    const minROI = Math.min(...allROIs);
    const maxROI = Math.max(...allROIs);
    console.log('ROI Range Across All Bundles:');
    console.log(`  Minimum ROI: ${minROI}%`);
    console.log(`  Maximum ROI: ${maxROI}%`);
    console.log('');

    // Total Target Amount
    const totalTarget = bundles.reduce((sum, b) => sum + parseFloat(b.target_amount), 0);
    console.log(`Total Target Investment Pool: AED ${(totalTarget / 1000000).toFixed(1)}M`);
    console.log('');

    console.log('='.repeat(80));
    console.log('✅ Verification completed successfully!');
    console.log('='.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  }
}

verifyBundles();
