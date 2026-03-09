export class PromisesUtil {
    static splitSettled<VALUE, ERROR extends Error>(
        settled: PromiseSettledResult<VALUE>[],
    ): { fulfilled: VALUE[]; rejected: ERROR[] } {
        const items: VALUE[] = [];
        const errors: ERROR[] = [];
        for (const record of settled) {
            if (record.status === "fulfilled") {
                items.push(record.value);
            } else {
                errors.push(record.reason);
            }
        }
        return {fulfilled: items, rejected: errors};
    }
}
