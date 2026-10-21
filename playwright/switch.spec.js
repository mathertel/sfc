import { expect, test } from '@playwright/test';

test('u-switch controls its value and contributes it to form data', async ({ page }) => {
  await page.goto('/test/test-form.htm');

  const form = page.locator('#myForm');
  const jsonView = page.locator('#data');
  const switchControl = form.locator('u-switch[name="aSwitch"]');
  const switchValue = () => form.evaluate(element => element.getJsonData().aSwitch);
  const onButton = switchControl.getByRole('button', { name: 'on' });
  const offButton = switchControl.getByRole('button', { name: 'off' });
  const slider = switchControl.locator('input[type="range"]');

  await expect.poll(switchValue).toBe('0');

  await onButton.click();
  await expect.poll(switchValue).toBe('1');
  await expect(jsonView).toContainText('"aSwitch": "1"');

  await offButton.click();
  await expect.poll(switchValue).toBe('0');
  await expect(jsonView).toContainText('"aSwitch": "0"');

  await slider.focus();
  await slider.press('Space');
  await expect.poll(switchValue).toBe('1');

  await switchControl.evaluate(element => element.setAttribute('value', '0'));
  await expect.poll(switchValue).toBe('0');

  await onButton.click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect.poll(switchValue).toBe('0');
});

test('clicking the range track away from the thumb toggles the switch once', async ({ page }) => {
  await page.goto('/test/test-form.htm');

  const form = page.locator('#myForm');
  const jsonView = page.locator('#data');
  const switchControl = form.locator('u-switch[name="aSwitch"]');
  const slider = switchControl.locator('input[type="range"]');
  const switchValue = () => form.evaluate(element => element.getJsonData().aSwitch);
  const sliderBox = await slider.boundingBox();

  await expect.poll(switchValue).toBe('0');
  await slider.click({ position: { x: sliderBox.width - 2, y: sliderBox.height / 2 } });
  await expect.poll(switchValue).toBe('1');
  await expect(jsonView).toContainText('"aSwitch": "1"');

  await slider.click({ position: { x: 2, y: sliderBox.height / 2 } });
  await expect.poll(switchValue).toBe('0');
  await expect(jsonView).toContainText('"aSwitch": "0"');
});