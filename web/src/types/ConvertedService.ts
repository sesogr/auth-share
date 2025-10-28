export type ConvertedService =
  & {
    serviceName: string;
    serviceUrl: string;
    credentials: {
      username: string;
      password: string;
    };
  }
  & {
    [K in ServiceListProperties]?: string[];
  };

type ServiceListProperties = "users" | "owners" | "groups" | "sentInvitations";
