import { UserRepository } from "../../../interfaceTypes/UserRepository.ts";
import { User } from "../../User.ts";
import { DbUser } from "./Models/DbUser.ts";
import { DbUserCredential } from "./Models/DbUserCredentials.ts";
import { Database, MySQLConnector } from "@denodb";

export class DbUserRepository implements UserRepository {
  private readonly connector = new MySQLConnector({
    database: Deno.env.get("DB_NAME")!,
    host: Deno.env.get("DB_HOST")!,
    username: Deno.env.get("DB_USER")!,
    password: Deno.env.get("DB_PASSWORD")!,
  });
  constructor() {
    const db = new Database(this.connector);
    db.link([DbUser, DbUserCredential]);
  }
  findById(_id: string): User {
    throw new Error("Method not implemented.");
  }
  findByName(_name: string): User {
    throw new Error("Method not implemented.");
  }
  findAll(): User[] {
    throw new Error("Method not implemented.");
  }
  add(item: User): void {
    DbUser.create({
      displayname: item.getDisplayName(),
      id: item.getId(),
    });
    DbUserCredential.create({
      dbuser_id: item.getId(),
      username: item.getCredentials().username,
      password: item.getCredentials().password,
    });
  }
  removeById(_id: string): void {
    throw new Error("Method not implemented.");
  }
  async save(item: User) {
    if (!(await DbUser.find(item.getId()))) {
      this.add(item);
    }
  }
  hydrate(_item: DbUser): User {
    throw new Error("Method not implemented.");
  }
}
