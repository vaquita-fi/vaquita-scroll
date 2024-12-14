import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**.js',
        '**.ts',
        '**/**.stories.**',
        '**/*Svg.tsx',
        '**/types.ts',
        '.next/**',
        'public/**',
        'node_modules/**',
        'contracts/lib/**', // Added to exclude all files in contracts/lib
      ],
      reportOnFailure: true,
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      '.next/**',
      'public/**',
      'contracts/lib/**/*.test.{js,jsx,ts,tsx}',
      'contracts/lib/**/*.spec.{js,jsx,ts,tsx}',
      'contracts/lib/**/__tests__/**',
      'contracts/lib/**/test/**',
    ],
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});