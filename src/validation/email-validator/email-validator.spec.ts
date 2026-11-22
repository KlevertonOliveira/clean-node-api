import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { EmailValidator } from "./email-validator";
import { MissingParamError } from "@/utils/errors";

const makeSut = (): EmailValidator => {
  return new EmailValidator();
};

const { safeParseMock } = vi.hoisted(() => ({
  safeParseMock: vi.fn(),
}));

vi.mock("zod", () => ({
  z: {
    email: vi.fn(() => ({
      safeParse: safeParseMock,
    })),
  },
}));

describe("EmailValidator", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("Should throw if no email is provided", () => {
    const sut = makeSut();
    expect(sut.isValid).toThrow(new MissingParamError("email"));
  });

  test("Should call validator with correct email ", () => {
    safeParseMock.mockReturnValue({ success: faker.datatype.boolean() });
    const sut = makeSut();
    const email = faker.internet.email();
    sut.isValid(email);

    expect(safeParseMock).toHaveBeenCalledOnce();
    expect(safeParseMock).toHaveBeenCalledWith(email);
  });

  test("Should return true if validator returns true", () => {
    safeParseMock.mockReturnValue({ success: true });
    const sut = makeSut();
    const isEmailValid = sut.isValid(faker.internet.email());

    expect(isEmailValid).toBeTruthy();
  });

  test("Should return false if validator returns false", () => {
    safeParseMock.mockReturnValue({ success: false });
    const sut = makeSut();
    const email = faker.internet.email();
    const isEmailValid = sut.isValid(email);

    expect(isEmailValid).toBeFalsy();
  });
});
