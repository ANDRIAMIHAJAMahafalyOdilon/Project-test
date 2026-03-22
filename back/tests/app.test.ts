import request from "supertest";
import { app } from "../src/app";

describe("Backend API", () => {
  it("GET /api/health should return ok", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("POST /api/documents should create envelope", async () => {
    const response = await request(app).post("/api/documents").send({
      title: "Contract",
      content: "Please sign this contract",
      recipientEmail: "user@example.com",
    });

    expect(response.status).toBe(201);
    expect(response.body.envelopeId).toBeDefined();
    expect(response.body.pdfSize).toBeGreaterThan(0);
  });

  it("POST /api/documents should reject missing fields", async () => {
    const response = await request(app).post("/api/documents").send({
      title: "Incomplete",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("required");
  });
});
