import React, { useEffect, useState } from "react";
import type { ConvertedService } from "./types/ConvertedService.ts";
import { Link, useParams } from "react-router-dom";

const Home = () => {
  const [serviceList, setServiceList] = useState<ConvertedService[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { serviceName } = useParams();
  //Deconstruction
  //const parameter = useParams();
  //const { serviceName } = parameter
  useEffect(() => {
    fetch("http://localhost:8000/user/owned") // Port/Host anpassen
      .then((res): Promise<ConvertedService[]> => {
        if (!res.ok) throw new Error("Netzwerkfehler");
        return res.json();
      })
      .then((data: ConvertedService[]) => setServiceList(data))
      .catch((err) => setError(err.message));
  }, []);
  if (error) return <div>Fehler: {error}</div>;
  if (!serviceList) return <div>Lade...</div>;

  const service = serviceList.find(
    (currService) => serviceName == currService.serviceName
  );

  return (
    <div>
      <h1>Service List</h1>
      <ul>
        {serviceList.map((e) => (
          <li>
            <Link to={"/" + e.serviceName}>{e.serviceName}</Link>
          </li>
        ))}
      </ul>
      <div>
        <h2>{serviceName}</h2>
        <ul>
          <li>
            {service?.credentials.username +
              ":" +
              service?.credentials.password}
          </li>
          <li>
            Groups:{" "}
            <ul>
              {service?.groups.map((e) => (
                <li>{e}</li>
              ))}
            </ul>
          </li>
          <li>
            Owner:{" "}
            <ul>
              {service?.owners.map((e) => (
                <li>{e}</li>
              ))}
            </ul>
          </li>
          <li>
            Sent Invitations:{" "}
            <ul>
              {service?.sentInvitations.map((e) => (
                <li>{e}</li>
              ))}
            </ul>
          </li>
          <li>
            Users:{" "}
            <ul>
              {service?.users.map((e) => (
                <li>{e}</li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
