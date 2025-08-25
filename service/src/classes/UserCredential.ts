export class UserCredential {
  constructor(
    private readonly username: string,
    private readonly password: string
  ) {}
  toString() {
    return `${this.username}:${this.password}`;
  }
  equals(that: UserCredential) {
    return this.toString() === that.toString();
  }
}
