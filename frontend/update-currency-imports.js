const fs = require('fs');
const path = require('path');

// Files that need to be updated (excluding the ones we already fixed)
const filesToUpdate = [
  'app/layout.tsx',
  'app/rewards/page.tsx',
  'app/category/[categoryKey]/page.tsx',
  'app/page.tsx',
  'app/scenarios/page.tsx',
  'app/secondary-market/page.tsx',
  'app/portfolio/page.tsx',
  'app/featured/page.tsx',
  'app/sip/plans/page.tsx',
  'app/copy-trading/page.tsx',
  'app/bundles/page.tsx',
  'app/deals/[id]/page.tsx',
  'app/progress/page.tsx',
  'app/sip/[id]/page.tsx',
  'app/sip/page.tsx',
  'app/admin/page.tsx',
  'app/deals/compare/page.tsx',
  'app/secondary-market/[id]/page.tsx',
  'app/bundles/[id]/page.tsx',
  'app/copy-trading/[id]/page.tsx',
  'app/search/page.tsx',
  'app/watchlist/page.tsx',
  'app/portfolio-builder/page.tsx',
  'app/calculator/page.tsx',
  'app/risk-assessment/page.tsx',
  'app/referrals/page.tsx',
  'components/SmartRecommendations.tsx',
  'components/DealSocialProof.tsx',
  'components/ActivityFeed.tsx',
  'app/analytics/page.tsx',
  'app/investments/[id]/page.tsx',
  'app/property-management/page.tsx',
  'app/communications/page.tsx',
  'app/payout-schedules/page.tsx',
  'app/agent-dashboard/page.tsx',
  'app/operations/page.tsx',
];

const frontendDir = '/Users/rejaulkarim/Documents/ownly/frontend';

function updateFile(filePath) {
  const fullPath = path.join(frontendDir, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Check if file already uses usePreferences
  if (content.includes('usePreferences')) {
    console.log(`✓ Already updated: ${filePath}`);
    return;
  }

  // Check if file uses formatCurrency from utils
  if (!content.includes("formatCurrency") || !content.includes("from '@/lib/utils'")) {
    console.log(`⚠️  No formatCurrency import found: ${filePath}`);
    return;
  }

  // Pattern 1: import { formatCurrency, ...other } from '@/lib/utils'
  // Replace with: import { ...other } from '@/lib/utils'
  //               import { usePreferences } from '@/context/PreferencesContext'

  const utilsImportRegex = /import\s+{([^}]+)}\s+from\s+['"]@\/lib\/utils['"]/;
  const match = content.match(utilsImportRegex);

  if (match) {
    const imports = match[1].split(',').map(i => i.trim());
    const otherImports = imports.filter(i => i !== 'formatCurrency');

    let newImport;
    if (otherImports.length > 0) {
      // Keep other imports
      newImport = `import { ${otherImports.join(', ')} } from '@/lib/utils';\nimport { usePreferences } from '@/context/PreferencesContext'`;
    } else {
      // No other imports, just replace entirely
      newImport = `import { usePreferences } from '@/context/PreferencesContext'`;
    }

    content = content.replace(utilsImportRegex, newImport);
    modified = true;
  }

  // Now add the hook at the beginning of the component/function
  // Find the export default function pattern
  const componentRegex = /export\s+default\s+function\s+(\w+)\s*\([^)]*\)\s*{/;
  const componentMatch = content.match(componentRegex);

  if (componentMatch) {
    const replacement = componentMatch[0] + '\n  const { formatCurrency } = usePreferences();';
    content = content.replace(componentRegex, replacement);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`⚠️  Could not update: ${filePath}`);
  }
}

console.log('🚀 Starting bulk currency import update...\n');

filesToUpdate.forEach(file => {
  try {
    updateFile(file);
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error.message);
  }
});

console.log('\n✨ Bulk update complete!');
