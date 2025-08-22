import { User } from "./User.ts";

export class Group{
    groupname: string;

    users: User[];
    sentUserInvitations: Invitation[];

    listServiceInvitation(): Invitation[];
    static createUserGroup(: groupname,): Group;
    sendInvitation(: User);
    addServiceInvitation(: Invitation);
}