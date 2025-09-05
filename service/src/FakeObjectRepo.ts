import { Group } from "./classes/Group.ts";
import { Service } from "./classes/Service.ts";
import { User } from "./classes/User.ts";
import { FakeObjectGen } from "./FakeObjectGen.ts";

export class FakeObjectRepo {
  public get groupList(): Group[] {
    return [...this._groupList];
  }
  public get serviceList(): Service[] {
    return [...this._serviceList];
  }
  public get userList(): User[] {
    return [...this._userList];
  }
  private constructor(
    private readonly _userList: User[] = (this._userList = Array.from(
      { length: 10 },
      () => FakeObjectGen.createFakeUser()
    )),
    private readonly _serviceList: Service[] = [],
    private readonly _groupList: Group[] = []
  ) {
    this.groupList.push(
      FakeObjectGen.createFakeGroup(undefined, this.userList[0])
    );
  }
}
