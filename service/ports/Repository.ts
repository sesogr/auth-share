import { User } from "./User.ts";

export interface Repository {
  getUserList(): User[];
  findUserByName(name: string): User;
  addNewUser(user: User): boolean;
}
