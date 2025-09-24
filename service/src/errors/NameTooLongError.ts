export class NameTooLong extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NameTooLong";
  }
}
