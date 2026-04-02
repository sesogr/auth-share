import { Displayable } from "./Displayable.ts";
import { Entity } from "./Entity.ts";
import { IdNameMap } from "../src/classes/Values/IdNameMap.ts";
export type DisplayableEntity = Displayable & Entity & {
  convertToShort(): IdNameMap;
};
