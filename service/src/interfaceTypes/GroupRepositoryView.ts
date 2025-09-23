import { AllowedUserGroupMap } from "../classes/AllowedUserGroupMap.ts";

export type GroupRepositoryView = {
  viewAllowedUser(): AllowedUserGroupMap[];
};
