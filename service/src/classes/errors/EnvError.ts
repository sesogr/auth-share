export class EnvError extends Error {
  public environmentVariable: string;
  constructor(variableName: string, msg?: string) {
    super(
      `Environment variable ${variableName} is not defined
      ${msg ? `:\n ${msg}` : ""}`,
    );
    this.name = "EnvError";
    this.environmentVariable = variableName;
  }
}
