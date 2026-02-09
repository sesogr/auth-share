import { HonoCookieAdapter } from "../deps/HonoCookieAdapter.ts";
import { User } from "../classes/User.ts";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { Context } from "@hono/hono";
import { SessionError } from "../errors/SessionError.ts";

export class HeadController {
  constructor(protected readonly userRepository: UserRepository) {
  }
  protected async getMeFromContext(c: Context): Promise<User> {
    const sessionToken = HonoCookieAdapter.getCookie(c, "session");
    if (!sessionToken) throw new SessionError("No session token");
    const me = await this.userRepository.findBySessionToken(sessionToken);
    // optional: validate session here to be robust
    me.validateSession(sessionToken);
    return me;
  }
}
