type serializeErrors = { message: string; field?: string }[];

export abstract class CustomError extends Error {
  protected abstract readonly statusCode: number;

  constructor() {
    super();

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): serializeErrors;
}
