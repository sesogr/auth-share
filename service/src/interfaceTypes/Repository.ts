export type Repository<T> = {
  findById(id: string): T;
  findByName(name: string): T;
  findAll(): T[];
  add(item: T): void;
  removeById(id: string): void;
};
