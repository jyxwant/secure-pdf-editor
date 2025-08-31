import { test, expect } from '@playwright/test';

test('French language switching test', async ({ page }) => {
  // Navigate to the app
  await page.goto('http://localhost:5174');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot before language change
  await page.screenshot({ path: 'before-french.png' });
  
  // Find and click language selector
  const languageButton = page.locator('button[aria-haspopup="true"]');
  await expect(languageButton).toBeVisible();
  await languageButton.click();
  
  // Wait for dropdown to appear and select French
  const frenchOption = page.locator('text=Français');
  await expect(frenchOption).toBeVisible();
  await frenchOption.click();
  
  // Wait for language change to take effect
  await page.waitForTimeout(2000);
  
  // Take screenshot after language change
  await page.screenshot({ path: 'after-french.png' });
  
  // Print page content to debug
  const pageContent = await page.textContent('body');
  console.log('Page content after switching to French:', pageContent?.substring(0, 500));
  
  // Check if the title changed to French
  const title = await page.textContent('h1');
  console.log('H1 title:', title);
  
  // Check if specific French text appears
  const fileRequirements = page.locator('text=📄 Exigences du fichier');
  const isVisible = await fileRequirements.isVisible();
  console.log('Is French file requirements visible:', isVisible);
  
  if (!isVisible) {
    // Log what we actually see
    const actualText = await page.locator('h4').first().textContent();
    console.log('Actual h4 text:', actualText);
  }
  
  await expect(fileRequirements).toBeVisible();
});