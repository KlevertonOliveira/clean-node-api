export class AuthUseCase {
  async auth(email: string): Promise<any> {
    if (!email) throw new Error();
  }
}
