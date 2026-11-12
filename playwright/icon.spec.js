import { expect, test } from '@playwright/test';

test('u-icon resolves symbols from the default, CSS variable, and src collections', async ({ page }) => {
  await page.goto('/test/test-icon.htm');

  await expect(page.locator('#default-icon use')).toHaveAttribute('href', '/icons.svg#config');
  await expect(page.locator('#src-icon use')).toHaveAttribute('href', '/ed-icons.svg#ed-bold');
  await expect(page.locator('#css-icon use')).toHaveAttribute('href', '/ed-icons.svg#ed-italic');
  await expect(page.locator('#default-icon')).toHaveCSS('display', 'inline-block');
  expect(await page.locator('#default-icon').evaluate(element => element.shadowRoot)).toBeNull();
});

test('u-icon updates its symbol and collection when attributes change', async ({ page }) => {
  await page.goto('/test/test-icon.htm');

  const icon = page.locator('#default-icon');
  await icon.evaluate(element => element.setAttribute('use', 'plus'));
  await expect(icon.locator('use')).toHaveAttribute('href', '/icons.svg#plus');

  await icon.evaluate(element => element.setAttribute('src', '/ed-icons.svg'));
  await expect(icon.locator('use')).toHaveAttribute('href', '/ed-icons.svg#plus');
});