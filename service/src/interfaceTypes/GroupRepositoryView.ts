import { AllowedUserGroupMap } from "../classes/AllowedUserGroupMap.ts";
import { Group } from "../classes/Group.ts";
import { Invitation } from "../classes/Invitation.ts";
import { User } from "../classes/User.ts";

export type GroupRepositoryView = {
  viewAllowedUser(): AllowedUserGroupMap[];
  viewInvitations(): Invitation<Group, User>[];
};
