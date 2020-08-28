type serializeErrors = { message: string; field?: string }[];

export abstract class CustomError extends Error {
  public abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): serializeErrors;
}
