import { Router } from "express";
import {
  createEnvelope,
  getEnvelopes,
  getEnvelope,
  voidEnvelope,
} from "../controllers/docusign.controller";

export const docusignRouter = Router();

docusignRouter.post("/envelopes", createEnvelope);
docusignRouter.get("/envelopes", getEnvelopes);
docusignRouter.get("/envelopes/:envelopeId", getEnvelope);
docusignRouter.patch("/envelopes/:envelopeId/void", voidEnvelope);
