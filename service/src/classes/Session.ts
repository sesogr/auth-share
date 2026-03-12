import { Sha256 } from "@std/hash";
import { encodeBase64, encodeHex } from "@std/encoding";

export class Session {
  constructor(
    readonly id: string,
    public expiresAt: Date,
    readonly userId: string,
  ) {
  }

  static create(sessionToken: string, userId: string) {
    const sessionId = Session.fromSessionTokenToSessionId(sessionToken);
    return new Session(
      sessionId,
      new Date(Date.now() + Session.MAX_DURATION_MS),
      userId,
    );
  }

  //DB Table "Sessions"
  //Session Class done
  //DB Session link to?
  //repository user with sessions --> hydration
  //USer Class new Attributes (session[], password hash)
  //salts for every user saved in db --> used
  //authToken? jsonwebtoken = jwt --> jwtio
  //npm audit tool
  //
  toString() {
    return this.id;
  }

  static generateRandomSessionToken = () => {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    return encodeBase64(bytes);
  };
  static readonly REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15;
  static readonly MAX_DURATION_MS = Session.REFRESH_INTERVAL_MS * 2;

  static readonly fromSessionTokenToSessionId = (
    sessionToken: string,
  ) => {
    if (!(typeof sessionToken === "string")) {
      throw new TypeError("Session token is Missing");
    }
    const sha = new Sha256();
    sha.update([...new TextEncoder().encode(sessionToken)]);
    const digest = sha.digest(); // Uint8Array
    return encodeHex(new Uint8Array(digest));
  };
}
