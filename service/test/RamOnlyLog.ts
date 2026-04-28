import { Logger, LogLevel } from "../interfaceTypes/Logger.ts";

export class RamOnlyLog implements Logger {
  constructor(readonly logLevel = [], readonly context = "") {
  }
  logList: [LogLevel, unknown[], string][] = [];
  loggerList: RamOnlyLog[] = [];
  withOwnContext(context: string): Logger {
    const ramOnlyLog = new RamOnlyLog(this.logLevel, context);
    this.loggerList.push(ramOnlyLog);
    return ramOnlyLog;
  }
  findLoggerByContext(context: string): RamOnlyLog {
    const logger = this.loggerList.find((logger) => logger.context === context);
    if (logger === undefined) {
      throw new Error("Logger not found for context " + context);
    }
    return logger;
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
  reset() {
    this.logList = [];
  }
}
