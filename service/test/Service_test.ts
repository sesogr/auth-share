import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Service } from "../src/classes/Service.ts";
import { ServiceCredential } from "../src/classes/ServiceCredential.ts";
import { User } from "../src/classes/User.ts";
import { UserCredential } from "../src/classes/UserCredential.ts";

//Auslagerung der Service-Einstellungen in der Function createTestService
function createTestService(): Service {
  const serviceCredential = new ServiceCredential("", "");
  const userCredential = new UserCredential("", "");
  const user = User.createUser(userCredential, "");
  return Service.createService(serviceCredential, "Google", user);
}

Deno.test(
  "Service should return correct display name when created with valid credentials",
  () => {
    const service = createTestService();
    assertEquals(service.getDisplayName(), "Google");
  }
);
