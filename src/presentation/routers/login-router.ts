import {
  type HttpRequestType,
  type HttpResponseType,
  HttpResponse,
} from "@/presentation/helpers/http";

export class LoginRouter {
  constructor(private readonly authUseCase: any) {
    this.authUseCase = authUseCase;
  }

  route(httpRequest: HttpRequestType): HttpResponseType {
    if (
      !this.authUseCase ||
      !this.authUseCase.auth ||
      !httpRequest ||
      !httpRequest.body
    )
      return HttpResponse.serverError();

    const { email, password } = httpRequest.body;

    if (!email) return HttpResponse.badRequest("email");
    if (!password) return HttpResponse.badRequest("password");

    const accessToken = this.authUseCase.auth(email, password);

    if (!accessToken) return HttpResponse.unauthorizedError();

    return HttpResponse.ok({ accessToken });
  }
}
