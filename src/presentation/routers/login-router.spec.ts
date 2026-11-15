import { describe, expect, test } from "vitest";
import { faker } from "@faker-js/faker";

type HttpRequest = {
  body?: any;
};

type HttpResponse = {
  statusCode: number;
  body?: any;
};

class LoginRouter {
  route(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body?.email || !httpRequest.body.password) {
      const httpResponse = {
        statusCode: 400,
      };
      return httpResponse;
    }

    return { statusCode: 0 };
  }
}

describe("Login Router", () => {
  test("Should return 400 if no email is provided", () => {
    const sut = new LoginRouter();

    const httpRequest = {
      body: {
        password: faker.internet.password(),
      },
    };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
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
  });
});
