import { Group } from "./Group.ts";
import { User } from "./User.ts";

export class Service{
    servicename: string;
    credentials: ServiceCredential;

    authorized: User[];
    users: User[];
    groups: Group[];
    invitation: Invitation[];

    static createService(:string, :User, :ServiceCredentials): Service;
    giveAuthorizationToUser(userFromList: User);
    sendInvitation(:Group?);
    deleteService();
    callService();
}