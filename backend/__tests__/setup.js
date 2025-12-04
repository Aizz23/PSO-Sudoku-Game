/**
 * Jest Setup File
 * Runs before all tests
 */

const mongoose = require('mongoose');

// Set test environment variables
process.env. NODE_ENV = 'test';
process.env.PORT = 5001; // Different port for testing
process.env.MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/sudoku-test';
process.env. JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

// Suppress console logs during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };

// Increase timeout for database operations
jest.setTimeout(30000);

// Mock Date for consistent testing (optional)
// const mockDate = new Date('2024-01-01T00:00:00.000Z');
// global.Date = class extends Date {
//   constructor() {
//     return mockDate;
//   }
// };

// Setup runs before all tests
beforeAll(async () => {
  console.log('🧪 Test environment initialized');
  console.log(`📍 MongoDB URI: ${process.env.MONGODB_URI}`);
});

// Cleanup after all tests - CRITICAL for preventing open handles
afterAll(async () => {
  try {
    // Close all mongoose connections
    await mongoose.disconnect();
    
    // Close any remaining connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection. close();
    }
    
    console.log('✅ Test cleanup completed - MongoDB connections closed');
  } catch (error) {
    console.error('⚠️  Error during test cleanup:', error. message);
  }
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});