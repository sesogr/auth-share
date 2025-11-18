class testclass1 {
  public get b(): {
    [k in number]: string;
  } {
    return this._b;
  }
  public get a(): string[] {
    return [...this._a];
  }
  constructor(
    private readonly _a: string[],
    private readonly _b: {
      [k in number]: string;
    },
  ) {}

  *[Symbol.iterator]() {
    for (const key in this._b) {
      yield this._b[key];
    }
  }
}

Deno.test("a", () => {
  const startarray: string[] = ["0", "1", "2"];
  const testobject = new testclass1([
    ...startarray,
    "a",
    "b",
    "c",
    "d",
  ], { 0: "a", 1: "b", 2: "c" });
  test(...testobject.a);
  test(...testobject);
});
// spread operator ... macht die eckinen und geschwungenen klammern weg. [1,2,3] -> 1,2,3 . {1:1, 2:2, 3:3} -> 1:1, 2:2, 3:3
function test(...args: string[]) {
  args.forEach((e) => console.log(e));
}
