import { AllowedUserGroupMap } from "../src/classes/Values/AllowedUserGroupMap.ts";
import { Invitation } from "../src/classes/Values/Invitation.ts";

export type GroupAggregateView = {
  viewAllowedUser(): AllowedUserGroupMap[];
  viewInvitations(): Invitation[];
};
