import { Context } from "@hono/hono";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { User } from "../classes/User.ts";
import { UserCredential } from "../classes/UserCredential.ts";
import { ConvertedUser } from "../types/types.ts";
import * as bcrypt from "@bcrypt";
import { setCookie } from "@hono/hono/cookie";

export class UserController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly ME: string,
  ) {}

  async listMyServices(
    c: Context,
  ) {
    const user = await this.userRepository.findById(
      this.ME,
    );
    user.listServices();
    return c.json(
      user.toJson(),
    );
  }

  async read(c: Context) {
    const user = await this.userRepository.findById(
      this.ME,
    );
    return c.json(
      user.toJson(),
    );
  }
  async changePassword(c: Context) {
    const requestData: ConvertedUser = await c.req.json();
    const myself: User = await this.userRepository.findById(this.ME);
    const newPassword: string = requestData.credentials.split(":")[1];
    const { hashedPassword } = await this.hashPassword(
      newPassword,
      myself.getCredentials().salt,
    );

    //TODO we need the loggedin User here!!
    myself.changeUserCredentials(
      myself.getCredentials().with({ "hash": hashedPassword }),
    );
    this.userRepository.save(myself);
    return c.body(null, 204);
  }
  // async create(c: Context) {
  //   try {
  //     c.res.headers.set("Access-Control-Allow-Origin", "*");
  //     const requestData: ConvertedUser = await c.req.json();
  //     const newUser = new User(
  //       new UserCredential(
  //         requestData.credentials.split(":")[0],
  //         requestData.credentials.split(":")[1],

  //       ),
  //       requestData.displayname,
  //       requestData.id,
  //     );
  //     await this.userRepository.save(newUser);
  //     return c.body(null, 201);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       return c.body(error.message, 500);
  //     }
  //   }
  // }
  async logIn(c: Context) {
    try {
      c.res.headers.set("Access-Control-Allow-Origin", "*");
      const requestData: ConvertedUser = await c.req.json();

      const [username, plainPassword] = requestData.credentials.split(":");

      const userToCheck = await this.userRepository.findByUserName(username);

      if (
        await bcrypt.compare(plainPassword, userToCheck.getCredentials().hash)
      ) {
        const { token, session } = userToCheck.createSession();
        this.userRepository.save(userToCheck);
        setCookie(c, "session", token, {
          path: "/",
          secure: true,
          domain: "*",
          httpOnly: true,
          maxAge: 1000,
          expires: session.expiresAt,
          sameSite: "lax" as const,
        });
        return c.body(null, 200);
      } else {
        return c.body(null, 401);
      }
    } catch (error) {
      if (error instanceof Error) {
        return c.body(error.message, 500);
      }
    }
  }
  async create(c: Context) {
    try {
      c.res.headers.set("Access-Control-Allow-Origin", "*");
      const requestData: ConvertedUser = await c.req.json();

      const [username, plainPassword] = requestData.credentials.split(":");

      // Salt generieren (z.B. 12 Runden)
      const { hashedPassword, salt } = await this.hashPassword(plainPassword);

      const newUser = new User(
        new UserCredential(
          username,
          hashedPassword,
          salt, // optionales Salt-Feld
        ),
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

  private async hashPassword(plainPassword: string, salt?: string) {
    const saltRounds = 12;
    salt = salt ? salt : await bcrypt.genSalt(saltRounds);

    // Passwort mit Salt hashen
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return { hashedPassword, salt };
  }
}
