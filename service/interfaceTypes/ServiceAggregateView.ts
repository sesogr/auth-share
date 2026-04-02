import { AllowedGroupServiceMap } from "../src/classes/Values/AllowedGroupServiceMap.ts";
import { AllowedUserServiceMap } from "../src/classes/Values/AllowedUserServiceMap.ts";
import { Invitation } from "../src/classes/Values/Invitation.ts";

export type ServiceAggregateView = {
  viewAllowedUser(): AllowedUserServiceMap[];
  viewAllowedGroups(): AllowedGroupServiceMap[];
  viewInvitedGroups(): Invitation[];
};
