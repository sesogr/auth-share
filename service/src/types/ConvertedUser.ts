export type ConvertedUser =
  & {
    id?: string;
    credentials?: `${string}:${string}` | string;
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
