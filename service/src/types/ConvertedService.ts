export type ConvertedService =
  & {
    credentials: {
      username: string;
      password: string;
    };
    serviceName: string;
    serviceUrl: string;
  }
  & {
    [K in ServiceListProperties]: string[];
  };

type ServiceListProperties = "users" | "owners" | "groups" | "sentInvitations";
