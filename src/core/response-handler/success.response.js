class SuccessResponse {
  constructor({
    message,
    statusCode = SuccessStatusCode.OK,
    reasonStatusCode = ReasonSuccessCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

export class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

export class CREATED extends SuccessResponse {
  constructor({
    message,
    metadata,
    statusCode = SuccessStatusCode.CREATED,
    reasonStatusCode = ReasonSuccessCode.CREATED,
  }) {
    super({ message, metadata, statusCode, reasonStatusCode });
  }
}

const SuccessStatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonSuccessCode = {
  OK: "Success",
  CREATED: "Created",
};
