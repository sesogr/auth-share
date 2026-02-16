import type { AllOptional } from "./AllOptional.ts";

type ConvertedUser =
  & { [k in UserStringProperties]: string }
  & {
    [k in UserListProperties]: string[];
  };

type UserListProperties =
  | "owned"
  | "callable"
  | "groups"
  | "userGroupInvitations"
  | "ownedGroups";

export type UserStringProperties = "id" | "credentials" | "displayname";
export type SendingConvertedUser = AllOptional<ConvertedUser>;
export type ReceivedConvertedUser = ConvertedUser;
