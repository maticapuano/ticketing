export class DatabaseConnectionError extends Error {
  statusCode = 500;
  reason: string = "Error connecting' to database";

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
