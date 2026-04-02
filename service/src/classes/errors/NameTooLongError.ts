export class NameTooLongError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NameTooLongError";
  }
}
