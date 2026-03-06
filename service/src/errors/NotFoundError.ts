export class NotFoundError extends Error {
  constructor(
    readonly target: string,
    readonly by: string,
    readonly key: string,
  ) {
    super(`${target}, not found with ${by}: ${key}`);
    this.name = "NotFoundError";
  }
}
