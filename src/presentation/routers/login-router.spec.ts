import { describe, expect, test } from "vitest";
import { faker } from "@faker-js/faker";

type HttpRequestType = {
  body?: any;
};

type HttpResponseType = {
  statusCode: number;
  body?: any;
};

class HttpResponse {
  static badRequest(paramName: string): HttpResponseType {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }

  static serverError(): HttpResponseType {
    return { statusCode: 500 };
  }
}

class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`Missing param: ${paramName}`);
    this.name = "MissingParamError";
  }
}

class LoginRouter {
  route(httpRequest: HttpRequestType): HttpResponseType {
    if (!httpRequest.body) return HttpResponse.serverError();

    const { email, password } = httpRequest.body;

    if (!email) return HttpResponse.badRequest("email");
    if (!password) return HttpResponse.badRequest("password");

    return { statusCode: 0 };
  }
}

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
