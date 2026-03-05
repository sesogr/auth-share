import { ControllerError } from "./ControllerError.ts";

export class AuthorizationError extends ControllerError {
  constructor(message: string) {
    super(message, 401);
    this.name = "AuthorizationError";
  }
}
