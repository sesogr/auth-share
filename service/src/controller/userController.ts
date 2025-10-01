import { Context } from "@hono/hono";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { User } from "../classes/User.ts";
import { UserCredential } from "../classes/UserCredential.ts";
import { User as DbUser } from "../classes/Repositories/DenoDB/Models/DbUser.ts";
import { UserCredential as DbUserCredential } from "../classes/Repositories/DenoDB/Models/DbUser.ts";

export const userController = (
  userRepository: UserRepository,
) => ({
  read: async (c: Context) => {
    const user = await DbUser.where(
      "id",
      "testID1",
    ).get();
    if (!Array.isArray(user)) {
      throw new Error("User not found");
    }
    //const convertedUser: ConvertedUser = new User(user.credentials, user.displayname, user.id);
    console.log(user);
    const credentials = await DbUserCredential.where("user_id", "testID1")
      .get();
    if (!Array.isArray(credentials)) {
      throw new Error("Credentials not found");
    }
    return c.json(
      user.map((e) =>
        new User(
          new UserCredential(
            credentials[0]["_username"] + "",
            credentials[0]["_password"] + "",
          ),
          e.displayname + "",
          e.id + "",
        ).toJson()
      ),
    );
  },
  changePassword: async (c: Context) => {
    const requestData = await c.req.json();
    const newPassword: string = requestData.password;
    //TODO we need the loggedin User here!!
    const myself: User = userRepository.findAll()[0];
    myself.changeUserCredentials(
      new UserCredential(myself.getCredentials().username, newPassword),
    );
    userRepository.save(myself);
    //204 no content
    return c.status(204);
  },
});
