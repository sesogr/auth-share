import { Context } from "@hono/hono";
import { CustomTestStub } from "../CustomTestStub.ts";
import { HonoRequest } from "@hono/hono/request";
import { ClassMethodsOnlyShape } from "../ClassMethodsOnlyShape.ts";

export class TestContext extends CustomTestStub<Context> {
  req: TestRequest;
  res: TestResponse;
  private constructor() {
    super();
    this.initializeStub("json");
    this.initializeStub("body");
    this.initializeStub("get");
    this.initializeStub("set");
    this.initializeStub("notFound");
    this.initializeStub("getLayout");
    this.initializeStub("env");
    this.initializeStub("render");
    this.initializeStub("setLayout");
    this.initializeStub("setRenderer");
    this.initializeStub("header");
    this.initializeStub("status");
    this.initializeStub("newResponse");
    this.initializeStub("text");
    this.initializeStub("html");
    this.initializeStub("redirect");
    this.req = TestRequest.create();
    this.res = TestResponse.create();
  }

  static override create<T = Context>(): T & TestContext {
    return new TestContext() as T & TestContext;
  }
  override reset(trueReset: boolean = false) {
    this.req.reset(trueReset);
    this.res.reset(trueReset);
    super.reset(trueReset);
  }
}

class TestRequest extends CustomTestStub<HonoRequest>
  implements ClassMethodsOnlyShape<HonoRequest> {
  private constructor() {
    super();
    this.initializeStub("json");
    this.initializeStub("text");
    this.initializeStub("param");
    this.initializeStub("query");
    this.initializeStub("queries");
    this.initializeStub("header");
    this.initializeStub("parseBody");
    this.initializeStub("text");
    this.initializeStub("arrayBuffer");
    this.initializeStub("valid");
    this.initializeStub("addValidatedData");
    this.initializeStub("blob");
    this.initializeStub("formData");
  }
  param(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  query(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  queries(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  header(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  parseBody(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  json(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  text(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  arrayBuffer(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  blob(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  formData(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  addValidatedData(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  valid(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }

  static override create<T = HonoRequest>(): T & TestRequest {
    return new TestRequest() as T & TestRequest;
  }
}

class TestResponse extends CustomTestStub<Context["res"]>
  implements ClassMethodsOnlyShape<Context["res"]> {
  private constructor() {
    super();
    this.initializeStub("json");
    this.initializeStub("text");
    this.initializeStub("arrayBuffer");
    this.initializeStub("blob");
    this.initializeStub("formData");
    this.initializeStub("bytes");
    this.initializeStub("clone");
  }
  clone(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  arrayBuffer(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  blob(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  bytes(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  formData(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  json(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  text(..._args: unknown[]): unknown {
    throw new Error("Method not implemented.");
  }
  static override create<T = Context["res"]>() {
    return new TestResponse() as T & TestResponse;
  }
}

export type { TestRequest, TestResponse };
