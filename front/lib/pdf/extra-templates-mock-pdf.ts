/**
 * PDF mock pour les modèles : rapport, contrat, certificat, NDA (pdf-lib).
 */

import type { PDFTemplate } from '@/types';

export const REPORT_TEMPLATE_ID = 'report-template';
export const CONTRACT_TEMPLATE_ID = 'contract-template';
export const CERTIFICATE_TEMPLATE_ID = 'certificate-template';
export const NDA_TEMPLATE_ID = 'nda-template';

function pickStr(data: Record<string, unknown> | undefined, key: string, fallback: string): string {
  const v = data?.[key];
  return typeof v === 'string' && v.trim() ? v.trim() : fallback;
}

/** Quel PDF générer selon le modèle (génération). */
export function getExtraBlobKindForTemplate(template: PDFTemplate): 'report' | 'contract' | 'certificate' | 'nda' | null {
  switch (template.id) {
    case REPORT_TEMPLATE_ID:
      return 'report';
    case CERTIFICATE_TEMPLATE_ID:
      return 'certificate';
    case NDA_TEMPLATE_ID:
      return 'nda';
    case CONTRACT_TEMPLATE_ID:
      return 'contract';
    default:
      if (template.category === 'report') return 'report';
      if (template.category === 'certificate') return 'certificate';
      if (template.category === 'contract') {
        if (/confidentialit|nda|non-disclosure/i.test(template.name)) return 'nda';
        return 'contract';
      }
      return null;
  }
}

/** Quel PDF régénérer au téléchargement (id template ou nom de fichier). */
export function getExtraBlobKindForDownload(pdfId: string, filename?: string): 'report' | 'contract' | 'certificate' | 'nda' | null {
  const byId: Record<string, 'report' | 'contract' | 'certificate' | 'nda'> = {
    [REPORT_TEMPLATE_ID]: 'report',
    [CONTRACT_TEMPLATE_ID]: 'contract',
    [CERTIFICATE_TEMPLATE_ID]: 'certificate',
    [NDA_TEMPLATE_ID]: 'nda',
  };
  if (byId[pdfId]) return byId[pdfId];
  if (!filename) return null;
  const f = filename.toLowerCase();
  if (f.includes('non-disclosure') || f.includes('confidentialité') || f.includes('confidentialite')) return 'nda';
  if (f.includes('accord-de-confidentialité') || f.includes('accord-de-confidentialite')) return 'nda';
  if (f.includes('certificat') || f.includes('certificate') || f.includes('completion')) return 'certificate';
  if (f.includes('rapport') || f.includes('activité') || f.includes('activite') || f.includes('business-report')) return 'report';
  if (
    f.includes('service-contract') ||
    f.includes('contrat-de-prestation') ||
    (f.includes('contrat') && f.includes('prestation'))
  ) {
    return 'contract';
  }
  return null;
}

export async function createExtraTemplatePdfBlob(
  kind: 'report' | 'contract' | 'certificate' | 'nda',
  data?: Record<string, unknown>
): Promise<Blob> {
  switch (kind) {
    case 'report':
      return createReportPdfBlob(data);
    case 'contract':
      return createContractPdfBlob(data);
    case 'certificate':
      return createCertificatePdfBlob(data);
    case 'nda':
      return createNdaPdfBlob(data);
  }
}

/** Découpe le texte en lignes qui tiennent dans maxWidth (largeur utile du PDF). */
function wrapPlainText(
  text: string,
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  fontSize: number,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  const paragraphs = text.split(/\n/);
  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    let current = '';
    for (const word of words) {
      const trial = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(trial, fontSize) <= maxWidth) {
        current = trial;
      } else {
        if (current) lines.push(current);
        if (font.widthOfTextAtSize(word, fontSize) <= maxWidth) {
          current = word;
        } else {
          let remaining = word;
          while (remaining.length > 0) {
            let len = remaining.length;
            while (len > 0 && font.widthOfTextAtSize(remaining.slice(0, len), fontSize) > maxWidth) {
              len--;
            }
            if (len < 1) len = 1;
            lines.push(remaining.slice(0, len));
            remaining = remaining.slice(len);
          }
          current = '';
        }
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

async function baseDoc() {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page = doc.addPage();
  const margin = 50;
  let y = page.getHeight() - margin;

  const maxTextWidth = () => page.getWidth() - 2 * margin;

  const ensure = (needed: number) => {
    if (y < margin + needed) {
      page = doc.addPage();
      y = page.getHeight() - margin;
    }
  };

  /**
   * Dessine un paragraphe avec retours à la ligne réels : chaque ligne a sa propre baseline,
   * le curseur Y avance du nombre de lignes (évite la superposition avec maxWidth de pdf-lib).
   */
  const draw = (text: string, size: number, font: typeof regular, color = rgb(0, 0, 0)) => {
    const lines = wrapPlainText(text.trim(), font, size, maxTextWidth());
    const lineHeight = font.heightAtSize(size) + 3;
    const blockHeight = lines.length * lineHeight + 6;
    ensure(blockHeight);
    for (const line of lines) {
      page.drawText(line, {
        x: margin,
        y,
        size,
        font,
        color,
      });
      y -= lineHeight;
    }
    y -= 4;
  };

  const finish = async () =>
    new Blob([await doc.save()], { type: 'application/pdf' });
  return { draw, rgb, bold, regular, finish, addGap: (n: number) => (y -= n) };
}

export async function createReportPdfBlob(data?: Record<string, unknown>): Promise<Blob> {
  const period = pickStr(data, 'period', `T1 ${new Date().getFullYear()}`);
  const org = pickStr(data, 'organization', 'ROCH SAS');
  const { draw, rgb, bold, regular, finish, addGap } = await baseDoc();

  draw('RAPPORT D’ACTIVITÉ', 20, bold);
  addGap(6);
  draw(`Période : ${period}`, 11, bold);
  draw(`Établissement : ${org}`, 10, regular, rgb(0.3, 0.3, 0.3));
  addGap(10);

  draw('1. Synthèse exécutive', 13, bold);
  draw(
    'Ce rapport présente les activités réalisées sur la période : livraisons majeures, indicateurs de qualité et alignement sur la feuille de route produit.',
    10,
    regular
  );
  addGap(8);

  draw('2. Indicateurs clés', 13, bold);
  const kpis = [
    'Disponibilité applicative : 99,9 %',
    'Tickets résolus dans les SLA : 94 %',
    'Satisfaction utilisateurs (NPS) : +12 points vs période précédente',
  ];
  for (const line of kpis) draw(`• ${line}`, 10, regular);
  addGap(8);

  draw('3. Réalisations', 13, bold);
  draw(
    'Mise en production du module PDF & DocuSign, refonte du tableau de bord, renforcement des tests automatisés (Jest, Playwright).',
    10,
    regular
  );
  addGap(8);

  draw('4. Risques & points de vigilance', 13, bold);
  draw('Charge sur l’équipe en fin de sprint ; mitigation : priorisation MoSCoW et revue hebdomadaire.', 10, regular);
  addGap(8);

  draw('5. Perspectives', 13, bold);
  draw('Industrialisation des pipelines CI/CD, extension des tests E2E sur les parcours critiques.', 10, regular);
  addGap(12);
  draw(
    `Document émis le ${new Date().toLocaleDateString('fr-FR')} — Confidentiel`,
    9,
    regular,
    rgb(0.45, 0.45, 0.45)
  );

  return await finish();
}

export async function createContractPdfBlob(data?: Record<string, unknown>): Promise<Blob> {
  const prestataire = pickStr(data, 'providerName', 'ROCH SAS');
  const client = pickStr(data, 'clientName', 'Client Démo SARL');
  const { draw, rgb, bold, regular, finish, addGap } = await baseDoc();

  draw('CONTRAT DE PRESTATION DE SERVICES', 16, bold);
  addGap(8);

  draw('Entre les soussignés :', 11, bold);
  draw(`${prestataire}, société immatriculée au RCS de Paris, ci-après « le Prestataire » ;`, 10, regular);
  draw(`Et ${client}, ci-après « le Client » ;`, 10, regular);
  addGap(8);

  draw('Article 1 — Objet', 12, bold);
  draw(
    'Le Prestataire fournit au Client des prestations de conception, développement et maintenance logicielle, selon les ordres de service validés.',
    10,
    regular
  );
  addGap(6);

  draw('Article 2 — Durée', 12, bold);
  draw('Le présent contrat est conclu pour une durée d’un (1) an à compter de sa signature, tacitement reconductible.', 10, regular);
  addGap(6);

  draw('Article 3 — Obligations du Prestataire', 12, bold);
  draw('Exécuter les prestations conformément aux bonnes pratiques, assurer la confidentialité des données du Client, tenir un reporting régulier.', 10, regular);
  addGap(6);

  draw('Article 4 — Obligations du Client', 12, bold);
  draw('Fournir les accès et informations nécessaires, valider les livrables dans les délais convenus, régler les factures selon les modalités ci-dessous.', 10, regular);
  addGap(6);

  draw('Article 5 — Prix et facturation', 12, bold);
  draw('Les prestations sont facturées sur la base des tarifs convenus en annexe. Paiement à 30 jours fin de mois.', 10, regular);
  addGap(6);

  draw('Article 6 — Résiliation', 12, bold);
  draw('Chaque partie peut résilier le contrat avec un préavis de trente (30) jours, ou en cas de manquement grave non réparé dans quinze (15) jours.', 10, regular);
  addGap(6);

  draw('Article 7 — Droit applicable', 12, bold);
  draw('Le présent contrat est soumis au droit français. Litiges : tribunaux compétents de Paris.', 10, regular);
  addGap(12);
  draw('Fait à Paris, en deux exemplaires.', 10, regular);
  addGap(16);
  draw('Le Prestataire (signature)                              Le Client (signature)', 9, regular, rgb(0.35, 0.35, 0.35));

  return await finish();
}

export async function createCertificatePdfBlob(data?: Record<string, unknown>): Promise<Blob> {
  const trainee = pickStr(data, 'traineeName', 'Jean Dupont');
  const course = pickStr(data, 'courseName', 'Développement Full Stack & tests automatisés');
  const hours = pickStr(data, 'hours', '35');
  const { draw, rgb, bold, regular, finish, addGap } = await baseDoc();

  draw('CERTIFICAT DE FORMATION', 18, bold);
  addGap(16);
  draw('La société ROCH SAS atteste que', 11, regular);
  addGap(8);
  draw(trainee.toUpperCase(), 16, bold);
  addGap(10);
  draw(`a suivi avec succès la formation intitulée :`, 10, regular);
  addGap(6);
  draw(course, 12, bold);
  addGap(10);
  draw(`Durée : ${hours} heures — Modalité : présentiel / distanciel`, 10, regular);
  draw(`Lieu : Paris / à distance`, 10, regular);
  addGap(12);
  draw('Ce certificat est délivré pour servir et valoir ce que de droit.', 10, regular);
  addGap(20);
  draw(`Fait à Paris, le ${new Date().toLocaleDateString('fr-FR')}`, 10, regular);
  addGap(24);
  draw('Direction pédagogique ROCH', 10, bold);
  draw('Signature et cachet', 9, regular, rgb(0.4, 0.4, 0.4));

  return await finish();
}

export async function createNdaPdfBlob(data?: Record<string, unknown>): Promise<Blob> {
  const partyA = pickStr(data, 'partyA', 'ROCH SAS');
  const partyB = pickStr(data, 'partyB', 'Partenaire Démo SA');
  const { draw, rgb, bold, regular, finish, addGap } = await baseDoc();

  draw('ACCORD DE CONFIDENTIALITÉ (NDA)', 16, bold);
  addGap(10);

  draw('1. Parties', 12, bold);
  draw(`${partyA}, d’une part, et ${partyB}, d’autre part, sont désignées ensemble « les Parties ».`, 10, regular);
  addGap(8);

  draw('2. Objet', 12, bold);
  draw(
    'Les Parties échangent des Informations Confidentielles dans le cadre d’une collaboration commerciale et/ou technique. Le présent accord encadre leur protection.',
    10,
    regular
  );
  addGap(8);

  draw('3. Définition', 12, bold);
  draw(
    'Sont confidentielles toutes les informations divulguées oralement ou par écrit, identifiées comme telles ou dont la nature impose un devoir de discrétion.',
    10,
    regular
  );
  addGap(8);

  draw('4. Obligations', 12, bold);
  draw(
    'Chaque Partie s’engage à ne pas divulguer les Informations Confidentielles à des tiers sans accord préalable, à les utiliser uniquement pour les besoins du projet, et à les protéger avec le même soin que ses propres informations sensibles.',
    10,
    regular
  );
  addGap(8);

  draw('5. Durée', 12, bold);
  draw('Les obligations de confidentialité demeurent en vigueur pendant cinq (5) ans à compter de la dernière divulgation.', 10, regular);
  addGap(8);

  draw('6. Sanctions', 12, bold);
  draw('Tout manquement peut entraîner résiliation et dommages-intérêts, sans préjudice d’autres recours.', 10, regular);
  addGap(8);

  draw('7. Droit applicable', 12, bold);
  draw('Le présent accord est régi par le droit français. Compétence exclusive des tribunaux de Paris.', 10, regular);
  addGap(16);
  draw(`Fait à Paris, le ${new Date().toLocaleDateString('fr-FR')}, en deux exemplaires originaux.`, 10, regular);
  addGap(20);
  draw(`${partyA} (signature)                    ${partyB} (signature)`, 9, regular, rgb(0.35, 0.35, 0.35));

  return await finish();
}
