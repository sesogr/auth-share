export type ShortEntity = {
  id: string;
  displayname: string;
  equals(_: ShortEntity): boolean;
  copy(): ShortEntity;
  with(_: { id?: string; displayname?: string }): ShortEntity;
};
