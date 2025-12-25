export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "services/**/*.js",
    "middleware/**/*.js",
    "utils/**/*.js",
    "!**/node_modules/**",
    "!**/__tests__/**",
  ],
  coverageDirectory: "coverage",
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup/jest.setup.js"],
  testTimeout: 30000,
};

