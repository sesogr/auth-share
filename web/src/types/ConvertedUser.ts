export type ConvertedUser =
  & {
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
