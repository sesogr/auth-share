import { Model } from "@denodb";

export class DbRepository {
  constructor(
    protected readonly model: typeof Model,
    protected readonly displayname: string,
    // "=" makes id optional
    protected readonly id: string = "id",
  ) {
  }
  async existId(id: string): Promise<boolean> {
    if ((await this.model.where(this.id, id).first())) {
      return true;
    } else {
      return false;
    }
  }
  async existDisplayname(displayname: string): Promise<boolean> {
    if ((await this.model.where(this.displayname, displayname).first())) {
      return true;
    } else {
      return false;
    }
  }
}
