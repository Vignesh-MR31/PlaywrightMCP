import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Authentication', () => {
  test('Reject invalid or missing login credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Submit the login form with blank credentials and verify the required username error.
    await loginPage.goto();
    await loginPage.submit();
    await expect(loginPage.errorMessage).toContainText('Username is required');
    await expect(page).toHaveURL(/\/$/);

    // Submit a valid username with an invalid password and verify authentication is rejected.
    await loginPage.login('standard_user', 'incorrect_password');
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    await expect(page).toHaveURL(/\/$/);
  });
});
