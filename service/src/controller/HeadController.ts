import { User, ValidatedUser } from "../classes/User.ts";
import { Context } from "@hono/hono";
import { SessionError } from "../errors/controllerErrors/SessionError.ts";
import { ControllerError } from "../errors/controllerErrors/ControllerError.ts";

export class HeadController {
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
      return c.json(error, error.errorCode);
    }
    if (error instanceof Error) {
      console.log(error);
      return c.body(null, 500);
    }
    console.log(error);
    return c.body(null, 500);
  }
}
