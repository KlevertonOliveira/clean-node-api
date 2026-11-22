import { MissingParamError } from "../errors";
import jwt from "jsonwebtoken";

export class TokenGenerator {
  async generate(id: string) {
    if (!id) throw new MissingParamError("id");

    return jwt.sign(id, "secret");
  }
}
