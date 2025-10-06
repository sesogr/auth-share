import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { rootController } from "./controller/rootController.ts";
import { dataController } from "./controller/dataController.ts";
import { serviceController } from "./controller/serviceController.ts";
import { GroupRepository } from "./interfaceTypes/GroupRepository.ts";
import { ServiceRepository } from "./interfaceTypes/ServiceRepository.ts";
import { InMemGroupRepository } from "./classes/Repositories/InMem$Repositories/InMemGroupRepository.ts";
import { InMemServiceRepository } from "./classes/Repositories/InMem$Repositories/InMemServiceRepository.ts";
import { UserRepository } from "./interfaceTypes/UserRepository.ts";
import { FakeObjectGen } from "./FakeObjectGen.ts";
import { createUserController } from "./controller/userController.ts";
import { DbUserRepository } from "./classes/Repositories/DenoDB/DbUserRepository.ts";
import { ServiceAggregateView } from "./interfaceTypes/ServiceAggregateView.ts";

//initialize repositories
const serviceRepository: ServiceAggregateView & ServiceRepository =
  new InMemServiceRepository();
const groupRepository: GroupRepository = new InMemGroupRepository(
  serviceRepository,
);
const userRepository: UserRepository = new DbUserRepository();
// FakeObjectGen.generateFakeUsers().forEach(async (e) =>
//   await userRepository.save(e)
// );
FakeObjectGen.generateFakeGroups().forEach((e) => groupRepository.save(e));
FakeObjectGen.generateFakeServices().forEach((e) => serviceRepository.save(e));
// userRepository.findAll().forEach((e) => {
//   serviceRepository.save(FakeObjectGen.createFakeService(e.convertToShort()));
// });
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

const userController = createUserController(userRepository);
app.get("/user", userController.read);

app.put("/user/me/password", userController.changePassword);

app.get(
  "/user/owned",
  serviceController(serviceRepository, userRepository), //TODO!!! Needs to be fixed!
);

app.put();

app.post("/user", userController.create);

//app.get("/group", groupController);

// Server starten
Deno.serve(app.fetch);
