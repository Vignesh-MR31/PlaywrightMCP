import { type Locator, type Page } from '@playwright/test';

export class CheckoutCompletePage {
  readonly heading: Locator;
  readonly confirmationTitle: Locator;
  readonly dispatchMessage: Locator;
  readonly cartButton: Locator;
  readonly backHomeButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText('Checkout: Complete!', { exact: true });
    this.confirmationTitle = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.dispatchMessage = page.getByText('Your order has been dispatched');
    this.cartButton = page.getByRole('button', { name: /^Cart,/ });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
