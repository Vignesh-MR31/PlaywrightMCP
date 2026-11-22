import { type Locator, type Page } from '@playwright/test';

export class BuzzPage {
  readonly newsfeedHeading: Locator;
  readonly mostRecentPostsFilter: Locator;
  readonly postComposer: Locator;
  readonly postButton: Locator;

  constructor(private readonly page: Page) {
    this.newsfeedHeading = page.getByText('Buzz Newsfeed', { exact: true });
    this.mostRecentPostsFilter = page.getByRole('button', { name: /Most Recent Posts/ });
    this.postComposer = page.getByRole('textbox', { name: "What's on your mind?" });
    this.postButton = page.getByRole('button', { name: 'Post', exact: true });
  }

  postContent(message: string) {
    return this.page.getByText(message, { exact: true }).first();
  }

  async createPost(message: string) {
    await this.postComposer.fill(message);
    await this.postButton.click();
  }
}