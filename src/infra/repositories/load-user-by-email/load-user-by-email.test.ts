import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { LoadUserByEmailRepository } from "./load-user-by-email";
import { MissingParamError } from "@/utils/errors";
import { faker } from "@faker-js/faker";

import { createTestDatabase } from "@/tests/helpers/mongodb";

describe("LoadUserByEmail Repository", () => {
  let database: Awaited<ReturnType<typeof createTestDatabase>>;

  let sut: LoadUserByEmailRepository;

  beforeAll(async () => {
    database = await createTestDatabase();

    sut = new LoadUserByEmailRepository({
      userModel: database.db.collection("users"),
    });
  });

  beforeEach(async () => {
    await database.clearDatabase();
  });

  afterAll(async () => {
    await database.close();
  });

  test("Should throw if no email is provided", async () => {
    // @ts-expect-error
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should return null if no user is found", async () => {
    const user = await sut.load(faker.internet.email());
    expect(user).toBeNull();
  });

  test("Should return an user if a user is found", async () => {
    const email = faker.internet.email();

    await database.db.collection("users").insertOne({
      name: "John",
      email,
    });

    const user = await sut.load(email);
    expect(user?.email).toBe(email);
  });
});
