import { AllowedGroupServiceMap } from "../classes/AllowedGroupServiceMap.ts";
import { AllowedUserServiceMap } from "../classes/AllowedUserServiceMap.ts";
import { Group } from "../classes/Group.ts";
import { Invitation } from "../classes/Invitation.ts";
import { Service } from "../classes/Service.ts";

export type ServiceRepositoryView = {
  viewAllowedUser(): AllowedUserServiceMap[];
  viewAllowedGroups(): AllowedGroupServiceMap[];
  viewInvitedGroups(): Invitation<Service, Group>[];
};
