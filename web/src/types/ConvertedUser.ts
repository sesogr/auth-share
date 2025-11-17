import type { AllOptional } from "./AllOptional.ts";

type ConvertedUser =
  & {
    id: string;
    credentials: string;
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

export type SendingConvertedUser = AllOptional<ConvertedUser>;
export type ReceivedConvertedUser = ConvertedUser;
