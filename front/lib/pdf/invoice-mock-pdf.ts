/**
 * PDF facture mock (pdf-lib) — contenu structuré, pas seulement un titre.
 */

export const INVOICE_TEMPLATE_ID = 'invoice-template';

/** Détecte une facture au téléchargement (id template ou nom de fichier généré). */
export function isInvoiceMockPdf(pdfId: string, filename?: string): boolean {
  if (pdfId === INVOICE_TEMPLATE_ID) return true;
  if (!filename) return false;
  const f = filename.toLowerCase();
  return (
    f.includes('facture') ||
    f.includes('invoice') ||
    f.includes('modèle-de-facture') ||
    f.includes('modele-de-facture')
  );
}

function pickStr(data: Record<string, unknown> | undefined, key: string, fallback: string): string {
  const v = data?.[key];
  return typeof v === 'string' && v.trim() ? v.trim() : fallback;
}

export async function createInvoicePdfBlob(
  data?: Record<string, unknown>
): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');

  const invoiceNo = pickStr(data, 'invoiceNumber', `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`);
  const clientName = pickStr(data, 'clientName', 'Client Démo SARL');
  const clientEmail = pickStr(data, 'clientEmail', 'contact@client.example.com');
  const clientAddr = pickStr(data, 'clientAddress', '25 avenue des Champs — 75008 Paris');

  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage();
  const margin = 50;
  let y = page.getHeight() - margin;

  const ensureSpace = (needed: number) => {
    if (y < margin + needed) {
      page = doc.addPage();
      y = page.getHeight() - margin;
    }
  };

  const draw = (text: string, size: number, font: typeof regular, color = rgb(0, 0, 0)) => {
    ensureSpace(size + 8);
    page.drawText(text, { x: margin, y, size, font, color, maxWidth: page.getWidth() - 2 * margin });
    y -= size + 6;
  };

  const drawRight = (text: string, size: number, font: typeof regular) => {
    ensureSpace(size + 8);
    const w = font.widthOfTextAtSize(text, size);
    const x = page.getWidth() - margin - w;
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
    y -= size + 6;
  };

  draw('FACTURE', 22, bold);
  y -= 4;
  draw(`N° ${invoiceNo}`, 11, bold);
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  draw(`Date d'émission : ${dateStr}`, 10, regular, rgb(0.25, 0.25, 0.25));
  y -= 8;

  draw('Émetteur', 12, bold);
  draw('ROCH SAS', 10, regular);
  draw('123 rue de la Démo — 75001 Paris — France', 10, regular);
  draw('SIRET : 123 456 789 00012 — TVA : FR12 345 678 901', 10, regular, rgb(0.2, 0.2, 0.2));
  y -= 6;

  draw('Facturer à', 12, bold);
  draw(clientName, 10, regular);
  draw(clientAddr, 10, regular);
  draw(clientEmail, 10, regular, rgb(0.2, 0.2, 0.35));
  y -= 10;

  draw('Détail des prestations', 12, bold);
  y -= 2;

  const colDesc = margin;
  const colQty = 300;
  const colUnit = 360;
  const colTot = 450;

  const headerSize = 9;
  ensureSpace(20);
  page.drawText('Désignation', { x: colDesc, y, size: headerSize, font: bold });
  page.drawText('Qté', { x: colQty, y, size: headerSize, font: bold });
  page.drawText('PU HT', { x: colUnit, y, size: headerSize, font: bold });
  page.drawText('Total HT', { x: colTot, y, size: headerSize, font: bold });
  y -= 12;
  page.drawLine({
    start: { x: margin, y: y + 4 },
    end: { x: page.getWidth() - margin, y: y + 4 },
    thickness: 0.5,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 8;

  const rows: { desc: string; qty: string; unit: string; total: string }[] = [
    { desc: 'Prestation développement web', qty: '5', unit: '450,00 EUR', total: '2 250,00 EUR' },
    { desc: 'Maintenance applicative (mois)', qty: '1', unit: '120,00 EUR', total: '120,00 EUR' },
    { desc: 'Hébergement & infogérance cloud', qty: '1', unit: '89,00 EUR', total: '89,00 EUR' },
  ];

  const rowSize = 10;
  for (const r of rows) {
    ensureSpace(rowSize + 6);
    page.drawText(r.desc, { x: colDesc, y, size: rowSize, font: regular, maxWidth: colQty - colDesc - 8 });
    page.drawText(r.qty, { x: colQty, y, size: rowSize, font: regular });
    page.drawText(r.unit, { x: colUnit, y, size: rowSize, font: regular });
    page.drawText(r.total, { x: colTot, y, size: rowSize, font: regular });
    y -= rowSize + 8;
  }

  y -= 6;
  drawRight('Sous-total HT : 2 459,00 EUR', 10, bold);
  drawRight('TVA (20 %) : 491,80 EUR', 10, regular);
  drawRight('Total TTC : 2 950,80 EUR', 12, bold);
  y -= 10;

  draw('Modalités de paiement', 11, bold);
  draw('Paiement à 30 jours net — pas d\'escompte pour paiement anticipé.', 10, regular);
  draw('IBAN : FR76 1234 5678 9012 3456 7890 123 — BIC :ABCDEFGH', 10, regular, rgb(0.2, 0.2, 0.2));
  y -= 8;
  draw(
    'En cas de retard, pénalités au taux légal en vigueur, indemnité forfaitaire pour frais de recouvrement : 40 EUR.',
    9,
    regular,
    rgb(0.35, 0.35, 0.35)
  );

  return new Blob([await doc.save()], { type: 'application/pdf' });
}
