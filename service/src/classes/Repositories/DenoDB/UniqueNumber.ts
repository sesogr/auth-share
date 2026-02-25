export class UniqueNumber {
  private static current = 0;
  static next(): number {
    return this.current++;
  }
}
