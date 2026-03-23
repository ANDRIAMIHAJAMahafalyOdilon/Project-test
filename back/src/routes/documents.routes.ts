import { Router } from "express";
import { createDocument } from "../controllers/documents.controller";

export const documentsRouter = Router();

documentsRouter.post("/", createDocument);
