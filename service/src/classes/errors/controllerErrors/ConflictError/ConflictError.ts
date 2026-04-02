import { ControllerError } from "../ControllerError.ts";

export class ConflictError extends ControllerError {
  constructor(message: string) {
    super(message, 409);
    this.name = "ConflictError";
  }
}
