export type LogLevel = "debug" | "info" | "warn" | "error";
export type Logger = {
  readonly logLevel: LogLevel[];
  withOwnContext(context: string): Logger;
  log(...message: unknown[]): void;

  warn(...message: unknown[]): void;

  error(...message: unknown[]): void;

  debug(...message: unknown[]): void;
};
