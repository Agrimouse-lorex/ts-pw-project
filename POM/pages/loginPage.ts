import { test, expect, Locator, Page } from '@playwright/test';

export default class loginPage {
    private readonly page: Page;
    private readonly usernameField: Locator;
    private readonly passwordField: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page
        this.usernameField = page.getByTestId('username');
        this.passwordField = page.locator('//input[@data-test="password"]');
        this.loginButton = page.getByText('Login', {exact:true});
    }

    async openPage() {
        await this.page.goto('/');
    }
    async fillUsernameField(username: string) {
        await this.usernameField.fill(username);
    }
    async fillPasswordField(password: string) {
        await this.passwordField.fill(password);
    }
    async clickLoginButton() {
        await this.loginButton.click();
    }
    async login() {
        await this.openPage();
        await this.fillUsernameField('standard_user');
        await this.fillPasswordField('secret_sauce');
        await this.clickLoginButton();
    }
}