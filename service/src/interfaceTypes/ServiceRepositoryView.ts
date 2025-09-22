import { AllowedGroupMap } from "../classes/AllowedGroupMap.ts";
import { AllowedUserServiceMap } from "../classes/AllowedUserServiceMap.ts";
import { Group } from "../classes/Group.ts";
import { Invitation } from "../classes/Invitation.ts";
import { Service } from "../classes/Service.ts";

export type ServiceRepositoryView = {
  allowedUser: AllowedUserServiceMap[];
  allowedGroups: AllowedGroupMap[];
  invitedGroups: Invitation<Service, Group>[];
};
