import { type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly heading: Locator;
  private readonly profilePicture: Locator;
  private readonly logoutMenuItem: Locator;
  private readonly pimLink: Locator;
  private readonly adminLink: Locator;
  private readonly buzzLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.profilePicture = page.getByRole('banner').getByRole('img', { name: 'profile picture' });
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
    this.pimLink = page.getByRole('link', { name: 'PIM' });
    this.adminLink = page.getByRole('link', { name: 'Admin' });
    this.buzzLink = page.getByRole('link', { name: 'Buzz' });
  }

  async logout() {
    await this.profilePicture.click();
    await this.logoutMenuItem.click();
  }

  async navigateToPim() {
    await this.pimLink.click();
  }

  async navigateToAdmin() {
    await this.adminLink.click();
  }

  async navigateToBuzz() {
    await this.buzzLink.click();
  }
}