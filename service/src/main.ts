import { Context, Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { FakeObjectGen } from "./FakeObjectGen.ts";
import { User } from "./classes/User.ts";
import { Group } from "./classes/Group.ts";
import { ConvertedGroup, ConvertedService } from "./types/types.ts";
import { Service } from "./classes/Service.ts";
import { Repository } from "./interfaces/Repository.ts";
import { InMemoryServiceRepository } from "./classes/InMemoryServiceRepository.ts";
import { rootController } from "./controller/rootController.ts";
import { dataController } from "./controller/dataController.ts";
import { userController } from "./controller/userController.ts";

export const app = new Hono();
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
//new
export const userList: User[] = [];

for (let i = 0; i < 10; i++) {
  const fakeUser = FakeObjectGen.createFakeUser();
  userList.push(fakeUser);
}

const firstUser = userList[0];

const serviceRepository: Repository<Service> = new InMemoryServiceRepository();
for (let i = 0; i < 3; i++) {
  const _service = FakeObjectGen.createFakeService(firstUser);
  serviceRepository.add(_service);
}

const testGroup: Group[] = [];

for (let i = 0; i < 5; i++) {
  const fakeGroup = FakeObjectGen.createFakeGroup(undefined, userList[i]);
  testGroup.push(fakeGroup);
}
app.get("/", rootController("Trees"));
// Neue Route, die Daten von einer externen URL abruft
app.get("/data", dataController);

app.get("/user", userController);

app.get("/user/owned", (c: Context) => {
  const serviceList = serviceRepository.findOwnedByUserName(
    firstUser.getDisplayName(),
  );
  const convertedList: ConvertedService[] = serviceList.map((e) => e.toJson());
  return c.json(convertedList);
});

app.get("/group", (c: Context) => {
  const convertedGroupList: ConvertedGroup[] = testGroup.map((e) => e.toJson());
  return c.json(convertedGroupList);
});

// Server starten
Deno.serve(app.fetch);
