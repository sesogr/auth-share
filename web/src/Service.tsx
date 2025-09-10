import React from "react";
import type { ConvertedService } from "./types/types.ts";

const Service: React.FC<{ service: ConvertedService }> = ({ service }) => {
  return (
    <div>
      <h2>{service.serviceName}</h2>
      <ul>
        <li>
          Groups:{" "}
          <ul>
            {service.groups.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </li>
        <li>
          Owner:{" "}
          <ul>
            {service.owners.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </li>
        <li>
          Sent Invitations:{" "}
          <ul>
            {service.sentInvitations.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </li>
        <li>
          Users:{" "}
          <ul>
            {service.users.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Service;
