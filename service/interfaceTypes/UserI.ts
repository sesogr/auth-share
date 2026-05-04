import type { Session } from "../src/classes/Session.ts";
import type { UserCredential } from "../src/classes/Values/UserCredential.ts";
import type { DisplayableEntity } from "./DisplayableEntity.ts";
import type { ValidatedUser } from "./ValidatedUser.ts";
import { ConvertedUser } from "../src/types/ConvertedUser.ts";

export type UserI = DisplayableEntity & {
  sessions: Session[];
  getCredentials(): UserCredential;
  validateSession(sessionToken: string): asserts this is ValidatedUser;
  deleteSessionByToken: (sessionToken: string) => void;
  deleteSession(session: Session): void;
  checkValidation(): asserts this is ValidatedUser;
  createSession(): { token: string; session: Session };
  toJson(): ConvertedUser;
  toJsonString(): string;
  listServices(owned?: boolean): string[];
  listJoinedGroups(): string[];
};
