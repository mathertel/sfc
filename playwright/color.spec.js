import { expect, test } from '@playwright/test';

test('color buttons update the u-color readout and CSS variable', async ({ page }) => {
  await page.goto('/test/test-color.htm');

  await expect(page.getByRole('heading', { name: 'u-color Test Page' })).toBeVisible();
  const colorReadout = page.locator('#c-color .code');

  for (const [buttonId, color] of [
    ['t-black', '#000000'],
    ['t-blue', '#0000ff'],
    ['t-red', '#8b0000'],
  ]) {
    await page.locator(`#${buttonId}`).click();
    await expect(colorReadout).toHaveText(color);
    await expect.poll(() => page.locator('html').evaluate((element) =>
      element.style.getPropertyValue('--color').trim())).toBe(color);
  }
});