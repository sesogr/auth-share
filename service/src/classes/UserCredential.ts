import { ValueClass } from "./ValueClass.ts";
export class UserCredential extends ValueClass<UserCredential> {
  constructor(
    readonly username: string,
    readonly hash: string,
  ) {
    super();
  }
}

// Deno.test("jdsj", () => {
//   console.log(new UserCredential("a", "b").toString());
// });
Deno.test("With from valueClass", () => {
  console.log(new UserCredential("a", "b").with({ "username": "c" }));
});
