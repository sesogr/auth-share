export type ConvertedGroup = {
  groupname: string;
  owner: string;
} & { [k in GroupListProperties]: string[] };

type GroupListProperties =
  | "users"
  | "serviceList"
  | "sentInvitations"
  | "serviceInvitations";
