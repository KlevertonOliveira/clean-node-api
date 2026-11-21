import { MissingParamError } from "@/utils/errors";

type Dependencies = {
  loadUserByEmailRepository: any;
  encrypter: any;
  tokenGenerator: any;
  updateAccessTokenRepository: any;
};

export class AuthUseCase {
  constructor(private readonly deps: Dependencies) {}

  async auth(email: string, password: string): Promise<any> {
    if (!email) throw new MissingParamError("email");
    if (!password) throw new MissingParamError("password");

    const user = await this.deps.loadUserByEmailRepository.load(email);
    if (!user) return null;

    const isValid = this.deps.encrypter.compare(password, user.password);
    if (!isValid) return null;

    const accessToken = await this.deps.tokenGenerator.generate(user.id);

    await this.deps.updateAccessTokenRepository.update(user.id, accessToken);

    return accessToken;
  }
}
