import { ConflictError } from "./ConflictError.ts";

export class AlreadyTakenError extends ConflictError {
  constructor(message: string, readonly type: string) {
    super(message);
    this.name = "AlreadyTakenError";
  }
}
