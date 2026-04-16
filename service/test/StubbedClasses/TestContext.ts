import { Context } from "@hono/hono";
import { CustomTestStub } from "../CustomTestStub.ts";
import { HonoRequest } from "@hono/hono/request";
import { ClassMethodsOnlyShape } from "../ClassMethodsOnlyShape.ts";

export class TestContext extends CustomTestStub<Context>
  implements ClassMethodsOnlyShape<Context> {
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
  render(...args: unknown[]) {
    return this.fakeProcess(args, "render");
  }
  setLayout(...args: unknown[]) {
    return this.fakeProcess(args, "setLayout");
  }
  setRenderer(...args: unknown[]) {
    return this.fakeProcess(args, "setRenderer");
  }
  header(...args: unknown[]) {
    return this.fakeProcess(args, "header");
  }
  status(...args: unknown[]) {
    return this.fakeProcess(args, "status");
  }
  newResponse(...args: unknown[]) {
    return this.fakeProcess(args, "newResponse");
  }
  text(...args: unknown[]) {
    return this.fakeProcess(args, "text");
  }
  html(...args: unknown[]) {
    return this.fakeProcess(args, "html");
  }
  redirect(...args: unknown[]) {
    return this.fakeProcess(args, "redirect");
  }
  json(...args: unknown[]) {
    return this.fakeProcess(args, "json");
  }
  body(...args: unknown[]) {
    return this.fakeProcess(args, "body");
  }
  get(...args: unknown[]) {
    return this.fakeProcess(args, "get");
  }
  env(...args: unknown[]) {
    return this.fakeProcess(args, "env");
  }
  getLayout(...args: unknown[]) {
    return this.fakeProcess(args, "getLayout");
  }
  set(...args: unknown[]) {
    return this.fakeProcess(args, "set");
  }
  notFound(...args: unknown[]) {
    return this.fakeProcess(args, "notFound");
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

  static override create<T = HonoRequest>(): T & TestRequest {
    return new TestRequest() as T & TestRequest;
  }
  param(...args: unknown[]): unknown {
    return this.fakeProcess(args, "param");
  }
  query(...args: unknown[]): unknown {
    return this.fakeProcess(args, "query");
  }
  queries(...args: unknown[]): unknown {
    return this.fakeProcess(args, "queries");
  }
  header(...args: unknown[]): unknown {
    return this.fakeProcess(args, "header");
  }
  parseBody(...args: unknown[]): unknown {
    return this.fakeProcess(args, "parseBody");
  }
  text(...args: unknown[]): unknown {
    return this.fakeProcess(args, "text");
  }
  arrayBuffer(...args: unknown[]): unknown {
    return this.fakeProcess(args, "arrayBuffer");
  }
  blob(...args: unknown[]): unknown {
    return this.fakeProcess(args, "blob");
  }
  formData(...args: unknown[]): unknown {
    return this.fakeProcess(args, "formData");
  }
  addValidatedData(...args: unknown[]): unknown {
    return this.fakeProcess(args, "addValidatedData");
  }
  valid(...args: unknown[]): unknown {
    return this.fakeProcess(args, "valid");
  }
  json(...args: unknown[]) {
    return this.fakeProcess(args, "json");
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
  static override create<T = Context["res"]>() {
    return new TestResponse() as T & TestResponse;
  }
  clone(...args: unknown[]): unknown {
    return this.fakeProcess(args, "clone");
  }
  arrayBuffer(...args: unknown[]): unknown {
    return this.fakeProcess(args, "arrayBuffer");
  }
  blob(...args: unknown[]): unknown {
    return this.fakeProcess(args, "blob");
  }
  bytes(...args: unknown[]): unknown {
    return this.fakeProcess(args, "bytes");
  }
  formData(...args: unknown[]): unknown {
    return this.fakeProcess(args, "formData");
  }
  text(...args: unknown[]): unknown {
    return this.fakeProcess(args, "text");
  }
  json(...args: unknown[]) {
    return this.fakeProcess(args, "json");
  }
}

export type { TestRequest, TestResponse };
