import request from "supertest";
import { app } from "../src/app";

describe("PDF API", () => {
  it("GET /api/pdf/templates returns seeded templates", async () => {
    const res = await request(app).get("/api/pdf/templates");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("GET /api/pdf/templates/:id returns template", async () => {
    const list = await request(app).get("/api/pdf/templates");
    const id = list.body.data[0].id;

    const res = await request(app).get(`/api/pdf/templates/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  it("POST /api/pdf/generate creates PDF record", async () => {
    const list = await request(app).get("/api/pdf/templates");
    const templateId = list.body.data[0].id;

    const res = await request(app)
      .post("/api/pdf/generate")
      .send({ templateId, data: { foo: "bar" } });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.filename).toBeDefined();
    expect(res.body.data.size).toBeGreaterThan(0);
  });

  it("POST /api/pdf/generate uses structured job posting PDF for Full Stack template", async () => {
    const list = await request(app).get("/api/pdf/templates");
    const job = list.body.data.find((t: { category?: string }) => t.category === "job");
    if (!job) {
      return;
    }

    const res = await request(app)
      .post("/api/pdf/generate")
      .send({ templateId: job.id, data: {} });

    expect(res.status).toBe(201);
    expect(res.body.data.size).toBeGreaterThan(2000);
  });

  it("GET /api/pdf/generated returns paginated list", async () => {
    const res = await request(app).get("/api/pdf/generated?page=1&pageSize=5");
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.total).toBeDefined();
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(5);
  });

  it("DELETE /api/pdf/generated/:id removes PDF", async () => {
    const list = await request(app).get("/api/pdf/templates");
    const gen = await request(app)
      .post("/api/pdf/generate")
      .send({ templateId: list.body.data[0].id });

    const id = gen.body.data.id;
    const del = await request(app).delete(`/api/pdf/generated/${id}`);
    expect(del.status).toBe(200);

    const get = await request(app).get("/api/pdf/generated");
    const found = get.body.data.find((p: { id: string }) => p.id === id);
    expect(found).toBeUndefined();
  });
});

describe("DocuSign API", () => {
  it("POST /api/docusign/envelopes creates envelope", async () => {
    const res = await request(app)
      .post("/api/docusign/envelopes")
      .send({
        subject: "Test Contract",
        recipients: [{ email: "a@b.com", name: "A B" }],
        documentUrl: "/doc.pdf",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.status).toBe("sent");
    expect(res.body.data.recipients).toHaveLength(1);
  });

  it("GET /api/docusign/envelopes returns paginated list", async () => {
    const res = await request(app).get("/api/docusign/envelopes?page=1&pageSize=5");
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.total).toBeDefined();
  });

  it("GET /api/docusign/envelopes/:id returns envelope", async () => {
    const create = await request(app)
      .post("/api/docusign/envelopes")
      .send({
        subject: "Get One",
        recipients: [{ email: "x@y.com", name: "X" }],
        documentUrl: "/x.pdf",
      });
    const id = create.body.data.id;

    const res = await request(app).get(`/api/docusign/envelopes/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  it("PATCH /api/docusign/envelopes/:id/void voids envelope", async () => {
    const create = await request(app)
      .post("/api/docusign/envelopes")
      .send({
        subject: "Void Test",
        recipients: [{ email: "v@v.com", name: "V" }],
        documentUrl: "/v.pdf",
      });
    const id = create.body.data.id;

    const res = await request(app).patch(`/api/docusign/envelopes/${id}/void`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("declined");
  });

  it("PATCH void rejects completed envelope", async () => {
    const create = await request(app)
      .post("/api/docusign/envelopes")
      .send({
        subject: "Completed",
        recipients: [{ email: "c@c.com", name: "C" }],
        documentUrl: "/c.pdf",
      });
    const id = create.body.data.id;

    const { DocuSignEnvelopeModel } = await import("../src/models/docusign-envelope.model");
    await DocuSignEnvelopeModel.findByIdAndUpdate(id, { status: "completed" });

    const res = await request(app).patch(`/api/docusign/envelopes/${id}/void`);
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("completed");
  });
});
