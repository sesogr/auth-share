import { Invitation } from "../src/classes/Values/Invitation.ts";

export type HasInvitations = {
  sentInvitations: Invitation[];
  acceptInvitation: (invitation: Invitation) => void;
};
