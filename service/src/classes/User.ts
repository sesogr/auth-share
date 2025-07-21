import { User } from "../../ports/User.ts";
export class UserFacade implements User {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName(): string {
    return this.name;
  }
}
