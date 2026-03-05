import { Context } from "@hono/hono";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { User } from "../classes/User.ts";
import { UserCredential } from "../classes/UserCredential.ts";
import { ConvertedUser } from "../types/types.ts";
import { deleteCookie, getCookie, setCookie } from "@hono/hono/cookie";
import { HeadController } from "./HeadController.ts";
import { Environment } from "../classes/Environment.ts";
import { ensureConvertedUserIntegrity } from "../types/ConvertedUser.ts";
import { ControllerError } from "../errors/controllerErrors/ControllerError.ts";
import { SessionError } from "../errors/controllerErrors/SessionError.ts";

export class UserController extends HeadController {
  constructor(
    readonly userRepository: UserRepository,
  ) {
    super();
  }

  async authMiddleware(c: Context, next: () => Promise<void>) {
    try {
      const sessiontoken = getCookie(c, "session");
      if (!sessiontoken) {
        throw new SessionError("No session token");
      }
      const currentUser = await this.userRepository.findBySessionToken(
        sessiontoken,
      );
      currentUser.validateSession(sessiontoken);
      c.set("currentUser", currentUser);
    } catch (error) {
      return this.errorHandle(error, c);
    }
    await next();
  }
  listMyServices(
    c: Context,
  ) {
    const me = this.getMeFromContext(c);
    const list = me.listServices();
    return c.json(list);
  }

  read(c: Context) {
    const me = this.getMeFromContext(c);
    return c.json(me.toJson());
  }

  async changePassword(c: Context) {
    try {
      const requestData: ConvertedUser = await c.req.json();
      const me: User = this.getMeFromContext(c);
      ensureConvertedUserIntegrity(requestData, "credentials");
      const newPassword: string = requestData.credentials.password;

      me.changeUserCredentials(
        await me.getCredentials().changePassword(newPassword),
      );
      await this.userRepository.save(me);
      return c.body(null, 204);
    } catch (error) {
      if (error instanceof TypeError) {
        return c.body(error.message, 400);
      }
      if (error instanceof Error) {
        return c.json(error, 500);
      }
    }
  }

  async logOut(c: Context) {
    const sessionToken = getCookie(c, "session");
    if (!sessionToken) {
      return c.body(null, 401);
    }
    const user = await this.userRepository.findBySessionToken(sessionToken);
    user.deleteSessionByToken(sessionToken);
    await this.userRepository.save(user);
    deleteCookie(c, "session");
    return c.body(null, 200);
  }

  async logIn(c: Context) {
    try {
      const requestData: ConvertedUser = await c.req.json();
      ensureConvertedUserIntegrity(requestData, "credentials");

      const { username, password } = requestData.credentials;
      const userToCheck = await this.userRepository.findByUserName(username);
      if (
        await userToCheck.getCredentials().verifyPasswordHash(password)
      ) {
        const { token, session } = userToCheck.createSession();

        const URL = Environment.FRONT_END_URL.replace(/(^\w+:|^)\/\//, "")
          .replace(
            /:\d+/g,
            "",
          );
        await this.userRepository.save(userToCheck);
        setCookie(c, "session", token, {
          domain: URL,
          path: "/",
          secure: true,
          httpOnly: true,
          maxAge: 1000,
          expires: session.expiresAt,
          sameSite: "None" as const,
        });
        return c.json({
          id: userToCheck.getId(),
          displayname: userToCheck.getDisplayName(),
        }, 200);
      } else {
        return c.body(null, 401);
      }
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }

  async changeDisplayName(c: Context) {
    const requestData: ConvertedUser = await c.req.json();
    const me: User = this.getMeFromContext(c);
    if (!requestData.displayname) {
      return c.body("Displayname is required", 400);
    }
    me.setDisplayName(requestData.displayname);
    try {
      await this.userRepository.save(me);
    } catch (error) {
      if (error instanceof TypeError) {
        return c.body(error.message, 400);
      }
      if (error instanceof Error) {
        console.log(error);
        return c.body(null, 500);
      }
    }
    return c.body(null, 204);
  }
  async delete(c: Context) {
    const me: User = this.getMeFromContext(c);
    try {
      await this.userRepository.delete(me);
      deleteCookie(c, "session");
      return c.body(null, 204);
    } catch (error) {
      if (error instanceof ControllerError) {
        return c.json(error, error.errorcode);
      }
      if (error instanceof Error) {
        console.log(error);
        return c.body(null, 500);
      }
    }
  }
  async create(c: Context) {
    try {
      const requestData: ConvertedUser = await c.req.json();
      ensureConvertedUserIntegrity(requestData, [
        "credentials",
        "displayname",
      ]);
      const { username, password } = requestData.credentials;
      const newUser = new User(
        await UserCredential.create(username, password),
        requestData.displayname,
      );

      await this.userRepository.save(newUser);
      console.log("test");
      return c.body(null, 201);
    } catch (error) {
      if (error instanceof TypeError) {
        return c.body(error.message, 400);
      }
      if (error instanceof Error) {
        return c.body(error.message, 500);
      }
    }
  }
}
