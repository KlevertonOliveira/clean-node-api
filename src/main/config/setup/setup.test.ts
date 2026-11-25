import { describe, expect, test } from "vitest";
import request from "supertest";
import app from "../app/app";

describe("App Setup", () => {
  test("Should disable x-powered-by header", async () => {
    app.get("/test-x-powered-by", (_, res) => {
      res.send("");
    });

    const res = await request(app).get("/test-x-powered-by");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });
});
