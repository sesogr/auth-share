import { Context } from "@hono/hono";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { User } from "../classes/User.ts";
import { UserCredential } from "../classes/UserCredential.ts";
import { ConvertedUser } from "../types/types.ts";

export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  private readonly ME = "15ed8f0d-f3c3-4e6c-84dc-c2c0824741be"; //TODO with meaningfull

  async listMyServices(
    c: Context,
  ) {
    const user = await this.userRepository.findById(
      this.ME,
    );
    user.listServices();
    return c.json!(
      user.toJson(),
    );
  }

  async read(c: Context) {
    const user = await this.userRepository.findById(
      this.ME,
    );
    return c.json!(
      user.toJson(),
    );
  }
  async changePassword(c: Context) {
    const requestData = await c.req!.json!();
    const newPassword: string = requestData.password;
    //TODO we need the loggedin User here!!
    const myself: User = (await this.userRepository.findAll())[0];
    myself.changeUserCredentials(
      new UserCredential(myself.getCredentials().username, newPassword),
    );
    this.userRepository.save(myself);
    return c.body!(null, 204);
  }
  async create(c: Context) {
    c.res!.headers!.set!("Access-Control-Allow-Origin", "*");
    const requestData: ConvertedUser = await c.req!.json!();

    const newUser = new User(
      new UserCredential(
        requestData.credentials.split(":")[0],
        requestData.credentials.split(":")[1],
      ),
      requestData.displayname,
      requestData.id,
    );
    await this.userRepository.save(newUser);

    return c.body!(null, 201);
  }
}
