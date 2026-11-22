import { MissingParamError } from "@/utils/errors";
import { z } from "zod";

export class EmailValidator {
  isValid(email: string): boolean {
    if (!email) throw new MissingParamError("email");
    return z.email().safeParse(email).success;
  }
}
