import { Context } from "@hono/hono";
//rootController Factory!!
export const rootController = (scene: string) => (c: Context) => {
  return c.text(`Hello from the ${scene} !`);
};
