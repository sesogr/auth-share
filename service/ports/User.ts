export interface User {
  getName(): string;
  auth(password: string): boolean;
}
