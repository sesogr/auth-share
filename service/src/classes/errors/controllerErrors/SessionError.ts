import { ControllerError } from "./ControllerError.ts";

export class SessionError extends ControllerError {
  constructor(message: string) {
    super(message, 401);
    this.name = "SessionError";
  }
}
