import bcrypt from "bcrypt";
import { MissingParamError } from "../errors";

export class Encrypter {
  async compare(value: string, hash: string) {
    if (!value) throw new MissingParamError("value");

    const isValid = await bcrypt.compare(value, hash);
    return isValid;
  }
}
