import { Request, Response, NextFunction } from "express";
import * as pdfService from "../services/pdf.service";

export async function getTemplates(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await pdfService.getTemplates();
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await pdfService.getTemplate(String(req.params.templateId));
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function generatePDF(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { templateId, data } = req.body;
    const result = await pdfService.generatePDF({ templateId, data });
    res.status(201).json({ success: true, data: result, message: "PDF generated successfully" });
  } catch (e) {
    next(e);
  }
}

export async function getGeneratedPDFs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const result = await pdfService.getGeneratedPDFs(page, pageSize);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function deletePDF(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await pdfService.deletePDF(String(req.params.pdfId));
    res.json({ success: true, data: null, message: "PDF deleted successfully" });
  } catch (e) {
    next(e);
  }
}

export async function downloadPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { buffer, filename } = await pdfService.getPDFBuffer(String(req.params.pdfId));
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (e) {
    next(e);
  }
}
