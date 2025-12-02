import { Displayable } from "./Displayable.ts";
import { Entity } from "./Entity.ts";
import { IdNameMap } from "./ShortEntity.ts";

export type DisplayableEntity = Displayable & Entity & {
  convertToShort(): IdNameMap;
};
