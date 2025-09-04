import React from "react";
import type { ConvertedService } from "./types/types.ts";

const Service = ({ service, ...children }) => {
  const service2: ConvertedService = service;
  return <div>{service2.credentials}</div>;
};

export default Service;
