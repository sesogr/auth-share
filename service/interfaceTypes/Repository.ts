import { RepositoryView } from "./RepositoryView.ts";

export type Repository<T> = RepositoryView<T> & {
  add(_item: T): Promise<void>;
  removeById(_id: string): Promise<void>;
  save(_item: T): Promise<void>;
};
