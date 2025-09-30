import { Context } from "@hono/hono";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { ConvertedUser } from "../types/ConvertedUser.ts";
import { User } from "../classes/User.ts";
import { UserCredential } from "../classes/UserCredential.ts";

export const userController = (userRepository: UserRepository) => ({
  read: (c: Context) => {
    const user: ConvertedUser[] = userRepository.findAll().map((e) =>
      e.toJson()
    );
    return c.json(user);
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
