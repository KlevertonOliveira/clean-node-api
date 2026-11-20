import { describe, expect, test } from "vitest";
import { AuthUseCase } from "./auth-usecase";
import { MissingParamError } from "@/utils/errors";
import { faker } from "@faker-js/faker";

class TokenGeneratorSpy {
  userId!: string;
  accessToken!: string;

  async generate(userId: string): Promise<any> {
    this.userId = userId;
    return this.accessToken;
  }
}

class LoadUserByEmailRepositorySpy {
  email!: string;
  user!: any;

  async load(email: string): Promise<any> {
    this.email = email;
    return this.user;
  }
}

class EncrypterSpy {
  password!: string;
  hashedPassword!: string;
  isValid!: boolean;

  compare(password: string, hashedPassword: string): boolean {
    this.password = password;
    this.hashedPassword = hashedPassword;
    return this.isValid;
  }
}

type SutTypes = {
  sut: AuthUseCase;
  loadUserByEmailRepositorySpy: LoadUserByEmailRepositorySpy;
  encrypterSpy: EncrypterSpy;
  tokenGeneratorSpy: TokenGeneratorSpy;
};

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = {
    id: faker.string.uuid(),
    password: faker.internet.password(),
  };

  const encrypterSpy = new EncrypterSpy();
  encrypterSpy.isValid = true;

  const tokenGeneratorSpy = new TokenGeneratorSpy();
  tokenGeneratorSpy.accessToken = faker.string.alphanumeric();

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
  });

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
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

  test("Should throw if no dependency is provided", async () => {
    // @ts-expect-error
    const sut = new AuthUseCase();
    const promise = sut.auth(faker.internet.email(), faker.internet.password());

    await expect(promise).rejects.toThrow();
  });

  test("Should throw if LoadUserByEmailRepository has no load method", async () => {
    const encrypterSpy = new EncrypterSpy();
    const tokenGeneratorSpy = new TokenGeneratorSpy();
    const sut = new AuthUseCase({
      loadUserByEmailRepository: {},
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy,
    });
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

  test("Should return null if an invalid password is provided", async () => {
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;

    const accessToken = await sut.auth(
      faker.internet.email(),
      faker.internet.password(),
    );

    expect(accessToken).toBeNull();
  });

  test("Should call Encrypter with correct values", async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    const password = faker.internet.password();

    await sut.auth(faker.internet.email(), password);

    expect(encrypterSpy.password).toBe(password);
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepositorySpy.user.password,
    );
  });

  test("Should call TokenGenerator with userId", async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth(faker.internet.email(), faker.internet.password());

    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
  });

  test("Should return an accessToken if correct credentials are provided", async () => {
    const { sut, tokenGeneratorSpy } = makeSut();
    const accessToken = await sut.auth(
      faker.internet.email(),
      faker.internet.password(),
    );

    expect(accessToken).toBe(tokenGeneratorSpy.accessToken);
    expect(accessToken).toBeTruthy();
  });
});
