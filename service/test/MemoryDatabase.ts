import "../ports/Repository.ts";
import { Repository } from "../ports/Repository.ts";
import { User } from "../ports/User.ts";
import { UserFacade } from "../src/classes/UserFacade.ts";

export class MemoryDatabase implements Repository {
  private users: User[] = [];
  private static generateUsers(): User[] {
    const userlist: User[] = [];
    for (let i: number = 1; i < 10; i++) {
      userlist.push(
        new UserFacade(`${i}@${i}.de}`, `name${i}`, `pass1234`, ``)
      );
    }
    return userlist;
  }
  constructor() {
    this.users = MemoryDatabase.generateUsers();
  }
  addNewUser(user: User) {
    this.users.push(user);
    return true;
  }
  getUserList(): User[] {
    return this.users;
  }
  findUserByName(name: string): User {
    const user: User | undefined = this.users.find(
      (e: User) => e.getName() === name
    );
    if (user === undefined) {
      throw new Error("user not found");
    }
    return user;
  }
}
