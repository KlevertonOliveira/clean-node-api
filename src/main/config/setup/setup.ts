import { corsMiddleware } from "@/main/middlewares/cors/cors";
import { Express } from "express";

export function setupApp(app: Express) {
  app.disable("x-powered-by");
  app.use(corsMiddleware);
}
