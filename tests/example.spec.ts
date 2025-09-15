import { test, expect } from '@playwright/test';

test('Успішна авторизація', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  const username = page.getByTestId('username');
  await expect(username).toBeVisible();
  const password = page.locator('//input[@data-test="password"]')
  

  await username.fill('standard_user');
  await password.fill('secret_sauce');
  await page.getByText('Login', {exact:true}).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
  await expect(page.getByTestId('title')).toHaveText('Products');
});

test('Авторизація без логіну', async ({ page }) =>{
  await page.goto('https://www.saucedemo.com/');
  const password = page.locator('//input[@data-test="password"]')
  await expect(password).toBeVisible();

  await password.fill('secret_sauce');
  await page.getByText('Login', {exact:true}).click();
  await expect(page.locator('h3[data-test="error"]')).toContainText('Username is required')
});

test('Авторизація без пароля', async ({ page }) =>{
  await page.goto('https://www.saucedemo.com/');
  const username = page.getByTestId('username');
  await expect(username).toBeVisible();

  await username.fill('standard_user');
  await page.getByText('Login', {exact:true}).click();
  await expect(page.locator('h3[data-test="error"]')).toContainText('Password is required')
})

test('Неправильний логін або пароль', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  const username = page.getByTestId('username');
  await expect(username).toBeVisible();
  const password = page.locator('//input[@data-test="password"]')
  await expect(password).toBeVisible();
  

  await username.fill('standard_user');
  await password.fill('secret');
  await page.getByText('Login', {exact:true}).click();
  await expect(page.locator('h3[data-test="error"]')).toContainText('Username and password do not match any user in this service')
});

test('Авторизація різних юзерів', async ({ page }) =>{
  // Login as user with Visual defects
  await page.goto('https://www.saucedemo.com/');
  const username = page.getByTestId('username');
  await expect(username).toBeVisible();
  const password = page.locator('//input[@data-test="password"]')
  await expect(password).toBeVisible();
  
  await username.fill('visual_user');
  await password.fill('secret_sauce');
  await page.getByText('Login', {exact:true}).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
  await expect(page.getByTestId('title')).toHaveText('Products');
  // Then Logging out
  await page.locator('button[id="react-burger-menu-btn"]').click();
  await page.getByText('Logout').click();
  // Then relogin as locked user
  await username.fill('locked_out_user');
  await password.fill('secret_sauce');
  await page.getByText('Login', {exact:true}).click();
  await expect(page.locator('h3[data-test="error"]')).toContainText('Sorry, this user has been locked out.')
  
})

