import { assertEquals } from "https://deno.land/std@0.104.0/testing/asserts.ts";
import { assertInstanceOf } from "https://deno.land/std@0.224.0/assert/assert_instance_of.ts";
import { DbUserRepository } from "../../src/classes/Repositories/DenoDB/DbUserRepository.ts";
import { User } from "../../src/classes/User.ts";
import { UserRepository } from "../../src/interfaceTypes/UserRepository.ts";

Deno.test("DbUserRepository: hydrate", async () => {
  // Methode aufrufen und erwartetes Ergebnis überprüfen
  const userRepository: UserRepository & {
    hydrate: (id: string) => Promise<User>;
  } = new DbUserRepository();
  const user = await userRepository.hydrate("testID1");
  assertInstanceOf(user, User);
  assertEquals(user.getId(), "testID1");
  assertEquals(user.getDisplayName(), "Hans Meiser");
  assertEquals(user.listServices().length, 1);
  assertEquals(user.listServices()[0], "MyService");
  assertEquals(user.listJoinedGroups().length, 1);
  assertEquals(user.listJoinedGroups()[0], "TestGroup1");
});
