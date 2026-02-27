import { Context } from "@hono/hono";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { User } from "../classes/User.ts";
import { UserCredential } from "../classes/UserCredential.ts";
import { ConvertedUser } from "../types/types.ts";
import { deleteCookie, getCookie, setCookie } from "@hono/hono/cookie";
import { HeadController } from "./HeadController.ts";
import { Environment } from "../classes/Environment.ts";

export class UserController extends HeadController {
  constructor(
    userRepository: UserRepository,
  ) {
    super(userRepository);
  }
  async listMyServices(
    c: Context,
  ) {
    const me = await this.getMeFromContext(c);
    const list = me.listServices();
    return c.json(list);
  }

  async read(c: Context) {
    const me = await this.getMeFromContext(c);
    return c.json(me.toJson());
  }
  private confirmCredentials(
    requestData: ConvertedUser,
  ): asserts requestData is ConvertedUser & {
    credentials: `${string}:${string}`;
  } {
    if (!requestData.credentials || !requestData.credentials.includes(":")) {
      throw new TypeError(
        "Credentials are required and must be in the format 'username:password'",
      );
    }
  }
  async changePassword(c: Context) {
    const requestData: ConvertedUser = await c.req.json();
    const me: User = await this.getMeFromContext(c);
    this.confirmCredentials(requestData);
    const newPassword: string = requestData.credentials.split(":")[1];

    me.changeUserCredentials(
      await me.getCredentials().changePassword(newPassword),
    );
    await this.userRepository.save(me);
    return c.body(null, 204);
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
      this.confirmCredentials(requestData);
      const [username, plainPassword] = requestData.credentials.split(":");

      const userToCheck = await this.userRepository.findByUserName(username);

      if (
        await userToCheck.getCredentials().verifyPasswordHash(plainPassword)
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
        // Gib Id + displayname zurück (Frontend benötigt das)
        return c.json({
          id: userToCheck.getId(),
          displayname: userToCheck.getDisplayName(),
        }, 200);
      } else {
        return c.body(null, 401);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        return c.body(error.message, 500);
      }
    }
  }
  async changeDisplayName(c: Context) {
    const requestData: ConvertedUser = await c.req.json();
    const me: User = await this.getMeFromContext(c);
    if (!requestData.displayname) {
      return c.body("Displayname is required", 400);
    }
    me.setDisplayName(requestData.displayname);
    try {
      await this.userRepository.save(me);
    } catch (error) {
      if (error instanceof Error) {
        return c.body(error.message, 500);
      }
    }
    return c.body(null, 204);
  }
  async create(c: Context) {
    try {
      c.res.headers.set("Access-Control-Allow-Origin", "*");
      const requestData: ConvertedUser = await c.req.json();
      this.confirmCredentials(requestData);
      const [username, plainPassword] = requestData.credentials.split(":");

      const newUser = new User(
        await UserCredential.create(username, plainPassword),
        requestData.displayname,
        requestData.id,
      );

      await this.userRepository.save(newUser);
      return c.body(null, 201);
    } catch (error) {
      if (error instanceof Error) {
        return c.body(error.message, 500);
      }
    }
  }
}
