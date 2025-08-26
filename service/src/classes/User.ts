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
    private invitedGroups: Invitation<Group, User>[] = [],
    private ownedGroups: Group[] = []
  ) {}

  getDisplayName(): string {
    return this.displayName;
  }

  listOwnedServices(): Service[] {
    return [...this.owned];
  }
  // exception! Unique Username(rules like lenght, what kind of special characters, ..)
  static createUser(credentials: UserCredential, displayName: string) {
    return new User(credentials, displayName);
  }
  static authenticate(credentials: UserCredential): User {
    return new User(credentials);
  }

  addInvitation(newInvite: Invitation<Group, User>) {
    const receiver = newInvite.getReceiverReference();
    if (receiver != this) {
      throw new WrongReceiverError(
        `This isn't User ${receiver.getDisplayName()}`
      );
    }
    this.invitedGroups.push(newInvite);
  }
  removeInvitation(invite: Invitation<Group, User>) {
    this.invitedGroups = this.invitedGroups.filter((currInvitation) => {
      return currInvitation.equals(invite);
    });
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
    return [...this.invitedGroups];
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
}
