import { describe, expect, test } from "vitest";
import { LoadUserByEmailRepository } from "./load-user-by-email";
import { MissingParamError } from "@/utils/errors";
import { faker } from "@faker-js/faker";

describe("LoadUserByEmail Repository", () => {
  test("Should throw if no email is provided", async () => {
    const sut = new LoadUserByEmailRepository();
    // @ts-expect-error
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should return null if no user is found", async () => {
    const sut = new LoadUserByEmailRepository();
    const user = await sut.load(faker.internet.email());
    expect(user).toBeNull();
  });
});
