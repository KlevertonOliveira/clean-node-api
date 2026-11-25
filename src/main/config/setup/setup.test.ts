import { describe, expect, test } from "vitest";
import request from "supertest";
import app from "../app/app";

describe("App Setup", () => {
  test("Should disable x-powered-by header", async () => {
    app.get("/test_x_powered-by", (_, res) => {
      res.send("");
    });

    const res = await request(app).get("/test-x-powered-by");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  test("Should enable CORS", async () => {
    app.get("/test_cors", (_, res) => {
      res.send("");
    });

    const res = await request(app).get("/test_cors");

    expect(res.headers["access-control-allow-origin"]).toBe("*");
    expect(res.headers["access-control-allow-methods"]).toBe("*");
    expect(res.headers["access-control-allow-headers"]).toBe("*");
  });
});
