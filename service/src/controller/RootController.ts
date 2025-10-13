import { Context } from "@hono/hono";
import { AllOptional } from "../types/AllOptional.ts";

export class RootController {
  constructor(private readonly scene: string) {}
  sayHelloFromTrees(c: AllOptional<Context>) {
    return c.text!(`Hello from the ${this.scene} !`);
  }
}
