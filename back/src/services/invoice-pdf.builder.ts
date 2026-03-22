import PDFDocument from "pdfkit";

function pickStr(data: Record<string, unknown> | undefined, key: string, fallback: string): string {
  const v = data?.[key];
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

/**
 * Facture PDF structurée (mock) — remplace l’ancien contenu JSON.stringify(data).
 */
export function buildMockInvoicePdf(data?: Record<string, unknown>): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const width = doc.page.width - 100;
    const invoiceNo = pickStr(
      data,
      "invoiceNumber",
      `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    );
    const clientName = pickStr(data, "clientName", "Client Démo SARL");
    const clientEmail = pickStr(data, "clientEmail", "contact@client.example.com");
    const clientAddr = pickStr(data, "clientAddress", "25 avenue des Champs — 75008 Paris");

    doc.fontSize(22).font("Helvetica-Bold").text("FACTURE", { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(11).font("Helvetica-Bold").text(`N° ${invoiceNo}`, { width });
    doc.font("Helvetica").fontSize(10).fillColor("#444444");
    doc.text(
      `Date d'émission : ${new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      { width }
    );
    doc.fillColor("#000000");
    doc.moveDown(1);

    doc.font("Helvetica-Bold").fontSize(12).text("Émetteur", { width });
    doc.font("Helvetica").fontSize(10);
    doc.text("ROCH SAS", { width });
    doc.text("123 rue de la Démo — 75001 Paris — France", { width });
    doc.text("SIRET : 123 456 789 00012 — TVA : FR12 345 678 901", { width });
    doc.moveDown(0.8);

    doc.font("Helvetica-Bold").fontSize(12).text("Facturer à", { width });
    doc.font("Helvetica").fontSize(10);
    doc.text(clientName, { width });
    doc.text(clientAddr, { width });
    doc.fillColor("#333366").text(clientEmail, { width });
    doc.fillColor("#000000");
    doc.moveDown(1);

    doc.font("Helvetica-Bold").fontSize(12).text("Détail des prestations", { width });
    doc.moveDown(0.4);

    const tableTop = doc.y;
    doc.font("Helvetica-Bold").fontSize(9);
    doc.text("Désignation", 50, tableTop, { width: 220 });
    doc.text("Qté", 280, tableTop, { width: 40 });
    doc.text("PU HT", 330, tableTop, { width: 70 });
    doc.text("Total HT", 410, tableTop, { width: 120 });

    doc.moveTo(50, tableTop + 14).lineTo(doc.page.width - 50, tableTop + 14).strokeColor("#666666").stroke();
    doc.strokeColor("#000000");

    let rowY = tableTop + 22;
    doc.font("Helvetica").fontSize(10);
    const rows: { desc: string; qty: string; unit: string; total: string }[] = [
      { desc: "Prestation développement web", qty: "5", unit: "450,00 EUR", total: "2 250,00 EUR" },
      { desc: "Maintenance applicative (mois)", qty: "1", unit: "120,00 EUR", total: "120,00 EUR" },
      { desc: "Hébergement & infogérance cloud", qty: "1", unit: "89,00 EUR", total: "89,00 EUR" },
    ];

    for (const r of rows) {
      doc.text(r.desc, 50, rowY, { width: 220 });
      doc.text(r.qty, 280, rowY, { width: 40 });
      doc.text(r.unit, 330, rowY, { width: 70 });
      doc.text(r.total, 410, rowY, { width: 120 });
      rowY += 22;
    }

    doc.y = rowY + 10;
    doc.font("Helvetica-Bold").fontSize(10).text("Sous-total HT : 2 459,00 EUR", { width, align: "right" });
    doc.font("Helvetica").text("TVA (20 %) : 491,80 EUR", { width, align: "right" });
    doc.moveDown(0.2);
    doc.font("Helvetica-Bold").fontSize(12).text("Total TTC : 2 950,80 EUR", { width, align: "right" });
    doc.moveDown(1);

    doc.font("Helvetica-Bold").fontSize(11).text("Modalités de paiement", { width });
    doc.font("Helvetica").fontSize(10);
    doc.text("Paiement à 30 jours net — pas d'escompte pour paiement anticipé.", { width });
    doc.text("IBAN : FR76 1234 5678 9012 3456 7890 123 — BIC : ABCDEFGH", { width });
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor("#555555");
    doc.text(
      "En cas de retard, pénalités au taux légal en vigueur, indemnité forfaitaire pour frais de recouvrement : 40 EUR.",
      { width }
    );

    doc.end();
  });
}
