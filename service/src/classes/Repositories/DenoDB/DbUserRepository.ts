// import { UserRepository } from "../../../interfaceTypes/UserRepository.ts";
// import { User } from "../../User.ts";
// import { UserCredential } from "../../UserCredential.ts";
// import { DbUser } from "./Models/DbUser.ts";
// import { DbUserCredential } from "./Models/DbUserCredentials.ts";

// export class DbUserRepository implements UserRepository {
//   constructor() {}
//   async findById(id: string): User {
//     return this.hydrate(await DbUser.find(id));
//   }
//   findByName(name: string): User {
//     throw new Error("Method not implemented.");
//   }
//   findAll(): User[] {
//     throw new Error("Method not implemented.");
//   }
//   add(item: User): void {
//     throw new Error("Method not implemented.");
//   }
//   removeById(id: string): void {
//     throw new Error("Method not implemented.");
//   }
//   save(item: User): void {
//     throw new Error("Method not implemented.");
//   }
//   hydrate(item: DbUser): User {
//     const id = item.id;
//     const credentials = new UserCredential(
//       item.credentials.username,
//       item.credentials.password,
//     );
//     )
//     const user: User = new User(
//       credentials,
//       displayname,
//       id,
//       serviceList,
//       invitations,
//       joinedGroups,
//     );
//     return user;
//   }
// }
