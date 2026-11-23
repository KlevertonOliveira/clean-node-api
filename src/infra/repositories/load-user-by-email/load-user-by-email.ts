import { MissingParamError } from "@/utils/errors";

export class LoadUserByEmailRepository {
  async load(email: string) {
    if (!email) throw new MissingParamError("email");
  }
}
