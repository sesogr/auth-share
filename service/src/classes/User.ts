import { Group } from "./Group.ts";
import { Invitation } from "./Invitation.ts";
import { Service } from "./Service.ts";
import { UserCredential } from "./UserCredential.ts";

export class User {
  private constructor(
    private credentials: UserCredential,

    private displayName: string = "",
    private owned: Service[] = [],
    private callable: Service[] = [],
    private groups: Group[] = [],
    private invitedGroups: Invitation[] = [],
    private ownedGroups: Group[] = []
  ) {}

  listOwnedServices(): Service[] {
    return this.owned;
  }
  static createUser(credentials: UserCredential, displayName: string) {
    return new User(credentials, displayName);
  }
  static authenticate(credentials: UserCredential): User {
    return new User(credentials);
  }

  addInvitation(newInvite: Invitation) {
    this.invitedGroups.push(newInvite);
  }

  listServices(): Service[] {
    return this.callable;
  }
  changeUserCredentials(newCredentials: UserCredential) {}

  listOwnedGroups(): Group[] {
    return this.ownedGroups;
  }

  listUserGroups(): Group[] {
    return this.groups;
  }

  listUserGroupInvitation(): Invitation[] {
    return this.invitedGroups;
  }
  requestAuthorization(newService: Service) {}
}
