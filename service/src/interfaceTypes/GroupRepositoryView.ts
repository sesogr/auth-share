import { AllowedUserGroupMap } from "../classes/AllowedUserGroupMap.ts";
import { Invitation } from "../classes/Invitation.ts";

export type GroupRepositoryView = {
  viewAllowedUser(): AllowedUserGroupMap[];
  viewInvitations(): Invitation[];
};
