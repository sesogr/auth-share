import React from "react";
import type { ConvertedService } from "./types/types.ts";

const Service = ({ service }: { service: ConvertedService }) => {
  return (
    <div>
      <h2>{service.serviceName}</h2>
      <ul>
        <li>
          Groups:{" "}
          <ul>
            {service.groups.map((e) => (
              <li>{e}</li>
            ))}
          </ul>
        </li>
        <li>
          Owner:{" "}
          <ul>
            {service.owners.map((e) => (
              <li>{e}</li>
            ))}
          </ul>
        </li>
        <li>
          Sent Invitations:{" "}
          <ul>
            {service.sentInvitations.map((e) => (
              <li>{e}</li>
            ))}
          </ul>
        </li>
        <li>
          Users:{" "}
          <ul>
            {service.users.map((e) => (
              <li>{e}</li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Service;
