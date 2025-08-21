class Group{
    groupname: string;

    users: User[];
    sentUserInvitations: Invitation[];

    listServiceInvitation(): Invitation[];
    static createUserGroup(: groupname,): Group;
    sendInvitation(: User);
    addServiceInvitation(: Invitation);
}