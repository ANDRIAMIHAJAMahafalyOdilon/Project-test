/**
 * Contenu texte de la fiche de poste Full Stack & Test Engineer (mock PDF côté client).
 * Reprise à l’identique du texte métier ; aligné avec le backend (PDFKit) lorsque l’API est utilisée.
 */
export const JOB_POSTING_FULLSTACK_LINES: string[] = [
  'Fiche de poste : Full Stack & Test Engineer',
  '',
  'Intitulé : Full Stack & Test Engineer (H/F)',
  'Contrat : CDI / Freelance',
  'Localisation : Télétravail / Hybride',
  '',
  'Missions',
  '',
  'Développement Full Stack :',
  '- Développer des fonctionnalités React/TypeScript (dashboard, formulaires, hooks personnalisés).',
  '- Créer et maintenir des APIs Node.js/Express.',
  '- Intégrer les services de génération PDF et DocuSign.',
  '',
  'Tests :',
  '- Mettre en place une stratégie de tests unitaires, intégration et E2E.',
  '- Rédiger des tests avec Jest, React Testing Library et Cypress/Playwright.',
  '- Viser une couverture de code minimale de 80% sur les routes et services critiques.',
  '- Automatiser les tests dans les pipelines CI/CD.',
  '',
  'Compétences',
  '',
  '- Frontend : React, TypeScript, Tailwind CSS, Vite.',
  '- Backend : Node.js, Express, TypeScript, REST APIs.',
  '- Base de données : MongoDB, Mongoose.',
  '- Tests : Jest, Supertest, React Testing Library, Cypress/Playwright.',
  '- Outils : Docker, Git, Swagger, PDFKit, DocuSign API.',
  '',
  'Profil',
  '',
  "- 4+ ans d'expérience full stack avec une forte composante tests.",
  '- Rigoureux, autonome, passionné par la qualité logicielle.',
  '- Français courant.',
];

export const JOB_POSTING_TEMPLATE_ID = 'job-posting-fullstack-test';

export function isJobPostingMockTemplate(templateId: string, filename?: string): boolean {
  return (
    templateId === JOB_POSTING_TEMPLATE_ID ||
    (filename?.includes('Full-Stack') ?? false) ||
    (filename?.includes('Fiche-de-poste') ?? false)
  );
}
