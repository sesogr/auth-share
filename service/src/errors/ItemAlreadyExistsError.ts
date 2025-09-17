export class ItemAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ItemAlreadyExistsError";
    Object.setPrototypeOf(this, ItemAlreadyExistsError);
  }
}
