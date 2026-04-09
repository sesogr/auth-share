import { Logger, LogLevel } from "../interfaceTypes/Logger.ts";

export class RamOnlyLog implements Logger {
  constructor(readonly logLevel = [], readonly context = "") {
  }
  logList: [LogLevel, unknown[], string][] = [];
  withOwnContext(context: string): Logger {
    return new RamOnlyLog(this.logLevel, context);
  }
  log(...message: unknown[]): void {
    this.logList.push(["info", message, this.context]);
  }
  warn(...message: unknown[]): void {
    this.logList.push(["warn", message, this.context]);
  }
  error(...message: unknown[]): void {
    this.logList.push(["error", message, this.context]);
  }
  debug(...message: unknown[]): void {
    this.logList.push(["debug", message, this.context]);
  }
}
