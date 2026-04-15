import { Context } from "@hono/hono";
import { CustomTestStub } from "../CustomTestStub.ts";
import { HonoRequest } from "@hono/hono/request";
type JsonArgs = [unknown, number?];
type BodyArgs = [unknown, number?];

export class TestContext extends CustomTestStub<Context> {
  req: TestRequest;
  res: TestResponse;
  private constructor() {
    super();
    this.initializeStub("json");
    this.initializeStub("body");
    this.initializeStub("get");
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
  json(...args: JsonArgs) {
    return this.fakeProcess(args, "json");
  }
  body(...args: BodyArgs) {
    return this.fakeProcess(args, "body");
  }
  get(...args: unknown[]) {
    return this.fakeProcess(args, "get");
  }
}

class TestRequest extends CustomTestStub<HonoRequest> {
  private constructor() {
    super();
    this.initializeStub("json");
  }
  static override create<T = HonoRequest>(): T & TestRequest {
    return new TestRequest() as T & TestRequest;
  }
  json(...args: never) {
    return this.fakeProcess(args, "json");
  }
}

class TestResponse extends CustomTestStub<Context["res"]> {
  private constructor() {
    super();
    this.initializeStub("json");
  }
  static override create<T = Context["res"]>() {
    return new TestResponse() as T & TestResponse;
  }
  json(...args: never) {
    return this.fakeProcess(args, "json");
  }
}

export type { TestRequest, TestResponse };
