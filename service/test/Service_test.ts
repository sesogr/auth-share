import { assertArrayIncludes, assertEquals } from "@std/assert";
import { Service } from "../src/classes/Service.ts";
import { ServiceCredential } from "../src/classes/ServiceCredential.ts";
import { User } from "../src/classes/User.ts";
import { UserCredential } from "../src/classes/UserCredential.ts";
function newUser(displayName: string): {
  credentials: { userCred: UserCredential; serviceCred: ServiceCredential };
  user: User;
} {
  const serviceCredential = new ServiceCredential("", "");
  const userCredential = new UserCredential("", "");
  const user = User.createUser(userCredential, displayName);
  return {
    credentials: {
      userCred: userCredential,
      serviceCred: serviceCredential,
    },
    user: user,
  };
}
const user = newUser("Uwe");
const user2 = newUser("Swe");
const service: Service = Service.createService(
  user.credentials.serviceCred,
  "Google",
  user.user,
);
Deno.test("Service Creates with correct Owner", () => {
  const owners: User[] = service.listOwners();
  assertArrayIncludes(owners, [user.user]);
});

Deno.test("lists that should be empty are empty", () => {
  assertEquals(service.listGroups().length + service.listUsers().length, 0);
});

Deno.test(
  "Service Authorize new User successfully puts User into owners",
  () => {
    service.giveAuthorizationToUser(user2.user);
    assertArrayIncludes(service.listOwners(), [user2.user]);
  },
);
