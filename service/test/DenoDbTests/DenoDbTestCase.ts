import {Database, MySQLConnector} from "@denodb";
import {DbGroup} from "../../src/classes/Repositories/DenoDB/Models/DbGroup.ts";
import {DbGroupService} from "../../src/classes/Repositories/DenoDB/Models/DbGroupService.ts";
import {DbIdDisplayname} from "../../src/classes/Repositories/DenoDB/Models/DbIdDisplayname.ts";
import {DbInvitation} from "../../src/classes/Repositories/DenoDB/Models/DbInvitation.ts";
import {DbService} from "../../src/classes/Repositories/DenoDB/Models/DbService.ts";
import {DbServiceCredential} from "../../src/classes/Repositories/DenoDB/Models/DbServiceCredentials.ts";
import {DbUser} from "../../src/classes/Repositories/DenoDB/Models/DbUser.ts";
import {DbUserCredential} from "../../src/classes/Repositories/DenoDB/Models/DbUserCredentials.ts";
import {DbUserGroup} from "../../src/classes/Repositories/DenoDB/Models/DbUserGroup.ts";
import {DbUserService} from "../../src/classes/Repositories/DenoDB/Models/DbUserService.ts";
import {setupManyToMany} from "../../src/classes/Repositories/DenoDB/Models/setupManyToMany.ts";

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

    //await createUsers();

    //get "everything" of a User
    const result = await DbUser.leftJoin(
        DbUserCredential,
        DbUserCredential.field("dbuser_id"),
        DbUser.field("id"),
    )
        .leftJoin(
            DbUserService,
            DbUserService.field("dbuser_id"),
            DbUser.field("id"),
        )
        .leftJoin(
            DbInvitation,
            DbInvitation.field("receiver_reference"),
            DbUser.field("id"),
        )
        .leftJoin(DbUserGroup, DbUserGroup.field("dbuser_id"), DbUser.field("id"))
        .where("Users.id", "852050e3-6410-4a71-8f33-3e0244187ae8").groupBy(
            "Users.id",
        ).get();
    console.log("8", result);
    // Groups per User
    const groupsPerUser = await DbUser
        .join(
            DbUserGroup,
            DbUserGroup.field("dbuser_id"),
            DbUser.field("id"),
        )
        .join(
            DbGroup,
            DbGroup.field("id"),
            DbUserGroup.field("dbgroup_id"),
        )
        .where("Users.id", "852050e3-6410-4a71-8f33-3e0244187ae8")
        .count("Groups.id");

    // Nutzungsergebnis prüfen
    console.log("6");
    console.log(groupsPerUser);

    // User with groups
    const usersWithGroups = await DbUser
        .select(
            DbUser.field("id"),
            DbUser.field("displayname"),
        )
        .leftJoin(
            DbUserGroup,
            DbUserGroup.field("dbuser_id"),
            DbUser.field("id"),
        )
        .leftJoin(
            DbGroup,
            DbGroup.field("id"),
            DbUserGroup.field("dbgroup_id"),
        )
        .groupBy(DbUser.field("id"))
        .all();

    // Nutzungsergebnis prüfen
    console.log("5");
    console.log(usersWithGroups);

    //i guess senseless, for the groupname by id i dont need a join
    const groupnameById = await DbGroup.select("groupname").join(
        DbUserGroup,
        DbUserGroup.field("dbgroup_id"),
        DbGroup.field("id"),
    ).where("dbgroup_id", "1db46ad8-26eb-4dbe-8ee5-7d43fad4c30c").first();
    console.log("4");
    console.log(groupnameById);
    //
    const groupnameByUserId = await DbGroup.select("groupname").join(
        DbUserGroup,
        DbUserGroup.field("dbuser_id"),
        DbGroup.field("owner"),
    ).where("dbuser_id", "852050e3-6410-4a71-8f33-3e0244187ae8").first();
    console.log("3");
    console.log(groupnameByUserId);

    const userByGroupId = await DbUser.join(
        DbUserGroup,
        DbUserGroup.field("dbuser_id"),
        DbUser.field("id"),
    ).where("dbgroup_id", "1db46ad8-26eb-4dbe-8ee5-7d43fad4c30c").first();
    console.log("2");
    console.log(userByGroupId);

    const userById = await DbUser.join(
        DbUserCredential,
        DbUserCredential.field("dbuser_id"),
        DbUser.field("id"),
    ).where("id", "testID5").first();
    console.log("1");
    console.log(userById);

    await db.close();
});

// async function createUsers() {
//   try {
//     await DbUser.create(
//       {
//         displayname: "Talkmaster Ricky",
//         id: "testID5",
//       },
//     );

//     await DbUserCredential.create({
//       dbuser_id: "testID5",
//       username: "Talkmaster Ricky",
//       password: "5678",
//     });
//   } catch (error) {
//     if (error.message !== "Duplicate entry 'testID5' for key 'PRIMARY'") {
//       throw error;
//     }
//   }
// }

// await DbUser.create(
//   {
//     displayname: "Talkmaster Ricky",
//     id: "testID5",
//   },
// );

// await DbUserCredential.create({
//   dbuser_id: "testID5",
//   username: "Talkmaster Ricky",
//   password: "5678",
// });

//instead of .create use .update?!

// await DbUser.update({
//   displayname: "Herr Röhrig",
//   id: "wernerBesterMann",
//   where: {
//     id: "15ed8f0d-f3c3-4e6c-84dc-c2c0824741be",
//   },
// });
