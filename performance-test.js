#!/usr/bin/env node

/**
 * Performance Test Script
 * Tests the performance requirements for all three challenges
 */

const axios = require('axios');
const WebSocket = require('ws');

const BASE_URL = 'http://localhost:3001';
const WS_URL = 'ws://localhost:3001';

class PerformanceTester {
  constructor() {
    this.results = {
      challenge1: {},
      challenge2: {},
      challenge3: {}
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Performance Tests...\n');

    try {
      await this.testChallenge1();
      await this.testChallenge2();
      await this.testChallenge3();
      
      this.printResults();
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      process.exit(1);
    }
  }

  async testChallenge1() {
    console.log('📊 Testing Challenge 1: Data Processing...');
    
    // Test first page load performance
    const startTime = Date.now();
    const response = await axios.get(`${BASE_URL}/api/users?page=1&pageSize=50`);
    const loadTime = Date.now() - startTime;
    
    this.results.challenge1.firstPageLoad = loadTime;
    this.results.challenge1.totalRecords = response.data.total;
    this.results.challenge1.recordsReturned = response.data.items.length;
    
    console.log(`  ✅ First page load: ${loadTime}ms (target: <500ms)`);
    console.log(`  📈 Total records: ${response.data.total.toLocaleString()}`);
    
    // Test pagination performance
    const paginationStart = Date.now();
    await axios.get(`${BASE_URL}/api/users?page=2&pageSize=50`);
    const paginationTime = Date.now() - paginationStart;
    
    this.results.challenge1.pagination = paginationTime;
    console.log(`  ✅ Pagination: ${paginationTime}ms (target: <300ms)`);
    
    // Test search performance
    const searchStart = Date.now();
    await axios.get(`${BASE_URL}/api/users?search=User&page=1&pageSize=50`);
    const searchTime = Date.now() - searchStart;
    
    this.results.challenge1.search = searchTime;
    console.log(`  ✅ Search: ${searchTime}ms (target: <300ms)`);
  }

  async testChallenge2() {
    console.log('\n🌳 Testing Challenge 2: Tree Hierarchy...');
    
    // Test root nodes load
    const rootStart = Date.now();
    const rootResponse = await axios.get(`${BASE_URL}/api/nodes/root`);
    const rootTime = Date.now() - rootStart;
    
    this.results.challenge2.rootLoad = rootTime;
    this.results.challenge2.rootNodes = rootResponse.data.items.length;
    console.log(`  ✅ Root nodes load: ${rootTime}ms (target: <300ms)`);
    
    // Test child nodes load
    if (rootResponse.data.items.length > 0) {
      const childStart = Date.now();
      await axios.get(`${BASE_URL}/api/nodes/${rootResponse.data.items[0].id}/children`);
      const childTime = Date.now() - childStart;
      
      this.results.challenge2.childLoad = childTime;
      console.log(`  ✅ Child nodes load: ${childTime}ms (target: <300ms)`);
    }
    
    // Test search performance
    const searchStart = Date.now();
    const searchResponse = await axios.get(`${BASE_URL}/api/search?q=Node&limit=100`);
    const searchTime = Date.now() - searchStart;
    
    this.results.challenge2.search = searchTime;
    this.results.challenge2.searchResults = searchResponse.data.items.length;
    console.log(`  ✅ Search: ${searchTime}ms (target: <300ms)`);
    console.log(`  📈 Search results: ${searchResponse.data.items.length}`);
  }

  async testChallenge3() {
    console.log('\n📈 Testing Challenge 3: Real-time Dashboard...');
    
    // Test snapshot load
    const snapshotStart = Date.now();
    const snapshotResponse = await axios.get(`${BASE_URL}/api/quotes/snapshot?symbols=AAPL,MSFT,GOOG`);
    const snapshotTime = Date.now() - snapshotStart;
    
    this.results.challenge3.snapshotLoad = snapshotTime;
    this.results.challenge3.symbols = Object.keys(snapshotResponse.data).length;
    console.log(`  ✅ Snapshot load: ${snapshotTime}ms`);
    console.log(`  📈 Symbols loaded: ${Object.keys(snapshotResponse.data).length}`);
    
    // Test WebSocket connection
    const wsStart = Date.now();
    const wsPromise = new Promise((resolve, reject) => {
      const ws = new WebSocket(WS_URL);
      
      ws.on('open', () => {
        const connectionTime = Date.now() - wsStart;
        this.results.challenge3.wsConnection = connectionTime;
        console.log(`  ✅ WebSocket connection: ${connectionTime}ms`);
        
        // Subscribe to quotes
        ws.send(JSON.stringify({
          type: 'subscribe',
          symbols: ['AAPL', 'MSFT', 'GOOG']
        }));
        
        // Wait for a few messages
        let messageCount = 0;
        ws.on('message', (data) => {
          messageCount++;
          if (messageCount >= 3) {
            ws.close();
            resolve();
          }
        });
        
        // Timeout after 5 seconds
        setTimeout(() => {
          ws.close();
          resolve();
        }, 5000);
      });
      
      ws.on('error', reject);
    });
    
    await wsPromise;
  }

  printResults() {
    console.log('\n📊 Performance Test Results');
    console.log('='.repeat(50));
    
    // Challenge 1 Results
    console.log('\n📊 Challenge 1: Data Processing');
    console.log(`  First page load: ${this.results.challenge1.firstPageLoad}ms ${this.results.challenge1.firstPageLoad < 500 ? '✅' : '❌'}`);
    console.log(`  Pagination: ${this.results.challenge1.pagination}ms ${this.results.challenge1.pagination < 300 ? '✅' : '❌'}`);
    console.log(`  Search: ${this.results.challenge1.search}ms ${this.results.challenge1.search < 300 ? '✅' : '❌'}`);
    console.log(`  Total records: ${this.results.challenge1.totalRecords?.toLocaleString()}`);
    
    // Challenge 2 Results
    console.log('\n🌳 Challenge 2: Tree Hierarchy');
    console.log(`  Root load: ${this.results.challenge2.rootLoad}ms ${this.results.challenge2.rootLoad < 300 ? '✅' : '❌'}`);
    console.log(`  Child load: ${this.results.challenge2.childLoad}ms ${this.results.challenge2.childLoad < 300 ? '✅' : '❌'}`);
    console.log(`  Search: ${this.results.challenge2.search}ms ${this.results.challenge2.search < 300 ? '✅' : '❌'}`);
    console.log(`  Search results: ${this.results.challenge2.searchResults}`);
    
    // Challenge 3 Results
    console.log('\n📈 Challenge 3: Real-time Dashboard');
    console.log(`  Snapshot load: ${this.results.challenge3.snapshotLoad}ms`);
    console.log(`  WebSocket connection: ${this.results.challenge3.wsConnection}ms`);
    console.log(`  Symbols: ${this.results.challenge3.symbols}`);
    
    // Overall Assessment
    const allPassed = 
      this.results.challenge1.firstPageLoad < 500 &&
      this.results.challenge1.pagination < 300 &&
      this.results.challenge1.search < 300 &&
      this.results.challenge2.rootLoad < 300 &&
      this.results.challenge2.childLoad < 300 &&
      this.results.challenge2.search < 300;
    
    console.log('\n🎯 Overall Assessment');
    console.log(`  Performance targets: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runAllTests().catch(console.error);
}

module.exports = PerformanceTester;
