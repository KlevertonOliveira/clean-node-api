import app from "@/main/config/app/app";
import request from "supertest";
import { describe, expect, test } from "vitest";

describe("CORS Middleware", () => {
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
