import { describe, expect, test } from "vitest";
import { TokenGenerator } from "./token-generator";
import { MissingParamError } from "../errors";
import { faker } from "@faker-js/faker";

describe("Token Generator", () => {
  test("Should throw if no id is provided", async () => {
    const sut = new TokenGenerator();

    // @ts-expect-error
    const promise = sut.generate();

    await expect(promise).rejects.toThrow(new MissingParamError("id"));
  });

  test("Should return null if JWT returns null", async () => {
    const sut = new TokenGenerator();
    const token = await sut.generate(faker.string.uuid());
    expect(token).toBeNull();
  });
});
