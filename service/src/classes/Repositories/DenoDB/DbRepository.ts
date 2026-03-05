import { Model } from "@denodb";
import { Entity } from "../../Entity.ts";
import { DbInvitation } from "./Models/DbInvitation.ts";
import { AllowedGroupServiceMap } from "../../AllowedGroupServiceMap.ts";
import { AllowedUserGroupMap } from "../../AllowedUserGroupMap.ts";
import { AllowedUserServiceMap } from "../../AllowedUserServiceMap.ts";
import { Invitation } from "../../Invitation.ts";
import { Session } from "../../Session.ts";
import { DuplicateError } from "../../../errors/DuplicateError.ts";
import { NotFoundError } from "../../../errors/NotFoundError.ts";

export abstract class DbRepository {
  constructor(
    protected readonly model: typeof Model,
    protected readonly displayname: string,
    // "=" makes id optional
    protected readonly id: string = "id",
  ) {
  }
  protected nTomFilter(
    modelList: Model[],
    objectRelationList: AllowedGroupServiceMap[],
  ): { relationsToDelete: Model[]; relationsToSave: AllowedGroupServiceMap[] };
  protected nTomFilter(
    modelList: Model[],
    objectRelationList: AllowedUserGroupMap[],
  ): { relationsToDelete: Model[]; relationsToSave: AllowedUserGroupMap[] };
  protected nTomFilter(
    modelList: Model[],
    objectRelationList: AllowedUserServiceMap[],
  ): { relationsToDelete: Model[]; relationsToSave: AllowedUserServiceMap[] };
  protected nTomFilter(
    modelList: Model[],
    objectRelationList: Invitation[],
  ): { relationsToDelete: Model[]; relationsToSave: Invitation[] };
  protected nTomFilter(
    modelList: Model[],
    objectRelationList: Session[],
  ): { relationsToDelete: Model[]; relationsToSave: Session[] };
  //n:m Model Filter Methode
  //
  protected nTomFilter(
    //old List from DB
    modelList: Model[],
    //new updated List for the DB
    objectRelationList:
      | AllowedGroupServiceMap[]
      | AllowedUserGroupMap[]
      | AllowedUserServiceMap[]
      | Invitation[]
      | Session[],
  ): {
    //Difference between old and new List
    // --> Delete(if allowence of user and Groups are cancled or any kind of Invitations are expired) or Save(if there are new allowence for User or Groups as well as any new kind of Invitations)
    relationsToDelete: Model[];
    relationsToSave: (
      | AllowedGroupServiceMap
      | AllowedUserGroupMap
      | AllowedUserServiceMap
      | Invitation
      | Session
    )[];
  } {
    const relationsToDelete = modelList.filter((e) =>
      objectRelationList.every((f) => e.id != f.toString())
    );
    const relationsToSave = objectRelationList.filter((e) =>
      modelList.every((f) => e.toString() != f.id)
    );
    return { relationsToDelete, relationsToSave };
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
  async checkIdName(item: Entity): Promise<boolean> {
    const data = await this.model.where("id", item.getId()).first();

    return data && data[this.displayname] == item.getDisplayName();
  }
  async save(item: Entity) {
    const idExists = await this.existId(item.getId());
    if (!idExists) {
      if (await this.existDisplayname(item.getDisplayName())) {
        throw new DuplicateError(item.getDisplayName() + ": already Exists");
      }
      await this.add(item);
    } else {
      if (!(await this.checkIdName(item))) {
        if (await this.existDisplayname(item.getDisplayName())) {
          throw new DuplicateError(item.getDisplayName() + ": already Exists");
        }
      }
      this.update(item);
    }
  }
  abstract update(item: Entity): Promise<void>;
  abstract add(item: Entity): Promise<void>;
  async delete(item: Entity) {
    const idExists = await this.existId(item.getId());
    if (!idExists) {
      throw new NotFoundError(
        "Item with id: " + item.getId() + " does not exist",
      );
    }
    await this.model.where(this.id, item.getId()).delete();
  }
  protected async updateInvitation(item: Entity) {
    const _invitationsModel = await DbInvitation.where(
      "obj_reference",
      item.getId(),
    ).all();

    const {
      relationsToDelete: invitationsToDelete,
      relationsToSave: invitationsToSave,
    } = this.nTomFilter(_invitationsModel, item.sentInvitations);

    await Promise.all(invitationsToDelete.map((e) => e.delete()));
    await DbInvitation.create(invitationsToSave.map((e) => {
      return {
        sender_reference: e.senderId,
        obj_reference: e.objId,
        receiver_reference: e.receiverId,
      };
    }));
  }
}
