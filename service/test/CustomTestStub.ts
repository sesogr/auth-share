import { CustomStubType } from "./CustomStubType.ts";

export class CustomTestStub<T> {
  public get stub(): CustomStubType<T> {
    return { ...this._stub };
  }
  protected constructor(
    private readonly _stub: CustomStubType<T> = {} as CustomStubType<T>,
  ) {}

  protected initializeStub<K extends keyof T>(key: K) {
    this._stub[key] = this.createInitialState<K>();
  }

  static create<StaticT>(): StaticT & CustomTestStub<never> {
    return new CustomTestStub() as StaticT & CustomTestStub<never>;
  }

  private createInitialState<K extends keyof T>(): CustomStubType<T>[K] {
    return {
      counter: 0,
      outputs: [],
      args: [],
      permanent: false,
    } as unknown as CustomStubType<T>[K];
  }
  reset(trueReset = false) {
    Object.keys(this._stub).forEach((key) => {
      const f = key as keyof T;
      if (this._stub[f].permanent && !trueReset) {
        return;
      }
      this._stub[f] = this.createInitialState();
    });
  }
  registerOutput<K extends keyof T>(
    key: K,
    output: unknown,
    permanent = false,
  ) {
    const stub = this._stub[key] as CustomStubType<T>[K];
    stub.outputs.push(output);
    this._stub[key].permanent = permanent;
  }
  counter(key: keyof T): number {
    return this._stub[key].counter ?? 0;
  }
  lastArgs<K extends keyof T>(key: K): unknown[] {
    return this._stub[key].args[this._stub[key].counter - 1];
  }
  private nextOutput(
    key: keyof T,
  ): unknown {
    return this._stub[key].permanent
      ? this._stub[key].outputs[0]
      : this._stub[key].outputs.shift();
  }
  private incrementCounter(key: keyof T) {
    this._stub[key].counter = (this._stub[key].counter) + 1;
  }

  protected fakeProcess(
    args: unknown[],
    method: keyof T,
  ) {
    this.saveArgs(args, method);
    this.incrementCounter(method);
    const nextOutput = this.nextOutput(method);
    if (nextOutput instanceof Error) throw nextOutput;
    return nextOutput;
  }

  private saveArgs(
    args: unknown[],
    method: keyof T,
  ) {
    this._stub[method].args.push(args);
  }
}
