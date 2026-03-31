import { Context } from "@hono/hono";
import { GroupRepository } from "../interfaceTypes/GroupRepository.ts";
import { HeadController } from "./HeadController.ts";
import {
  ConvertedGroup,
  ensureConvertedGroupIntegrity,
} from "../types/ConvertedGroup.ts";
import { Group } from "../classes/Group.ts";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { ServiceRepository } from "../interfaceTypes/ServiceRepository.ts";
import { PromisesUtil } from "../services/PromissesUtil.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import { User } from "../classes/User.ts";
import {
  ConvertedUser,
  ensureConvertedUserIntegrity,
} from "../types/ConvertedUser.ts";
import { Invitation } from "../classes/Invitation.ts";

export class GroupController extends HeadController {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly serviceRepository: ServiceRepository,
  ) {
    super();
  }
  async delete(c: Context) {
    try {
      const groupData: ConvertedGroup = await c.req.json();
      ensureConvertedGroupIntegrity(groupData, ["id"]);
      await this.groupRepository.delete(
        await this.groupRepository.findById(groupData.id),
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
        .map((e) => e.toJson());
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
          const [sender, obj, receiver] = invitationStr.split(":");
          if (receiver !== ME.getDisplayName()) {
            throw new Error();
          }
          const object: Group = await this.groupRepository.findByDisplayName(
            obj,
          );
          const senderUser: User = await this.userRepository.findByDisplayName(
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
      this.errorHandle(error, c);
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
        .splitSettled<User, NotFoundError>(settledUsers);
      const { fulfilled, alreadyIn } = group.sendMultipleInvitations(
        ME,
        userlist,
      );
      return c.json({
        fulfilled: fulfilled.map((e) => e.getDisplayName()),
        alreadyIn: alreadyIn.map((e) => e.getDisplayName()),
        rejected: notFound.map((e) => e.target),
      });
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }
}
