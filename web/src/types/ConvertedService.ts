import { ServiceCredential } from "../classes/ServiceCredential.ts";

export type ConvertedService =
  & {
    serviceName: string;
    credentials: ServiceCredential;
  }
  & {
    [K in ServiceListProperties]: string[];
  };

type ServiceListProperties = "users" | "owners" | "groups" | "sentInvitations";
