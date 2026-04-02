import { Logger, LogLevel } from "../../../interfaceTypes/Logger.ts";

export class LogWriter implements Logger {
  initialized: boolean = false;
  constructor(
    readonly logLevel: LogLevel[],
    readonly context: string = "",
    readonly logfile: string = "",
  ) {}
  withOwnContext(context: string, logfile?: string): Logger {
    if (logfile === undefined) {
      logfile = this.logfile;
    }
    return new LogWriter(this.logLevel, context, logfile);
  }
  log(...message: unknown[]): void {
    if (!this.initialized) {
      if (this.logLevel.includes("info")) {
        this.writeLog("INFO", ...message).catch();
      }
    }
  }

  warn(...message: unknown[]): void {
    if (this.logLevel.includes("warn")) {
      this.writeLog("WARN", ...message).catch(console.error);
    }
  }
  error(...message: unknown[]): void {
    if (this.logLevel.includes("error")) {
      this.writeLog("ERROR", ...message).catch(console.error);
    }
  }
  debug(...message: unknown[]): void {
    if (this.logLevel.includes("debug")) {
      this.writeLog("DEBUG", ...message).catch(console.error);
    }
  }
  private stringify(message: unknown[]): string[] {
    return message.map((m) => {
      let fullMessage = "";
      if (m instanceof Object) {
        if (m instanceof Error) {
          Object.keys(m).forEach((key) => {
            if (key !== "name") {
              //@ts-ignore any key as identifier
              fullMessage += "\n  " + key + ": " + m[key];
            }
          });
          fullMessage += "\n  " + m.stack;
        } else {
          fullMessage += JSON.stringify(m);
        }
      } else {
        fullMessage += m;
      }
      return fullMessage;
    });
  }
  private writeLog(loglevel: string, ...message: unknown[]) {
    if (!this.initialized) this.initializeLogs();
    const stringified = this.stringify(message);
    return Deno.writeTextFile(
      this.logfile,
      "[" +
        [loglevel, this.getNow(), this.context, stringified.join(", ")].map((
          s,
        ) => s.replace(/\[/g, "\\[").replace(/]/g, "\\]")).join("][") +
        "]" +
        "\n",
      { append: true, mode: 0o000 },
    );
  }
  private getNow() {
    return new Date().toISOString();
  }
  initializeLogs() {
    try {
      Deno.mkdirSync(
        this.logfile.split("/").slice(0, this.logfile.length - 1).join("/"),
        { mode: 0o000 },
      );
    } catch (e) {
      if (e instanceof Deno.errors.AlreadyExists) {
        //ignore it
      } else {
        throw e;
      }
    }
    this.initialized = true;
  }
}
