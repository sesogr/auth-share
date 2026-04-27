import type { Repository } from "./Repository.ts";
import { ValidatedUser } from "./ValidatedUser.ts";
import { UserI } from "./UserI.ts";

export type UserRepository = Repository<UserI> & {
  findByUserName(_: string): Promise<UserI>;
  findBySessionToken(_: string): Promise<UserI>;
  delete(_: ValidatedUser): Promise<void>;
};
