import React, { useEffect, useState } from "react";
import type { ConvertedService } from "./types/ConvertedService.ts";
import { Link, useParams } from "react-router-dom";
import Service from "./Service.tsx";

const Home = () => {
  const [serviceList, setServiceList] = useState<ConvertedService[]>([]);
  const [error, setError] = useState<string | null>(null);
  //Deconstruction
  //const parameter = useParams();
  //const { serviceName } = parameter
  const { serviceName } = useParams();

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
      {service && <Service {service} />}
    </div>
  );
};

export default Home;
