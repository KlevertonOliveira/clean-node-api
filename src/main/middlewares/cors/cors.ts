import { Request, Response, NextFunction } from "express";

export function cors(_: Request, res: Response, next: NextFunction): void {
  res.set("access-control-allow-origin", "*");
  res.set("access-control-allow-methods", "*");
  res.set("access-control-allow-headers", "*");

  next();
}
