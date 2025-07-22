import { User } from "../../ports/User.ts";
export class UserFacade implements User {
  private authenticated: boolean = false;
  constructor(
    private name: string,
    private password: string,
    private email: string,
    private twofa: string = ""
  ) {}
  getName(): string {
    return this.name;
  }
  auth(passwordhash: string): boolean {
    if (passwordhash === this.password) {
      this.authenticated = true;
      return true;
    }
    throw Error;
  }
}
