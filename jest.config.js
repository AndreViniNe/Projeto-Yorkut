module.exports = {
  testEnvironment: 'node',
  cache: false,
  collectCoverageFrom: ['**/routes/*.js', '**/models/*.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  reporters: ['default', 'jest-junit'],
};