import {
  type HttpRequestType,
  type HttpResponseType,
  HttpResponse,
} from "@/presentation/helpers/http";

export class LoginRouter {
  route(httpRequest: HttpRequestType): HttpResponseType {
    if (!httpRequest.body) return HttpResponse.serverError();

    const { email, password } = httpRequest.body;

    if (!email) return HttpResponse.badRequest("email");
    if (!password) return HttpResponse.badRequest("password");

    return { statusCode: 0 };
  }
}
