import { expect, test } from '@playwright/test';

test('pie chart updates and clears its slices', async ({ page }) => {
  await page.goto('/test/test-piechart.htm');

  await expect(page.getByRole('heading', { name: 'test <u-piechart>' })).toBeVisible();
  await page.evaluate(() => customElements.whenDefined('u-piechart'));

  const values = page.locator('#p1-data');
  const slices = page.locator('#p1').locator('path.segment');
  const titles = page.locator('#p1').locator('text.text');

  await values.fill('1,2,3,4,5,6,7,8');
  await page.locator('#p1-update').click();
  await expect(page.locator('#p1-cur')).toHaveText('1,2,3,4,5,6,7,8');
  await expect(slices).toHaveCount(8);
  await expect.poll(() => slices.evaluateAll((paths) => paths.map((path) => path.style.fill)))
    .toEqual(['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'cyan']);
  await expect(titles).toHaveCount(0);

  await page.locator('#p1-show-titles').check();
  await expect(titles).toHaveCount(8);
  await expect.poll(() => titles.allTextContents()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
  await page.locator('#p1-show-titles').uncheck();
  await expect(titles).toHaveCount(0);

  await values.fill('40,60');
  await page.locator('#p1-update').click();
  await expect(slices).toHaveCount(2);

  await page.locator('#p1-clear').click();
  await expect(page.locator('#p1-cur')).toBeEmpty();
  await expect(slices).toHaveCount(0);
});