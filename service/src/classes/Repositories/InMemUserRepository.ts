import { FakeObjectGen } from "../../FakeObjectGen.ts";
import { User } from "../User.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

const groupInvitations: { senderId: string, receiverId: string, groupId: string }[] = [];
export const listGroupInvitations = () => [...groupInvitations];
export class InMemUserRepository extends InMemoryRepository<User> {
  constructor() {
    const userList: User[] = [];
    for (let i = 0; i < 10; i++) {
      const fakeUser = FakeObjectGen.createFakeUser();
      userList.push(fakeUser);
    }
    super(userList);
  }
}
