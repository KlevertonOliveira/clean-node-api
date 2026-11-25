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

describe("UpdateAccessToken Repository", () => {
  let database: Awaited<ReturnType<typeof createTestDatabase>>;

  let sut: UpdateAccessTokenRepository;

  beforeAll(async () => {
    database = await createTestDatabase();

    sut = new UpdateAccessTokenRepository({
      userModel: database.db.collection("users"),
    });
  });

  beforeEach(async () => {
    await database.clearDatabase();
  });

  afterAll(async () => {
    await database.close();
  });

  test("Should update the user with the given accessToken", async () => {
    const userModel = database.db.collection("users");
    const token = faker.string.alphanumeric();

    const fakeUser = await database.db.collection("users").insertOne({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    await sut.update(fakeUser.insertedId, token);

    const updatedFakeUser = await userModel.findOne({
      _id: fakeUser.insertedId,
    });

    expect(updatedFakeUser?.accessToken).toBe(token);
  });
});
