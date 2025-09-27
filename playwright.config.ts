import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests/e2e',
	/* Run tests in files in parallel */
	fullyParallel: false,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: 1,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: process.env.CI ? 'on-first-retry' : 'on'
	},
	/* Configure projects for major browsers */
	projects: process.env.CI
		? [
				{ name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
				{ name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
				{ name: 'WebKit', use: { ...devices['Desktop Safari'] } }
			]
		: [{ name: 'Chromium', use: { ...devices['Desktop Chrome'], headless: false } }]
});
