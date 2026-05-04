import type { UserI } from "./UserI.ts";
import type { UserCredential } from "../src/classes/Values/UserCredential.ts";
import { Invitation } from "../src/classes/Values/Invitation.ts";

export type ValidatedUserMethods = {
  setDisplayName(newDisplayName: string): void;
  listServices(owned?: boolean): string[];
  listJoinedGroups(): string[];
  changeUserCredentials(newCredentials: UserCredential): void;
  listUserGroupInvitation(): Invitation[];
};
export type ValidatedUser = UserI & ValidatedUserMethods;
