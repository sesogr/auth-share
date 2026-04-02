import { ValueClass } from "../ValueClass.ts";
import { bcryptAdapter } from "../../adapter/bcryptAdapter.ts";
import { AuthorizationError } from "../errors/controllerErrors/AuthorizationError.ts";
export class UserCredential extends ValueClass<UserCredential> {
  constructor(
    readonly username: string,
    readonly hash: string,
    readonly salt: string,
  ) {
    super();
    Object.freeze(this);
  }
  assertsVerification(b: boolean): asserts b is true {
    if (!b) {
      throw new AuthorizationError("Password or Username incorrect");
    }
  }
  public async verifyPasswordHash(
    plainPassword: string,
  ): Promise<void> {
    const b = await bcryptAdapter.compare(
      plainPassword,
      this.hash,
    );
    this.assertsVerification(b);
  }
  public async changePassword(newPassword: string) {
    //new usercred --> alles alt außer hash neu!!
    const { hashedPassword } = await UserCredential.hashPassword(
      newPassword,
      this.salt,
    );
    //this. und this.with() nicht vergessen!!
    return this.with({ hash: hashedPassword });
  }
  private static async hashPassword(plainPassword: string, salt?: string) {
    const saltRounds = 12;
    salt = salt ? salt : await bcryptAdapter.genSalt(saltRounds);

    // Passwort mit Salt hashen
    const hashedPassword = await bcryptAdapter.hash(plainPassword, salt);
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
