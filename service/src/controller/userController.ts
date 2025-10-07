import { Context } from "@hono/hono";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { User } from "../classes/User.ts";
import { UserCredential } from "../classes/UserCredential.ts";
import { ConvertedUser } from "../types/types.ts";

export const createUserController = (
  userRepository: UserRepository,
) => ({
  read: async (c: Context) => {
    const user = await userRepository.findById("testID1");
    return c.json(
      user.toJson(),
    );
  },
  changePassword: async (c: Context) => {
    const requestData = await c.req.json();
    const newPassword: string = requestData.password;
    //TODO we need the loggedin User here!!
    const myself: User = (await userRepository.findAll())[0];
    myself.changeUserCredentials(
      new UserCredential(myself.getCredentials().username, newPassword),
    );
    userRepository.save(myself);
    //204 no content
    c.status(204);
    return c;
  },
  create: async (c: Context) => {
    c.res.headers.set("Access-Control-Allow-Origin", "*");
    const requestData: ConvertedUser = await c.req.json();

    const newUser = new User(
      new UserCredential(
        requestData.credentials.split(":")[0],
        requestData.credentials.split(":")[1],
      ),
      requestData.displayname,
      requestData.id,
    );
    await userRepository.save(newUser);
    c.status(201);
    return c;
  },
});
