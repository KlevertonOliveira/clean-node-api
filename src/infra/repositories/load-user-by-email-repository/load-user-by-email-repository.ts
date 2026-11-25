import { User } from "@/infra/types/user";
import { MissingParamError } from "@/utils/errors";
import { Collection } from "mongodb";

type Dependencies = {
  userModel: Collection<User>;
};

export class LoadUserByEmailRepository {
  constructor(private readonly deps: Dependencies) {}

  async load(email: string) {
    if (!email) throw new MissingParamError("email");

    const user = this.deps.userModel.findOne({ email });
    return user;
  }
}
