export class GroupAlreadyAuthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroupAlreadyAuthorized";
    Object.setPrototypeOf(this, GroupAlreadyAuthorizedError);
  }
}
