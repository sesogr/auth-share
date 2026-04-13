import { ConflictError } from "./ConflictError.ts";

export class WrongInvitationTypeError extends ConflictError {
  constructor(message: string) {
    super(message);
    this.name = "WrongInvitationTypeError";
  }
}
