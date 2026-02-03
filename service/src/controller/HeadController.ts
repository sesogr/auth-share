import { getCookie } from "@hono/hono/cookie";
import { User } from "../classes/User.ts";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { Context } from "@hono/hono";

export class HeadController {
  constructor(protected readonly userRepository: UserRepository) {
  }
  protected async getMeFromContext(c: Context): Promise<User> {
    const sessionToken = getCookie(c, "session");
    if (!sessionToken) throw new Error("No session token");
    const me = await this.userRepository.findBySessionToken(sessionToken);
    // optional: validate session here to be robust
    me.validateSession(sessionToken);
    return me;
  }
}
