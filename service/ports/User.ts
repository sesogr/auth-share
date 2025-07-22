export interface User {
  getName(): string;
  auth([string]: string): boolean;
}
