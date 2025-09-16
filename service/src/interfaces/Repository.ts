export type Repository<T> = {
  findById<T>(id: string): T;
  findByName<T>(name: string): T;
  findOwnedByUserId<T>(userId: string): T[];
};
