import { docusignService } from "../integrations/docusign.service";
import { pdfService } from "../integrations/pdf.service";
import { AppError } from "../middlewares/errorHandler";

export type CreateDocumentInput = {
  title: string;
  content: string;
  recipientEmail: string;
};

export class DocumentService {
  async createAndSend(input: CreateDocumentInput): Promise<{ envelopeId: string; pdfSize: number }> {
    if (!input.title || !input.content || !input.recipientEmail) {
      throw new AppError("title, content and recipientEmail are required", 400);
    }

    const pdf = await pdfService.generate({ title: input.title, content: input.content });
    const envelope = await docusignService.createSignatureRequest({
      documentName: input.title,
      recipientEmail: input.recipientEmail,
    });

    return { envelopeId: envelope.envelopeId, pdfSize: pdf.length };
  }
}

export const documentService = new DocumentService();
