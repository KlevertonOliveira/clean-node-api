import { describe, expect, test } from "vitest";
import { faker } from "@faker-js/faker";
import { LoginRouter } from "./login-router";
import {
  MissingParamError,
  UnauthorizedError,
} from "@/presentation/helpers/errors";

type SutTypes = {
  sut: LoginRouter;
  authUseCaseSpy: AuthUseCaseSpy;
};

export class AuthUseCaseSpy {
  email!: string;
  password!: string;

  auth(email: string, password: string): void {
    this.email = email;
    this.password = password;
  }
}

const makeSut = (): SutTypes => {
  const authUseCaseSpy = new AuthUseCaseSpy();
  const sut = new LoginRouter(authUseCaseSpy);

  return {
    sut,
    authUseCaseSpy,
  };
};

describe("LoginRouter", () => {
  test("Should return 500 if no AuthUseCase is provided", () => {
    /* @ts-expect-error */
    const sut = new LoginRouter();

    const httpResponse = sut.route({
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 500 if no httpRequest is provided", () => {
    const { sut } = makeSut();

    /* @ts-expect-error */
    const httpResponse = sut.route();

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 500 if httpRequest has no body", () => {
    const { sut } = makeSut();

    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 400 if no email is provided", () => {
    const { sut } = makeSut();

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
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: faker.internet.email(),
      },
    };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 401 when invalid credentials are provided", () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test("Should call AuthUseCase with correct params", () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };

    sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });
});
