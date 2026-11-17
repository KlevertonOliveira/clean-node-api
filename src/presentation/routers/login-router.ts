import {
  type HttpRequestType,
  type HttpResponseType,
  HttpResponse,
} from "@/presentation/helpers/http";
import { MissingParamError } from "../helpers/errors";

export class LoginRouter {
  constructor(private readonly authUseCase: any) {
    this.authUseCase = authUseCase;
  }

  async route(httpRequest: HttpRequestType): Promise<HttpResponseType> {
    try {
      const { email, password } = httpRequest.body;

      if (!email) {
        return HttpResponse.badRequest(new MissingParamError("email"));
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError("password"));
      }

      const accessToken = await this.authUseCase.auth(email, password);

      if (!accessToken) return HttpResponse.unauthorizedError();

      return HttpResponse.ok({ accessToken });
    } catch (error) {
      console.error(error);
      return HttpResponse.serverError();
    }
  }
}
