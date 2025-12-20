/* eslint-env jest */
/* global beforeAll, afterAll */

/**
 * Jest Setup File
 * Runs before all tests
 */

const mongoose = require('mongoose');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = 5001; // Different port for testing
process.env.MONGODB_URI =
  process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/sudoku-test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

// Increase timeout for database operations
jest.setTimeout(30000);

// Setup runs before all tests
beforeAll(async () => {
  console.log('🧪 Test environment initialized');
  console.log(`📍 MongoDB URI: ${process.env.MONGODB_URI}`);

  // Wait a bit for MongoDB to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));
});

// Cleanup after all tests - CRITICAL for preventing open handles
afterAll(async () => {
  try {
    console.log('✅ Test cleanup completed - MongoDB connections closed');
    
    // Close all mongoose connections
    await mongoose.disconnect();

    // Close any remaining connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    // Add a small delay to allow cleanup
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('⚠️  Error during test cleanup:', error.message);
  }
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});