import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/test/test-format.htm');
  await page.evaluate(() => window.allSFCLoaded);
  await expect(page.locator('#text')).toHaveText('1234.56');
});

test('defaults to text mode and gives the value attribute precedence', async ({ page }) => {
  await expect(page.locator('#attribute')).toHaveText('9876.54');
  await expect(page.locator('#zero')).toHaveText('0');
  await expect(page.locator('#negative')).toHaveText('-1234.56');
});

test('explicit text mode preserves numeric spelling and nonnumeric text', async ({ page }) => {
  await expect(page.locator('#explicit-text')).toHaveText('001234.5600');
  await expect(page.locator('#text-value')).toHaveText('Amount pending');
  await expect(page.locator('#text-currency')).toHaveText('1234.56');
});

test('text mode displays updated values literally, including empty and markup-like strings', async ({ page }) => {
  const amount = page.locator('#text-value');
  for (const value of ['00012.3400', '-0', '1.234,56 EUR', 'invalid', 'Infinity', '', '  pending  ', '<b>pending</b>']) {
    await amount.evaluate((element, input) => { element.value = input; }, value);
    await expect(amount).toHaveJSProperty('textContent', value);
  }
  await expect(amount.locator('b')).toHaveCount(0);
});

test('changing locale does not format text mode values', async ({ page }) => {
  const amount = page.locator('#text');
  for (const locale of ['de-DE', 'en-US']) {
    await amount.evaluate((element, language) => { element.locale = language; }, locale);
    await expect(amount).toHaveText('1234.56');
  }
});

test('formats currency initially and when the currency attribute changes', async ({ page }) => {
  const amount = page.locator('#currency');
  for (const currency of ['EUR', 'USD', 'JPY']) {
    if (currency !== 'EUR') {
      await amount.evaluate((element, code) => { element.currency = code; }, currency);
    }
    const expected = await page.evaluate(code => new Intl.NumberFormat('de-DE', {
      style: 'currency', currency: code
    }).format(1234.56), currency);
    await expect(amount).toHaveText(expected);
  }
});

test('currency mode reacts to locale and value changes', async ({ page }) => {
  const amount = page.locator('#currency');
  await amount.evaluate(element => { element.locale = 'en-US'; });
  await expect(amount).toHaveText('€1,234.56');
  await amount.evaluate(element => { element.value = '2345.67'; });
  await expect(amount).toHaveText('€2,345.67');
  for (const value of ['invalid', 'Infinity']) {
    await amount.evaluate((element, input) => { element.value = input; }, value);
    await expect(amount).toHaveText('');
  }
});

test('switches between text and currency without reparsing formatted output', async ({ page }) => {
  const amount = page.locator('#currency');
  await amount.evaluate(element => { element.mode = 'text'; });
  await expect(amount).toHaveText('1234.56');
  await amount.evaluate(element => {
    element.value = '0012.5000';
    element.locale = 'en-US';
    element.mode = 'currency';
  });
  await expect(amount).toHaveText('€12.50');
  await amount.evaluate(element => { element.mode = 'text'; });
  await expect(amount).toHaveText('0012.5000');
});