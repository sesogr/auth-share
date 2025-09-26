export type ShortEntity = {
  id: string;
  displayname: string;
  equals(_: ShortEntity): boolean;
};
