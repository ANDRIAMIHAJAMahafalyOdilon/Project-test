import { app } from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";
import { seedTemplates } from "./seed/templates";

async function start() {
  if (env.mongoUri) {
    await connectDb(env.mongoUri);
    await seedTemplates();
  }
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on port ${env.port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
