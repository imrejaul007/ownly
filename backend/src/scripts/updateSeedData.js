import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCompleteDataset } from './generateSampleData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Updating seed-data.json with complete dataset...\n');

// Read existing seed-data.json
const seedDataPath = path.join(__dirname, '../../seed-data.json');
const existingData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

console.log('✅ Loaded existing brands:', existingData.brands.length);

// Generate investor data
const { investors, platform_totals } = generateCompleteDataset();

// Combine with existing brands
const completeData = {
  platform: existingData.platform,
  generated_on: new Date().toISOString().split('T')[0],
  brands: existingData.brands,
  investors: investors,
  platform_totals: platform_totals,
};

// Write back to file
fs.writeFileSync(seedDataPath, JSON.stringify(completeData, null, 2));

console.log('\n✅ seed-data.json updated successfully!');
console.log(`📍 Location: ${seedDataPath}`);
console.log(`📊 File size: ${(fs.statSync(seedDataPath).size / 1024).toFixed(2)} KB\n`);

console.log('📋 Complete dataset now includes:');
console.log(`   ✅ Brands: ${completeData.brands.length}`);
console.log(`   ✅ Investors: ${completeData.investors.length}`);
console.log(`   ✅ Platform Totals: Calculated\n`);

console.log('🎯 Ready to import! Run:');
console.log('   node src/scripts/importOwnlyData.js\n');
