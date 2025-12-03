import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: /Довідник з навчальних закладів України/i })).toBeVisible();
  });

  test('should display search bar', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByRole('searchbox');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Пошук закладів...');
  });

  test('should display filter panel', async ({ page }) => {
    await page.goto('/');
    
    const filterPanel = page.locator('aside');
    await expect(filterPanel).toBeAttached();
  });

  test('should handle search input', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('test search');
    
    await page.waitForTimeout(400);
    
    await expect(searchInput).toHaveValue('test search');
  });

  test('should click search button', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByRole('searchbox');
    const searchButton = page.getByRole('button', { name: /пошук/i });
    
    await searchInput.fill('test');
    await searchButton.click();
    
    await expect(searchButton).toBeEnabled();
  });
});

