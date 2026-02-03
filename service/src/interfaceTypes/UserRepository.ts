import { User } from "../classes/User.ts";
import type { Repository } from "./Repository.ts";

export type UserRepository = Repository<User> & {
  findByUserName(_: string): Promise<User>;
  findBySessionToken(_: string): Promise<User>;
};
