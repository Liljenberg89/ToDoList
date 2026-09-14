import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
    }),
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/tasks", taskRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
