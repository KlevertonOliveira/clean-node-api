import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { LoadUserByEmailRepository } from "./load-user-by-email-repository";
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
    const password = faker.internet.password();
    const name = faker.person.firstName();

    const fakeUser = await database.db
      .collection("users")
      .insertOne({ name, email, password });

    const user = await sut.load(email);

    expect(user).toEqual({
      _id: fakeUser.insertedId,
      name,
      email,
      password,
    });
  });
});
