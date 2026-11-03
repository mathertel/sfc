import { expect, test } from '@playwright/test';

test('sums marked columns across table bodies using the table locale', async ({ page }) => {
  await page.goto('/test/test-tablesum.htm');
  await page.evaluate(() => window.allSFCLoaded);

  const sumCell = page.locator('tfoot u-tablesum');
  const expected = await page.evaluate(() =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(3305.67));
  await expect(sumCell).toHaveText(expected);

  const firstRow = page.locator('tbody').first().locator('tr').first();
  const firstRowBeforeSort = await firstRow.innerText();
  await page.locator('thead th').click();
  await expect.poll(() => firstRow.innerText()).not.toBe(firstRowBeforeSort);
  await expect(sumCell).toHaveText(expected);

  await page.locator('tbody').last().locator('tr').last().locator('u-format').evaluate((amount) => {
    amount.textContent = '2000';
    amount.closest('table').querySelector('u-tablesum').sum();
  });
  const updated = await page.evaluate(() =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(5205.67));
  await expect(sumCell).toHaveText(updated);
});