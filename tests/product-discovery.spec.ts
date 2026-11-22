import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';

test.describe('Product discovery', () => {
  test('Browse products, sort the catalog, and inspect product details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    // Sign in and verify the default catalog state.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(inventoryPage.pageHeading).toHaveText('Products');
    await expect(inventoryPage.productCards).toHaveCount(6);
    await expect(inventoryPage.sortControl).toHaveValue('az');

    // Sort product names in descending order and verify the visible order.
    await inventoryPage.sortBy('za');
    await expect(inventoryPage.sortControl).toHaveValue('za');
    await expect(inventoryPage.productNames).toHaveText([
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Onesie',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Bike Light',
      'Sauce Labs Backpack',
    ]);

    // Sort prices low to high and verify both order and selection.
    await inventoryPage.sortBy('lohi');
    await expect(inventoryPage.sortControl).toHaveValue('lohi');
    await expect(inventoryPage.productPrices).toHaveText([
      '$7.99', '$9.99', '$15.99', '$15.99', '$29.99', '$49.99',
    ]);

    // Sort prices high to low and verify both order and selection.
    await inventoryPage.sortBy('hilo');
    await expect(inventoryPage.sortControl).toHaveValue('hilo');
    await expect(inventoryPage.productPrices).toHaveText([
      '$49.99', '$29.99', '$15.99', '$15.99', '$9.99', '$7.99',
    ]);

    // Open the Backpack details and verify its purchase information.
    await inventoryPage.openProduct('Sauce Labs Backpack');
    await expect(productDetailsPage.productName).toHaveText('Sauce Labs Backpack');
    await expect(productDetailsPage.productImage).toBeVisible();
    await expect(productDetailsPage.description).toBeVisible();
    await expect(productDetailsPage.price).toHaveText('$29.99');
    await expect(productDetailsPage.addToCartButton).toBeVisible();

    // Return to the product catalog.
    await productDetailsPage.backToProducts();
    await expect(inventoryPage.pageHeading).toHaveText('Products');
    await expect(inventoryPage.productCards).toHaveCount(6);
  });
});
