import { Express } from "express";

export function setupApp(app: Express) {
  app.disable("x-powered-by");
  app.use((_, res, next) => {
    res.set("access-control-allow-origin", "*");
    res.set("access-control-allow-methods", "*");
    res.set("access-control-allow-headers", "*");
    next();
  });
}
