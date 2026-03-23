export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongoUri: process.env.MONGO_URI ?? "",
};

export const isTest = env.nodeEnv === "test";
