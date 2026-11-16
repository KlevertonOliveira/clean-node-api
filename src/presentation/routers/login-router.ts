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
    if (!httpRequest.body) return HttpResponse.serverError();

    const { email, password } = httpRequest.body;

    if (!email) return HttpResponse.badRequest("email");
    if (!password) return HttpResponse.badRequest("password");

    this.authUseCase.auth(email, password);

    return { statusCode: 0 };
  }
}
