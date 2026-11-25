import { User } from "@/infra/types/user";
import { Collection, ObjectId } from "mongodb";

type Dependencies = {
  userModel: Collection<User>;
};

export class UpdateAccessTokenRepository {
  constructor(private readonly deps: Dependencies) {}

  async update(userId: ObjectId, accessToken: string): Promise<void> {
    await this.deps.userModel.updateOne(
      { _id: userId },
      { $set: { accessToken } },
    );
  }
}
