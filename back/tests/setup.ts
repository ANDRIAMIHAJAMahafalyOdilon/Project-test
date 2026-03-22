import mongoose from "mongoose";
import { seedTemplates } from "../src/seed/templates";

let mongoCleanup: (() => Promise<void>) | null = null;

beforeAll(async () => {
  const uri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    (await (async () => {
      try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const instance = await MongoMemoryServer.create();
        mongoCleanup = () => instance.stop();
        return instance.getUri();
      } catch {
        return null;
      }
    })());

  if (!uri) {
    // eslint-disable-next-line no-console
    console.warn("No MongoDB: set MONGO_URI or install mongodb-memory-server. Skipping DB tests.");
    return;
  }

  await mongoose.connect(uri);
  await seedTemplates();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoCleanup) await mongoCleanup();
});
