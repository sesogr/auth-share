import { Sha256 } from "@std/hash";
import { encodeBase64, encodeHex } from "@std/encoding";

//vielleicht keine Valueclass???

export class Session {
  readonly id: string;
  expiresAt: Date;
  readonly userId: string;

  constructor(
    sessionToken: string,
    userId: string,
  ) {
    const sessionId = Session.fromSessionTokenToSessionId(sessionToken);

    this.id = sessionId;
    this.userId = userId;
    this.expiresAt = new Date(Date.now() + Session.MAX_DURATION_MS);
  }

  //DB Table "Sessions"
  //Session Class done
  //DB Session link to?
  //repository user with sessions --> hydration
  //USer Class new Attributes (session[], passwordhash)
  //salts for every user saved in db --> used
  //authtoken? jsonwebtoken = jwt .. jwtio
  //npm audit tool
  //

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
    const sha = new Sha256();
    sha.update([...new TextEncoder().encode(sessionToken)]);
    const digest = sha.digest(); // Uint8Array
    const hex = encodeHex(new Uint8Array(digest));
    return hex;
  };
}
