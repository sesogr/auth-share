export class NotFoundError extends Error {
  override readonly name: "NotFoundError" = "NotFoundError";
  constructor(
    readonly target: string,
    readonly by: string,
    readonly key: string,
  ) {
    super(`${target}, not found with ${by}: ${key}`);
  }
}
