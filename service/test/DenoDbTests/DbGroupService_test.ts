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
import { DbServiceRepository } from "../../src/classes/Repositories/DenoDB/DbServiceRepository.ts";
import { DbGroupRepository } from "../../src/classes/Repositories/DenoDB/DbGroupRepository.ts";

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
//Test how DenoDB react --> Integrationstest
Deno.test("DenoDB Update", async () => {
  const serviceRepo = new DbServiceRepository();
  const groupRepo = new DbGroupRepository();
  const groups = await groupRepo.findAll();

  //get an item from servicerepository/database
  const service = await serviceRepo.findById(
    "8fcf4e8d-1014-4bc8-9044-74b00fdac529",
  );
  //oldData from DB
  const _groupServiceModel = await DbGroupService.where(
    "dbserviceId",
    service.getId(),
  )
    .all();
  //newData
  service.giveAuthorizationToGroup(groups[5]);
  //Filter
  const toDelete = _groupServiceModel.filter((e) =>
    service.allowedGroups.every((f) => e.id != f.toString())
  );
  const toSave = service.allowedGroups.filter((e) =>
    _groupServiceModel.every((f) => e.toString() != f.id)
  );
  await Promise.all(toDelete.map((e) => e.delete()));
  await Promise.all(
    toSave.map((e) =>
      DbGroupService.create({
        id: e.toString(),
        dbserviceId: e.serviceId,
        dbgroupId: e.groupId,
      })
    ),
  );
  await db.close();
  //console.log(item.allowedGroups);
  //console.log(item.allowedGroups);
  //change some inside allowedGroupMap
  //update should be dynamic, get old data and compare with new data
  // -> but how to get the old Data
});
