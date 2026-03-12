import {Model} from "@denodb";
import {Entity} from "../../../src/classes/Entity.ts";
import {DbRepository} from "../../../src/classes/Repositories/DenoDB/DbRepository.ts";
import {spy, stub} from "@std/testing/mock";
import {assert, assertFalse, assertGreater, assertRejects} from "@std/assert";
import {DuplicateError} from "../../../src/errors/DuplicateError.ts";

class TestDbRepository extends DbRepository {
    override update(_item: Entity): Promise<void> {
        return Promise.resolve();
    }

    override add(_item: unknown): Promise<void> {
        return Promise.resolve();
    }
}

class TModel extends Model {
}

Deno.test("DbRepository", async (t) => {
    let modelResponse: boolean[] | undefined[];
    let modelResponseNumber: number = 0;
    stub(TModel, "where", () => TModel);
    stub(
        TModel,
        "first",
        () => {
            const newLocal = Promise.resolve(
                modelResponse[modelResponseNumber],
            ) as unknown as Promise<
                TModel
            >;
            if (modelResponse.length - 1 != modelResponseNumber) {
                modelResponseNumber++;
            }
            return newLocal;
        },
    );
    stub(TModel, "select", () => TModel);
    const dbRepository = new TestDbRepository(
        TModel,
        "displayname",
        "id",
    );
    let mockData: { id?: string; displayname?: string } = {
        id: undefined,
        displayname: undefined,
    };
    const item = {
        getId: () => "123",
        getDisplayName: () => "Test User",
    } as unknown as Entity;
    const updateStub = spy(dbRepository, "update");
    await t.step(
        "checkIdName returns true if id and displayname match",
        async () => {
            modelResponseNumber = 0;
            mockData = {id: "123", displayname: "Test User"};
            //@ts-ignore Type mismatch because of the way we stubbed the model
            modelResponse = [mockData];
            const result = await dbRepository.checkIdName(item);
            assert(result);
        },
    );
    await t.step(
        "checkIdName returns false if displayname does not match",
        async () => {
            modelResponseNumber = 0;
            mockData = {id: "123", displayname: "Wrong Name"};
            //@ts-ignore Type mismatch because of the way we stubbed the model
            modelResponse = [mockData];
            const result = await dbRepository.checkIdName(item);
            assertFalse(result);
        },
    );
    await t.step("checkIdName returns false if id does not exist", async () => {
        modelResponseNumber = 0;
        modelResponse = [undefined];
        const result = await dbRepository.checkIdName(item);
        assertFalse(result);
    });
    await t.step("save calls add if id does not exist", async () => {
        modelResponseNumber = 0;

        const addStub = spy(dbRepository, "add");
        modelResponse = [false];
        await dbRepository.save(item);
        assertGreater(addStub.calls.length, 0);
    });
    await t.step(
        "save calls update if id exists but displayname differ",
        async () => {
            modelResponseNumber = 0;
            mockData = {id: "123", displayname: "TestUser"};
            modelResponse = [true, false];
            await dbRepository.save(item);
            assertGreater(updateStub.calls.length, 0);
        },
    );
    await t.step("save calls update if id exists ", async () => {
        modelResponseNumber = 0;
        mockData = {id: "123", displayname: "Test User"};
        modelResponse = [true, false];
        await dbRepository.save(item);
        assertGreater(updateStub.calls.length, 1);
    });
    await t.step(
        "save throws error if displayname is already there",
        async () => {
            modelResponseNumber = 0;
            mockData = {id: "123", displayname: "TestUser"};
            modelResponse = [true, true];
            await assertRejects(async () => {
                await dbRepository.save(item);
            }, DuplicateError);
        },
    );
    await t.step(
        "checkIdName returns false if id exist but displayname differ",
        async () => {
            modelResponseNumber = 0;
            mockData = {id: "123", displayname: "TestUser"};
            const result = await dbRepository.checkIdName(item);
            assertFalse(result);
        },
    );
    await t.step(
        "checkIdName returns false if id doesnt exist",
        async () => {
            modelResponseNumber = 0;
            mockData = {id: undefined, displayname: "TestUser"};
            const result = await dbRepository.checkIdName(item);
            assertFalse(result);
        },
    );
    await t.step(
        "checkIdName returns true ",
        async () => {
            modelResponseNumber = 0;
            mockData = {id: "123", displayname: "Test User"};
            //@ts-ignore Type mismatch because of the way we stubbed the model
            modelResponse = [mockData];
            const result = await dbRepository.checkIdName(item);
            assert(result);
        },
    );
});
