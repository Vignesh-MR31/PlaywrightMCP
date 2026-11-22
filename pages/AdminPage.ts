import { type Locator, type Page } from '@playwright/test';

export class AdminPage {
  readonly systemUsersHeading: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    this.systemUsersHeading = page.getByRole('heading', { name: 'System Users' });
    this.addButton = page.getByRole('button', { name: /Add/ });
  }
}