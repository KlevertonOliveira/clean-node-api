import { User } from "@/infra/types/user";
import { MissingParamError } from "@/utils/errors";
import { Collection, ObjectId } from "mongodb";

type Dependencies = {
  userModel: Collection<User>;
};

export class UpdateAccessTokenRepository {
  constructor(private readonly deps: Dependencies) {}

  async update(userId: ObjectId, accessToken: string): Promise<void> {
    if (!userId) throw new MissingParamError("userId");
    if (!accessToken) throw new MissingParamError("accessToken");

    await this.deps.userModel.updateOne(
      { _id: userId },
      { $set: { accessToken } },
    );
  }
}
