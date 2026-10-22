import { expect, test } from '@playwright/test';

test('u-countdown updates its DataHub value and stops on command or at zero', async ({ page }) => {
  await page.goto('/test/test-countdown.htm');
  await page.evaluate(() => window.allSFCLoaded);

  const value = page.locator('#countdownValue');
  const hubData = page.locator('#hubData');
  const startButton = page.getByRole('button', { name: 'Start', exact: true });
  const stopButton = page.getByRole('button', { name: 'Stop' });

  await expect(value).toHaveText('00:01:03');
  await expect(hubData).toContainText('"timer": "00:01:03"');

  await startButton.click();
  await expect(value).toHaveText('00:01:02', { timeout: 2500 });
  await expect(hubData).toContainText('"timer": "00:01:02"');
  await stopButton.click();
  await page.waitForTimeout(1100);
  await expect(value).toHaveText('00:01:02');

  await startButton.click();
  await expect(value).toHaveText('00:01:01', { timeout: 2500 });
  await stopButton.click();
});

test('u-countdown calculates and updates the duration until a timestamp', async ({ page }) => {
  await page.goto('/test/test-countdown.htm');
  await page.evaluate(() => window.allSFCLoaded);

  const value = page.locator('#countdownValue');
  const doneDialog = page.waitForEvent('dialog').then(async dialog => {
    expect(dialog.message()).toBe('DONE');
    await dialog.accept();
  });
  await page.locator('#counter').evaluate(element => element.startFor(Date.now() + 2500));

  await expect(value).toHaveText('00:00:03');
  await expect(value).toHaveText('00:00:02', { timeout: 1500 });
  await doneDialog;
  await expect(value).toHaveText('00:00:00', { timeout: 3000 });
});

test('u-countdown start value replaces the current DataHub duration', async ({ page }) => {
  await page.goto('/test/test-countdown.htm');
  await page.evaluate(() => window.allSFCLoaded);

  const value = page.locator('#countdownValue');
  const hubData = page.locator('#hubData');
  await page.locator('#counter').evaluate(element => element.start('00:00:02'));

  await expect(value).toHaveText('00:00:02');
  await expect(hubData).toContainText('"timer": "00:00:02"');
  await expect(value).toHaveText('00:00:01', { timeout: 1500 });
});

test('u-countdown normalizes numeric seconds and MM:SS initial values', async ({ page }) => {
  await page.goto('/test/test-countdown.htm');
  await page.evaluate(() => window.allSFCLoaded);

  const value = page.locator('#countdownValue');
  const hubData = page.locator('#hubData');
  const countdown = page.locator('#counter');

  for (const initialValue of [125, '2:05']) {
    await countdown.evaluate((element, initial) => element.start(initial), initialValue);
    await expect(value).toHaveText('00:02:05');
    await expect(hubData).toContainText('"timer": "00:02:05"');
    await countdown.evaluate(element => element.stop());
  }
});

test('u-countdown starts automatically when the autostart attribute is present', async ({ page }) => {
  await page.goto('/test/test-countdown.htm');
  await page.evaluate(() => window.allSFCLoaded);

  await page.evaluate(() => {
    window.datahub.publish('autoTimer', '00:00:02');
    const countdown = document.createElement('u-countdown');
    countdown.setAttribute('dh-path', 'autoTimer');
    countdown.setAttribute('autostart', '');
    document.body.append(countdown);
  });

  await expect.poll(() => page.evaluate(() => window.datahub.get('autoTimer')), { timeout: 2500 }).toBe('00:00:01');
});