import { Logger } from "../interfaceTypes/Logger.ts";

export class RamOnlyLog implements Logger {
  constructor(readonly logLevel = [], readonly context = "") {
  }
  logList: unknown[] = [];
  withOwnContext(context: string): Logger {
    return new RamOnlyLog(this.logLevel, context);
  }
  log(...message: unknown[]): void {
    this.logList.push("info", message);
  }
  warn(...message: unknown[]): void {
    this.logList.push("warn", message);
  }
  error(...message: unknown[]): void {
    this.logList.push("error", message);
  }
  debug(): void {
    this.logList.push("debug", arguments);
  }
}
