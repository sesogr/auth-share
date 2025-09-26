import { Displayable } from "./Displayable.ts";
import { Entity } from "./Entity.ts";
import { ShortEntity } from "./ShortEntity.ts";

export type DisplayableEntity = Displayable & Entity & {
  convertToShort(): ShortEntity;
};
