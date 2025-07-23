import { User } from "./User.ts";

export interface Repository {
  getUserList(): User[];
  findUserByName([string]: string): User;
  addNewUser(User: User): boolean;
}
