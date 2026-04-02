import { User, ValidatedUser } from "../Entities/User.ts";
import { Context } from "@hono/hono";
import { SessionError } from "../errors/controllerErrors/SessionError.ts";
import { ControllerError } from "../errors/controllerErrors/ControllerError.ts";
import { Logger } from "../../../interfaceTypes/Logger.ts";

export class HeadController {
  constructor(readonly logging: Logger) {
  }
  protected getMeFromContext(c: Context): ValidatedUser {
    const me: User = c.get("currentUser");
    if (!me) {
      throw new SessionError("No user in context");
    }
    me.checkValidation();
    return me;
  }
  errorHandle(error: unknown, c: Context) {
    if (error instanceof ControllerError) {
      this.logging.warn(error);
      return c.json(error, error.errorCode);
    }
    if (error instanceof Error) {
      this.logging.error(error);
      return c.body(null, 500);
    }
    this.logging.error(error);
    return c.body(null, 500);
  }
}
