export type ConvertedService =
  & {
    serviceName: string;
    credentials: string;
  }
  & {
    [K in ServiceListProperties]: string[];
  };

type ServiceListProperties = "users" | "owners" | "groups" | "sentInvitations";
