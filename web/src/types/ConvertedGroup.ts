import type { AllOptional } from "./AllOptional.ts";

type ConvertedGroup = {
  groupname: string;
  owner: string;
} & { [k in GroupListProperties]: string[] };

type GroupListProperties =
  | "users"
  | "serviceList"
  | "sentInvitations"
  | "serviceInvitations";

export type ReceivedConvertedGroup = ConvertedGroup;
export type SendingConvertedGroup = AllOptional<ConvertedGroup>;
