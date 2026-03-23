import { test, expect } from '@playwright/test';

test.describe('Page d’accueil', () => {
  test('affiche la marque et le hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'DocuFlow' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /gestion documentaire/i })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Connexion' }).first()).toBeVisible();
  });

  test('permet d’aller à la page de connexion', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').getByRole('link', { name: 'Connexion' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: /bon retour/i })).toBeVisible();
  });
});
