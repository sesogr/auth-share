import { Context } from "@hono/hono";

export class RootController {
  constructor(private readonly scene: string) {}
  sayHelloFromTrees(c: Context) {
    {
      return c.text!(`Hello from the ${this.scene} !`);
    }
  }
}
