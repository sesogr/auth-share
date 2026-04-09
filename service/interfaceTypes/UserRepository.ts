import { User, ValidatedUser } from "../src/classes/Entities/User.ts";
import type { Repository } from "./Repository.ts";

export type UserRepository = Repository<User> & {
  findByUserName(_: string): Promise<User>;
  findBySessionToken(_: string): Promise<User>;
  delete(_: ValidatedUser): Promise<void>;
};
