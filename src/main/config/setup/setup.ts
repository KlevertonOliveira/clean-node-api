import { corsMiddleware, jsonParserMiddleware } from "@/main/middlewares";
import { Express } from "express";

export function setupApp(app: Express) {
  app.disable("x-powered-by");
  app.use(corsMiddleware);
  app.use(jsonParserMiddleware());
}
