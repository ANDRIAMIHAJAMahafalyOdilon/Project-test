import { Request, Response, NextFunction } from "express";
import { documentService } from "../services/document.service";

export async function createDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, content, recipientEmail } = req.body;
    const result = await documentService.createAndSend({ title, content, recipientEmail });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
