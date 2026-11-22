import { type Locator, type Page } from '@playwright/test';

export class PIMPage {
  readonly employeeInformationHeading: Locator;
  readonly searchButton: Locator;
  readonly saveButton: Locator;

  constructor(private readonly page: Page) {
    this.employeeInformationHeading = page.getByRole('heading', { name: 'Employee Information' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  employeeResult(name: string) {
    return this.page.getByRole('row').filter({ hasText: name });
  }

  employeeProfileHeading(name: string) {
    return this.page.getByRole('heading', { name, exact: true });
  }

  async searchEmployee(name: string) {
    await this.page.getByPlaceholder('Type for hints...').first().fill(name);
    await this.page.getByRole('option').filter({ hasText: name }).first().click();
    await this.searchButton.click();
  }

  async openAddEmployeeForm() {
    await this.page.getByRole('link', { name: 'Add Employee' }).click();
  }

  async addEmployee(firstName: string, lastName: string) {
    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);
    await this.saveButton.click();
  }
}