import {
  MissingParamError,
  UnauthorizedError,
} from "@/presentation/helpers/errors";

export type HttpRequestType = {
  body?: any;
};

export type HttpResponseType = {
  statusCode: number;
  body?: any;
};

export class HttpResponse {
  static badRequest(paramName: string): HttpResponseType {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }

  static serverError(): HttpResponseType {
    return { statusCode: 500 };
  }

  static unauthorizedError(): HttpResponseType {
    return {
      statusCode: 401,
      body: new UnauthorizedError(),
    };
  }
}
