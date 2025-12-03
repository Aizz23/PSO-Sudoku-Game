/**
 * Jest Setup File
 * Runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = 5001; // Different port for testing
process.env.MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/sudoku-test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

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

console.log('🧪 Test environment initialized');
console.log(`📍 MongoDB URI: ${process.env.MONGODB_URI}`);
