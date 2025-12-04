import { ValueClass } from "./ValueClass.ts";
import * as bcrypt from "@bcrypt";
export class UserCredential extends ValueClass<UserCredential> {
  constructor(
    readonly username: string,
    readonly hash: string,
    readonly salt: string,
  ) {
    super();
  }
  public name(_newPassword: string) {
    //neuen usercred --> alles alt außer hash neu!!
    //this. und this.with() nicht vergessen!!
  }
  private static async hashPassword(plainPassword: string, salt?: string) {
    const saltRounds = 12;
    salt = salt ? salt : await bcrypt.genSalt(saltRounds);

    // Passwort mit Salt hashen
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return { hashedPassword, salt };
  }
  static async create(username: string, plainPassword: string) {
    // Salt generieren (z.B. 12 Runden)
    const { hashedPassword, salt } = await this.hashPassword(plainPassword);
    return new UserCredential(
      username,
      hashedPassword,
      salt, // optionales Salt-Feld
    );
  }
}

// Deno.test("jdsj", () => {
//   console.log(new UserCredential("a", "b").toString());
// });
//Deno.test("With from valueClass", () => {
//  console.log(new UserCredential("a", "b").with({ "username": "c" }));
//});
