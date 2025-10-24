export class RuntimeError extends Error {
  constructor(message: string = "types arent safe enough safe") {
    super(message);
    this.name = "RuntimeError";
  }
}
