import { Context } from "@hono/hono";
import { StubFullType } from "@stubClass";
import { HonoRequest } from "@hono/hono/request";
import { Stubbed } from "@stubClass";

export class TestContext extends StubFullType<Context> {
  req: Stubbed<HonoRequest> & {
    raw: TestRequest["raw"] & { headers: Raw["headers"] };
  };
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
      req: TestContext["req"] & { raw: TestRequest["raw"] };
      res: TestContext["res"];
    };
  }
  override reset(trueReset?: true) {
    this.req.reset(trueReset);
    this.res.reset(trueReset);
    super.reset(trueReset);
  }
}

class TestRequest extends StubFullType<HonoRequest> {
  raw: Stubbed<HonoRequest["raw"]> & {
    headers: Stubbed<HonoRequest["raw"]["headers"]>;
  };
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
    this.raw = Raw.create();
  }
  static create(): Stubbed<HonoRequest> & {
    raw: Stubbed<HonoRequest["raw"]> & { headers: Raw["headers"] };
  } {
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
class Raw extends StubFullType<HonoRequest["raw"]> {
  headers: Stubbed<HonoRequest["raw"]["headers"]>;
  private constructor() {
    super();
    this.headers = Headers.create();
  }
  static create(): Stubbed<HonoRequest["raw"]> & {
    headers: Stubbed<HonoRequest["raw"]["headers"]>;
  } {
    return new Raw();
  }
}
class Headers extends StubFullType<HonoRequest["raw"]["headers"]> {
  private constructor() {
    super(["get"]);
  }
  static create(): Stubbed<HonoRequest["raw"]["headers"]> {
    return new Headers();
  }
}
export type { TestRequest, TestResponse };
