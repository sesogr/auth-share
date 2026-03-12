import { Context } from "@hono/hono";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { User } from "../classes/User.ts";
import { UserCredential } from "../classes/UserCredential.ts";
import { ConvertedUser } from "../types/types.ts";
import { HonoCookieAdapter } from "../deps/HonoCookieAdapter.ts";

const { deleteCookie, saveGetCookie, setCookie } = HonoCookieAdapter;
import { HeadController } from "./HeadController.ts";
import { Environment } from "../classes/Environment.ts";
import { ensureConvertedUserIntegrity } from "../types/ConvertedUser.ts";
import { SessionError } from "../errors/controllerErrors/SessionError.ts";

export class UserController extends HeadController {
  constructor(
    readonly userRepository: UserRepository,
  ) {
    super();
  }

  async authMiddleware(c: Context, next: () => Promise<void>) {
    try {
      const sessionToken = saveGetCookie(c, "session");
      if (!sessionToken) {
        return this.errorHandle(new SessionError("No session token"), c);
      }
      const currentUser: User = await this.userRepository.findBySessionToken(
        sessionToken,
      );
      currentUser.validateSession(sessionToken);
      c.set("currentUser", currentUser);
    } catch (error) {
      return this.errorHandle(error, c);
    }
    await next();
  }

  listMyServices(
    c: Context,
  ) {
    try {
      const me = this.getMeFromContext(c);
      const list = me.listServices();
      return c.json(list);
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }

  read(c: Context) {
    try {
      const me = this.getMeFromContext(c);
      return c.json(me.toJson());
    } catch (error) {
      return this.errorHandle(error, c);
    }
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
      return this.errorHandle(error, c);
    }
  }

  async logOut(c: Context) {
    try {
      const sessionToken = saveGetCookie(c, "session");
      const user = await this.userRepository.findBySessionToken(sessionToken);
      user.deleteSessionByToken(sessionToken);
      await this.userRepository.save(user);
      deleteCookie(c, "session");
      return c.body(null, 200);
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }

  async logIn(c: Context) {
    try {
      const requestData: ConvertedUser = await c.req.json();
      ensureConvertedUserIntegrity(requestData, "credentials");
      const { username, password } = requestData.credentials;
      const userToCheck = await this.userRepository.findByUserName(username);
      await userToCheck.getCredentials().verifyPasswordHash(password);
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
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }

  async changeDisplayName(c: Context) {
    try {
      const requestData: ConvertedUser = await c.req.json();
      ensureConvertedUserIntegrity(requestData, "displayname");
      const me: User = this.getMeFromContext(c);
      me.setDisplayName(requestData.displayname);
      await this.userRepository.save(me);
      return c.body(null, 204);
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }

  async delete(c: Context) {
    try {
      const me: User = this.getMeFromContext(c);
      await this.userRepository.delete(me);
      deleteCookie(c, "session");
      return c.body(null, 204);
    } catch (error) {
      return this.errorHandle(error, c);
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
      const newUser = User.createUser(
        await UserCredential.create(username, password),
        requestData.displayname,
      );
      await this.userRepository.save(newUser);
      console.log("test");
      return c.body(null, 201);
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }
}
