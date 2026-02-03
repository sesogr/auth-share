import { assert } from "node:console";
import { ValueClass } from "../../src/classes/ValueClass.ts";
import { assertEquals, assertInstanceOf, assertThrows } from "@std/assert";
class TestValueClass extends ValueClass<TestValueClass> {
  constructor(readonly a: number, readonly b: number) {
    super();
  }
}

Deno.test("ValueClass", async (t) => {
  const valueobj = new TestValueClass(123, 123);
  await t.step("creation and methods", () => {
    assertInstanceOf(valueobj, TestValueClass);
    assert(valueobj.equals(valueobj.copy()));
    assertEquals(valueobj.with({ "a": 232 }).a, 232);
    assertEquals("123:123", valueobj.toString());
  });
  await t.step("error from with", () => {
    assertThrows(() => {
      valueobj.with({ "c": "asdfk" });
    });
  });
});
