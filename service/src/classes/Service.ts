import { Group } from "./Group.ts";
import { Invitation } from "./Invitation.ts";
import { ServiceCredential } from "./ServiceCredential.ts";
import { User } from "./User.ts";

export class Service {
  private constructor(
    private credentials: ServiceCredential,

    private serviceName: string = "",
    private owners: User[] = [],
    private users: User[] = [],
    private groups: Group[] = [],
    private invitation: Invitation[] = []
  ) {}

  static createService(
    credentials: ServiceCredential,
    serviceName: string,
    serviceOwner: User
  ): Service {
    const service = new Service(credentials, serviceName);
    service.owners.push(serviceOwner);
    serviceOwner.addOwnedService(service);
    return service;
  }
  giveAuthorizationToUser(userFromList: User) {}

  sendInvitation(receiver: Group, sender: User = this.owners[0]) {
    const invitation = new Invitation(
      sender.getDisplayName(),
      this.serviceName
    );
    receiver.addServiceInvitation(invitation);
  }
  deleteService() {}
  callService() {}
}
