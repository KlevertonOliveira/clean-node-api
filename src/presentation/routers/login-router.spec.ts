import { describe, expect, test } from "vitest";
import { faker } from "@faker-js/faker";
import { LoginRouter } from "./login-router";
import { MissingParamError } from "@/presentation/helpers/errors";

describe("Login Router", () => {
  test("Should return 500 if httpRequest has no body", () => {
    const sut = new LoginRouter();

    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 400 if no email is provided", () => {
    const sut = new LoginRouter();

    const httpRequest = {
      body: {
        password: faker.internet.password(),
      },
    };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is provided", () => {
    const sut = new LoginRouter();

    const httpRequest = {
      body: {
        email: faker.internet.email(),
      },
    };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });
});
