import { Request, Response, NextFunction } from "express";
import * as docusignService from "../services/docusign.service";

export async function createEnvelope(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { subject, recipients, documentUrl } = req.body;
    const data = await docusignService.createEnvelope({ subject, recipients, documentUrl });
    res.status(201).json({ success: true, data, message: "DocuSign envelope created and sent" });
  } catch (e) {
    next(e);
  }
}

export async function getEnvelopes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const result = await docusignService.getEnvelopes(page, pageSize);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function getEnvelope(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await docusignService.getEnvelope(String(req.params.envelopeId));
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function voidEnvelope(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await docusignService.voidEnvelope(String(req.params.envelopeId));
    res.json({ success: true, data, message: "Envelope voided successfully" });
  } catch (e) {
    next(e);
  }
}
