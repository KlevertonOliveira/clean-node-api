import { z } from "zod";

export class EmailValidator {
  isValid(email: string): boolean {
    return z.email().safeParse(email).success;
  }
}
