import { User } from "../classes/User.ts";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { Context } from "@hono/hono";
import { SessionError } from "../errors/SessionError.ts";

export class HeadController {
  constructor(protected readonly userRepository: UserRepository) {
  }
  protected getMeFromContext(c: Context): User {
    const me = c.get("currentUser") as User;
    if (!me) {
      throw new SessionError("No user in context");
    }
    return me;
  }
}
