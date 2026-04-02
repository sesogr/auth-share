import { assertEquals } from "@std/assert";
import { IdNameMap } from "../../src/classes/Values/IdNameMap.ts";
import { Invitation } from "../../src/classes/Values/Invitation.ts";

Deno.test("Invitations", async (t) => {
  const inviter = new IdNameMap("id123", "123");
  const obj = new IdNameMap("id1234", "1234");
  const receiver = new IdNameMap("id1235", "12345");
  await t.step("creation", () => {
    const invite = new Invitation(inviter, obj, receiver, "service");
    assertEquals(invite.receiverName, receiver.displayname);
    assertEquals(invite.receiverId, receiver.id);
    assertEquals(invite.objName, obj.displayname);
    assertEquals(invite.objId, obj.id);
    assertEquals(invite.senderName, inviter.displayname);
    assertEquals(invite.senderId, inviter.id);
    assertEquals(
      invite.toString(),
      `${inviter.displayname}:${obj.displayname}:${receiver.displayname}:s`,
    );
  });
});
