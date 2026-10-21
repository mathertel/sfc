import { expect, test } from '@playwright/test';

test('form and DataHub stay synchronized according to the selected mode', async ({ page }) => {
  await page.goto('/test/test-formdata.htm');

  const form = page.locator('#contactForm');
  const nameInput = page.getByRole('textbox', { name: 'Name:' });
  const ageInput = page.getByRole('spinbutton', { name: 'Age:' });
  const formData = page.locator('#formData');
  const hubData = page.locator('#hubData');
  const modeButton = page.getByRole('button', { name: 'Switch to submit mode' });

  await expect(page.getByRole('heading', { name: 'Form and DataHub Sync Test' })).toBeVisible();
  await expect(nameInput).toHaveValue('Ada Lovelace');
  await expect(ageInput).toHaveValue('36');
  await expect(hubData).toContainText('"name": "Ada Lovelace"');

  await nameInput.fill('Grace Hopper');
  await expect(hubData).toContainText('"name": "Grace Hopper"');

  await modeButton.click();
  await expect(form).toHaveAttribute('dh-mode', 'submit');
  await nameInput.fill('Katherine Johnson');
  await expect(formData).toContainText('"name": "Katherine Johnson"');
  await expect(hubData).toContainText('"name": "Grace Hopper"');

  await page.getByRole('button', { name: 'Submit form' }).click();
  await expect(hubData).toContainText('"name": "Katherine Johnson"');

  await page.getByRole('button', { name: 'Change name in DataHub' }).click();
  await expect(nameInput).toHaveValue('Ada Lovelace');

  await page.getByRole('button', { name: 'Switch to sync mode' }).click();
  await nameInput.fill('Charles Babbage');
  await expect(hubData).toContainText('"name": "Charles Babbage"');

  await page.getByRole('button', { name: 'Increase age in DataHub' }).click();
  await expect(ageInput).toHaveValue('37');

  await page.getByRole('button', { name: 'Delete profile in DataHub' }).click();
  await expect(nameInput).toHaveValue('');
  await expect(ageInput).toHaveValue('');
  await expect(page.getByRole('checkbox', { name: 'Active:' })).not.toBeChecked();
});