import { test, expect } from '@playwright/test';

test.describe('Page de connexion', () => {
  test('affiche le formulaire', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /bon retour/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
  });

  test('affiche une erreur de validation pour un email invalide', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('pas-un-email');
    await page.getByLabel(/mot de passe/i).fill('secret12');
    await page.locator('form').getByRole('button', { name: /^Connexion$/i }).click();
    await expect(
      page.getByText(/adresse email valide/i)
    ).toBeVisible();
  });
});
