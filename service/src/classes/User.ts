import { Group } from "./Group.ts";
import { Service } from "./Service.ts";

export class User {
  displayName: string;
  //I guess UserCredentials are an Object
  credentials: UserCredentials;
  owned: Service[];
  callable: Service[];
  invitedGroups: Invitation[];
  ownedGroups: Group[];

  listOwnedServices(): Service[] {
    return this.owned;
  }
  static authenticate(UserCredentials): User;
  addInvitation(newInvite: Invitation);
  listServices(): Service[];
  changeUserCredentials(newCredentials: UserCredentials);
  listUserGroups(): Group[];
  listUserGroupInvitation(): Invitation[];
  requestAuthorization(newService: Service);
}
