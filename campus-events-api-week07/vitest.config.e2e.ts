import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Migrates the test database once, before any test file runs
    globalSetup: ['./test/global-setup.ts'],
    // Points DATABASE_URL at the test database inside each test file
    setupFiles: ['./test/load-test-env.ts'],
    // All files share one database, so run them one at a time
    fileParallelism: false,
  },
});
