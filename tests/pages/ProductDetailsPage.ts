import { type Locator, type Page } from '@playwright/test';

export class ProductDetailsPage {
  readonly productName: Locator;
  readonly productImage: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly cartButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(private readonly page: Page) {
    this.productName = page.locator('.inventory_details_name');
    this.productImage = page.locator('.inventory_details_img');
    this.description = page.locator('.inventory_details_desc');
    this.price = page.locator('.inventory_details_price');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.removeButton = page.getByRole('button', { name: 'Remove' });
    this.cartButton = page.getByRole('button', { name: /^Cart,/ });
    this.backToProductsButton = page.getByRole('button', { name: 'Back to products' });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async openCart(): Promise<void> {
    await this.cartButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}
