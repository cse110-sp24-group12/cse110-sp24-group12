import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: '__tests__',
    testMatch: '__tests__/*.e2e.js',
});
