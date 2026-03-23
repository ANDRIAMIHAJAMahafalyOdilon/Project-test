import PDFDocument from "pdfkit";

/**
 * PDF structuré — texte de la fiche de poste repris à l’identique (missions, tests, compétences, profil).
 */
export function buildFullStackTestEngineerJobPostingPdf(): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const width = doc.page.width - 100;

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Fiche de poste : Full Stack & Test Engineer", { align: "center" });
    doc.moveDown(0.8);

    doc.fontSize(11).font("Helvetica");
    doc.text("Intitulé : Full Stack & Test Engineer (H/F)", { width });
    doc.text("Contrat : CDI / Freelance", { width });
    doc.text("Localisation : Télétravail / Hybride", { width });
    doc.moveDown(1);

    const sectionTitle = (title: string) => {
      doc.font("Helvetica-Bold").fontSize(13).text(title, { width });
      doc.moveDown(0.35);
      doc.font("Helvetica").fontSize(11);
    };

    const hyphenBullets = (lines: string[]) => {
      for (const line of lines) {
        doc.text(`- ${line}`, { width, indent: 12 });
        doc.moveDown(0.15);
      }
      doc.moveDown(0.4);
    };

    sectionTitle("Missions");
    doc.moveDown(0.25);
    doc.font("Helvetica-Bold").text("Développement Full Stack :", { width });
    doc.moveDown(0.2);
    doc.font("Helvetica");
    hyphenBullets([
      "Développer des fonctionnalités React/TypeScript (dashboard, formulaires, hooks personnalisés).",
      "Créer et maintenir des APIs Node.js/Express.",
      "Intégrer les services de génération PDF et DocuSign.",
    ]);

    doc.font("Helvetica-Bold").text("Tests :", { width });
    doc.moveDown(0.2);
    doc.font("Helvetica");
    hyphenBullets([
      "Mettre en place une stratégie de tests unitaires, intégration et E2E.",
      "Rédiger des tests avec Jest, React Testing Library et Cypress/Playwright.",
      "Viser une couverture de code minimale de 80% sur les routes et services critiques.",
      "Automatiser les tests dans les pipelines CI/CD.",
    ]);

    sectionTitle("Compétences");
    doc.moveDown(0.25);
    doc.font("Helvetica");
    hyphenBullets([
      "Frontend : React, TypeScript, Tailwind CSS, Vite.",
      "Backend : Node.js, Express, TypeScript, REST APIs.",
      "Base de données : MongoDB, Mongoose.",
      "Tests : Jest, Supertest, React Testing Library, Cypress/Playwright.",
      "Outils : Docker, Git, Swagger, PDFKit, DocuSign API.",
    ]);

    sectionTitle("Profil");
    doc.moveDown(0.25);
    doc.font("Helvetica");
    hyphenBullets([
      "4+ ans d'expérience full stack avec une forte composante tests.",
      "Rigoureux, autonome, passionné par la qualité logicielle.",
      "Français courant.",
    ]);

    doc.moveDown(0.5);
    doc.fontSize(9).fillColor("#666666").text(`Document généré le ${new Date().toLocaleString("fr-FR")}`, {
      width,
      align: "right",
    });

    doc.end();
  });
}

export function isFullStackJobPostingTemplate(template: {
  name: string;
  category?: string;
}): boolean {
  return (
    template.category === "job" ||
    /Full Stack\s*&\s*Test Engineer/i.test(template.name) ||
    /Fiche de poste.*Full Stack/i.test(template.name)
  );
}
