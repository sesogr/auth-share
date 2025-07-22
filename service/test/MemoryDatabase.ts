import "../ports/Database.ts";
import { Database, Userinfo } from "../ports/Database.ts";

export class MemoryDatabase implements Database {
  private generateUsers(): Userinfo[] {
    const Userlist: Userinfo[] = [];
    for (let i: number = 1; i < 10; i++) {
      Userlist.push({
        email: `${i}@${i}.de}`,
        name: `name${i}`,
        passwort: `pass1234`,
        twofaref: ``,
      });
    }
    return Userlist;
  }
  getUserinfoList(): Userinfo[] {
    return this.generateUsers();
  }
  getUserinfoByName(name: string): Userinfo {
    const user: Userinfo | undefined = this.generateUsers().find(
      (e) => e.name === name
    );
    if (user === undefined) {
      throw new Error("user not found");
    }
    return user;
  }
}
