import { DataService } from '../services/DataService';
import { TreeService } from '../services/TreeService';

const dataService = new DataService();
const treeService = new TreeService();

async function seedData() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Seed data for Challenge 1
    console.log('📊 Seeding data for Challenge 1...');
    const dataResult = dataService.seedData(50000, 500000, 10000);
    console.log('✅ Data seeded:', dataResult);
    
    // Seed tree for Challenge 2
    console.log('🌳 Seeding tree for Challenge 2...');
    const treeResult = treeService.seedTree(20, 10);
    console.log('✅ Tree seeded:', treeResult);
    
    console.log('🎉 All seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seedData();
