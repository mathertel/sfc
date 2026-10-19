import { test, expect } from '@playwright/test';

test.describe('u-duration input normalization', () => {
  test('normalizes typed duration values on change', async ({ page }) => {
    await page.goto('/test/test-duration.htm');

    await page.waitForFunction(() => typeof window.allSFCLoaded?.then === 'function');
    await page.evaluate(() => window.allSFCLoaded);

    const durationInput = page.locator('input[is="u-duration"]');
    await expect(durationInput).toBeVisible();

    const checkValue = async (typedValue, expectedValue) => {
      await durationInput.fill(typedValue);
      await durationInput.dispatchEvent('change');
      await expect(durationInput).toHaveValue(expectedValue);
    };

    await checkValue('5', '00:00:05');
    await checkValue('9/22', '00:09:22');
    await checkValue('80:00', '01:20:00');
    await checkValue('1h2m3s', '01:02:03');
  });
});
