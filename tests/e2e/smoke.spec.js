import { expect, test } from '@playwright/test';

test('public navigation smoke', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(
        page.getByRole('link', { name: 'Projects', exact: true }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Contact' }).first().click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(
        page.getByRole('heading', { name: 'Start a conversation' }),
    ).toBeVisible();
});

test('projects page opens project detail', async ({ page }) => {
    await page.goto('/projects');
    await expect(
        page.getByRole('heading', { name: 'Published Projects' }),
    ).toBeVisible();

    const projectLink = page.getByRole('link', { name: 'View project' }).first();
    await expect(projectLink).toBeVisible();
    await projectLink.click();
    await expect(page).toHaveURL(/\/projects\/.+/);
});

test('projects filters smoke', async ({ page }) => {
    await page.goto('/projects');
    await expect(
        page.getByRole('heading', { name: 'Published Projects' }),
    ).toBeVisible();

    const filterForm = page.locator('.projects-filter-form');
    const stackButton = filterForm.locator('.projects-filter-select-button').first();
    const sortButton = filterForm.locator('.projects-filter-select-button').nth(1);

    await stackButton.click();
    const stackOptions = page.locator('.projects-filter-options .projects-filter-option-multi');
    const stackOptionCount = await stackOptions.count();
    expect(stackOptionCount).toBeGreaterThan(0);

    await stackOptions.nth(0).click();
    if (stackOptionCount > 1) {
        await stackOptions.nth(1).click();
    }
    await stackButton.click();

    await sortButton.click();
    await page.locator('.projects-filter-option', { hasText: 'Newest' }).click();
    await page.waitForTimeout(450);

    await expect(page).toHaveURL(/\/projects\?/);
    await expect(page).toHaveURL(/sort=newest/);
    await expect(page).toHaveURL(/stack=/);

    await page.getByRole('button', { name: 'Reset' }).click();
    await page.waitForTimeout(450);
    await expect(page).toHaveURL(/\/projects\?sort=editorial$/);
    await expect(page).not.toHaveURL(/stack=/);
    await expect(stackButton).toContainText('All stacks');
});

test('contact form submit smoke', async ({ page }) => {
    await page.goto('/contact');

    await page.getByLabel('Name').fill('Playwright Tester');
    await page.getByLabel('Email').fill('playwright@example.com');
    await page.getByLabel('Message').fill('Smoke test contact submission.');
    await page.waitForTimeout(3200);
    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(
        page.getByText('Message sent successfully. I will get back to you soon.'),
    ).toBeVisible();
});

test('dashboard auth smoke', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Content Admin' })).toBeVisible();
});
