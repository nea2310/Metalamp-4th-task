/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.setup.ts'],
};
