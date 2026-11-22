import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutInformationPage } from './pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from './pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from './pages/CheckoutCompletePage';

test.describe('Order completion', () => {
  test('Finish a reviewed order and confirm completion', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    // Sign in, add Backpack, and open the cart.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();

    // Enter customer information and verify the order review before submission.
    await checkoutInformationPage.fillInformation('Taylor', 'Tester', '10001');
    await checkoutInformationPage.continue();
    await expect(checkoutOverviewPage.heading).toHaveText('Checkout: Overview');
    await expect(checkoutOverviewPage.orderItems).toContainText('Sauce Labs Backpack');
    await expect(checkoutOverviewPage.itemTotal).toContainText('$29.99');
    await expect(checkoutOverviewPage.tax).toContainText('$2.40');
    await expect(checkoutOverviewPage.total).toContainText('$32.39');

    // Submit the order and verify confirmation and the cleared cart.
    await checkoutOverviewPage.finish();
    await expect(checkoutCompletePage.heading).toHaveText('Checkout: Complete!');
    await expect(checkoutCompletePage.confirmationTitle).toHaveText('Thank you for your order!');
    await expect(checkoutCompletePage.dispatchMessage).toContainText('Your order has been dispatched');
    await expect(checkoutCompletePage.cartButton).toHaveAccessibleName('Cart, empty');

    // Return home and verify the cart remains empty.
    await checkoutCompletePage.backHome();
    await expect(inventoryPage.pageHeading).toHaveText('Products');
    await expect(inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');
  });
});
