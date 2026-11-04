import { expect, test } from '@playwright/test';

test('automatically sums table changes and preserves sorting', async ({ page }) => {
  await page.goto('/test/test-tablesum.htm');
  await page.evaluate(() => window.allSFCLoaded);

  const sumCell = page.locator('tfoot u-tablesum');
  await expect(sumCell).toHaveText('3305.67');
  const unchangedTextNode = await sumCell.evaluate((element) => {
    const textNode = element.firstChild;
    element.sum();
    return textNode === element.firstChild;
  });
  expect(unchangedTextNode).toBe(true);

  const firstRow = page.locator('tbody').first().locator('tr').first();
  const firstRowBeforeSort = await firstRow.innerText();
  await page.locator('thead th').click();
  await expect.poll(() => firstRow.innerText()).not.toBe(firstRowBeforeSort);
  await expect(sumCell).toHaveText('3305.67');

  await page.getByRole('button', { name: 'Add 10 to amount' }).click();
  await expect(page.locator('#increment-amount')).toHaveText('198,56 €');
  await expect(sumCell).toHaveText('3315.67');
});

test('recalculates the sum after each table sort', async ({ page }) => {
  await page.goto('/test/test-tablesort.htm');
  await page.evaluate(() => window.allSFCLoaded);

  const sumCell = page.locator('tfoot u-tablesum');
  await expect(sumCell).toHaveText('3305.67');

  for (const header of await page.locator('thead th').all()) {
    await header.click();
    await expect(sumCell).toHaveText('3305.67');
  }

  await page.getByRole('button', { name: 'Add 10 to amount' }).click();
  await expect(page.locator('#increment-amount')).toHaveText('198,56 €');
  await expect(sumCell).toHaveText('3315.67');
});