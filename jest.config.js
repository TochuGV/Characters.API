export default {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  clearMocks: true,
  testTimeout: 10000,
  transform: {},
};