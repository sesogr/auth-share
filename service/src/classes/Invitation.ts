export class Invitation {
  constructor(
    private readonly sendername: string,
    private readonly reference: string
  ) {}
  toString() {
    return this.sendername + "&" + this.reference;
  }
}
