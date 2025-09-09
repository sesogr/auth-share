import { Displayable } from "../interfaces/Displayable.ts";
import { ConvertedService } from "../types/types.ts";
import { Group } from "./Group.ts";
import { Invitation } from "./Invitation.ts";
import { ServiceCredential } from "./ServiceCredential.ts";
import { User } from "./User.ts";

export class Service implements Displayable {
  private constructor(
    private credentials: ServiceCredential,
    private serviceName: string = "",
    private owners: User[] = [],
    private users: User[] = [],
    private groups: Group[] = [],
    private sentInvitations: Invitation<Service, Group>[] = [], //private services or callable: Service[] = []
  ) {}
  getDisplayName(): string {
    return this.serviceName;
  }
  listUsers(): User[] {
    return [...this.users];
  }
  listGroups(): Group[] {
    return [...this.groups];
  }
  listOwners(): User[] {
    return [...this.owners];
  }
  // createService should also have an exception
  static createService(
    credentials: ServiceCredential,
    serviceName: string,
    serviceOwner: User,
  ): Service {
    /*if(this.serviceIsInList(serviceName)) {
      throw new Error(
        `The service called ${serviceName} is already found in the callable list.`
      )
    }
    */
    const service = new Service(credentials, serviceName);
    service.owners.push(serviceOwner);
    serviceOwner.addOwnedService(service);
    //service.services or callable.push(service);
    return service;
  }
  giveAuthorizationToUser(userFromList: User) {
    this.owners.push(userFromList);
  }

  sendInvitation(receiver: Group, sender: User = this.owners[0]) {
    if (this.receiverIsInGroups(receiver)) {
      throw new Error(
        `The group ${receiver.getDisplayName()} is already using the service ${this.getDisplayName()}!`,
      );
    }
    const invitation = new Invitation<Service, Group>(sender, this, receiver);
    this.sentInvitations.push(invitation);
    receiver.addServiceInvitation(invitation);
  }
  deleteService() {
    this.users.forEach((currUser) => {
      currUser.removeService(this);
    });
    this.groups.forEach((currGroup) => {
      currGroup.removeService(this);
    });
    /*this.invitation.forEach((currInvitation)=> {
    currInvitation.
  })*/
  }

  callService() {}

  receiverIsInGroups(receiver: Group): boolean {
    return this.groups.includes(receiver);
  }
  toJsonString(): string {
    return JSON.stringify(this.convertToSerializeableObj());
  }
  private convertToSerializeableObj(): ConvertedService {
    return {
      serviceName: this.serviceName,
      credentials: this.credentials.toString(),
      users: this.users.map((e) => e.getDisplayName()),
      owners: this.owners.map((e) => e.getDisplayName()),
      groups: this.groups.map((e) => e.getDisplayName()),
      sentInvitations: this.sentInvitations.map((e) => e.toString()),
    };
  }

  toJson() {
    return this.convertToSerializeableObj();
  }
  /*serviceIsInList(serviceName: string): boolean{
  return this.services.includes(serviceName);
}*/
}
