import { AllowedGroupServiceMap } from "../classes/AllowedGroupServiceMap.ts";
import { AllowedUserServiceMap } from "../classes/AllowedUserServiceMap.ts";
import { Invitation } from "../classes/Invitation.ts";

export type ServiceRepositoryView = {
  viewAllowedUser(): AllowedUserServiceMap[];
  viewAllowedGroups(): AllowedGroupServiceMap[];
  viewInvitedGroups(): Invitation[];
};
