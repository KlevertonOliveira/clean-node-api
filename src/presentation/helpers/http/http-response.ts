import { ServerError, UnauthorizedError } from "@/presentation/helpers/errors";

export type HttpRequestType = {
  body?: any;
};

export type HttpResponseType = {
  statusCode: number;
  body?: any;
};

export class HttpResponse {
  static badRequest(error: Error): HttpResponseType {
    return {
      statusCode: 400,
      body: error,
    };
  }

  static serverError(): HttpResponseType {
    return {
      statusCode: 500,
      body: new ServerError(),
    };
  }

  static unauthorizedError(): HttpResponseType {
    return {
      statusCode: 401,
      body: new UnauthorizedError(),
    };
  }

  static ok<ResponseBody>(body?: ResponseBody): HttpResponseType {
    return {
      statusCode: 200,
      body,
    };
  }
}
