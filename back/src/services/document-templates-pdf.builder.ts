import PDFDocument from "pdfkit";

function pickStr(data: Record<string, unknown> | undefined, key: string, fallback: string): string {
  const v = data?.[key];
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

function collectPdf(doc: PDFKit.PDFDocument): Promise<Buffer> {
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

/** Rapport d'activité */
export function buildMockActivityReportPdf(data?: Record<string, unknown>): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const period = pickStr(data, "period", `T1 ${new Date().getFullYear()}`);
  const org = pickStr(data, "organization", "ROCH SAS");
  const width = doc.page.width - 100;

  doc.fontSize(20).font("Helvetica-Bold").text("RAPPORT D'ACTIVITÉ", { width });
  doc.moveDown(0.6);
  doc.fontSize(11).font("Helvetica-Bold").text(`Période : ${period}`, { width });
  doc.font("Helvetica").fontSize(10).fillColor("#444444").text(`Établissement : ${org}`, { width });
  doc.fillColor("#000000");
  doc.moveDown(1);

  doc.font("Helvetica-Bold").fontSize(13).text("1. Synthèse exécutive", { width });
  doc.font("Helvetica").fontSize(10).text(
    "Ce rapport présente les activités réalisées sur la période : livraisons majeures, indicateurs de qualité et alignement sur la feuille de route produit.",
    { width }
  );
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").fontSize(13).text("2. Indicateurs clés", { width });
  doc.font("Helvetica").fontSize(10);
  doc.text("• Disponibilité applicative : 99,9 %", { width });
  doc.text("• Tickets résolus dans les SLA : 94 %", { width });
  doc.text("• Satisfaction utilisateurs (NPS) : +12 points vs période précédente", { width });
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").fontSize(13).text("3. Réalisations", { width });
  doc.font("Helvetica").fontSize(10).text(
    "Mise en production du module PDF & DocuSign, refonte du tableau de bord, renforcement des tests automatisés (Jest, Playwright).",
    { width }
  );
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").fontSize(13).text("4. Risques & points de vigilance", { width });
  doc.font("Helvetica").fontSize(10).text(
    "Charge sur l'équipe en fin de sprint ; mitigation : priorisation MoSCoW et revue hebdomadaire.",
    { width }
  );
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").fontSize(13).text("5. Perspectives", { width });
  doc.font("Helvetica").fontSize(10).text(
    "Industrialisation des pipelines CI/CD, extension des tests E2E sur les parcours critiques.",
    { width }
  );
  doc.moveDown(1);
  doc.fontSize(9).fillColor("#666666").text(
    `Document émis le ${new Date().toLocaleDateString("fr-FR")} — Confidentiel`,
    { width }
  );

  return collectPdf(doc);
}

/** Contrat de prestation */
export function buildMockServiceContractPdf(data?: Record<string, unknown>): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const prestataire = pickStr(data, "providerName", "ROCH SAS");
  const client = pickStr(data, "clientName", "Client Démo SARL");
  const width = doc.page.width - 100;

  doc.fontSize(16).font("Helvetica-Bold").text("CONTRAT DE PRESTATION DE SERVICES", { width });
  doc.moveDown(1);

  doc.fontSize(11).font("Helvetica-Bold").text("Entre les soussignés :", { width });
  doc.font("Helvetica").fontSize(10);
  doc.text(`${prestataire}, société immatriculée au RCS de Paris, ci-après « le Prestataire » ;`, { width });
  doc.text(`Et ${client}, ci-après « le Client » ;`, { width });
  doc.moveDown(0.8);

  const art = (title: string, body: string) => {
    doc.font("Helvetica-Bold").fontSize(12).text(title, { width });
    doc.font("Helvetica").fontSize(10).text(body, { width });
    doc.moveDown(0.5);
  };

  art(
    "Article 1 — Objet",
    "Le Prestataire fournit au Client des prestations de conception, développement et maintenance logicielle, selon les ordres de service validés."
  );
  art(
    "Article 2 — Durée",
    "Le présent contrat est conclu pour une durée d'un (1) an à compter de sa signature, tacitement reconductible."
  );
  art(
    "Article 3 — Obligations du Prestataire",
    "Exécuter les prestations conformément aux bonnes pratiques, assurer la confidentialité des données du Client, tenir un reporting régulier."
  );
  art(
    "Article 4 — Obligations du Client",
    "Fournir les accès et informations nécessaires, valider les livrables dans les délais convenus, régler les factures selon les modalités ci-dessous."
  );
  art(
    "Article 5 — Prix et facturation",
    "Les prestations sont facturées sur la base des tarifs convenus en annexe. Paiement à 30 jours fin de mois."
  );
  art(
    "Article 6 — Résiliation",
    "Chaque partie peut résilier le contrat avec un préavis de trente (30) jours, ou en cas de manquement grave non réparé dans quinze (15) jours."
  );
  art(
    "Article 7 — Droit applicable",
    "Le présent contrat est soumis au droit français. Litiges : tribunaux compétents de Paris."
  );

  doc.moveDown(0.5);
  doc.text("Fait à Paris, en deux exemplaires.", { width });
  doc.moveDown(1.2);
  doc.fontSize(9).fillColor("#555555").text("Le Prestataire (signature)                              Le Client (signature)", { width });

  return collectPdf(doc);
}

/** Certificat de formation */
export function buildMockCompletionCertificatePdf(data?: Record<string, unknown>): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const trainee = pickStr(data, "traineeName", "Jean Dupont");
  const course = pickStr(data, "courseName", "Développement Full Stack & tests automatisés");
  const hours = pickStr(data, "hours", "35");
  const width = doc.page.width - 100;

  doc.fontSize(18).font("Helvetica-Bold").text("CERTIFICAT DE FORMATION", { align: "center" });
  doc.moveDown(1.5);
  doc.font("Helvetica").fontSize(11).text("La société ROCH SAS atteste que", { align: "center" });
  doc.moveDown(0.8);
  doc.font("Helvetica-Bold").fontSize(16).text(trainee.toUpperCase(), { align: "center" });
  doc.moveDown(1);
  doc.font("Helvetica").fontSize(10).text("a suivi avec succès la formation intitulée :", { align: "center" });
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(12).text(course, { align: "center" });
  doc.moveDown(1);
  doc.font("Helvetica").fontSize(10);
  doc.text(`Durée : ${hours} heures — Modalité : présentiel / distanciel`, { width, align: "center" });
  doc.text("Lieu : Paris / à distance", { width, align: "center" });
  doc.moveDown(1.2);
  doc.text("Ce certificat est délivré pour servir et valoir ce que de droit.", { width, align: "center" });
  doc.moveDown(1.5);
  doc.text(`Fait à Paris, le ${new Date().toLocaleDateString("fr-FR")}`, { width, align: "center" });
  doc.moveDown(2);
  doc.font("Helvetica-Bold").text("Direction pédagogique ROCH", { width, align: "center" });
  doc.font("Helvetica").fontSize(9).fillColor("#666666").text("Signature et cachet", { width, align: "center" });

  return collectPdf(doc);
}

/** NDA */
export function buildMockNdaPdf(data?: Record<string, unknown>): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const partyA = pickStr(data, "partyA", "ROCH SAS");
  const partyB = pickStr(data, "partyB", "Partenaire Démo SA");
  const width = doc.page.width - 100;

  doc.fontSize(16).font("Helvetica-Bold").text("ACCORD DE CONFIDENTIALITÉ (NDA)", { width });
  doc.moveDown(1);

  const sec = (title: string, body: string) => {
    doc.font("Helvetica-Bold").fontSize(12).text(title, { width });
    doc.font("Helvetica").fontSize(10).text(body, { width });
    doc.moveDown(0.7);
  };

  sec(
    "1. Parties",
    `${partyA}, d'une part, et ${partyB}, d'autre part, sont désignées ensemble « les Parties ».`
  );
  sec(
    "2. Objet",
    "Les Parties échangent des Informations Confidentielles dans le cadre d'une collaboration commerciale et/ou technique. Le présent accord encadre leur protection."
  );
  sec(
    "3. Définition",
    "Sont confidentielles toutes les informations divulguées oralement ou par écrit, identifiées comme telles ou dont la nature impose un devoir de discrétion."
  );
  sec(
    "4. Obligations",
    "Chaque Partie s'engage à ne pas divulguer les Informations Confidentielles à des tiers sans accord préalable, à les utiliser uniquement pour les besoins du projet, et à les protéger avec le même soin que ses propres informations sensibles."
  );
  sec(
    "5. Durée",
    "Les obligations de confidentialité demeurent en vigueur pendant cinq (5) ans à compter de la dernière divulgation."
  );
  sec("6. Sanctions", "Tout manquement peut entraîner résiliation et dommages-intérêts, sans préjudice d'autres recours.");
  sec(
    "7. Droit applicable",
    "Le présent accord est régi par le droit français. Compétence exclusive des tribunaux de Paris."
  );

  doc.moveDown(0.5);
  doc.text(`Fait à Paris, le ${new Date().toLocaleDateString("fr-FR")}, en deux exemplaires originaux.`, { width });
  doc.moveDown(1.5);
  doc.fontSize(9).fillColor("#555555").text(`${partyA} (signature)                    ${partyB} (signature)`, { width });

  return collectPdf(doc);
}

export function isNdaTemplateName(name: string): boolean {
  return /non-disclosure|nda|confidential/i.test(name);
}
