import { AllowedUserGroupMap } from "../classes/AllowedUserGroupMap.ts";
import { Invitation } from "../classes/Invitation.ts";

export type GroupAggregateView = {
  viewAllowedUser(): AllowedUserGroupMap[];
  viewInvitations(): Invitation[];
};
