import { test, expect, Locator } from '@playwright/test';
import loginPage from "../POM/pages/loginPage";
import headerPage from "../POM/modules/header"
import inventoryPage from "../POM/pages/inventoryPage"

test.describe('Verify user logging in', async () => {
    let loginPO: loginPage;
    let loginError: Locator;
    
    test.beforeEach(async ({page}) => {
        loginPO = new loginPage(page);
        loginError = page.locator('h3[data-test="error"]')
        await loginPO.openPage();
    })

    test('Successful Login', async({page}) => {
        await loginPO.fillUsernameField('standard_user');
        await loginPO.fillPasswordField('secret_sauce');
        await loginPO.clickLoginButton();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
        await expect(page.getByTestId('title')).toHaveText('Products');
    })
    test('Login with empty Username', async({page}) => {
        await loginPO.fillPasswordField('secret_sauce');
        await loginPO.clickLoginButton();
        await expect(loginError).toContainText('Username is required')
    })
    test('Login with empty Password', async({page}) => {
        await loginPO.fillUsernameField('standard_user');
        await loginPO.clickLoginButton();
        await expect(loginError).toContainText('Password is required')
    })
    test('Wrong Password or Login', async({page}) => {
        await loginPO.fillUsernameField('standard_user');
        await loginPO.fillPasswordField('secret');
        await loginPO.clickLoginButton();
        await expect(loginError).toContainText('Username and password do not match any user in this service')
    })
})


test.describe('Verify Inventory Page UI and Sorting ', async() => {
    let loginPO: loginPage;
    let invPage: inventoryPage;
    
    // To Login before each test
    test.beforeEach(async ({page}) => {
        loginPO = new loginPage(page);
        invPage = new inventoryPage(page);
        await loginPO.login();
    })

    test('Verify sorting products is available',async () => {
        await expect(invPage.sortContainer).toHaveValue('az');
        await invPage.sortLohi();
        await expect(invPage.sortContainer).toHaveValue('lohi');
    })
    test('Verify all UI elements for Product Item container',async ({page}) => {
        expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        expect(invPage.productTitle).toHaveText('Products');
        expect

    })
    test('Verify prices sorting for Low High sorting',async () => {
        await invPage.sortLohi();
        const priceTexts = await invPage.itemPrice.allTextContents()
        const prices = priceTexts.map(i => Number(i.replace('$', '')))
        const expected = [...prices].sort((a,b) => a - b);
        expect(prices).toEqual(expected);
        console.log(prices)
        console.log(expected)
    })
    test('Verify prices sorting for High Low sorting',async () => {
        await invPage.sortHilo();
        const priceTexts = await invPage.itemPrice.allTextContents()
        const prices = priceTexts.map(i => Number(i.replace('$', '')))
        const expected = [...prices].sort((a,b) => b - a);
        expect(prices).toEqual(expected);
    })
    test('Verify amount of inventory items per page', async () => {
    console.log(await invPage.countInvItems())
    await expect.poll(() => invPage.countInvItems()).toBe(6);
    })
    test('Verify first product card with default sorting', async({ page}) => {
        await invPage.productItemVisible(0);
        await invPage.productItemVisible(5);
    })
})