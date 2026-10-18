# Automated Testing

The automated end-to-end tests use the [Playwright](https://playwright.dev/) tools to run in Microsoft Edge.

## Running tests

Run all Playwright tests:

```powershell
npm run test:e2e
```

Run one spec by passing its path after `--`:

```powershell
npm run test:e2e -- playwright/piechart.spec.js
```

Run the suite with the Edge window visible and one worker:

```powershell
npm run test:e2e:show
```

Playwright runs tests in parallel by default. Pass `--workers=1` to `test:e2e` to use one worker for a run. To slow down browser actions during visible execution, set `launchOptions: { slowMo: 400 }` in the `use` section of `playwright.config.js`.

## Playwright setup

The configuration is in `playwright.config.js`; it starts the local site using `npm run serve` at `http://127.0.0.1:4173` before running tests. Edge must be installed on the machine.

The Playwright dependencies are listed in `package.json`. Install project dependencies with:

```powershell
npm install
```

## Existing coverage

* `playwright/color.spec.js` checks color button updates to the `<u-color>` readout and CSS variable.
* `playwright/piechart.spec.js` checks pie slice colors and counts, title visibility, and clearing the chart.
* `playwright/splitter.spec.js` checks horizontal and vertical splitter dragging and panel resizing.

## Adding a test

Add a `*.spec.js` file in the `playwright` directory. Import `test` and `expect` from `@playwright/test`, open a test page using the configured base URL, and assert user-visible behavior. For example:

```js
import { expect, test } from '@playwright/test';

test('example interaction', async ({ page }) => {
  await page.goto('/test/test-example.htm');
  await expect(page.getByRole('heading', { name: 'Example' })).toBeVisible();
});
```

Run the new spec directly with:

```powershell
npm run test:e2e -- playwright/example.spec.js
```

The `test:e2e` script also accepts a spec path to run only that test file.