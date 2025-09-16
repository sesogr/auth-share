export type Repository<T> = {
  //findById(id: string): T;
  findByName(name: string): T;
  findOwnedByUserName(userName: string): T[];
  //maybe also usefull?
  findAll(): T[];
  add(item: T): void;
  removeByName(id: string): boolean;
};
