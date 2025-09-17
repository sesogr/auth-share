export type Repository<T> = {
  //findById(id: string): T;
  findByName(name: string): T;
  //maybe also usefull?
  findAll(): T[];
  add(item: T): void;
  removeById(id: string): boolean;
};
