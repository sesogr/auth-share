import {Context} from "@hono/hono";
import {GroupRepository} from "../interfaceTypes/GroupRepository.ts";
import {HeadController} from "./HeadController.ts";
import {
    ConvertedGroup,
    ensureConvertedGroupIntegrity,
} from "../types/ConvertedGroup.ts";
import {Group} from "../classes/Group.ts";
import {UserRepository} from "../interfaceTypes/UserRepository.ts";
import {ServiceRepository} from "../interfaceTypes/ServiceRepository.ts";
import {PromisesUtil} from "../services/PromissesUtil.ts";
import {NotFoundError} from "../errors/NotFoundError.ts";
import {User} from "../classes/User.ts";
import {AlreadyTakenError} from "../errors/controllerErrors/ConflictError/AlreadyTakenError.ts";

export class GroupController extends HeadController {
    constructor(
        private readonly groupRepository: GroupRepository,
        private readonly userRepository: UserRepository,
        private readonly serviceRepository: ServiceRepository,
    ) {
        super();
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

    async inviteUsers(c: Context) {
        try {
            const ME = this.getMeFromContext(c);
            const groupData = await c.req.json();
            ensureConvertedGroupIntegrity(groupData, ["id", "sentInvitations"]);
            const group: Group = await this.groupRepository.findById(groupData.id);
            group.checkOwner(ME);
            const settledUsers = await Promise.allSettled(
                groupData.sentInvitations.map((e) =>
                    this.userRepository.findByDisplayName(e)
                ),
            );
            const {rejected: notFound, fulfilled: userlist} = PromisesUtil
                .splitSettled<User, NotFoundError>(settledUsers);
            const fulfilled: string[] = [];
            const alreadyIn: string[] = [];
            userlist.forEach((user) => {
                try {
                    group.sendInvitation(ME, user);
                    fulfilled.push(user.getDisplayName());
                } catch (e) {
                    if (e instanceof AlreadyTakenError) {
                        alreadyIn.push(user.getDisplayName());
                    } else {
                        throw e;
                    }
                }
            });
            return c.json({
                fulfilled: fulfilled,
                alreadyIn: alreadyIn,
                rejected: notFound.map((e) => e.target),
            });
        } catch (error) {
            return this.errorHandle(error, c);
        }
    }
}
