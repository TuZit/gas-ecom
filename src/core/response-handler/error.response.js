class ErrorReponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorReponse {
  constructor(
    message = ReponseStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorReponse {
  constructor(
    message = ReponseStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

const StatusCode = {
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

const ReponseStatusCode = {
  FORBIDDEN: "Bad Request error",
  NOT_FOUND: "Not Found error",
  CONFLICT: "Conflict error",
};

export {
  ErrorReponse,
  ConflictRequestError,
  BadRequestError,
  StatusCode,
  ReponseStatusCode,
};
