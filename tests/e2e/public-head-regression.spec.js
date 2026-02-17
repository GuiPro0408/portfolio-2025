import { expect, test } from '@playwright/test';

test('public head regression: home renders without symbol runtime errors', async ({ page }) => {
    const pageErrors = [];
    const consoleErrors = [];

    page.on('pageerror', (error) => {
        pageErrors.push(error.message);
    });

    page.on('console', (message) => {
        if (message.type() === 'error') {
            consoleErrors.push(message.text());
        }
    });

    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(pageErrors).toEqual([]);

    const symbolErrors = consoleErrors.filter((errorMessage) =>
        /Symbol value to a string/i.test(errorMessage),
    );

    expect(symbolErrors).toEqual([]);
});
