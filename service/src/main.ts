import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { rootController } from "./controller/rootController.ts";
import { dataController } from "./controller/dataController.ts";
import { serviceController } from "./controller/serviceController.ts";
import { GroupRepository } from "./interfaceTypes/GroupRepository.ts";
import { ServiceRepository } from "./interfaceTypes/ServiceRepository.ts";
import { InMemGroupRepository } from "./classes/Repositories/InMem$Repositories/InMemGroupRepository.ts";
import { InMemServiceRepository } from "./classes/Repositories/InMem$Repositories/InMemServiceRepository.ts";
import { InMemUserRepository } from "./classes/Repositories/InMem$Repositories/InMemUserRepository.ts";
import { UserRepository } from "./interfaceTypes/UserRepository.ts";
import { FakeObjectGen } from "./FakeObjectGen.ts";
import { userController } from "./controller/userController.ts";

//initialize repositories
const serviceRepository: ServiceRepository = new InMemServiceRepository();
const groupRepository: GroupRepository = new InMemGroupRepository(
  serviceRepository,
);
const userRepository: UserRepository = new InMemUserRepository(
  serviceRepository,
  groupRepository,
);
FakeObjectGen.generateFakeUsers().forEach((e) => userRepository.save(e));
FakeObjectGen.generateFakeGroups().forEach((e) => groupRepository.save(e));
FakeObjectGen.generateFakeServices().forEach((e) => serviceRepository.save(e));
userRepository.findAll().forEach((e) => {
  serviceRepository.save(FakeObjectGen.createFakeService(e.convertToShort()));
});
export const app = new Hono();
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.get("/", rootController("Trees"));

app.get("/data", dataController);

app.get("/user", userController(userRepository));

app.get(
  "/user/owned",
  serviceController(serviceRepository, userRepository), //TODO!!! Needs to be fixed!
);

//app.get("/group", groupController);

// Server starten
Deno.serve(app.fetch);
