import { defineConfig } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';

const ENV = process.env.ENV ?? 'test';
dotenv.config({path: path.resolve(__dirname , `.env.${ENV}`)});

export default defineConfig({
  testDir: './e2e' ,
  use: {
    baseURL: 'http://localhost:3000' ,
    trace: 'on-first-retry' ,
  } ,
  webServer: {
    command: 'npm run dev' ,
    url: 'http://localhost:3000' ,
    reuseExistingServer: !process.env.CI ,
    timeout: 120000
  }
});
