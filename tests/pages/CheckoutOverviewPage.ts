import { type Locator, type Page } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly heading: Locator;
  readonly orderItems: Locator;
  readonly paymentInformation: Locator;
  readonly shippingInformation: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText('Checkout: Overview', { exact: true });
    this.orderItems = page.locator('.cart_item');
    this.paymentInformation = page.locator('.summary_value_label').nth(0);
    this.shippingInformation = page.locator('.summary_value_label').nth(1);
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async moneyValue(locator: Locator): Promise<number> {
    const text = await locator.innerText();
    const match = text.match(/\$([\d.]+)/);
    if (!match) {
      throw new Error(`Could not parse a dollar amount from: ${text}`);
    }
    return Number(match[1]);
  }
}
