export class UserCredentials {
  constructor(
    private readonly username: string,
    private readonly password: string
  ) {}
  toString() {
    return this.username + "&" + this.password;
  }
}
