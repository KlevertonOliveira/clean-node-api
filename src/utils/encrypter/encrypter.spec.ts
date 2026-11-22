import { describe, expect, test, vi } from "vitest";
import { Encrypter } from "./encrypter";
import { faker } from "@faker-js/faker";

const mocks = vi.hoisted(() => ({
  compare: vi.fn<(data: string, encrypted: string) => Promise<boolean>>(),
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: mocks.compare,
  },
}));

const makeSut = (): Encrypter => {
  return new Encrypter();
};

describe("Encrypter", () => {
  test("Should return true if bcrypt returns true", async () => {
    mocks.compare.mockResolvedValue(true);

    const sut = makeSut();

    const isValid = await sut.compare(
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
    );

    expect(isValid).toBeTruthy();
  });

  test("Should return false if bcrypt returns false", async () => {
    mocks.compare.mockResolvedValue(false);

    const sut = makeSut();

    const isValid = await sut.compare(
      faker.string.alphanumeric(),
      faker.string.alphanumeric(),
    );

    expect(isValid).toBeFalsy();
  });

  test("Should call bcrypt with correct values", async () => {
    const sut = makeSut();

    const value = faker.string.alphanumeric();
    const hash = faker.string.alphanumeric();

    await sut.compare(value, hash);

    expect(mocks.compare).toHaveBeenCalledOnce();
    expect(mocks.compare).toHaveBeenCalledWith(value, hash);
  });
});
