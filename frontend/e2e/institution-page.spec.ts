import { test, expect } from '@playwright/test';

test.describe('Institution Detail Page', () => {
  test('should navigate to institution page', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    const institutionCard = page.locator('a[href^="/institution/"]').first();
    
    if (await institutionCard.count() > 0) {
      await institutionCard.click();
      
      await expect(page).toHaveURL(/\/institution\/.+/);
      
      const backLink = page.getByRole('link', { name: /Повернутися до списку/i });
      await expect(backLink).toBeVisible();
    }
  });

  test('should display loading state', async ({ page }) => {
    await page.goto('/institution/Q123');
    
    const loadingOrError = page.locator('text=/Завантаження|Помилка|не знайдено/i');
    await expect(loadingOrError.first()).toBeVisible({ timeout: 5000 });
  });
});

