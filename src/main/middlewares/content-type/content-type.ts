import { Request, Response, NextFunction } from "express";

export function contentTypeMiddleware(
  _: Request,
  res: Response,
  next: NextFunction,
): void {
  res.type("json");
  next();
}
