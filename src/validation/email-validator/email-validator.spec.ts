import { faker } from "@faker-js/faker";
import { describe, expect, test } from "vitest";
import { EmailValidator } from "./email-validator";

describe("EmailValidator", () => {
  test("Should return true if validator returns true", () => {
    const sut = new EmailValidator();

    const email = faker.internet.email();
    const isEmailValid = sut.isValid(email);

    expect(isEmailValid).toBeTruthy();
  });
});
