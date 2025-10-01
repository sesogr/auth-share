import { AllowedGroupServiceMap } from "../classes/AllowedGroupServiceMap.ts";
import { AllowedUserServiceMap } from "../classes/AllowedUserServiceMap.ts";
import { Invitation } from "../classes/Invitation.ts";

export type ServiceAggregateView = {
  viewAllowedUser(): AllowedUserServiceMap[];
  viewAllowedGroups(): AllowedGroupServiceMap[];
  viewInvitedGroups(): Invitation[];
};
