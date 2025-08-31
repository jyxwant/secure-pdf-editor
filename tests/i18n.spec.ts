import { test, expect } from '@playwright/test';

test.describe('i18n Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174');
  });

  test('should default to detected language', async ({ page }) => {
    // Wait for the page to load
    await expect(page.locator('h1')).toBeVisible();
    
    // Check if we have the language selector button
    const languageSelector = page.locator('button[aria-haspopup="true"]');
    await expect(languageSelector).toBeVisible();
  });

  test('should switch to French and display all text in French', async ({ page }) => {
    // Wait for page to load
    await expect(page.locator('h1')).toBeVisible();
    
    // Click language selector
    const languageSelector = page.locator('button[aria-haspopup="true"]');
    await languageSelector.click();
    
    // Select French
    const frenchOption = page.locator('text=Français');
    await frenchOption.click();
    
    // Wait a bit for language change to take effect
    await page.waitForTimeout(500);
    
    // Check key elements are in French
    await expect(page.locator('h1')).toContainText('Éditeur PDF Sécurisé');
    await expect(page.locator('h2')).toContainText('Éditeur PDF Sécurisé');
    
    // Check file requirements section
    await expect(page.locator('text=📄 Exigences du fichier')).toBeVisible();
    await expect(page.locator('text=🔄 Flux d\'utilisation')).toBeVisible();
    
    // Check upload area text
    await expect(page.locator('text=Glisser le fichier PDF ici')).toBeVisible();
    await expect(page.locator('text=cliquer pour sélectionner le fichier')).toBeVisible();
    
    // Check privacy section
    await expect(page.locator('text=100% Traitement Local, Confidentialité Sécurisée')).toBeVisible();
    
    // Check file requirements
    await expect(page.locator('text=Seuls les fichiers PDF sont pris en charge')).toBeVisible();
    await expect(page.locator('text=Taille de fichier ne dépassant pas 50 Mo')).toBeVisible();
    
    // Check usage flow steps
    await expect(page.locator('text=Télécharger le fichier PDF (glisser ou cliquer pour sélectionner)')).toBeVisible();
    await expect(page.locator('text=Glisser la souris pour sélectionner les zones d\'informations sensibles')).toBeVisible();
  });

  test('should switch to Arabic and display all text in Arabic', async ({ page }) => {
    // Wait for page to load
    await expect(page.locator('h1')).toBeVisible();
    
    // Click language selector
    const languageSelector = page.locator('button[aria-haspopup="true"]');
    await languageSelector.click();
    
    // Select Arabic
    const arabicOption = page.locator('text=العربية');
    await arabicOption.click();
    
    // Wait for language change
    await page.waitForTimeout(500);
    
    // Check key elements are in Arabic
    await expect(page.locator('h1')).toContainText('محرر PDF الآمن');
    await expect(page.locator('h2')).toContainText('محرر PDF الآمن');
    
    // Check file requirements section
    await expect(page.locator('text=📄 متطلبات الملف')).toBeVisible();
    await expect(page.locator('text=🔄 تدفق الاستخدام')).toBeVisible();
    
    // Check upload area text
    await expect(page.locator('text=اسحب ملف PDF هنا')).toBeVisible();
    await expect(page.locator('text=أو انقر لتحديد الملف')).toBeVisible();
    
    // Check privacy section
    await expect(page.locator('text=100% معالجة محلية، خصوصية آمنة')).toBeVisible();
    
    // Check file requirements
    await expect(page.locator('text=ملفات PDF فقط مدعومة')).toBeVisible();
    await expect(page.locator('text=الحد الأقصى لحجم الملف: 50 ميجابايت')).toBeVisible();
  });

  test('should switch to English and display all text in English', async ({ page }) => {
    // Wait for page to load
    await expect(page.locator('h1')).toBeVisible();
    
    // Click language selector
    const languageSelector = page.locator('button[aria-haspopup="true"]');
    await languageSelector.click();
    
    // Select English
    const englishOption = page.locator('text=English');
    await englishOption.click();
    
    // Wait for language change
    await page.waitForTimeout(500);
    
    // Check key elements are in English
    await expect(page.locator('h1')).toContainText('PDF Security Editor');
    await expect(page.locator('h2')).toContainText('Upload PDF File');
    
    // Check file requirements section
    await expect(page.locator('text=📄 File Requirements')).toBeVisible();
    await expect(page.locator('text=🔄 Usage Flow')).toBeVisible();
    
    // Check upload area text
    await expect(page.locator('text=Drag PDF file here')).toBeVisible();
    await expect(page.locator('text=click to select file')).toBeVisible();
    
    // Check privacy section
    await expect(page.locator('text=100% Local Processing, Privacy Secure')).toBeVisible();
    
    // Check file requirements
    await expect(page.locator('text=Only PDF format files supported')).toBeVisible();
    await expect(page.locator('text=File size no more than 50MB')).toBeVisible();
  });

  test('should persist language choice after page reload', async ({ page }) => {
    // Switch to French
    const languageSelector = page.locator('button[aria-haspopup="true"]');
    await languageSelector.click();
    const frenchOption = page.locator('text=Français');
    await frenchOption.click();
    
    // Wait for change
    await page.waitForTimeout(500);
    
    // Reload page
    await page.reload();
    
    // Check if French is still selected
    await expect(page.locator('h1')).toContainText('Éditeur PDF Sécurisé');
    await expect(page.locator('text=📄 Exigences du fichier')).toBeVisible();
  });

  test('should not have any hardcoded English text when French is selected', async ({ page }) => {
    // Switch to French
    const languageSelector = page.locator('button[aria-haspopup="true"]');
    await languageSelector.click();
    const frenchOption = page.locator('text=Français');
    await frenchOption.click();
    
    await page.waitForTimeout(1000);
    
    // Check that common English phrases are NOT present
    const englishPhrases = [
      'File Requirements',
      'Usage Flow', 
      'Drag PDF file here',
      'click to select file',
      'Only PDF format files supported',
      'Local processing',
      'Max 50MB',
      'PDF only'
    ];
    
    for (const phrase of englishPhrases) {
      await expect(page.locator(`text=${phrase}`)).toHaveCount(0);
    }
  });

  test('should not have any hardcoded English text when Arabic is selected', async ({ page }) => {
    // Switch to Arabic
    const languageSelector = page.locator('button[aria-haspopup="true"]');
    await languageSelector.click();
    const arabicOption = page.locator('text=العربية');
    await arabicOption.click();
    
    await page.waitForTimeout(1000);
    
    // Check that common English phrases are NOT present
    const englishPhrases = [
      'File Requirements',
      'Usage Flow', 
      'Drag PDF file here',
      'click to select file',
      'Only PDF format files supported',
      'Local processing',
      'Max 50MB',
      'PDF only'
    ];
    
    for (const phrase of englishPhrases) {
      await expect(page.locator(`text=${phrase}`)).toHaveCount(0);
    }
  });
});