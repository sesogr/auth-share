import { Invitation } from "./Invitation.ts";
import { Service } from "./Service.ts";
import { UserCredential } from "./UserCredential.ts";
//import { ConvertedUser } from "../types/types.ts";
import { NameTooLong as NameTooLongError } from "../errors/NameTooLongError.ts";
import { AllowedUserGroupMap } from "./AllowedUserGroupMap.ts";
import { ConvertedUser } from "../types/ConvertedUser.ts";
import { AllowedUserServiceMap } from "./AllowedUserServiceMap.ts";
import { Entity } from "./Entity.ts";
import { Session } from "./Session.ts";
export class User extends Entity {
  constructor(
    private credentials: UserCredential,
    private username: string = "",
    protected override readonly id: string = crypto.randomUUID(),
    //callableService includes owned and used Services of an User
    private callableService: AllowedUserServiceMap[] = [],
    private userGroupInvitations: Invitation[] = [],
    //..includes owned and used
    private joinedGroups: AllowedUserGroupMap[] = [],
    private sessions: Session[] = [],
  ) {
    super(id, username);
  }
  //private _validated: boolean;
  //controller ver
  validateSession(sessionToken: string) {
    const sessionId = Session.fromSessionTokenToSessionId(sessionToken);
    const session = this.sessions.find((e) => sessionId == e.id);
    if (session == undefined) {
      throw new Error("Session not found!");
    }
    if (Date.now() >= session.expiresAt.getTime()) {
      this.sessions = this.sessions.filter((e) => !e.equals(session));
      throw new Error("Session is expired");
    }
    // if 15 days are left until the session expires, refresh the session
    if (
      Date.now() >= session.expiresAt.getTime() - Session.REFRESH_INTERVAL_MS
    ) {
      //session.expiresAt = new Date(Date.now() + Session.MAX_DURATION_MS);
    }
  }

  override getId(): string {
    return this.id;
  }
  getCredentials() {
    return this.credentials;
  }
  override getDisplayName(): string {
    return this.username;
  }
  listServices(owned = false): string[] {
    const mapCallback = (currentElement: AllowedUserServiceMap): string =>
      currentElement.servicename;
    if (owned) {
      return this.callableService.filter((currentElement) =>
        currentElement.isOwner
      ).map(mapCallback);
    }
    return this.callableService.map(mapCallback);
  }
  listJoinedGroups(owned = false): string[] {
    const mapCallback = (currentElement: AllowedUserGroupMap): string =>
      currentElement.groupname;
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

  removeInvitation(invite: Invitation) {
    this.userGroupInvitations = this.userGroupInvitations.filter(
      (currInvitation) => {
        return currInvitation.equals(invite);
      },
    );
  }
  changeUserCredentials(_newCredentials: UserCredential) {
    this.credentials = _newCredentials;
  }

  listUserGroupInvitation(): Invitation[] {
    return [...this.userGroupInvitations];
  }
  requestAuthorization(_newService: Service) {}

  toJsonString(): string {
    return JSON.stringify(this.toConvertedUser());
  }
  private toConvertedUser(): ConvertedUser {
    return {
      credentials: this.credentials.toString(),
      displayname: this.username,
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
