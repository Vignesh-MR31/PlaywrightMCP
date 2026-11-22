import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';

test.describe('Cart management', () => {
  test('Add, review, remove, and continue shopping from the cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);

    // Sign in and add Backpack from the catalog and Bike Light from its details.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await expect(inventoryPage.productActionButton('Sauce Labs Backpack')).toHaveText('Remove');
    await expect(inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');
    await inventoryPage.openProduct('Sauce Labs Bike Light');
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.removeButton).toBeVisible();
    await expect(productDetailsPage.cartButton).toHaveAccessibleName('Cart, 2 items');

    // Review both cart entries and available cart actions.
    await productDetailsPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(2);
    await expect(cartPage.quantityLabels).toHaveText(['1', '1']);
    await expect(cartPage.cartButton).toHaveAccessibleName('Cart, 2 items');
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
    await expect(cartPage.cartItems).toContainText([
      /Sauce Labs Backpack/,
      /Sauce Labs Bike Light/,
    ]);

    // Remove Bike Light and verify the remaining product and badge count.
    await cartPage.removeProduct('Sauce Labs Bike Light');
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartItems).not.toContainText('Sauce Labs Bike Light');
    await expect(cartPage.cartButton).toHaveAccessibleName('Cart, 1 items');

    // Continue shopping and verify the remaining cart item is retained.
    await cartPage.continueShopping();
    await expect(inventoryPage.pageHeading).toHaveText('Products');
    await expect(inventoryPage.cartButton).toHaveAccessibleName('Cart, 1 items');
  });
});
