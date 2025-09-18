import { test, expect, Locator, Page } from '@playwright/test';

export default class inventoryPage {
    private readonly page: Page;
    readonly productTitle: Locator;
    readonly sortContainer: Locator;
    readonly inventoryItem: Locator;
    private readonly itemImage: Locator;
    private readonly itemDesc: Locator;
    private readonly addToCart: Locator;
    readonly itemPrice: Locator;
    readonly itemTitle: Locator;
    private readonly inventoryList: Locator;

    constructor(page: Page) {
        this.page = page
        this.productTitle = this.page.getByTestId('title')
        this.sortContainer = this.page.getByTestId('product-sort-container')
        this.inventoryItem = this.page.getByTestId('inventory-item')
        this.itemImage = this.page.locator('img.inventory_item_img')
        this.addToCart = this.page.getByRole('button', { name: /add to cart/i })
        this.itemDesc = this.page.getByTestId('inventory-item-desc')
        this.itemPrice = this.page.getByTestId('inventory-item-price')
        this.itemTitle = this.page.getByTestId('inventory-item-name')
        this.inventoryList = this.page.getByTestId('inventory-list')
    }

    private at(index: number) {
    const item = this.inventoryItem.nth(index);
    return {
      item,
      title: item.getByTestId('inventory-item-name'),
      desc:  item.getByTestId('inventory-item-desc'),
      price: item.getByTestId('inventory-item-price'),
      img:   item.getByRole('img'), // або item.locator('img')
      // універсальна кнопка для будь-якого товару в межах картки:
      add:   item.getByRole('button', { name: /add to cart/i }),
    };
  }


    async sortAZ() {
        await this.sortContainer.selectOption('az')
    }
    async sortZA() {
        await this.sortContainer.selectOption('za')
    }
    async sortLohi() {
        await this.sortContainer.selectOption('lohi')

    }
    async sortHilo() {
        await this.sortContainer.selectOption('hilo')
    }
    async countInvItems(): Promise<number> {
        return await this.inventoryList.locator('.inventory_item').count();
    }
    async productItemVisible(index = 0) {
        await expect(this.inventoryList).toBeVisible();

        const total = await this.inventoryItem.count();
        expect(total).toBeGreaterThan(index); // захист від поза-діапазоном

        const i = this.at(index);
        await expect(i.item).toBeVisible();
        await expect(i.title).toBeVisible();
        await expect(i.desc).toBeVisible();
        await expect(i.price).toBeVisible();
        await expect(i.img).toBeVisible();
        await expect(i.add).toBeVisible();
    }
    async productItemInfo(index = 0) {
        
        const i = this.at(index);
        console.log(await (i.item).textContent())
        console.log((i.desc).textContent())
        console.log((i.title).textContent())
        console.log((i.price).textContent())
    }
}
