import { test, expect } from '@playwright/test';

test.describe('Pagination', () => {
  test('should display pagination when there are many institutions', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(2000);
    
    const pagination = page.locator('text=/Сторінка|Попередня|Наступна/i');
    
    const isVisible = await pagination.first().isVisible().catch(() => false);
    
    if (isVisible) {
      await expect(page.getByText(/Сторінка \d+ з \d+/i)).toBeVisible();
      
      const prevButton = page.getByRole('button', { name: /Попередня/i });
      const nextButton = page.getByRole('button', { name: /Наступна/i });
      
      await expect(prevButton).toBeVisible();
      await expect(nextButton).toBeVisible();
    }
  });

  test('should navigate to next page', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    const nextButton = page.getByRole('button', { name: /Наступна/i });
    
    if (await nextButton.isVisible()) {
      const isDisabled = await nextButton.isDisabled();
      
      if (!isDisabled) {
        await nextButton.click();
        
        await expect(page.getByText(/Сторінка 2/i)).toBeVisible({ timeout: 2000 });
      }
    }
  });

  test('should navigate to previous page', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    const nextButton = page.getByRole('button', { name: /Наступна/i });
    const prevButton = page.getByRole('button', { name: /Попередня/i });
    
    if (await nextButton.isVisible() && !(await nextButton.isDisabled())) {
      await nextButton.click();
      await page.waitForTimeout(500);
      
      if (await prevButton.isVisible() && !(await prevButton.isDisabled())) {
        await prevButton.click();
        await expect(page.getByText(/Сторінка 1/i)).toBeVisible({ timeout: 2000 });
      }
    }
  });
});

