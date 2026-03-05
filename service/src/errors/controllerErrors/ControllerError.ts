import { ContentfulStatusCode } from "@hono/hono/utils/http-status";

export class ControllerError extends Error {
  constructor(message: string, readonly errorcode: ContentfulStatusCode) {
    super(message);
    this.name = "ControllerError";
  }
}
