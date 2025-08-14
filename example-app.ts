interface Repository<T> {
  load(id: string): T;
  save(obj: T): void;
}
interface User {
  id: string;
  firstName: string;
  lastName: string;
}
interface UserFinder {
  findByName(name: string): User[];
}
class InMemoryUserRepository implements Repository<User>, UserFinder {
  private users: User[] = [];
  load(id: string): User {
    const user = this.users.find((e) => e.id === id);
    if (user === undefined) {
      throw new Error("No such user.");
    } else {
      return user;
    }
  }
  findByName(name: string): User[] {
    return this.users.filter((e) => e.lastName === name);
  }
  save(obj: User): void {
    this.users.push(obj);
  }
}
const userRepository: InMemoryUserRepository = new InMemoryUserRepository();
let firstUserId = crypto.randomUUID();
userRepository.save({ firstName: "John", lastName: "Doe", id: firstUserId });
userRepository.save({
  firstName: "Jenny",
  lastName: "Doe",
  id: crypto.randomUUID(),
});
userRepository.save({
  firstName: "Dora",
  lastName: "Flinnigan",
  id: crypto.randomUUID(),
});
console.log(userRepository.findByName("Doe"));
