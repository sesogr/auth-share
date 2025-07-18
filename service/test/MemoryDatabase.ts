import "../ports/Database.ts";
import { Database } from "../ports/Database.ts";

export class MemoryDatabase implements Database{
    constructor(public test = 2){}
}