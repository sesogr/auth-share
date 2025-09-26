import { Displayable } from "./Displayable.ts";
import { Entity } from "./Entity.ts";

export type DisplayableEntity = Displayable & Entity & {
  convertToShort(): DisplayableEntity;
};
