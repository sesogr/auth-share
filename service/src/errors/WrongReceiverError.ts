export class WrongReceiverError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WrongReceiverError";
  }
}
