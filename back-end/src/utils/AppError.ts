export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string; // <-- adicione esta linha

  constructor(message: string, statusCode = 400, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code; // <-- adicione esta linha
    Object.setPrototypeOf(this, AppError.prototype);
  }
}