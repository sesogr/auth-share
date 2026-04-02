import { ControllerError } from "./ControllerError.ts";

export class FormlessError extends ControllerError {
  constructor(message: string = "Wrong Keys Detected") {
    super(message, 400);
    this.name = "FormlessError";
  }
}
