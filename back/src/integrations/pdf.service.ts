import PDFDocument from "pdfkit";

export type PdfPayload = {
  title: string;
  content: string;
};

export class PdfService {
  async generate(payload: PdfPayload): Promise<Buffer> {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));

    return new Promise((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.fontSize(18).text(payload.title);
      doc.moveDown();
      doc.fontSize(12).text(payload.content);
      doc.end();
    });
  }
}

export const pdfService = new PdfService();
