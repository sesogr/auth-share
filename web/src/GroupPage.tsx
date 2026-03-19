import React, { useEffect, useState } from "react";
import type { ReceivingConvertedGroup } from "./types/types.ts";
import { useAuth } from "./Context/AuthContext.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, List, Row, Typography } from "antd";
import CreateGroup from "./components/CreateGroup.tsx";
import Groups from "./Groups.tsx";

const GroupPage: React.FC = () => {
  const [groupList, setGroupList] = useState<ReceivingConvertedGroup[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { groupname } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(import.meta.env.VITE_APIURL + "/group/owned", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res): Promise<ReceivingConvertedGroup[]> => {
        if (!res.ok) throw new Error("Network Error");
        return res.json();
      })
      .then((data) => {
        return setGroupList(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!loading && groupList.length === 0) {
    return <CreateGroup />;
  }

  const group = groupname
    ? groupList.find((s) => groupname === s.groupname)
    : undefined;

  return (
    <div style={{ padding: 24 }}>
      <Row align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Typography.Title level={2}>Group List</Typography.Title>
        </Col>
      </Row>
      <CreateGroup />
      <List
        bordered
        loading={loading}
        dataSource={groupList}
        renderItem={(item: ReceivingConvertedGroup) => {
          try {
            const urlLink = `https://${item.groupname}`;
            const urlPath = `${item.groupname}`;
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
                    onClick={() => navigate("/groups/" + urlPath)}
                    aria-label={`Settings for ${item.groupname}`}
                  >
                    Settings
                  </Button>,
                  <Button
                    key="password"
                    type="default"
                    onClick={() => navigator.clipboard.writeText(item.id)}
                    aria-label={`Password for ${item.id}`}
                  >
                    Password
                  </Button>,
                  <Button
                    key="username"
                    type="default"
                    onClick={() => navigator.clipboard.writeText(item.id)}
                    aria-label={`Username for ${item.id}`}
                  >
                    Username
                  </Button>,
                ]}
              >
                {item.groupname}
                {item.owner === user!.displayname &&
                  (
                    <Button
                      key="DELETE"
                      type="default"
                      aria-label={`DELETE ${item.groupname}`}
                      onClick={() => {
                        fetch(import.meta.env.VITE_APIURL + "/group", {
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
                  Error bei Service "{item.groupname}": {err.message}
                </List.Item>
              )
              : (
                <List.Item>
                  Error bei Service "{item.groupname}"
                </List.Item>
              );
          }
        }}
      />

      {group && <Groups group={group} />}
    </div>
  );
};

export default GroupPage;
