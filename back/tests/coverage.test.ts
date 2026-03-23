import { AppError, errorHandler, notFoundHandler } from "../src/middlewares/errorHandler";
import { Request, Response } from "express";

describe("Coverage helpers", () => {
  it("loads env defaults", async () => {
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.MONGO_URI;

    jest.resetModules();
    const module = await import("../src/config/env");
    expect(module.env.port).toBe(4000);
    expect(module.env.nodeEnv).toBe("development");
    expect(module.env.mongoUri).toBe("");
    expect(module.isTest).toBe(false);
  });

  it("loads env from process values", async () => {
    process.env.PORT = "5001";
    process.env.NODE_ENV = "test";
    process.env.MONGO_URI = "mongodb://localhost:27017/db";

    jest.resetModules();
    const module = await import("../src/config/env");
    expect(module.env.port).toBe(5001);
    expect(module.env.nodeEnv).toBe("test");
    expect(module.env.mongoUri).toContain("mongodb://");
    expect(module.isTest).toBe(true);
  });

  it("returns app error status and message", () => {
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res = { status, json } as unknown as Response;

    errorHandler(new AppError("bad request", 400), {} as Request, res, jest.fn());
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: "bad request" });
  });

  it("returns 500 for unknown errors", () => {
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res = { status, json } as unknown as Response;

    errorHandler(new Error("boom"), {} as Request, res, jest.fn());
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  it("delegates not found with AppError", () => {
    const next = jest.fn();
    const req = { method: "GET", originalUrl: "/missing" } as Request;

    notFoundHandler(req, {} as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
  });
});
