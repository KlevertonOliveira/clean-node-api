import { createTestDatabase } from "@/infra/tests/helpers/mongodb";
import { faker } from "@faker-js/faker";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { UpdateAccessTokenRepository } from "./update-access-token-repository";
import { MissingParamError } from "@/utils/errors";
import { User } from "@/infra/types/user";
import { InsertOneResult } from "mongodb";

describe("UpdateAccessToken Repository", () => {
  let database: Awaited<ReturnType<typeof createTestDatabase>>;

  let sut: UpdateAccessTokenRepository;
  let fakeUser: InsertOneResult<User>;

  beforeAll(async () => {
    database = await createTestDatabase();

    sut = new UpdateAccessTokenRepository({
      userModel: database.db.collection("users"),
    });
  });

  beforeEach(async () => {
    await database.clearDatabase();

    fakeUser = await database.db.collection("users").insertOne({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
  });

  afterAll(async () => {
    await database.close();
  });

  test("Should throw if no userModel is provided", async () => {
    // @ts-expect-error
    const sut = new UpdateAccessTokenRepository();

    const promise = sut.update(
      fakeUser.insertedId,
      faker.string.alphanumeric(),
    );

    await expect(promise).rejects.toThrow();
  });

  test("Should throw if expected params are not provided", async () => {
    // @ts-expect-error
    await expect(sut.update()).rejects.toThrow(new MissingParamError("userId"));

    // @ts-expect-error
    await expect(sut.update(fakeUser.insertedId)).rejects.toThrow(
      new MissingParamError("accessToken"),
    );
  });

  test("Should update the user with the given accessToken", async () => {
    const userModel = database.db.collection("users");
    const token = faker.string.alphanumeric();

    await sut.update(fakeUser.insertedId, token);

    const updatedFakeUser = await userModel.findOne({
      _id: fakeUser.insertedId,
    });

    expect(updatedFakeUser?.accessToken).toBe(token);
  });
});
