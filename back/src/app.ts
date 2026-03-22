import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import { documentsRouter } from "./routes/documents.routes";
import { healthRouter } from "./routes/health.routes";
import { pdfRouter } from "./routes/pdf.routes";
import { docusignRouter } from "./routes/docusign.routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/health", healthRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/docusign", docusignRouter);

app.use(notFoundHandler);
app.use(errorHandler);
