const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Next.js 앱의 경로 제공
  dir: './',
})

// Jest에 추가할 사용자 정의 구성
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/?(*.)+(spec|test).{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{js,ts}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

// createJestConfig는 async이므로 Next.js 구성을 로드할 수 있습니다
module.exports = createJestConfig(customJestConfig)
