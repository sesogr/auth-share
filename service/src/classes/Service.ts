import { Displayable } from "../interfaceTypes/Displayable.ts";
import { Entity } from "../interfaceTypes/Entity.ts";
import { Group } from "./Group.ts";
import { Invitation } from "./Invitation.ts";
import { ServiceCredential } from "./ServiceCredential.ts";

export class Service implements Displayable, Entity {
  public get sentInvitations(): Invitation<Service, Group>[] {
    return this._sentInvitations;
  }
  public set sentInvitations(value: Invitation<Service, Group>[]) {
    this._sentInvitations = value;
  }
  public get credentials(): string {
    return this._credentials.toString();
  }
  public set credentials(value: ServiceCredential) {
    this._credentials = value;
  }
  constructor(
    private _credentials: ServiceCredential,
    private serviceName: string = "",
    private readonly id = crypto.randomUUID(),
    private groups: Group[] = [],
    private _sentInvitations: Invitation<Service, Group>[] = [],
  ) {
  }
  getId(): string {
    return this.id;
  }
  getDisplayName(): string {
    return this.serviceName;
  }
  /**
 * sendInvitation(receiver: Group, sender: User = this.owners[0]) {
    if (this.receiverIsInGroups(receiver)) {
      throw new GroupAlreadyAuthorizedError(
        `The group ${receiver.getDisplayName()} is already using the service ${this.getDisplayName()}!`,
      );
    }
    const invitation = new Invitation<Service, Group>(sender, this, receiver);
    this.sentInvitations.push(invitation);
    receiver.addServiceInvitation(invitation);
  }
  */

  callService() {}

  receiverIsInGroups(receiver: Group): boolean {
    return this.groups.includes(receiver);
  }
  /*serviceIsInList(serviceName: string): boolean{
  return this.services.includes(serviceName);
} */
}
