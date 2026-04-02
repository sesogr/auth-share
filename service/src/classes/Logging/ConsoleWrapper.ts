import type { Logger, LogLevel } from "../../../interfaceTypes/Logger.ts";

export class ConsoleWrapper implements Logger {
  constructor(
    readonly logLevel: LogLevel[],
    private readonly context: string = "",
  ) {}
  withOwnContext(context: string): Logger {
    return new ConsoleWrapper(this.logLevel, context);
  }
  log(...message: unknown[]) {
    if (!this.logLevel.includes("info")) return;
    console.log(this.getNow(), this.context, message);
  }

  private getNow() {
    const date = new Date();
    return `${date.toISOString()}`;
  }

  warn(...message: unknown[]) {
    if (!this.logLevel.includes("warn")) return;
    console.warn(this.getNow(), this.context, message);
  }

  error(...message: unknown[]) {
    if (!this.logLevel.includes("error")) return;
    console.error(this.getNow(), this.context, message);
  }

  debug(...message: unknown[]) {
    if (!this.logLevel.includes("debug")) return;
    console.debug(this.getNow(), this.context, message);
  }
}
