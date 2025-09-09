import { UserCredential } from "../classes/UserCredential.ts";

export type ConvertedUser =
  & {
    credentials: UserCredential;
    displayname: string;
  }
  & {
    [k in UserListProperties]: string[];
  };

type UserListProperties =
  | "owned"
  | "callable"
  | "groups"
  | "userGroupInvitations"
  | "ownedGroups";
