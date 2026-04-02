import { ControllerError } from "./ControllerError.ts";

export class MissingDataError extends ControllerError {
  constructor(message: string) {
    super(message, 400);
    this.name = "MissingDataError";
  }
}
