import { Context } from "@hono/hono";
import { GroupRepository } from "../../../interfaceTypes/GroupRepository.ts";
import { HeadController } from "./HeadController.ts";
import {
  ConvertedGroup,
  ensureConvertedGroupIntegrity,
} from "../../types/ConvertedGroup.ts";
import { Group } from "../Entities/Group.ts";
import { PromisesUtil } from "../PromissesUtil.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import {
  ConvertedUser,
  ensureConvertedUserIntegrity,
} from "../../types/ConvertedUser.ts";
import { Invitation } from "../Values/Invitation.ts";
import { Logger } from "../../../interfaceTypes/Logger.ts";
import { RepositoryView } from "../../../interfaceTypes/RepositoryView.ts";
import { Service } from "../Entities/Service.ts";
import { WrongInvitationTypeError } from "../errors/controllerErrors/ConflictError/WrongInvitationTypeError.ts";
import { UserI } from "../../../interfaceTypes/UserI.ts";

export class GroupController extends HeadController {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: RepositoryView<UserI>,
    private readonly serviceRepository: RepositoryView<Service>,
    logging: Logger,
  ) {
    super(logging.withOwnContext("GroupController"));
  }
  async delete(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const groupData: ConvertedGroup = await c.req.json();
      ensureConvertedGroupIntegrity(groupData, ["id"]);
      const group: Group = await this.groupRepository.findById(groupData.id);
      group.checkOwner(ME);
      await this.groupRepository.delete(
        group,
      );
      return c.body(null, 204);
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }
  async listMyGroups(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const groups = (await this.groupRepository.findOwnedByUserId(ME.getId()))
        .map((e: Group) => {
          e.checkOwner(ME);
          return e.toJson();
        });
      return c.json(groups);
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }

  async createGroup(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const groupData: ConvertedGroup = await c.req.json();
      ensureConvertedGroupIntegrity(groupData, ["groupname"]);
      const newGroup = Group.createUserGroup(groupData.groupname, ME);
      await this.groupRepository.save(newGroup);
      return c.body(null, 204);
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }

  async acceptInvitation(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const userData: ConvertedUser = await c.req.json();
      ensureConvertedUserIntegrity(userData, ["userGroupInvitations"]);
      const settledResults = await Promise.allSettled(
        userData.userGroupInvitations.map(async (invitationStr) => {
          const [sender, obj, receiver, type] = invitationStr.split(":");
          if (receiver !== ME.getDisplayName()) {
            throw new Error();
          }
          if (type !== "group") {
            throw new WrongInvitationTypeError(
              invitationStr + " is not a group invitation",
            );
          }
          const object: Group = await this.groupRepository.findByDisplayName(
            obj,
          );
          const senderUser = await this.userRepository.findByDisplayName(
            sender,
          );
          object.checkOwner(senderUser);
          const realInvite = new Invitation(
            senderUser.convertToShort(),
            object.convertToShort(),
            ME.convertToShort(),
            "group",
          );
          object.acceptInvitation(realInvite);
          return Promise.resolve(realInvite);
        }),
      );
      const { fulfilled, rejected } = PromisesUtil.splitSettled<
        Invitation,
        Error
      >(settledResults);
      return c.json({
        fulfilled: fulfilled.map((e) => e.toString()),
        rejected: rejected.map((e) => e.message),
      });
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }

  async inviteUsers(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const groupData: ConvertedGroup = await c.req.json();
      ensureConvertedGroupIntegrity(groupData, ["id", "sentInvitations"]);
      const group: Group = await this.groupRepository.findById(groupData.id);
      group.checkOwner(ME);
      const settledUsers = await Promise.allSettled(
        groupData.sentInvitations.map((e) =>
          this.userRepository.findByDisplayName(e)
        ),
      );
      const { rejected: notFound, fulfilled: userlist } = PromisesUtil
        .splitSettled<UserI, NotFoundError>(settledUsers);
      const { fulfilled, alreadyIn } = group.sendMultipleInvitations(
        ME,
        userlist,
      );
      return c.json({
        fulfilled: fulfilled.map((e) => e.getDisplayName()),
        alreadyIn: alreadyIn.map((e) => e.getDisplayName()),
        rejected: notFound.map((e) => e.key),
      });
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }
}
