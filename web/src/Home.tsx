import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Service from "./Service.tsx";
import { useNavigate } from "react-router-dom";
import CreateService from "./CreateService.tsx";
import { Button, Col, List, Row, Typography } from "antd";
import { type ReceivingConvertedService } from "./types/types.ts";
import { useAuth } from "./Context/AuthContext.tsx";

const Home: React.FC = () => {
  const [serviceList, setServiceList] = useState<ReceivingConvertedService[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(import.meta.env.VITE_APIURL + "/user/owned", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res): Promise<ReceivingConvertedService[]> => {
        if (!res.ok) throw new Error("Network Error");
        return res.json();
      })
      .then((data) => {
        return setServiceList(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!loading && serviceList.length === 0) {
    return (
      <CreateService
        serviceList={serviceList}
      />
    );
  }

  const service = serviceName
    ? serviceList.find((s) => serviceName === s.serviceName)
    : undefined;

  return (
    <div style={{ padding: 24 }}>
      <Row align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Typography.Title level={2}>Service List</Typography.Title>
        </Col>
      </Row>

      <CreateService
        serviceList={serviceList}
      />

      <List
        bordered
        loading={loading}
        dataSource={serviceList}
        renderItem={(item: ReceivingConvertedService) => {
          try {
            const urlLink = `https://${item.serviceName}`;
            const urlPath = `/${item.serviceName}`;
            return (
              <List.Item
                actions={[
                  <a
                    key="launch"
                    href={urlLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Launch
                  </a>,
                  <Button
                    key="settings"
                    type="default"
                    onClick={() => navigate(urlPath)}
                    aria-label={`Settings for ${item.serviceName}`}
                  >
                    Settings
                  </Button>,
                  <Button
                    key="password"
                    type="default"
                    onClick={() =>
                      navigator.clipboard.writeText(item.credentials.password)}
                    aria-label={`Password for ${item.serviceName}`}
                  >
                    Password
                  </Button>,
                  <Button
                    key="username"
                    type="default"
                    onClick={() =>
                      navigator.clipboard.writeText(item.credentials.username)}
                    aria-label={`Username for ${item.serviceName}`}
                  >
                    Username
                  </Button>,
                ]}
              >
                {item.serviceName}
                {item.owners.includes(user!.displayname) &&
                  (
                    <Button
                      key="DELETE"
                      type="default"
                      aria-label={`DELETE ${item.serviceName}`}
                      onClick={() => {
                        fetch(import.meta.env.VITE_APIURL + "/service", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify(item),
                        }).then((res) => {
                          console.log(res);
                          console.log(item);
                        });
                      }}
                    >
                      DELETE
                    </Button>
                  )}
              </List.Item>
            );
          } catch (err) {
            return (err instanceof Error)
              ? (
                <List.Item>
                  Error bei Service "{item.serviceName}": {err.message}
                </List.Item>
              )
              : (
                <List.Item>
                  Error bei Service "{item.serviceName}"
                </List.Item>
              );
          }
        }}
      />

      {service && <Service service={service} />}
    </div>
  );
};

export default Home;
