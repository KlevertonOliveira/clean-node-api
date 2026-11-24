import { MissingParamError } from "@/utils/errors";
import { Collection, ObjectId } from "mongodb";

interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
}

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
