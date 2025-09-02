import { Displayable } from "../interfaces/Displayable.ts";
import { Group } from "./Group.ts";
import { Invitation } from "./Invitation.ts";
import { Service } from "./Service.ts";
import { UserCredential } from "./UserCredential.ts";
import { WrongReceiverError } from "../errors/WrongReceiverError.ts";
export class User implements Displayable {
  private constructor(
    private credentials: UserCredential,

    private displayName: string = "",
    private owned: Service[] = [],
    private callable: Service[] = [],
    private groups: Group[] = [],
    private userGroupInvitations: Invitation<Group, User>[] = [],
    private ownedGroups: Group[] = []
  ) {}

  getDisplayName(): string {
    return this.displayName;
  }
  addOwnedGroup(newGroup: Group) {
    this.ownedGroups.push(newGroup);
  }
  listOwnedServices(): Service[] {
    return [...this.owned];
  }
  // exception! Unique Username(rules like lenght, what kind of special characters, ..)
  static createUser(credentials: UserCredential, displayName: string) {
    if (User.stringToLong(displayName)) {
      throw new Error(
        "Your Username is too long, please use a Name with max 40 characters."
      );
    }
    return new User(credentials, displayName);
  }
  private static stringToLong(displayName: string) {
    return displayName.length > 40;
  }

  static authenticate(credentials: UserCredential): User {
    return new User(credentials);
  }

  addInvitation(newInvite: Invitation<Group, User>) {
    const receiver = newInvite.receiverReference;
    if (receiver != this) {
      throw new WrongReceiverError(
        `This isn't User ${receiver.getDisplayName()}`
      );
    }
    this.userGroupInvitations.push(newInvite);
  }
  removeInvitation(invite: Invitation<Group, User>) {
    this.userGroupInvitations = this.userGroupInvitations.filter(
      (currInvitation) => {
        return currInvitation.equals(invite);
      }
    );
  }
  listServices(): Service[] {
    return [...this.callable];
  }
  changeUserCredentials(newCredentials: UserCredential) {}

  listOwnedGroups(): Group[] {
    return [...this.ownedGroups];
  }

  listUserGroups(): Group[] {
    return [...this.groups];
  }

  listUserGroupInvitation(): Invitation<Group, User>[] {
    return [...this.userGroupInvitations];
  }
  addOwnedService(newService: Service) {
    this.owned.push(newService);
  }
  removeOwnedService(service: Service) {
    this.owned = this.owned.filter((e) => e != service);
  }
  removeService(service: Service) {
    this.callable = this.callable.filter((e) => e != service);
  }
  addService(newService: Service) {
    this.callable.push(newService);
  }
  requestAuthorization(newService: Service) {}

  toJsonString(): string {
    return JSON.stringify({
      credentials: this.credentials,
      displayname: this.displayName,
      owned: this.owned.map((e) => e.getDisplayName()),
      callable: this.callable.map((e) => e.getDisplayName()),
      groups: this.groups.map((e) => e.getDisplayName()),
      userGroupInvitations: this.userGroupInvitations.map((e) => e.toString()),
      ownedGroups: this.ownedGroups.map((e) => e.getDisplayName()),
    });
  }
  toJson() {
    return JSON.parse(this.toJsonString());
  }
}
