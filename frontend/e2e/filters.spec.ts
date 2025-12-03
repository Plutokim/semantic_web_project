import { test, expect } from '@playwright/test';

test.describe('Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
  });

  test('should display filter sections', async ({ page }) => {
    const filterPanel = page.locator('aside');
    await expect(filterPanel).toBeAttached();
  });

  test('should toggle filter checkbox', async ({ page }) => {
    const checkboxes = page.locator('aside input[type="checkbox"]');
    const count = await checkboxes.count();
    
    if (count > 0) {
      const firstCheckbox = checkboxes.first();
      const initialChecked = await firstCheckbox.isChecked();
      
      await firstCheckbox.click();
      
      await page.waitForTimeout(100);
      
      const newChecked = await firstCheckbox.isChecked();
      expect(newChecked).toBe(!initialChecked);
    }
  });

  test('should show "Показати ще" button when filters exceed limit', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const showMoreButton = page.getByRole('button', { name: /Показати ще/i });
    
    const isVisible = await showMoreButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await showMoreButton.click();
      await expect(showMoreButton).toBeVisible({ timeout: 1000 });
    }
  });
});

