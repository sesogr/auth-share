import React, { useEffect, useState } from "react";
import type { ConvertedService } from "./types/ConvertedService.ts";
import { useParams } from "react-router-dom";
import Service from "./Service.tsx";
import { useNavigate } from "react-router-dom";
import CreateService from "./CreateService.tsx";
import { Col, Row, Typography } from "antd";

const Home: React.FC = () => {
  const [serviceList, setServiceList] = useState<ConvertedService[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  //Deconstruction
  //const parameter = useParams();
  //const { serviceName } = parameter
  const { serviceName } = useParams();
  useEffect(() => {
    fetch(import.meta.env.VITE_APIURL + "/user/owned") // Port/Host anpassen
      .then((res): Promise<ConvertedService[]> => {
        if (!res.ok) throw new Error("Netzwerkfehler");
        return res.json();
      })
      .then((data: ConvertedService[]) => setServiceList(data))
      .catch((err) => setError(err.message));
  }, []);
  if (error) return <div>Fehler: {error}</div>;
  if (serviceList.length == 0) return <CreateService />;

  const service = serviceName
    ? serviceList.find(
      (currService: ConvertedService) => serviceName == currService.serviceName,
    )
    : undefined;
  console.log(serviceList);
  return (
    <div>
      <Row align="middle">
        <Col span={48}>
          <Typography.Title level={2}>Service List</Typography.Title>
        </Col>
      </Row>
      <CreateService />

      <ul>
        {Array.isArray(serviceList) &&
          serviceList.map((e: ConvertedService) => {
            const urlPath = "/" + e.serviceName;
            const urlLink = "https://" + e.serviceName;
            //should be the final path like "/serviceName/details or /serviceName/settings"??
            return (
              <li>
                {e.serviceName}
                <a href={urlLink} target="_blank">
                  Launch
                </a>
                <button
                  type="button"
                  onClick={() => navigate(urlPath)}
                  aria-label={`Settings for ${e.serviceName}`}
                >
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(e.credentials.password);
                  }}
                  aria-label={`Settings for ${e.serviceName}`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(e.credentials.username);
                  }}
                  aria-label={`Settings for ${e.serviceName}`}
                >
                  Username
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
