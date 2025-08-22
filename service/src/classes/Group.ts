import { Invitation } from "./Invitation.ts";
import { User } from "./User.ts";

export class Group {
  private constructor(
    private groupname: string,
    private owner: User,
    private users: User[] = [],
    private sentUserInvitations: Invitation[] = [],
    private serviceInvitations: Invitation[] = []
  ) {}
  listServiceInvitation(): Invitation[] {
    return [...this.serviceInvitations];
  }
  listSentUserInvitation(): Invitation[] {
    return [...this.sentUserInvitations];
  }
  static createUserGroup(groupname: string, owner: User): Group {
    return new Group(groupname, owner);
  }
  sendInvitation(receiver: User) {
    const invite: Invitation = new Invitation(
      this.groupname,
      this.owner.getDisplayName()
    );
    receiver.addInvitation(invite);
  }
  addServiceInvitation(newServiceInvite: Invitation) {
    this.serviceInvitations.push(newServiceInvite);
  }
}
