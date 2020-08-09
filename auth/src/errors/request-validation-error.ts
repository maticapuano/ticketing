import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  statusCode = 400;

  public readonly errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super();
    this.errors = errors;

    //Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
