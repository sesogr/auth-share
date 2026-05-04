import { FakeObjectGen } from "./FakeObjectGen.ts";

Deno.test("lightFakeObjectGen", async () => {
  await FakeObjectGen.createFakeUser();
  await FakeObjectGen.createFakeGroup();
  await FakeObjectGen.createFakeService();
  await FakeObjectGen.createUnvalidatedUser();
  await FakeObjectGen.generateFakeGroups(undefined, 2);
  await FakeObjectGen.generateFakeServices(undefined, 2);
  await FakeObjectGen.generateFakeUsers(2);
});
