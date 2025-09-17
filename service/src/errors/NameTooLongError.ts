export class NameTooLong extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NameTooLong";
    Object.setPrototypeOf(this, NameTooLong);
  }
}
