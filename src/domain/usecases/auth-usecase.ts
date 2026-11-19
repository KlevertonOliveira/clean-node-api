import { MissingParamError } from "@/utils/errors";

export class AuthUseCase {
  async auth(email: string, password: string): Promise<any> {
    if (!email) throw new MissingParamError("email");
    if (!password) throw new MissingParamError("password");
  }
}
