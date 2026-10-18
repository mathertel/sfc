import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    channel: 'msedge',
    // launchOptions: { slowMo: 0 },
  },
  projects: [
    {
      name: 'edge',
      use: {
        browserName: 'chromium'
      },
    },
  ],
  webServer: {
    command: 'npm run serve',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});