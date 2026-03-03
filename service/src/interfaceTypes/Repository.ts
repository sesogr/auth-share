export type Repository<T> = {
  findById(_id: string): Promise<T>;
  findByDisplayName(_name: string): Promise<T>;
  findAll(): Promise<T[]>;
  add(_item: T): Promise<void>;
  removeById(_id: string): Promise<void>;
  save(_item: T): Promise<void>;
  delete(_item: T): Promise<void>;
};
