export class PromisesUtil {
  static splitSettled<VALUE, ERROR>(
    settled: PromiseSettledResult<VALUE>[],
  ): { fullfilled: VALUE[]; rejected: ERROR[] } {
    const items: VALUE[] = [];
    const errors: ERROR[] = [];
    for (const record of settled) {
      if (record.status === "fulfilled") {
        items.push(record.value);
      } else {
        errors.push(record.reason);
      }
    }
    return { fullfilled: items, rejected: errors };
  }
}
