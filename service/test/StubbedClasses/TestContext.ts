import { Context } from "@hono/hono";
import { StubFullType } from "@stubClass";
import { HonoRequest } from "@hono/hono/request";
import { Stubbed } from "@stubClass";

export class TestContext extends StubFullType<Context> {
  req: Stubbed<HonoRequest>;
  res: Stubbed<Context["res"]>;
  private constructor() {
    super([
      "body",
      "status",
      "setRenderer",
      "setLayout",
      "text",
      "set",
      "render",
      "redirect",
      "notFound",
      "newResponse",
      "json",
      "html",
      "header",
      "getLayout",
      "get",
      "env",
    ]);
    this.req = TestRequest.create();
    this.res = TestResponse.create();
  }

  static create() {
    return new TestContext() as Stubbed<Context> & {
      req: Stubbed<HonoRequest>;
      res: Stubbed<Context["res"]>;
    };
  }
  override reset(trueReset?: true) {
    this.req.reset(trueReset);
    this.res.reset(trueReset);
    super.reset(trueReset);
  }
}

class TestRequest extends StubFullType<HonoRequest> {
  private constructor() {
    super([
      "header",
      "valid",
      "query",
      "queries",
      "parseBody",
      "param",
      "formData",
      "blob",
      "arrayBuffer",
      "addValidatedData",
      "text",
      "json",
    ]);
  }
  static create(): Stubbed<HonoRequest> {
    return new TestRequest();
  }
}

class TestResponse extends StubFullType<Context["res"]> {
  private constructor() {
    super([
      "text",
      "clone",
      "bytes",
      "json",
      "formData",
      "blob",
      "arrayBuffer",
    ]);
  }
  static create(): Stubbed<Context["res"]> {
    return new TestResponse();
  }
}

export type { TestRequest, TestResponse };
