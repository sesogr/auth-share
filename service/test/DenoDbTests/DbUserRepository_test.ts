import { DbUserRepository } from "../../src/classes/Repositories/DenoDB/DbUserRepository.ts";
import { assertEquals, assertInstanceOf } from "@std/assert";
import { User } from "../../src/classes/User.ts";
import { UserRepository } from "../../src/interfaceTypes/UserRepository.ts";
import { Database, MySQLConnector } from "@denodb";
import { DbGroup } from "../../src/classes/Repositories/DenoDB/Models/DbGroup.ts";
import {
  DbGroupService,
} from "../../src/classes/Repositories/DenoDB/Models/DbGroupService.ts";
import { DbIdDisplayname } from "../../src/classes/Repositories/DenoDB/Models/DbIdDisplayname.ts";
import { DbInvitation } from "../../src/classes/Repositories/DenoDB/Models/DbInvitation.ts";
import { DbService } from "../../src/classes/Repositories/DenoDB/Models/DbService.ts";
import { DbServiceCredential } from "../../src/classes/Repositories/DenoDB/Models/DbServiceCredentials.ts";
import { DbUser } from "../../src/classes/Repositories/DenoDB/Models/DbUser.ts";
import { DbUserCredential } from "../../src/classes/Repositories/DenoDB/Models/DbUserCredentials.ts";
import {
  DbUserGroup,
} from "../../src/classes/Repositories/DenoDB/Models/DbUserGroup.ts";
import {
  DbUserService,
} from "../../src/classes/Repositories/DenoDB/Models/DbUserService.ts";
import { setupManyToMany } from "../../src/classes/Repositories/DenoDB/Models/setupManyToMany.ts";
import fakeUser from "../../../testuser.json" with { type: "json" };
import { UserCredential } from "../../src/classes/UserCredential.ts";
const connector = new MySQLConnector({
  database: "authshare",
  host: "localhost",
  username: "authshare",
  password: "5ES2#7PhHZplRm",
  port: 13006,
});
const db = new Database(connector);
setupManyToMany();
db.link([
  DbUser,
  DbService,
  DbGroup,
  DbUserService,
  DbUserCredential,
  DbServiceCredential,
  DbUserGroup,
  DbGroupService,
  DbInvitation,
  DbIdDisplayname,
]);

Deno.test("DbUserRepository: hydrate", async () => {
  // Methode aufrufen und erwartetes Ergebnis überprüfen
  const userRepository: UserRepository & {
    hydrate: (id: string) => Promise<User>;
  } = new DbUserRepository();

  const fakeuser: User = new User(
    new UserCredential(
      fakeUser[0].credentials._username,
      fakeUser[0].credentials._password,
    ),
    fakeUser[0].displayname,
    fakeUser[0].id,
    fakeUser[0].callableService,
    fakeUser[0].userGroupInvitations,
    fakeUser[0].joinedGroups,
  );
  const user = await userRepository.hydrate(fakeuser.getId());
  assertInstanceOf(user, User);
  assertEquals(user.getId(), fakeuser.getId());
  assertEquals(user.getDisplayName(), fakeuser.getDisplayName());
  assertEquals(user.listServices().length, fakeuser.listServices().length);
  assertEquals(user.listServices()[0], fakeuser.listServices()[0]);
  assertEquals(
    user.listJoinedGroups().length,
    fakeuser.listJoinedGroups().length,
  );
  assertEquals(user.listJoinedGroups()[0], fakeuser.listJoinedGroups()[0]);
});
