import { Displayable } from "../interfaceTypes/Displayable.ts";
import { Group } from "./Group.ts";
import { Invitation } from "./Invitation.ts";
import { Service } from "./Service.ts";
import { UserCredential } from "./UserCredential.ts";
import { WrongReceiverError } from "../errors/WrongReceiverError.ts";
//import { ConvertedUser } from "../types/types.ts";
import { Entity } from "../interfaceTypes/Entity.ts";
import { NameTooLong as NameTooLongError } from "../errors/NameTooLongError.ts";
import { AllowedUserGroupMap } from "./AllowedUserGroupMap.ts";
import { ConvertedUser } from "../types/ConvertedUser.ts";
import { AllowedUserServiceMap } from "./AllowedUserServiceMap.ts";
export class User implements Displayable, Entity {
  private constructor(
    private credentials: UserCredential,
    private displayName: string = "",
    private readonly id = crypto.randomUUID(),
    //callableService includes owned and used Services of an User
    private callableService: AllowedUserServiceMap[] = [],
    private groups: Group[] = [],
    private userGroupInvitations: Invitation<Group, User>[] = [],
    //..includes owned and used
    private joinedGroups: AllowedUserGroupMap[] = [],
  ) {}
  getId(): string {
    return this.id;
  }
  getDisplayName(): string {
    return this.displayName;
  }
  listServices(owned = false): string[] {
    const mapCallback = (currentElement: AllowedUserServiceMap): string =>
      currentElement.serviceId;
    if (owned) {
      return this.callableService.filter((currentElement) =>
        currentElement.isOwner
      ).map(mapCallback);
    }
    return this.callableService.map(mapCallback);
  }
  listJoinedGroups(owned = false): string[] {
    const mapCallback = (currentElement: AllowedUserGroupMap): string =>
      currentElement.groupId;
    if (owned) {
      return this.joinedGroups.filter((currentElement) =>
        currentElement.isOwner
      ).map(mapCallback);
    }
    return this.joinedGroups.map(mapCallback);
  }

  // exception! Unique Username(rules like lenght, what kind of special characters, ..)
  static createUser(credentials: UserCredential, displayName: string) {
    if (User.stringToLong(displayName)) {
      throw new NameTooLongError(
        "Your Username is too long, please use a Name with max 40 characters.",
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
        `This isn't User ${receiver.getDisplayName()}`,
      );
    }
    this.userGroupInvitations.push(newInvite);
  }
  removeInvitation(invite: Invitation<Group, User>) {
    this.userGroupInvitations = this.userGroupInvitations.filter(
      (currInvitation) => {
        return currInvitation.equals(invite);
      },
    );
  }
  changeUserCredentials(_newCredentials: UserCredential) {}

  listUserGroupInvitation(): Invitation<Group, User>[] {
    return [...this.userGroupInvitations];
  }
  requestAuthorization(_newService: Service) {}

  toJsonString(): string {
    return JSON.stringify(this.toConvertedUser());
  }
  private toConvertedUser(): ConvertedUser {
    return {
      credentials: this.credentials.toString(),
      displayname: this.displayName,
      owned: this.listServices(true),
      callable: this.listServices(),
      userGroupInvitations: this.userGroupInvitations.map((e) => e.toString()),
      ownedGroups: this.listJoinedGroups(true),
      groups: this.listJoinedGroups(),
    };
  }

  toJson(): ConvertedUser {
    return this.toConvertedUser();
  }
}
