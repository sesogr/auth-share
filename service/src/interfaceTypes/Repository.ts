export type Repository<T> = {
  findById(id: string): Promise<T>;
  findByName(name: string): Promise<T>;
  findAll(): Promise<T>[];
  add(item: T): Promise<void>;
  removeById(id: string): Promise<void>;
  save(item: T): Promise<void>;
};
