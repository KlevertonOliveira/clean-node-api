import { MissingParamError } from "@/utils/errors";

export class AuthUseCase {
  constructor(private readonly loadUserByEmailRepository: any) {}

  async auth(email: string, password: string): Promise<any> {
    if (!email) throw new MissingParamError("email");
    if (!password) throw new MissingParamError("password");

    await this.loadUserByEmailRepository.load(email);
  }
}
