import { MissingParamError } from "../errors";

export class TokenGenerator {
  async generate(id: string) {
    if (!id) throw new MissingParamError("id");
    return null;
  }
}
