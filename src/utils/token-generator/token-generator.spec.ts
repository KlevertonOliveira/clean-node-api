import { describe, expect, test, vi } from "vitest";
import { TokenGenerator } from "./token-generator";
import { MissingParamError } from "../errors";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

describe("Token Generator", () => {
  test("Should throw if no id is provided", async () => {
    const sut = new TokenGenerator();

    // @ts-expect-error
    const promise = sut.generate();

    await expect(promise).rejects.toThrow(new MissingParamError("id"));
  });

  test("Should return null if JWT returns null", async () => {
    vi.mocked(jwt.sign).mockImplementation(() => null);
    const sut = new TokenGenerator();
    const token = await sut.generate(faker.string.uuid());
    expect(token).toBeNull();
  });

  test("Should return a token if JWT returns a token", async () => {
    const jwtTokenMock = faker.string.uuid();
    vi.mocked(jwt.sign).mockImplementation(() => jwtTokenMock);

    const sut = new TokenGenerator();
    const token = await sut.generate(faker.string.uuid());

    expect(token).toBe(jwtTokenMock);
    expect(jwt.sign).toHaveBeenCalledOnce;
  });
});
