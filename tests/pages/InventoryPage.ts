import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly pageHeading: Locator;
  readonly sortControl: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly cartButton: Locator;

  constructor(private readonly page: Page) {
    this.pageHeading = page.getByText('Products', { exact: true });
    this.sortControl = page.getByRole('combobox', { name: 'Sort products' });
    this.productCards = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
    this.cartButton = page.getByRole('button', { name: /^Cart,/ });
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortControl.selectOption(value);
  }

  async openProduct(productName: string): Promise<void> {
    await this.page.getByRole('link', { name: productName, exact: true }).click();
  }

  productActionButton(productName: string): Locator {
    const testId = this.productTestId(productName);
    return this.page.locator(`[data-test="add-to-cart-${testId}"], [data-test="remove-${testId}"]`);
  }

  async addProduct(productName: string): Promise<void> {
    await this.page.locator(`[data-test="add-to-cart-${this.productTestId(productName)}"]`).click();
  }

  async openCart(): Promise<void> {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }

  private productTestId(productName: string): string {
    return productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}
