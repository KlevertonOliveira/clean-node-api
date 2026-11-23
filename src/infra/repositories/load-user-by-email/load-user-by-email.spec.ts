import { describe, expect, test } from "vitest";
import { LoadUserByEmailRepository } from "./load-user-by-email";
import { MissingParamError } from "@/utils/errors";

describe("LoadUserByEmail Repository", () => {
  test("Should throw if no email is provided", async () => {
    const sut = new LoadUserByEmailRepository();
    // @ts-expect-error
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new MissingParamError("email"));
  });
});
