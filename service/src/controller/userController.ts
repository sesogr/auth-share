import { Context } from "@hono/hono";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { ConvertedUser } from "../types/ConvertedUser.ts";

export const userController =
  (userRepository: UserRepository) => (c: Context) => {
    const user: ConvertedUser[] = userRepository.findAll().map((e) =>
      e.toJson()
    );
    return c.json(user);
  };
