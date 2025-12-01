import { Request, Response, NextFunction } from "express";
import { getAuthFromCookie } from "@/lib/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const payload = getAuthFromCookie(req.headers.cookie);
  if (!payload) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).user = payload;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const payload = getAuthFromCookie(req.headers.cookie);
  if (!payload || payload.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).user = payload;
  next();
}
