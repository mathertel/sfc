import { expect, test } from '@playwright/test';

test('u-form-json reads, updates, and resets form values', async ({ page }) => {
  await page.goto('/test/test-form.htm');

  const form = page.locator('#myForm');
  const jsonView = page.locator('#data');
  const getJsonData = async () => JSON.parse(await jsonView.textContent());

  await expect(page.getByRole('heading', { name: 'Form Data and Form Elements Test' })).toBeVisible();
  await expect.poll(getJsonData).toEqual({
    aInput: 'default',
    aCheckbox: false,
    aRange: '0',
    aColor: '#000000',
    aDuration: '',
    aTextArea: '',
    aSelect: '',
    aSwitch: '0'
  });

  await form.locator('[name="aInput"]').fill('updated');
  await form.locator('[name="aTextArea"]').fill('notes');
  await form.locator('[name="aSelect"]').selectOption('second');
  await form.locator('[name="aCheckbox"]').check();
  await form.locator('[name="aDuration"]').fill('01:02:03');
  await form.locator('[name="aRange"]').evaluate(element => {
    element.value = '25';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await form.locator('[name="aColor"]').evaluate(element => {
    element.value = '#ff0000';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.getByRole('button', { name: 'Switch-on' }).click();

  await expect.poll(getJsonData).toEqual({
    aInput: 'updated',
    aCheckbox: true,
    aRange: '25',
    aColor: '#ff0000',
    aDuration: '01:02:03',
    aTextArea: 'notes',
    aSelect: 'second',
    aSwitch: '1'
  });

  await form.evaluate(element => element.setJsonData({
    aInput: 'set by API',
    aCheckbox: false,
    aRange: '50',
    aColor: '#00ff00',
    aDuration: '00:00:05',
    aTextArea: 'updated by API',
    aSelect: 'first',
    aSwitch: '0'
  }));

  await expect.poll(getJsonData).toEqual({
    aInput: 'set by API',
    aCheckbox: false,
    aRange: '50',
    aColor: '#00ff00',
    aDuration: '00:00:05',
    aTextArea: 'updated by API',
    aSelect: 'first',
    aSwitch: '0'
  });

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect.poll(getJsonData).toEqual({
    aInput: 'default',
    aCheckbox: false,
    aRange: '0',
    aColor: '#000000',
    aDuration: '',
    aTextArea: '',
    aSelect: '',
    aSwitch: '0'
  });
});