import app from "@/main/config/app/app";
import { faker } from "@faker-js/faker";
import request from "supertest";
import { describe, test } from "vitest";

describe("JSON Parser Middleware", () => {
  test("Should parse body as JSON", async () => {
    app.post("/test_json_parser", (req, res) => {
      res.send(req.body);
    });

    const name = faker.person.fullName();

    await request(app)
      .post("/test_json_parser")
      .send({ name })
      .expect({ name });
  });
});
