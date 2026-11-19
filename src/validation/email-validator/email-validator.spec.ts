import { faker } from "@faker-js/faker";
import { describe, expect, test, vi } from "vitest";
import { EmailValidator } from "./email-validator";

describe("EmailValidator", () => {
  test("Should return true if validator returns true", () => {
    const sut = new EmailValidator();
    const isEmailValid = sut.isValid(faker.internet.email());
    expect(isEmailValid).toBeTruthy();
  });

  test("Should return false if validator returns false", () => {
    const sut = new EmailValidator();

    const spy = vi.spyOn(sut, "isValid").mockReturnValue(false);
    const email = faker.internet.email();
    const isEmailValid = sut.isValid(email);

    expect(spy).toHaveBeenCalledWith(email);
    expect(isEmailValid).toBeFalsy();
  });
});
