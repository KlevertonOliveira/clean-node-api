import { describe, expect, test, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { LoginRouter } from "./login-router";
import {
  MissingParamError,
  ServerError,
  UnauthorizedError,
} from "@/presentation/helpers/errors";

type SutTypes = {
  sut: LoginRouter;
  authUseCaseSpy: AuthUseCaseSpy;
};

export class AuthUseCaseSpy {
  email!: string;
  password!: string;
  accessToken!: string | null;

  async auth(email: string, password: string): Promise<string | null> {
    this.email = email;
    this.password = password;
    return this.accessToken;
  }
}

const makeSut = (): SutTypes => {
  const authUseCaseSpy = new AuthUseCaseSpy();
  authUseCaseSpy.accessToken = faker.string.uuid();

  const sut = new LoginRouter(authUseCaseSpy);

  return {
    sut,
    authUseCaseSpy,
  };
};

describe("LoginRouter", () => {
  test("Should return 500 if no httpRequest is provided", async () => {
    const { sut } = makeSut();

    /* @ts-expect-error */
    const httpResponse = await sut.route();

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if httpRequest has no body", async () => {
    const { sut } = makeSut();

    const httpRequest = {};
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: faker.internet.password(),
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: faker.internet.email(),
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 401 when invalid credentials are provided", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null;

    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test("Should return 500 if no AuthUseCase is provided", async () => {
    /* @ts-expect-error */
    const sut = new LoginRouter();

    const httpResponse = await sut.route({
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if AuthUseCase has no auth method", async () => {
    const sut = new LoginRouter({});

    const httpResponse = await sut.route({
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if AuthUseCase throws", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    vi.spyOn(authUseCaseSpy, "auth").mockRejectedValue(new Error());

    const httpResponse = await sut.route({
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should call AuthUseCase with correct params", async () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };

    await sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test("Should return 200 and accessToken when valid crentials are provided", async () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });
});
