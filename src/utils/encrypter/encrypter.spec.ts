import { faker } from "@faker-js/faker";
import { describe, expect, test } from "vitest";
import { Encrypter } from "./encrypter";

describe("Encrypter", () => {
  test("Should return true if bcrypt returns true", () => {
    const sut = new Encrypter();

    const isValid = sut.compare(
      faker.internet.password(),
      faker.string.alphanumeric(),
    );

    expect(isValid).toBeTruthy();
  });
});
