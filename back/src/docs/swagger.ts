export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Full Stack Test Backend API",
    version: "1.0.0",
  },
  paths: {
    "/api/health": {
      get: {
        summary: "Health check",
        responses: { "200": { description: "OK" } },
      },
    },
    "/api/documents": {
      post: {
        summary: "Generate PDF and create DocuSign envelope (legacy)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "content", "recipientEmail"],
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  recipientEmail: { type: "string", format: "email" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" }, "400": { description: "Validation error" } },
      },
    },
    "/api/pdf/templates": {
      get: {
        summary: "List PDF templates",
        responses: { "200": { description: "OK" } },
      },
    },
    "/api/pdf/templates/{templateId}": {
      get: {
        summary: "Get PDF template by ID",
        parameters: [{ name: "templateId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "404": { description: "Not found" } },
      },
    },
    "/api/pdf/generate": {
      post: {
        summary: "Generate PDF from template",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["templateId"],
                properties: {
                  templateId: { type: "string" },
                  data: { type: "object" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" }, "404": { description: "Template not found" } },
      },
    },
    "/api/pdf/generated": {
      get: {
        summary: "List generated PDFs (paginated)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: { "200": { description: "OK" } },
      },
    },
    "/api/pdf/generated/{pdfId}": {
      delete: {
        summary: "Delete generated PDF",
        parameters: [{ name: "pdfId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "404": { description: "Not found" } },
      },
    },
    "/api/docusign/envelopes": {
      get: {
        summary: "List DocuSign envelopes (paginated)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "pageSize", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: { "200": { description: "OK" } },
      },
      post: {
        summary: "Create DocuSign envelope",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["subject", "recipients", "documentUrl"],
                properties: {
                  subject: { type: "string" },
                  documentUrl: { type: "string" },
                  recipients: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { email: { type: "string" }, name: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/docusign/envelopes/{envelopeId}": {
      get: {
        summary: "Get DocuSign envelope by ID",
        parameters: [{ name: "envelopeId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "404": { description: "Not found" } },
      },
    },
    "/api/docusign/envelopes/{envelopeId}/void": {
      patch: {
        summary: "Void DocuSign envelope",
        parameters: [{ name: "envelopeId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "400": { description: "Cannot void completed" }, "404": { description: "Not found" } },
      },
    },
  },
};
