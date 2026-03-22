import { Router } from "express";
import {
  getTemplates,
  getTemplate,
  generatePDF,
  getGeneratedPDFs,
  deletePDF,
  downloadPDF,
} from "../controllers/pdf.controller";

export const pdfRouter = Router();

pdfRouter.get("/templates", getTemplates);
pdfRouter.get("/templates/:templateId", getTemplate);
pdfRouter.post("/generate", generatePDF);
pdfRouter.get("/generated", getGeneratedPDFs);
pdfRouter.get("/generated/:pdfId/download", downloadPDF);
pdfRouter.delete("/generated/:pdfId", deletePDF);
