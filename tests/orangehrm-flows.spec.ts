import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'csv-parse/sync';
import { test, expect, type Page } from '@playwright/test';
import { AdminPage } from '../pages/AdminPage';
import { BuzzPage } from '../pages/BuzzPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { PIMPage } from '../pages/PIMPage';

async function login(page: Page, username = 'Admin', password = 'admin123') {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
  return new DashboardPage(page);
}

test.describe('OrangeHRM workflows', () => {
  test('logs out and returns to the login page', async ({ page }) => {
    const dashboardPage = await login(page);
    const loginPage = new LoginPage(page);
    await dashboardPage.logout();

    await expect(page).toHaveURL(/\/web\/index\.php\/auth\/login$/);
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('searches for an employee in PIM', async ({ page }) => {
    const dashboardPage = await login(page);
    await dashboardPage.navigateToPim();
    const pimPage = new PIMPage(page);

    await expect(pimPage.employeeInformationHeading).toBeVisible();
    await pimPage.searchEmployee('John123');

    await expect(pimPage.employeeResult('John123 Doe456')).toBeVisible();
  });

  test('shows System Users and the Add button in Admin', async ({ page }) => {
    const dashboardPage = await login(page);
    await dashboardPage.navigateToAdmin();
    const adminPage = new AdminPage(page);

    await expect(adminPage.systemUsersHeading).toBeVisible();
    await expect(adminPage.addButton).toBeVisible();
  });

  test('adds an employee and displays the employee profile', async ({ page }) => {
    const dashboardPage = await login(page);
    await dashboardPage.navigateToPim();
    const pimPage = new PIMPage(page);
    await pimPage.openAddEmployeeForm();
    await pimPage.addEmployee('John123', 'Doe456');

    await expect(page).toHaveURL(/\/web\/index\.php\/pim\/viewPersonalDetails\/empNumber\/\d+$/);
    await expect(pimPage.employeeProfileHeading('John123 Doe456')).toBeVisible();
  });

  test('publishes a post in the Buzz feed', async ({ page }) => {
    const dashboardPage = await login(page);
    await dashboardPage.navigateToBuzz();
    const buzzPage = new BuzzPage(page);

    await expect(buzzPage.newsfeedHeading).toBeVisible();
    await expect(buzzPage.mostRecentPostsFilter).toBeVisible();
    await buzzPage.postComposer.fill('Excited for testing!');
    await expect(buzzPage.postComposer).toHaveValue('Excited for testing!');
    await buzzPage.postButton.click();

    await expect(buzzPage.postContent('Excited for testing!')).toBeVisible();
  });
});

const inlineLoginCases = [
  { username: 'Admin', password: 'admin123', expected: 'Dashboard' },
  { username: 'fakeuser', password: 'fakepass', expected: 'Invalid credentials' },
  { username: 'ESSUser1', password: 'ess123', expected: 'Invalid credentials' },
] as const;

test.describe('Data-driven login validation', () => {
  for (const scenario of inlineLoginCases) {
    test(`${scenario.username} login result`, async ({ page }) => {
      const dashboardPage = await login(page, scenario.username, scenario.password);
      const loginPage = new LoginPage(page);

      if (scenario.expected === 'Dashboard') {
        await expect(dashboardPage.heading).toBeVisible();
        await dashboardPage.logout();
        await expect(loginPage.usernameInput).toBeVisible();
      } else {
        await expect(loginPage.invalidCredentialsAlert).toHaveText(scenario.expected);
      }
    });
  }
});

type CsvLoginCase = {
  Username: string;
  Password: string;
  Expected: 'Dashboard' | 'Invalid credentials';
};

const csvLoginCases = parse(
  readFileSync(join(__dirname, '..', 'test_data', 'loginData.csv'), 'utf8'),
  { columns: true, skip_empty_lines: true, trim: true },
) as CsvLoginCase[];

test.describe('CSV-driven login validation', () => {
  test.afterEach(async ({}, testInfo) => {
    const result = testInfo.status === testInfo.expectedStatus ? 'PASS' : 'FAIL';
    console.log(`${result}: ${testInfo.title}`);
  });

  for (const scenario of csvLoginCases) {
    test(`${scenario.Username} expects ${scenario.Expected}`, async ({ page }) => {
      const dashboardPage = await login(page, scenario.Username, scenario.Password);
      const loginPage = new LoginPage(page);

      if (scenario.Expected === 'Dashboard') {
        await expect(dashboardPage.heading).toBeVisible();
      } else {
        await expect(loginPage.invalidCredentialsAlert).toHaveText(scenario.Expected);
      }
    });
  }
});