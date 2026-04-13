export type RepositoryView<T> = {
  findById(_id: string): Promise<T>;
  findByDisplayName(_name: string): Promise<T>;
  findAll(): Promise<T[]>;
};
