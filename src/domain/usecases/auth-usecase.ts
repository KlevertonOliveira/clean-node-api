import { MissingParamError } from "@/utils/errors";

export class AuthUseCase {
  constructor(
    private readonly loadUserByEmailRepository: any,
    private readonly encrypter: any,
  ) {}

  async auth(email: string, password: string): Promise<any> {
    if (!email) throw new MissingParamError("email");
    if (!password) throw new MissingParamError("password");

    const user = await this.loadUserByEmailRepository.load(email);
    if (!user) return null;

    this.encrypter.compare(password, user.password);
    return null;
  }
}
