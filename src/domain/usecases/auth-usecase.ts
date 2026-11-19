import { MissingParamError } from "@/utils/errors";

export class AuthUseCase {
  async auth(email: string): Promise<any> {
    if (!email) throw new MissingParamError("email");
  }
}
