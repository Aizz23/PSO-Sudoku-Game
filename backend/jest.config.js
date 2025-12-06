module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Coverage configuration
  collectCoverageFrom: [
    'routes/**/*.js',
    'utils/**/*.js',
    'models/**/*.js',
    'server.js',
    '!node_modules/**',
    '!__tests__/**',
  ],

  // Coverage thresholds (fail if below these percentages)
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },

  // Test match patterns
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],

  // Timeout for tests (30 seconds for integration tests)
  testTimeout: 30000,

  // Verbose output
  verbose: true,

  // Force exit after tests complete
  forceExit: true,

  // Clear mocks between tests
  clearMocks: true,

  // Detect open handles
  detectOpenHandles: false,
};
