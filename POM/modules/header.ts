import { test, expect, Locator, Page } from '@playwright/test';

export default class headerPage {
    private readonly page: Page;
    private readonly burgerIcon: Locator; 
    private readonly cartIcon: Locator;
    readonly burgerAllItems: Locator;
    readonly burgerAbout: Locator;
    readonly logout: Locator;
    readonly burgerReset: Locator;
    readonly burgerClose: Locator;
    private readonly burgerMenuOpen: Locator;

    constructor(page: Page) {
        this.page = page;
        this.burgerIcon = page.getByTestId('react-burger-menu-btn');
        this.cartIcon = page.getByTestId('shopping-cart-link');
        this.burgerAllItems = page.locator('#inventory_sidebar_link')
        this.burgerAbout = page.locator('#about_sidebar_link')
        this.logout = page.locator('#logout_sidebar_link')
        this.burgerReset = page.locator('#reset_sidebar_link')
        this.burgerClose = page.locator('#react-burger-cross-btn')
        this.burgerMenuOpen = page.locator('.bm-menu')
    }
    
    async clickBurger() {
        await this.burgerIcon.click();
    }
    async closeBurger() {
        if (await this.burgerMenuOpen.isVisible()) {
            await this.burgerClose.click();
        }
    }
    async clickAllItems() {
        if (await this.burgerMenuOpen.isVisible()) {
            await this.burgerAllItems.click();
        } else {
            await this.clickBurger()
            await this.burgerAllItems.click()
        }
    }
    async clickAbout() {
        if (await this.burgerMenuOpen.isVisible()) {
            await this.burgerAbout.click();
        } else {
            await this.clickBurger()
            await this.burgerAbout.click()
        }
    }
    async Logout() {
        if (await this.burgerMenuOpen.isVisible()) {
            await this.logout.click();
        } else {
            await this.clickBurger()
            await this.logout.click()
        }
    }
    async ResetAppState() {
        if (await this.burgerMenuOpen.isVisible()) {
            await this.burgerReset.click();
        } else {
            await this.clickBurger()
            await this.burgerReset.click()
        }
    }
    async clickCart() {
        await this.cartIcon.click()
    }

    
}
