import { MongoClient, type Db } from "mongodb";

import { inject } from "vitest";
import { randomUUID } from "node:crypto";

export async function createTestDatabase() {
  const mongoUri = inject("MONGO_URI");

  const client = new MongoClient(mongoUri);

  await client.connect();

  const databaseName = `test_${randomUUID().replaceAll("-", "")}`;

  const db: Db = client.db(databaseName);

  return {
    db,
    client,

    async clearDatabase() {
      const collections = await db.collections();

      await Promise.all(
        collections.map((collection) => collection.deleteMany({})),
      );
    },

    async close() {
      await client.close();
    },
  };
}
