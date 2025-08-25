import { Displayable } from "../interfaces/Displayable.ts";
import { Invitation } from "./Invitation.ts";
import { Service } from "./Service.ts";
import { User } from "./User.ts";

export class Group implements Displayable {
  private constructor(
    private groupname: string,
    private owner: User,
    private users: User[] = [],
    private serviceList: Service[] = [],
    private sentUserInvitations: User[] = [],
    private serviceInvitations: Invitation<Service>[] = []
  ) {}
  getDisplayName(): string {
    return this.groupname;
  }
  listServiceInvitation(): Invitation<Service>[] {
    return [...this.serviceInvitations];
  }
  listSentUserInvitation(): User[] {
    return [...this.sentUserInvitations];
  }
  static createUserGroup(groupname: string, owner: User): Group {
    return new Group(groupname, owner);
  }
  sendInvitation(receiver: User) {
    const invite: Invitation<Group> = new Invitation(
      this.owner.getDisplayName(),
      this
    );
    this.sentUserInvitations.push(receiver);
    receiver.addInvitation(invite);
  }
  addServiceInvitation(newServiceInvite: Invitation<Service>) {
    this.serviceInvitations.push(newServiceInvite);
  }
  removeServiceInvitation(serviceInvite: Service) {
    this.serviceInvitations = this.serviceInvitations.filter((e) => {
      return e.getReference() != serviceInvite;
    });
  }
  removeService(service: Service) {
    this.serviceList = this.serviceList.filter(
      (currService) => service != currService
    );
  }
}
