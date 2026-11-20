import { describe, expect, test } from "vitest";
import { AuthUseCase } from "./auth-usecase";
import { MissingParamError } from "@/utils/errors";
import { faker } from "@faker-js/faker";

class LoadUserByEmailRepositorySpy {
  email!: string;
  user!: any;

  async load(email: string): Promise<any> {
    this.email = email;
    return this.user;
  }
}

type SutTypes = {
  sut: AuthUseCase;
  loadUserByEmailRepositorySpy: LoadUserByEmailRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = {};
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy);

  return {
    sut,
    loadUserByEmailRepositorySpy,
  };
};

describe("Auth UseCase", () => {
  test("Should throw if no email is provided", async () => {
    const { sut } = makeSut();
    /* @ts-expect-error */
    const promise = sut.auth();

    await expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should throw if no password is provided", async () => {
    const { sut } = makeSut();

    /* @ts-expect-error */
    const promise = sut.auth(faker.internet.email());

    await expect(promise).rejects.toThrow(new MissingParamError("password"));
  });

  test("Should throw if no LoadUserByEmailRepository is provided", async () => {
    // @ts-expect-error
    const sut = new AuthUseCase();

    const promise = sut.auth(faker.internet.email(), faker.internet.password());

    await expect(promise).rejects.toThrow();
  });

  test("Should throw if LoadUserByEmailRepository has no load method", async () => {
    const sut = new AuthUseCase({});

    const promise = sut.auth(faker.internet.email(), faker.internet.password());

    await expect(promise).rejects.toThrow();
  });

  test("Should call LoadUserByEmailRepository with correct email", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    const email = faker.internet.email();

    await sut.auth(email, faker.internet.password());

    expect(loadUserByEmailRepositorySpy.email).toBe(email);
  });

  test("Should return null if LoadUserByEmailRepository does not return a user", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;

    const accessToken = await sut.auth(
      faker.internet.email(),
      faker.internet.password(),
    );

    expect(accessToken).toBeNull();
  });
});
