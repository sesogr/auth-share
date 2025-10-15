export type ConvertedService =
  | {
    serviceName: string;
    credentials: string;
  }
  | {
    [K in ServiceListProperties]: string[];
  }
    & {
      serviceName: string;
      credentials: string;
    };

type ServiceListProperties = "users" | "owners" | "groups" | "sentInvitations";
