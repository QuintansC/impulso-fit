import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './jest.globalSetup.ts',
  globalTeardown: './jest.globalTeardown.ts',
  setupFiles: ['./jest.setup.ts'],
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  verbose: true,
  forceExit: true,
};

export default config;
