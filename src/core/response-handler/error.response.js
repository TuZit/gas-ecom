import { ReasonPhrases, StatusCodes } from "../constants/httpStatusCode.js";
import WinstonLoggerV2 from "../../logger/winstonV2.log.js";
class ErrorReponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;

    WinstonLoggerV2.error(message, {
      context: "/path",
      requestId: "123456",
      message: this.message,
      metadata: {},
    });
  }
}

class ConflictRequestError extends ErrorReponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    statusCode = StatusCodes.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorReponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    statusCode = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorReponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorReponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    statusCode = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorReponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class RedisError extends ErrorReponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}

export {
  ErrorReponse,
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
  RedisError,
};
