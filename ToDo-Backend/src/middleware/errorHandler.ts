import type { Request, Response, NextFunction } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (err instanceof Error && err.name === "ValidationError") {
    res.status(400).json({ message: err.message });
    return;
  }

  if (err instanceof Error && err.name === "CastError") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ message });
}
