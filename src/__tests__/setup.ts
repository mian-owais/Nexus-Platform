import dotenv from 'dotenv';

// Load environment variables for testing
dotenv.config({ path: '.env.local' });

// Mock mongoose before importing models
jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');
  return {
    ...originalMongoose,
    connect: jest.fn().mockResolvedValue({}),
  };
});

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_12345';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_12345';
});

// Clean up after tests
afterEach(() => {
  jest.clearAllMocks();
});

// Suppress console output during tests unless verbose
if (!process.env.VERBOSE_TESTS) {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}

export {};
