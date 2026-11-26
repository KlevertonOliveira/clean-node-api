import { cors, jsonParser, contentType } from "@/main/middlewares";
import { Express } from "express";

export function setupApp(app: Express) {
  app.disable("x-powered-by");
  app.use(cors);
  app.use(jsonParser);
  app.use(contentType);
}
