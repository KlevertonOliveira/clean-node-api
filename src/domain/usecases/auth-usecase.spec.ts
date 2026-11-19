import { describe, expect, test } from "vitest";
import { AuthUseCase } from "./auth-usecase";

describe("Auth UseCase", () => {
  test("Should throw if no email is provided", async () => {
    const sut = new AuthUseCase();
    /* @ts-expect-error */
    const promise = sut.auth();

    await expect(promise).rejects.toThrow();
  });
});
