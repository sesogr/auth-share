import React, { useEffect, useState } from "react";
import type { ConvertedService } from "./types/ConvertedService.ts";
import { useParams } from "react-router-dom";
import Service from "./Service.tsx";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
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
    (currService) => serviceName == currService.serviceName,
  );
  const navigate = useNavigate();

  return (
    <div>
      <h1>Service List</h1>
      <ul>
        {serviceList.map((e) => {
          //should be the final path like "/serviceName/details or /serviceName/settings"??
          const urlPath = "/" + e.serviceName;
          return (
            <li>
              {e.serviceName}
              <button
                type="button"
                onClick={() => navigate(urlPath)}
                aria-label={`Launch the ${e.serviceName}`}
              >
                Launch
              </button>
              <button
                type="button"
                onClick={() => navigate(urlPath)}
                aria-label={`Settings for ${e.serviceName}`}
              >
                Settings
              </button>
            </li>
          );
        })}
      </ul>
      {service && <Service service={service} />}
    </div>
  );
};

export default Home;
