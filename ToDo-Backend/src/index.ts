import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT ?? 4000;
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/todolist";

async function main() {
  await connectDB(MONGODB_URI);

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
