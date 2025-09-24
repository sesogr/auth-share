import { User } from "../classes/User.ts";
import type { Repository } from "./Repository.ts";

export type UserRepository = Repository<User>;
