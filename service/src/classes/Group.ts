import { WrongReceiverError } from "../errors/WrongReceiverError.ts";
import { Displayable } from "../interfaces/Displayable.ts";
import { Invitation } from "./Invitation.ts";
import { Service } from "./Service.ts";
import { User } from "./User.ts";

export class Group implements Displayable {
  private constructor(
    private groupname: string,
    // private groupList: Group[] = []
    private owner: User,
    private users: User[] = [],
    private serviceList: Service[] = [],
    private sentInvitations: Invitation<Group, User>[] = [],
    private serviceInvitations: Invitation<Service, Group>[] = []
  ) {}
  getDisplayName(): string {
    return this.groupname;
  }
  listServiceInvitation(): Invitation<Service, Group>[] {
    return [...this.serviceInvitations];
  }
  listSentInvitation(): Invitation<Group, User>[] {
    return [...this.sentInvitations];
  }
  static createUserGroup(groupname: string, owner: User): Group {
    // if(this.groupAlreadyExists(groupname))
    return new Group(groupname, owner);
  }
  sendInvitation(receiver: User) {
    const invite: Invitation<Group, User> = new Invitation(
      this.owner,
      this,
      receiver
    );
    this.sentInvitations.push(invite);
    receiver.addInvitation(invite);
  }
  addServiceInvitation(newServiceInvite: Invitation<Service, Group>) {
    const receiver = newServiceInvite.getReceiverReference();
    if (receiver != this) {
      throw new WrongReceiverError(
        `This is not Group: ${receiver.getDisplayName()}`
      );
    }
    this.serviceInvitations.push(newServiceInvite);
  }
  removeServiceInvitation(invitation: Invitation<Service, Group>) {
    this.serviceInvitations = this.serviceInvitations.filter(
      (currInvitation) => {
        return currInvitation != invitation;
      }
    );
  }
  removeService(service: Service) {
    this.serviceList = this.serviceList.filter(
      (currService) => service != currService
    );
  }
}
