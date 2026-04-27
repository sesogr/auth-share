import type { UserI } from "./UserI.ts";
import type { UserCredential } from "../src/classes/Values/UserCredential.ts";

export type ValidatedUserMethods = {
  setDisplayName(newDisplayName: string): void;
  listServices(owned?: boolean): string[];
  listJoinedGroups(): string[];
  changeUserCredentials(newCredentials: UserCredential): void;
};
export type ValidatedUser = UserI & ValidatedUserMethods;
