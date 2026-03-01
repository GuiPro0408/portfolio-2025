import { expect, test } from '@playwright/test';

function requiredEnv(name) {
    const value = process.env[name];

    if (!value || value.trim() === '') {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

function e2eCredentials() {
    return {
        email: requiredEnv('E2E_LOGIN_EMAIL'),
        password: requiredEnv('E2E_LOGIN_PASSWORD'),
    };
}

async function loginAsOwner(page) {
    const { email, password } = e2eCredentials();

    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
}

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

test('home page exposes canonical and social image metadata', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        /^https?:\/\//,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        /^https?:\/\//,
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        /^https?:\/\//,
    );
});

test('public mobile navigation smoke', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: /open menu/i });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const mobileNav = page.getByRole('navigation', { name: 'Mobile primary' });
    await expect(mobileNav.getByRole('link', { name: 'Contact' })).toBeVisible();
    await mobileNav.getByRole('link', { name: 'Contact' }).click();

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

test('project detail exposes canonical and social image metadata', async ({ page }) => {
    await page.goto('/projects');
    await page.getByRole('link', { name: 'View project' }).first().click();

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        /\/projects\/.+/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        /^https?:\/\//,
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        /^https?:\/\//,
    );
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

    await expect(page).toHaveURL(/\/projects\?/);
    await expect(page).toHaveURL(/sort=newest/);
    await expect(page).toHaveURL(/stack=/);

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page).toHaveURL(/\/projects\?sort=editorial$/);
    await expect(page).not.toHaveURL(/stack=/);
    await expect(stackButton).toContainText('All stacks');
});

test('contact form submit smoke', async ({ page }) => {
    await page.goto('/contact');

    await page.getByLabel('Name').fill('Playwright Tester');
    await page.getByLabel('Email').fill('playwright@example.com');
    await page.getByLabel('Message').fill('Smoke test contact submission.');
    const startedAtInput = page.locator('input[name="form_started_at"]');
    await startedAtInput.waitFor({ state: 'attached' });

    const startedAtRaw = await startedAtInput.inputValue();
    const startedAt = Number.parseInt(startedAtRaw, 10);
    expect(Number.isNaN(startedAt)).toBe(false);

    await expect
        .poll(() => Math.floor(Date.now() / 1000) - startedAt)
        .toBeGreaterThanOrEqual(3);

    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(
        page.getByText('Message sent successfully. I will get back to you soon.'),
    ).toBeVisible();
});

test('dashboard auth smoke', async ({ page }) => {
    await loginAsOwner(page);

    await expect(page.getByRole('heading', { name: 'Content Admin' })).toBeVisible();
});

test('dashboard mobile nav and projects action sheet smoke', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsOwner(page);

    await page.getByRole('button', { name: /open admin menu/i }).click();
    const adminNav = page.getByRole('navigation', { name: 'Admin mobile navigation' });
    await adminNav.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/dashboard\/projects/);

    const actionsButton = page.getByRole('button', { name: /open actions for/i }).first();
    await expect(actionsButton).toBeVisible();
    await actionsButton.click();

    const editAction = page.locator('a:visible', { hasText: 'Edit' }).first();
    await expect(editAction).toBeVisible();
    await editAction.click();
    await expect(page).toHaveURL(/\/dashboard\/projects\/\d+\/edit$/);
});

test('homepage settings mobile sticky save state smoke', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsOwner(page);
    await page.goto('/dashboard/homepage');

    await expect(page.getByText('No pending changes.')).toBeVisible();
    await page.getByLabel('Hero Headline').fill('Updated headline from e2e');
    await expect(page.getByText('You have unsaved changes.')).toBeVisible();
});
