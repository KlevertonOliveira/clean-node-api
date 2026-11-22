import { MissingParamError } from "../errors";
import jwt from "jsonwebtoken";

export class TokenGenerator {
  constructor(private readonly secret: string) {}

  async generate(id: string) {
    if (!id) throw new MissingParamError("id");

    return jwt.sign(id, this.secret);
  }
}
