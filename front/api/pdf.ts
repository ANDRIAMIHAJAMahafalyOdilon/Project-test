import type { PDFTemplate, PDFGenerationRequest, PDFGenerationResponse, DocuSignEnvelope, ApiResponse, PaginatedResponse } from '@/types';
import { mockPDFTemplates, mockGeneratedPDFs, mockDocuSignEnvelopes } from '@/mock/pdf';
import { loadMockState, saveMockState } from '@/lib/mock-persistence';
import {
  JOB_POSTING_FULLSTACK_LINES,
  JOB_POSTING_TEMPLATE_ID,
  isJobPostingMockTemplate,
} from '@/lib/pdf/job-posting-fullstack-lines';
import {
  INVOICE_TEMPLATE_ID,
  createInvoicePdfBlob,
  isInvoiceMockPdf,
} from '@/lib/pdf/invoice-mock-pdf';
import {
  createExtraTemplatePdfBlob,
  getExtraBlobKindForDownload,
  getExtraBlobKindForTemplate,
} from '@/lib/pdf/extra-templates-mock-pdf';

async function createJobPostingPdfBlob(): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page = doc.addPage();
  const margin = 50;
  const lineH = 14;
  let y = page.getHeight() - margin;

  for (const raw of JOB_POSTING_FULLSTACK_LINES) {
    if (!raw.trim()) {
      y -= 8;
      continue;
    }
    if (y < margin + 40) {
      page = doc.addPage();
      y = page.getHeight() - margin;
    }
    const mainTitle = 'Fiche de poste : Full Stack & Test Engineer';
    const intituleLine = 'Intitulé : Full Stack & Test Engineer (H/F)';
    const sectionTitles = new Set(['Missions', 'Compétences', 'Profil']);
    const subHeadings = new Set(['Développement Full Stack :', 'Tests :']);
    const isMainTitle = raw === mainTitle;
    const isSectionTitle = sectionTitles.has(raw);
    const isIntitule = raw === intituleLine;
    const isSubHeading = subHeadings.has(raw);
    const sizePx = isMainTitle ? 16 : isIntitule ? 14 : isSectionTitle ? 12 : isSubHeading ? 11 : 10;
    const f = isMainTitle || isSectionTitle || isIntitule || isSubHeading ? bold : font;
    page.drawText(raw, {
      x: margin,
      y,
      size: sizePx,
      font: f,
      color: rgb(0, 0, 0),
    });
    y -= lineH;
  }

  return new Blob([await doc.save()], { type: 'application/pdf' });
}

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PDFS_KEY = 'generated-pdfs';
const ENVELOPES_KEY = 'docusign-envelopes';

let generatedPDFs: PDFGenerationResponse[] = loadMockState(PDFS_KEY, [...mockGeneratedPDFs]);
let docuSignEnvelopes: DocuSignEnvelope[] = loadMockState(ENVELOPES_KEY, [...mockDocuSignEnvelopes]);

function persistPdfs() {
  saveMockState(PDFS_KEY, generatedPDFs);
}

function persistEnvelopes() {
  saveMockState(ENVELOPES_KEY, docuSignEnvelopes);
}

export async function getPDFTemplates(): Promise<ApiResponse<PDFTemplate[]>> {
  await delay(500);

  return {
    success: true,
    data: mockPDFTemplates,
  };
}

export async function getPDFTemplate(
  templateId: string
): Promise<ApiResponse<PDFTemplate>> {
  await delay(300);

  const template = mockPDFTemplates.find((t) => t.id === templateId);

  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  return {
    success: true,
    data: template,
  };
}

export async function generatePDF(
  request: PDFGenerationRequest
): Promise<ApiResponse<PDFGenerationResponse>> {
  await delay(2000); // PDF generation takes longer

  const template = mockPDFTemplates.find((t) => t.id === request.templateId);

  if (!template) {
    throw new Error(`Template not found: ${request.templateId}`);
  }

  const isJobPosting =
    template.category === 'job' || template.id === JOB_POSTING_TEMPLATE_ID;
  const isInvoice =
    template.category === 'invoice' || template.id === INVOICE_TEMPLATE_ID;
  const extraKind = getExtraBlobKindForTemplate(template);
  let pdfSize = Math.floor(Math.random() * 500000) + 50000;
  if (isJobPosting) {
    const blob = await createJobPostingPdfBlob();
    pdfSize = blob.size;
  } else if (isInvoice) {
    const blob = await createInvoicePdfBlob(request.data);
    pdfSize = blob.size;
  } else if (extraKind) {
    const blob = await createExtraTemplatePdfBlob(extraKind, request.data);
    pdfSize = blob.size;
  }

  const newPDF: PDFGenerationResponse = {
    id: `pdf-${Date.now()}`,
    url: `/mock-pdfs/${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`,
    filename: `${template.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
    size: pdfSize,
    createdAt: new Date().toISOString(),
  };

  generatedPDFs.push(newPDF);
  persistPdfs();

  return {
    success: true,
    data: newPDF,
    message: 'PDF generated successfully',
  };
}

export async function getGeneratedPDFs(
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<PDFGenerationResponse>> {
  await delay(500);

  /** Plus récent en premier (évite d’afficher les mocks 2024 au-dessus des générations du jour). */
  const sorted = [...generatedPDFs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = sorted.slice(start, end);

  return {
    data: paginatedData,
    total: generatedPDFs.length,
    page,
    pageSize,
    totalPages: Math.ceil(generatedPDFs.length / pageSize),
  };
}

export async function deletePDF(pdfId: string): Promise<ApiResponse<null>> {
  await delay(400);

  const index = generatedPDFs.findIndex((p) => p.id === pdfId);

  if (index === -1) {
    throw new Error(`PDF not found: ${pdfId}`);
  }

  generatedPDFs.splice(index, 1);
  persistPdfs();

  return {
    success: true,
    data: null,
    message: 'PDF deleted successfully',
  };
}

/** Returns a Blob of the PDF for download. Calls backend if API_URL set, else generates client-side for mock. */
export async function downloadPDF(id: string, filename: string): Promise<Blob> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (baseUrl && !baseUrl.startsWith('/')) {
    const res = await fetch(`${baseUrl}/pdf/generated/${id}/download`);
    if (!res.ok) throw new Error('Failed to download PDF');
    return res.blob();
  }
  if (isJobPostingMockTemplate(id, filename)) {
    return createJobPostingPdfBlob();
  }
  if (isInvoiceMockPdf(id, filename)) {
    return createInvoicePdfBlob();
  }
  const extraKind = getExtraBlobKindForDownload(id, filename);
  if (extraKind) {
    return createExtraTemplatePdfBlob(extraKind);
  }

  const { PDFDocument } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  const page = doc.addPage();
  page.drawText(filename, { x: 50, y: page.getHeight() - 50, size: 14 });
  page.drawText('Document généré', { x: 50, y: page.getHeight() - 80, size: 12 });
  return new Blob([await doc.save()], { type: 'application/pdf' });
}

// DocuSign Integration (Simulated)
export async function createDocuSignEnvelope(
  subject: string,
  recipients: { email: string; name: string }[],
  documentUrl: string
): Promise<ApiResponse<DocuSignEnvelope>> {
  await delay(1500);

  const newEnvelope: DocuSignEnvelope = {
    id: `env-${Date.now()}`,
    status: 'sent',
    subject,
    recipients: recipients.map((r) => ({ ...r, status: 'pending' as const })),
    createdAt: new Date().toISOString(),
  };

  docuSignEnvelopes.push(newEnvelope);
  persistEnvelopes();

  return {
    success: true,
    data: newEnvelope,
    message: 'DocuSign envelope created and sent',
  };
}

export async function getDocuSignEnvelopes(
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<DocuSignEnvelope>> {
  await delay(600);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = docuSignEnvelopes.slice(start, end);

  return {
    data: paginatedData,
    total: docuSignEnvelopes.length,
    page,
    pageSize,
    totalPages: Math.ceil(docuSignEnvelopes.length / pageSize),
  };
}

export async function getDocuSignEnvelope(
  envelopeId: string
): Promise<ApiResponse<DocuSignEnvelope>> {
  await delay(400);

  const envelope = docuSignEnvelopes.find((e) => e.id === envelopeId);

  if (!envelope) {
    throw new Error(`Envelope not found: ${envelopeId}`);
  }

  return {
    success: true,
    data: envelope,
  };
}

export async function voidDocuSignEnvelope(
  envelopeId: string
): Promise<ApiResponse<DocuSignEnvelope>> {
  await delay(800);

  const envelope = docuSignEnvelopes.find((e) => e.id === envelopeId);

  if (!envelope) {
    throw new Error(`Envelope not found: ${envelopeId}`);
  }

  if (envelope.status === 'completed') {
    throw new Error('Cannot void a completed envelope');
  }

  envelope.status = 'declined';
  persistEnvelopes();

  return {
    success: true,
    data: envelope,
    message: 'Envelope voided successfully',
  };
}
