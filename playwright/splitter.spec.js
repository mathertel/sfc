import { expect, test } from '@playwright/test';

test('horizontal and vertical splitters resize their panels when dragged', async ({ page }) => {
  await page.goto('/test/test-splitter.htm');

  await expect(page.getByRole('heading', { name: 'u-splitter Test Page' })).toBeVisible();
  await page.waitForFunction(() => document.querySelectorAll('u-splitter > .resizer').length === 4);

  const cases = [
    { splitter: page.locator('u-splitter').first(), axis: 'x', cursor: 'ew-resize' },
    { splitter: page.locator('u-splitter[vertical]').first(), axis: 'y', cursor: 'ns-resize' },
  ];

  for (const { splitter, axis, cursor } of cases) {
    const resizer = splitter.locator(':scope > .resizer');
    const panels = splitter.locator(':scope > div:not(.resizer)');
    const dimension = axis === 'x' ? 'width' : 'height';
    const beforeFirst = await panels.nth(0).evaluate((panel, property) =>
      parseFloat(getComputedStyle(panel)[property]), dimension);
    const beforeSecond = await panels.nth(1).evaluate((panel, property) =>
      parseFloat(getComputedStyle(panel)[property]), dimension);
    const box = await resizer.boundingBox();

    await expect(resizer).toHaveCSS('cursor', cursor);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      box.x + box.width / 2 + (axis === 'x' ? 40 : 0),
      box.y + box.height / 2 + (axis === 'y' ? 40 : 0),
      { steps: 5 },
    );
    await page.mouse.up();

    await expect.poll(() => panels.nth(0).evaluate((panel, property) =>
      parseFloat(getComputedStyle(panel)[property]), dimension)).toBeGreaterThan(beforeFirst + 20);
    await expect.poll(() => panels.nth(1).evaluate((panel, property) =>
      parseFloat(getComputedStyle(panel)[property]), dimension)).toBeLessThan(beforeSecond - 20);
  }
});