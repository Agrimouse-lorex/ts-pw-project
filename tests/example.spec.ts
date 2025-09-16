import { test, expect } from '@playwright/test';

test('Successful login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  const usernameField = page.getByTestId('username');
  await expect(usernameField).toBeVisible();
  const passwordField = page.locator('//input[@data-test="password"]')
  

  await usernameField.fill('standard_user');
  await passwordField.fill('secret_sauce');
  await page.getByText('Login', {exact:true}).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
  await expect(page.getByTestId('title')).toHaveText('Products');
});

test('Login without username', async ({ page }) =>{
  await page.goto('https://www.saucedemo.com/');
  const passwordField = page.locator('//input[@data-test="password"]')
  await expect(passwordField).toBeVisible();

  await passwordField.fill('secret_sauce');
  await page.getByText('Login', {exact:true}).click();
  await expect(page.locator('h3[data-test="error"]')).toContainText('Username is required')
});

test('Login without password', async ({ page }) =>{
  await page.goto('https://www.saucedemo.com/');
  const usernameField = page.getByTestId('username');
  await expect(usernameField).toBeVisible();

  await usernameField.fill('standard_user');
  await page.getByText('Login', {exact:true}).click();
  await expect(page.locator('h3[data-test="error"]')).toContainText('Password is required')
})

test('Wrong password or login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  const usernameField = page.getByTestId('username');
  await expect(usernameField).toBeVisible();
  const passwordField = page.locator('//input[@data-test="password"]')
  await expect(passwordField).toBeVisible();
  

  await usernameField.fill('standard_user');
  await passwordField.fill('secret');
  await page.getByText('Login', {exact:true}).click();
  await expect(page.locator('h3[data-test="error"]')).toContainText('Username and password do not match any user in this service')
});

test('Logout test', async ({ page }) =>{
  // Login as user with Visual defects
  await page.goto('https://www.saucedemo.com/');
  const usernameField = page.getByTestId('username');
  await expect(usernameField).toBeVisible();
  const passwordField = page.locator('//input[@data-test="password"]')
  await expect(passwordField).toBeVisible();
  
  await usernameField.fill('visual_user');
  await passwordField.fill('secret_sauce');
  await page.getByText('Login', {exact:true}).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
  await expect(page.getByTestId('title')).toHaveText('Products');
  
  // Now Logout
  await page.locator('button[id="react-burger-menu-btn"]').click();
  await page.getByText('Logout').click();
  
})
test('Login as locked out user', async({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  const usernameField = page.getByTestId('username');
  await expect(usernameField).toBeVisible();
  const passwordField = page.locator('//input[@data-test="password"]')
  await expect(passwordField).toBeVisible();
  
  await usernameField.fill('locked_out_user');
  await passwordField.fill('secret_sauce');
  await page.getByText('Login', {exact:true}).click();
  await expect(page.locator('h3[data-test="error"]')).toContainText('Sorry, this user has been locked out.')
  
})

test('Filtering by price from low to high', async({ page }) => {
  //first we Login and check that login is successful 
  await page.goto('https://www.saucedemo.com/');
  await page.getByTestId('username').fill('standard_user');
  await page.locator('//input[@data-test="password"]').fill('secret_sauce');
  await page.getByText('Login', {exact:true}).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
  await expect(page.getByTestId('title')).toHaveText('Products');
  // then logic to get out price data in array
  let prices: number[] = [];

  const pricesFromPage = await page.getByTestId('inventory-item-price').all();
  
  for(let i = 0; i<pricesFromPage.length; i++) {
    const priceWithoutFormatting = await pricesFromPage[i].textContent();
    const priceWithFormatting = priceWithoutFormatting!.split('$');
    const finalPrice = priceWithFormatting[1];
    prices.push(parseFloat(finalPrice))

  }
console.log(prices)

await page.getByTestId('product-sort-container').selectOption('lohi');

const sortedPrices = [...prices].sort((a,b) => a - b);
const sortedProducts = await page.getByTestId('inventory-item-price').all();
const uiSortedPrices: number [] = [];

for (const priceEl of sortedProducts) {
  const text = await priceEl.textContent();
  const price = parseFloat(text!.replace('$', ''));
  uiSortedPrices.push(price);
}
console.log(uiSortedPrices)

expect(uiSortedPrices).toEqual(sortedPrices);
})
