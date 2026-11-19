import { faker } from "@faker-js/faker";
import { describe, expect, test, vi } from "vitest";
import { EmailValidator } from "./email-validator";

type SutTypes = {
  sut: EmailValidator;
};

const makeSut = (): SutTypes => {
  const sut = new EmailValidator();
  return {
    sut,
  };
};

describe("EmailValidator", () => {
  test("Should return true if validator returns true", () => {
    const { sut } = makeSut();
    const isEmailValid = sut.isValid(faker.internet.email());
    expect(isEmailValid).toBeTruthy();
  });

  test("Should return false if validator returns false", () => {
    const { sut } = makeSut();

    const spy = vi.spyOn(sut, "isValid").mockReturnValue(false);
    const email = faker.internet.email();
    const isEmailValid = sut.isValid(email);

    expect(spy).toHaveBeenCalledWith(email);
    expect(isEmailValid).toBeFalsy();
  });
});
