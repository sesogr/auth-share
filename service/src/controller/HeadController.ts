import { User } from "../classes/User.ts";
import { Context } from "@hono/hono";
import { SessionError } from "../errors/controllerErrors/SessionError.ts";
import { ControllerError } from "../errors/controllerErrors/ControllerError.ts";

export class HeadController {
  protected getMeFromContext(c: Context): User {
    const me = c.get("currentUser") as User;
    if (!me) {
      throw new SessionError("No user in context");
    }
    return me;
  }
  errorHandle(error: unknown, c: Context) {
    if (error instanceof ControllerError) {
      return c.json(error, error.errorcode);
    }
    if (error instanceof TypeError) {
      return c.json(error, 400);
    }
    if (error instanceof Error) {
      console.error(error);
      return c.body(null, 500);
    }
  }
}
