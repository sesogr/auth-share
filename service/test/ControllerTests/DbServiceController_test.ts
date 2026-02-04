import { ServiceController } from "../../src/controller/ServiceController.ts";
import { DbServiceRepository } from "../../src/classes/Repositories/DenoDB/DbServiceRepository.ts";
import { DbUserRepository } from "../../src/classes/Repositories/DenoDB/DbUserRepository.ts";
import { Database, MySQLConnector } from "@denodb";
import { DbGroup } from "../../src/classes/Repositories/DenoDB/Models/DbGroup.ts";
import { DbGroupService } from "../../src/classes/Repositories/DenoDB/Models/DbGroupService.ts";
import { DbIdDisplayname } from "../../src/classes/Repositories/DenoDB/Models/DbIdDisplayname.ts";
import { DbInvitation } from "../../src/classes/Repositories/DenoDB/Models/DbInvitation.ts";
import { DbService } from "../../src/classes/Repositories/DenoDB/Models/DbService.ts";
import { DbServiceCredential } from "../../src/classes/Repositories/DenoDB/Models/DbServiceCredentials.ts";
import { DbUser } from "../../src/classes/Repositories/DenoDB/Models/DbUser.ts";
import { DbUserCredential } from "../../src/classes/Repositories/DenoDB/Models/DbUserCredentials.ts";
import { DbUserGroup } from "../../src/classes/Repositories/DenoDB/Models/DbUserGroup.ts";
import { DbUserService } from "../../src/classes/Repositories/DenoDB/Models/DbUserService.ts";
import { setupManyToMany } from "../../src/classes/Repositories/DenoDB/Models/setupManyToMany.ts";
import { assertGreater } from "@std/assert";
import { Context } from "@hono/hono";
Deno.test("DbUserController", async (_t) => {
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
  const serviceController = new ServiceController(
    new DbServiceRepository(),
    new DbUserRepository(),
  );
  const mockContext = {
    req: {},
    res: {},
    json: (e: object) => e,
  } as unknown as Context;

  const serviceList =
    (await serviceController.listMyServices(mockContext)) as unknown as [];

  assertGreater(serviceList.length, 0);

  db.close();
});
