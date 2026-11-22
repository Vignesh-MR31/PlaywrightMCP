import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

test.describe('Authentication', () => {
  test('Sign in with the standard demo account', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Start from the login page and submit valid demo credentials.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // Verify the Products inventory page and initial empty cart.
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(inventoryPage.pageHeading).toHaveText('Products');
    await expect(inventoryPage.sortControl).toBeVisible();
    await expect(inventoryPage.productCards).toHaveCount(6);
    await expect(inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');
  });
});
