import { expect, test } from '@playwright/test';

test('u-story preserves its light-DOM steps and honors reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/test/test-story.htm');

  const story = page.locator('u-story');
  const steps = story.locator('.story-step');
  const button = story.getByRole('button', { name: 'Scroll to next section' });

  await expect(steps).toHaveCount(4);
  await expect(story).toHaveClass(/focus/);
  await expect(story.locator('.story-content').first()).toBeVisible();
  await expect(button).toBeEnabled();
  await expect(button).toHaveCSS('position', 'fixed');
  await expect(steps.first()).toHaveCSS('overflow', 'hidden');
  await expect(steps.first()).toHaveCSS('height', `${await page.evaluate(() => window.innerHeight)}px`);
});

test('u-story scrolls through each step and disables the button at the end', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/test/test-story.htm');

  const story = page.locator('u-story');
  const steps = story.locator('.story-step');
  const button = story.getByRole('button', { name: 'Scroll to next section' });

  for (let index = 1; index < await steps.count(); index++) {
    await button.click();
    await expect.poll(() => steps.nth(index).evaluate((step) => Math.abs(step.getBoundingClientRect().top)))
      .toBeLessThan(2);
  }

  await expect(button).toBeDisabled();
});

test('u-story focuses steps as they enter the viewport when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/test/test-story.htm');

  const story = page.locator('u-story');
  const firstStep = story.locator('.story-step').first();

  await expect(firstStep).toHaveClass(/focus/);
  await expect(story).not.toHaveClass(/focus/);
});
