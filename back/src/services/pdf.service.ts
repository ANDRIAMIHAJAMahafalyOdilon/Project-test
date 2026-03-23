import PDFDocument from "pdfkit";
import { PDFTemplateModel } from "../models/pdf-template.model";
import { GeneratedPDFModel } from "../models/generated-pdf.model";
import { AppError } from "../middlewares/errorHandler";
import {
  buildFullStackTestEngineerJobPostingPdf,
  isFullStackJobPostingTemplate,
} from "./job-posting-pdf.builder";
import { buildMockInvoicePdf } from "./invoice-pdf.builder";
import {
  buildMockActivityReportPdf,
  buildMockCompletionCertificatePdf,
  buildMockNdaPdf,
  buildMockServiceContractPdf,
  isNdaTemplateName,
} from "./document-templates-pdf.builder";

export type PDFGenerationInput = {
  templateId: string;
  data?: Record<string, unknown>;
};

export async function getTemplates() {
  const docs = await PDFTemplateModel.find().lean();
  return docs.map((d) => ({
    id: d._id.toString(),
    name: d.name,
    description: d.description,
    category: d.category,
  }));
}

export async function getTemplate(templateId: string) {
  const doc = await PDFTemplateModel.findById(templateId).lean();
  if (!doc) throw new AppError(`Template not found: ${templateId}`, 404);
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    category: doc.category,
  };
}

async function generatePdfBuffer(title: string, content: string): Promise<Buffer> {
  const doc = new PDFDocument();
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.fontSize(18).text(title);
    doc.moveDown();
    doc.fontSize(12).text(content);
    doc.end();
  });
}

export async function generatePDF(input: PDFGenerationInput) {
  const template = await PDFTemplateModel.findById(input.templateId).lean();
  if (!template) throw new AppError(`Template not found: ${input.templateId}`, 404);

  const content = JSON.stringify(input.data ?? {});

  let buffer: Buffer;
  if (isFullStackJobPostingTemplate(template)) {
    buffer = await buildFullStackTestEngineerJobPostingPdf();
  } else if (template.category === "invoice") {
    buffer = await buildMockInvoicePdf(input.data);
  } else if (template.category === "report") {
    buffer = await buildMockActivityReportPdf(input.data);
  } else if (template.category === "certificate") {
    buffer = await buildMockCompletionCertificatePdf(input.data);
  } else if (template.category === "contract") {
    buffer = isNdaTemplateName(template.name)
      ? await buildMockNdaPdf(input.data)
      : await buildMockServiceContractPdf(input.data);
  } else {
    buffer = await generatePdfBuffer(template.name, content);
  }
  const filename = `${template.name.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;
  const url = `/api/pdfs/${template._id}-${Date.now()}.pdf`;

  const created = await GeneratedPDFModel.create({
    url,
    filename,
    size: buffer.length,
    templateId: input.templateId,
    buffer,
  });

  return {
    id: created._id.toString(),
    url: created.url,
    filename: created.filename,
    size: created.size,
    createdAt: created.createdAt!.toISOString(),
  };
}

export async function getGeneratedPDFs(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;
  const [data, total] = await Promise.all([
    GeneratedPDFModel.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
    GeneratedPDFModel.countDocuments(),
  ]);

  return {
    data: data.map((d) => ({
      id: d._id.toString(),
      url: d.url,
      filename: d.filename,
      size: d.size,
      createdAt: d.createdAt!.toISOString(),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function deletePDF(pdfId: string) {
  const doc = await GeneratedPDFModel.findByIdAndDelete(pdfId);
  if (!doc) throw new AppError(`PDF not found: ${pdfId}`, 404);
}

export async function getPDFBuffer(pdfId: string): Promise<{ buffer: Buffer; filename: string }> {
  const doc = await GeneratedPDFModel.findById(pdfId).select("buffer filename").lean();
  if (!doc || !doc.buffer) throw new AppError(`PDF not found: ${pdfId}`, 404);
  return { buffer: doc.buffer, filename: doc.filename };
}
