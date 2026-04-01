export type LogLevel = "debug" | "info" | "warn" | "error";
export type Logger = {
  readonly logLevel: LogLevel[];
  instantiateWithOwnContext(context: string): Logger;
  log(...message: unknown[]): void;

  warn(...message: unknown[]): void;

  error(...message: unknown[]): void;

  debug(...message: unknown[]): void;
};
