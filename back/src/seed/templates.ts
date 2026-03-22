import { PDFTemplateModel } from "../models/pdf-template.model";

const TEMPLATES = [
  { name: "Invoice Template", description: "Standard invoice template with company branding", category: "invoice" as const },
  { name: "Business Report", description: "Professional report template for quarterly reviews", category: "report" as const },
  { name: "Service Contract", description: "Standard service agreement contract", category: "contract" as const },
  { name: "Completion Certificate", description: "Certificate of completion for courses and training", category: "certificate" as const },
  { name: "Non-Disclosure Agreement", description: "Standard NDA template for business partnerships", category: "contract" as const },
];

export async function seedTemplates(): Promise<void> {
  const count = await PDFTemplateModel.countDocuments();
  if (count === 0) {
    for (const t of TEMPLATES) {
      await PDFTemplateModel.create(t);
    }
  }

  await PDFTemplateModel.findOneAndUpdate(
    { name: "Fiche de poste — Full Stack & Test Engineer" },
    {
      name: "Fiche de poste — Full Stack & Test Engineer",
      description:
        "Document PDF structuré conforme à la fiche de poste Full Stack & Test Engineer (missions, tests, compétences, profil).",
      category: "job",
    },
    { upsert: true }
  );
}
