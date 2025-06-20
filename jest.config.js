module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    // If you have path aliases in tsconfig.json, map them here
    // Example: '^@/(.*)$': '<rootDir>/src/$1'
  },
};
