import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutInformationPage } from './pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from './pages/CheckoutOverviewPage';

test.describe('Checkout information and order review', () => {
  test('Validate required customer fields and review order totals', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    // Sign in, add one product, and open the checkout information page.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await expect(checkoutInformationPage.heading).toHaveText('Checkout: Your Information');
    await expect(checkoutInformationPage.firstNameInput).toBeVisible();
    await expect(checkoutInformationPage.lastNameInput).toBeVisible();
    await expect(checkoutInformationPage.postalCodeInput).toBeVisible();

    // Submit empty fields and verify required-field validation without advancing.
    await checkoutInformationPage.continue();
    await expect(checkoutInformationPage.errorMessage).toContainText('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html$/);

    // Enter valid customer information and inspect the order overview.
    await checkoutInformationPage.fillInformation('Taylor', 'Tester', '10001');
    await checkoutInformationPage.continue();
    await expect(checkoutOverviewPage.heading).toHaveText('Checkout: Overview');
    await expect(checkoutOverviewPage.paymentInformation).toContainText('SauceCard');
    await expect(checkoutOverviewPage.shippingInformation).toContainText('Pony Express');
    await expect(checkoutOverviewPage.itemTotal).toContainText('$29.99');
    await expect(checkoutOverviewPage.tax).toContainText('$2.40');
    await expect(checkoutOverviewPage.total).toContainText('$32.39');
    await expect(checkoutOverviewPage.orderItems).toContainText('Sauce Labs Backpack');

    const itemTotal = await checkoutOverviewPage.moneyValue(checkoutOverviewPage.itemTotal);
    const tax = await checkoutOverviewPage.moneyValue(checkoutOverviewPage.tax);
    const total = await checkoutOverviewPage.moneyValue(checkoutOverviewPage.total);
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });
});
